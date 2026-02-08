// Realistic fire simulation using a particle system with Perlin noise.
// Particles rise from the base, flicker with turbulence, and fade by life.

let particles = [];
let flowfield;   // Perlin noise for horizontal drift
let noiseScale = 0.02;
let noiseStrength = 50;
let spawnWidth = 20;   // width of the "flame" at the base
let spawnY;
let particleCount = 1000;
let baseRise = 2.2;
let lifeDecay = 0.012;
let sizeDecay = 0.88;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 100);
  spawnY = height - 40;

  // Pre-fill with some particles so fire is visible immediately
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(random(0, 1)));
  }
}

function draw() {
  // Dark background so fire stands out
  background(5, 5, 8);

  // Spawn new particles each frame (steady stream)
  let toSpawn = 8;
  for (let i = 0; i < toSpawn; i++) {
    particles.push(new Particle(1));
  }

  // Update and draw (reverse so new particles draw on top of older ones)
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }

  // Cap total particles for performance
  while (particles.length > particleCount) {
    particles.shift();
  }
}

class Particle {
  constructor(life) {
    this.reset(life);
  }

  reset(life) {
    this.x = width / 2 + random(-spawnWidth / 2, spawnWidth / 2);
    this.y = life < 1 ? random(spawnY, height) : spawnY;
    this.vx = 0;
    this.vy = -random(0.8, 1.8);
    this.life = life;
    this.maxLife = 1;
    this.size = random(4, 14);
    this.hue = random(15, 45);   // orange–yellow range
    this.sat = 90;
    this.bright = 100;
  }

  update() {
    // Perlin noise for organic horizontal movement
    let n = noise(this.x * noiseScale, this.y * noiseScale, frameCount * 0.02);
    this.vx += (n - 0.5) * noiseStrength * 0.15;
    // Slight pull toward mouse (wind / lean)
    if (mouseX >= 0 && mouseX <= width) {
      this.vx += (mouseX - this.x) * 0.0008;
    }
    this.vy -= 0.02;  // slight acceleration upward (buoyancy)
    this.vx *= 0.92;  // damp horizontal so it doesn't explode sideways
    this.vy *= 0.98;

    this.x += this.vx;
    this.y += this.vy * baseRise;

    this.life -= lifeDecay;
    this.size *= sizeDecay;

    // Widen slightly as it rises (flame shape)
    this.size += 0.02;
    this.size = constrain(this.size, 0.5, 18);
  }

  show() {
    if (this.life <= 0) return;

    noStroke();
    let alpha = 100 * this.life;
    let h = this.hue;
    let s = this.sat;
    let b = this.bright;

    // Cooler (redder) and dimmer as life decreases
    h = lerp(this.hue, 0, 1 - this.life);   // shift to red then fade
    s = lerp(100, 60, 1 - this.life);
    b = lerp(100, 40, 1 - this.life);
    fill(h, s, b, alpha);

    // Draw as soft ellipse (blur effect via multiple layers)
    let r = this.size;
    drawingContext.shadowBlur = r * 2;
    drawingContext.shadowColor = color(h, s, b, alpha * 0.8);
    ellipse(this.x, this.y, r * 2, r * 2.2);
    drawingContext.shadowBlur = 0;
  }
}
