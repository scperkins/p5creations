let x = 400;
let y = 100;
let xspeed = 5;
let yspeed = 2;
let r = 20;

let paddle;
let score = 0;

function setup() {
  createCanvas(800, 600);
  ball = new Ball(x, y, 5, 2);
  paddle = new Paddle();
}

function draw() {
  background(0);
  text(`Score: ${score}`, 50, 50);
  paddle.update();
  paddle.display();
  ball.update();
  ball.display();

  var ballBottom = ball.y + ball.radius;
  var ballTop = ball.y - ball.radius;
  var ballRightEdge = ball.x + ball.radius;
  var ballLeftEdge = ball.x - ball.radius;
  var paddleTopEdge = paddle.y;
  var paddleBottomEdge = paddle.y + paddle.h;
  var paddleLeftEdge = paddle.x;
  var isVerticalCollision = ((ballBottom) >= (paddleTopEdge)) && ((ballTop) <= (paddleBottomEdge));
  var isHorizontalCollision = ((ballRightEdge) >= (paddleLeftEdge)) && ((ballLeftEdge) <= (paddle.x + paddle.w));
  if (isVerticalCollision && isHorizontalCollision && ball.yspeed > 0) {
    ball.y = paddle.y - ball.radius;
    ball.yspeed = -ball.yspeed;
    score += 1;
  }
  // detect bottom of canvas hit
  if (ballBottom >= 600 && ball.yspeed > 0) {
    score -= 1;
    ball.yspeed = -ball.yspeed;
  }
}

class Ball {
  constructor(x, y, xspeed, yspeed) {
    this.x = x;
    this.y = y;
    this.xspeed = xspeed;
    this.yspeed = yspeed;
    this.radius = 20;
  }

  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;
    if (this.x > width - r || this.x < r) {
      this.xspeed = -this.xspeed;
    }
    if (this.y > height - r || this.y < r) {
      this.yspeed = -this.yspeed;
    }
  }

  display() {
    fill(color(255, 255, 255));
    circle(this.x, this.y, this.radius * 2);
  }
}

class Paddle {
  constructor() {
    this.x = 0;
    this.y = 585;
    this.w = 150; // width
    this.h = 15 // height
  }

  update() {
    this.x = constrain(mouseX, 0, width - this.w);
  }

  display() {
    fill(255,255,255);
    rect(this.x, this.y, this.w, this.h);
  }
}


