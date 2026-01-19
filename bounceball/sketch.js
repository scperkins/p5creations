let balls = [];

function setup() {
  createCanvas(800, 600);
  for (let i = 0; i <= 10; i+=1) {
    balls.push(new Ball(random(1, 800), random(1, 800)));
  }
}

function draw() {
  background(220);

  for (let ball of balls) {
    ball.update();
    ball.display();
  }
}

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 40;
    this.speed = 5;
    this.direction = 1; // 1 = down, -1 = up
    this.ballColor = color(random(255), random(255), random(255));
  }

  update() {
    this.y += this.speed * this.direction;

    // Bounce off top and bottom
    if (this.y > height - this.radius) {
      this.direction = -1;
    }
    if (this.y < this.radius) {
      this.direction = 1;
    }
  }

  display() {
    fill(this.ballColor);
    circle(this.x, this.y, this.radius * 2);
  }
}
