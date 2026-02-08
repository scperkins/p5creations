// Rocket tilt angle (toward top-right corner)
const ROCKET_ANGLE = 45;

// Star field
let stars = [];

// Fire particles
let fireParticles = [];

function setup() {
  createCanvas(800, 600);
  
  // Initialize stars
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.5, 2),
      brightness: random(150, 255)
    });
  }
}

function draw() {
  background(5, 5, 20);
  
  // Update and draw stars (parallax movement - opposite to rocket direction)
  const starDx = cos(radians(-ROCKET_ANGLE)) * 2;
  const starDy = sin(radians(-ROCKET_ANGLE)) * 2;
  
  for (let star of stars) {
    star.x -= starDx * star.speed;
    star.y -= starDy * star.speed;
    
    // Wrap around screen
    if (star.x < 0) star.x = width;
    if (star.x > width) star.x = 0;
    if (star.y < 0) star.y = height;
    if (star.y > height) star.y = 0;
  
  // Draw rocket (centered, tilted toward top-right, rotating around y-axis)
  push();
  translate(width / 2, height / 2);
  rotate(radians(ROCKET_ANGLE));
  // Simulate y-axis rotation: scale width by |cos(angle)| so it looks like we see front/side
  const yAxisAngle = frameCount * 2;
  const widthScale = 0.15 + 0.85 * abs(cos(radians(yAxisAngle)));
  scale(widthScale, 1);
  
  drawRocket();
  drawFire();
  
  pop();
}

function drawRocket() {
  // Rocket body - nose cone + cylindrical fuselage
  noStroke();
  
  // Main body (fuselage): pointed nose + straight cylindrical sides
  fill(180, 185, 195);
  beginShape();
  vertex(0, -60);   // nose tip
  vertex(10, -40);  // nose cone base right
  vertex(10, 50);   // cylinder right side (straight)
  vertex(-10, 50);  // bottom
  vertex(-10, -40); // cylinder left side (straight)
  endShape(CLOSE);
  
  // Window/cockpit
  /* fill(100, 180, 255);
  ellipse(0, -20, 18, 22); */

  // Fins (lower end, near engine housing)
  fill('red');
  //rotate(frameCount * 0.01);
  // Right fin: attached to fuselage at y 40–52, tip out and down
  triangle(10, 20, 10, 72, 28, 72);
  // Left fin
  triangle(-10, 20, -10, 72, -28, 72);
  

  // Engine housing
  fill(80, 85, 95);
  rect(-12, 45, 24, 15);
  
  // Engine nozzles (where fire comes from)
  fill(60, 65, 75);
  rect(-10, 58, 8, 12);
  rect(2, 58, 8, 12);
}

function drawFire() {
  // Add new fire particles each frame (from both engine nozzles)
  if (frameCount % 2 === 0) {
    const nozzleOffsets = [-6, 6];
    for (let offset of nozzleOffsets) {
      for (let i = 0; i < 2; i++) {
        fireParticles.push({
          x: offset + random(-2, 2),
          y: 70,
          vx: random(-0.5, 0.5),
          vy: random(2, 5),
          life: 1,
          size: random(4, 10)
        });
      }
    }
  }
  
  // Update and draw fire particles
  for (let i = fireParticles.length - 1; i >= 0; i--) {
    let p = fireParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.03;
    p.size *= 0.97;
    
    if (p.life <= 0 || p.size < 0.5) {
      fireParticles.splice(i, 1);
      continue;
    }
    
    // Flame gradient: orange/yellow at base, red at tip
    const alpha = p.life * 255;
    const lerpVal = 1 - p.life;
    fill(lerpColor(
      color(255, 200, 50, alpha),
      color(255, 80, 20, alpha * 0.5),
      lerpVal
    ));
    noStroke();
    ellipse(p.x, p.y, p.size * 1.5, p.size * 2);
  }
}
