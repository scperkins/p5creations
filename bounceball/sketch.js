var x = 400;
var y = 300;
var flipSwitch = false;

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(220);
  circle(x, y, 80);
  fill(25, 200, 90);
  console.log(y);
  console.log(flipSwitch);
  if ( y <= 299 ) {
    flipSwitch = false;
  }
  if ( y >= 601) {
    flipSwitch = true;
  }
  if (y < 601 & !flipSwitch) {
    y+=3;
  }
  if (flipSwitch && y > 299) {
    y-=3;
  }
}
