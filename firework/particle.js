class Particle {
  constructor(x, y, vel, explosionColor) {
    this.pos = createVector(x, y);
    this.vel = vel;
    this.acc = createVector(0, 0.05); // Water gravity (slow downward)
    this.lifespan = 255;
    this.explosionColor = explosionColor; // Color for each particle after explosion
    this.waveEffect = random(1000); // For smooth "wavy" movement
    this.size = random(4, 8); // Random size to make the explosion more dynamic
  }

  update() {
    this.vel.add(this.acc); // Apply gravity effect
    this.pos.add(this.vel);
    
    // Add some smooth 'wavy' motion for underwater effect
    this.pos.x += sin(frameCount * 0.1 + this.waveEffect) * 0.2; // Wavy horizontal movement
    this.pos.y += cos(frameCount * 0.1 + this.waveEffect) * 0.2; // Wavy vertical movement

    this.vel.mult(0.98); // Apply friction (more realistic underwater drag)
    this.lifespan -= 2; // Decrease opacity over time
  }

  show() {
    // Use the explosion color with the lifespan to gradually fade the color
    let col = lerpColor(this.explosionColor, color(0, 0, 0), map(this.lifespan, 255, 0, 0, 1));
    fill(col, this.lifespan);
    noStroke();

    // Draw particles with slightly blurred edges for a more fluid look
    ellipse(this.pos.x, this.pos.y, this.size); // Larger particles with soft edges
  }

  isDone() {
    return this.lifespan <= 0;
  }
}