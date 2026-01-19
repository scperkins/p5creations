
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
  let x = random(700);
  let y = random(500);
  
  this.drawBall(color(255, 192, 203), x, y);
  
  
}
