
function setup() {
  createCanvas(800, 600);
  frameRate(3);
}

function drawBall(color, x, y) {
  circle(x, y, 80);
  fill(color);
}

function draw() {
  background(220);
  // coords
  let x = random(700);
  let y = random(500);
  // colors
  let r = random(255);
  let g = random(255);
  let b = random(255);
  for (let i = 0; i <=10; i +=1) {
    this.drawBall(color(r, g, b), x, y);
  }
}
