class Boid {
  constructor() {
    this.pos = createVector(random(-100, width), random(height));
    this.velocity = p5.Vector.random2D().setMag(random(2, 5));
    this.acceleration = createVector();
    this.maxForce = 0.6;
    this.maxSpeed = 4;
    this.perceptionRadius = 120;

    this.history = [];
    this.isHealthy = random() < 0.65;
    this.motility = this.isHealthy ? "high" : "low";
    this.scaleFactor = random(0.5, 2.0);
  }

  edges() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  flock(boids, predator) {
    let alignment = createVector();
    let cohesion = createVector();
    let separation = createVector();
    let escape = createVector();
    let total = 0;

    for (let other of boids) {
      let d = this.pos.dist(other.pos);
      if (other !== this && d < this.perceptionRadius) {
        alignment.add(other.velocity);
        cohesion.add(other.pos);
        separation.add(p5.Vector.sub(this.pos, other.pos).div(d * d));
        total++;
      }
    }

    if (total > 0) {
      alignment.div(total).setMag(this.maxSpeed).sub(this.velocity).limit(this.maxForce);
      cohesion.div(total).sub(this.pos).setMag(this.maxSpeed).sub(this.velocity).limit(this.maxForce);
      separation.div(total).setMag(this.maxSpeed).sub(this.velocity).limit(this.maxForce);
    }

    // Predator escape behavior
    let dPredator = this.pos.dist(predator.position);
    if (dPredator < 200) {
      escape = p5.Vector.sub(this.pos, predator.position);
      escape.setMag(this.maxSpeed * 2).limit(this.maxForce * 1.5);
      this.acceleration.add(escape);
    } else {
      // Apply flocking behaviors only when predator is far
      this.acceleration.add(alignment);
      this.acceleration.add(cohesion);
      this.acceleration.add(separation);
    }
  }

  update() {
    this.velocity.add(this.acceleration).limit(this.maxSpeed);
    this.pos.add(this.velocity);
    this.acceleration.mult(0);

    // Add position to history for tail effect
    this.history.push(this.pos.copy());
    if (this.history.length > TAIL_LENGTH) {
      this.history.shift();
    }
  }

  display() {
    noStroke();
    fill(this.isHealthy ? "#A4CCCE" : "#AE9A93");

    // Draw tail
    for (let i = 0; i < this.history.length; i++) {
      const pos = this.history[i];
      ellipse(pos.x, pos.y, (i + 2) * TAIL_SCALE, (i + 2) * TAIL_SCALE);
    }

    // Draw fish body
    const head = this.history[this.history.length - 1];
    if (head) {
      ellipse(head.x, head.y, 10, 10);

      // Eyes
      const eyeOffsetX = 5, eyeOffsetY = 3, eyeSize = 3;
      fill(0);
      ellipse(head.x - eyeOffsetX, head.y - eyeOffsetY, eyeSize);
      ellipse(head.x + eyeOffsetX, head.y - eyeOffsetY, eyeSize);
    }
  }
}



