// Water surface simulation: drag to part the water and create ripples.
// Uses a 2D wave equation on a displacement grid.

let cols, rows;
let resolution = 6; // pixels per grid cell (smaller = finer detail, heavier)
let current;  // current displacement
let previous; // previous frame displacement
let nextGrid; // next state (so we don't overwrite while reading)
let damping = 0.96;  // lower = ripples die down faster
let waveSpeed = 0.5;
let brushRadius = 25;
let brushStrength = -12;  // negative = depress water (parting)
let trailStrength = 8;    // ripple strength in drag direction

function setup() {
  createCanvas(800, 600);
  cols = ceil(width / resolution) + 2;
  rows = ceil(height / resolution) + 2;
  current = initGrid(cols, rows);
  previous = initGrid(cols, rows);
  nextGrid = initGrid(cols, rows);
}

function initGrid(c, r) {
  let g = [];
  for (let i = 0; i < c; i++) {
    g[i] = [];
    for (let j = 0; j < r; j++) g[i][j] = 0;
  }
  return g;
}

function index(x, y) {
  x = constrain(floor(x / resolution), 0, cols - 1);
  y = constrain(floor(y / resolution), 0, rows - 1);
  return { i: x, j: y };
}

function mouseDragged() {
  if (mouseX < 0 || mouseX >= width || mouseY < 0 || mouseY >= height) return;
  let { i: ci, j: cj } = index(mouseX, mouseY);
  let dx = mouseX - pmouseX;
  let dy = mouseY - pmouseY;
  let moveDist = sqrt(dx * dx + dy * dy) || 1;
  dx /= moveDist;
  dy /= moveDist;

  let r = ceil(brushRadius / resolution);
  for (let di = -r; di <= r; di++) {
    for (let dj = -r; dj <= r; dj++) {
      let gi = ci + di;
      let gj = cj + dj;
      if (gi < 1 || gi >= cols - 1 || gj < 1 || gj >= rows - 1) continue;
      let gx = gi * resolution;
      let gy = gj * resolution;
      let d = dist(mouseX, mouseY, gx, gy);
      if (d > brushRadius) continue;
      // Falloff: stronger at center
      let falloff = 1 - (d / brushRadius) * 0.6;
      // Parting: depress the surface
      let part = brushStrength * falloff;
      // Trail: push displacement in the direction of drag (ripple source)
      let trail = (trailStrength * falloff * min(moveDist, 20) / 20) * (dx * (gx - mouseX) / brushRadius + dy * (gy - mouseY) / brushRadius);
      current[gi][gj] += part + trail;
      current[gi][gj] = constrain(current[gi][gj], -80, 80);
    }
  }
}

function draw() {
  // Update wave equation (read from current/previous, write to nextGrid)
  for (let i = 1; i < cols - 1; i++) {
    for (let j = 1; j < rows - 1; j++) {
      let laplacian =
        current[i - 1][j] + current[i + 1][j] +
        current[i][j - 1] + current[i][j + 1] -
        4 * current[i][j];
      nextGrid[i][j] = damping * (2 * current[i][j] - previous[i][j] + waveSpeed * laplacian);
    }
  }
  let temp = previous;
  previous = current;
  current = nextGrid;
  nextGrid = temp;

  // Draw water (single TRIANGLE_STRIP for speed)
  background(15, 25, 45);
  noStroke();
  fill(30, 80, 140, 220);
  beginShape(TRIANGLE_STRIP);
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols; i++) {
      vertex(i * resolution, j * resolution + (current[i][j] || 0));
      vertex(i * resolution, (j + 1) * resolution + (current[i][j + 1] || 0));
    }
  }
  endShape();
}
