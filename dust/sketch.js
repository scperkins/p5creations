// Dust particles blown by a shifting 2D wind field; wrap at edges.

let particles = [];
let particleCount = 2000;
let lifeDecay = 0.011;
let sizeDecay = 0.75;

// Wind field: Perlin noise gives direction and strength that vary in space and time
let windScale = 0.098;      // how large the wind "patches" are
let windStrength = 2.0;     // how hard the wind blows
let windTimeScale = 0.215;  // how quickly wind patterns change
let turbulence = 0.4;       // small random kick on top of wind (gusts)

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 100);

  // Pre-fill with particles scattered across the canvas
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(5, 5, 8);

  // Spawn a few new particles each frame from random positions (dust in the air)
  for (let i = 0; i < 4; i++) {
    particles.push(new Particle());
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }

  while (particles.length > particleCount) {
    particles.shift();
  }
}

class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.life = 1;
    this.size = random(1.2, 3);   // small, uniform dust specks
    this.hue = random(25, 45);   // warm dust / ember tint
    this.sat = 70;
    this.bright = 100;
  }

  update() {
    // Sample wind at this position (evolving over time = shifting patterns)
    let t = frameCount * windTimeScale;
    let nx = this.x * windScale;
    let ny = this.y * windScale;
    if (mouseX >= 0 && mouseX <= width) {
      this.vx += (mouseX - this.x) * 0.0008;
    }
    if (mouseY >= 0 && mouseY <= height) {
      this.vy += (mouseY - this.y) * 0.0008;
    }
    // Wind direction from angle noise; strength from second noise
    let angle = noise(nx, ny, t) * TWO_PI;
    let strength = 0.6 + 0.4 * noise(nx + 50, ny + 50, t * 1.1);
    let wx = cos(angle) * windStrength * strength;
    let wy = sin(angle) * windStrength * strength;
    // Add small turbulence (gusts)
    this.vx += wx * 0.08 + random(-turbulence, turbulence);
    this.vy += wy * 0.08 + random(-turbulence, turbulence);
    this.vx *= 0.94;
    this.vy *= 0.94;

    this.x += this.vx;
    this.y += this.vy;

    // Wrap around canvas so dust flows around the space
    if (this.x < 0) this.x += width;
    if (this.x >= width) this.x -= width;
    if (this.y < 0) this.y += height;
    if (this.y >= height) this.y -= height;

    this.life -= lifeDecay;
    this.size *= sizeDecay;
    this.size = constrain(this.size, 0.8, 3);
  }

  show() {
    if (this.life <= 0) return;

    noStroke();
    let alpha = 100 * this.life;
    let h = lerp(this.hue, 30, 1 - this.life);
    let s = lerp(this.sat, 50, 1 - this.life);
    let b = lerp(this.bright, 60, 1 - this.life);
    fill(h, s, b, alpha);

    let r = this.size;
    drawingContext.shadowBlur = r * 1.5;
    drawingContext.shadowColor = color(h, s, b, alpha * 0.6);
    ellipse(this.x, this.y, r * 2, r * 2);
    drawingContext.shadowBlur = 0;
  }
}
