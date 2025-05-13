class WindLeaf {
    constructor() {
      this.pos = createVector(random(width), random(height));
      this.vel = createVector(0, 0);
      this.acc = createVector(0, 0);
      this.maxSpeed = random(2, 4);
      this.size = random(10, 20);
      this.angle = random(TWO_PI);
      this.rotationSpeed = random(-0.02, 0.02);
      this.image = random(leafImages);
    }
  
    follow(vectors) {
      let x = floor(this.pos.x / scale);
      let y = floor(this.pos.y / scale);
      this.applyForce(vectors[x + y * cols]);
    }
  
    applyForce(force) {
      this.acc.add(force);
    }
  
    applyGravity() {
      this.acc.add(createVector(0, 0.02));
    }
  
    applyRightwardForce() {
      this.acc.add(createVector(0.01, 0));
    }
  
    update() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
      this.angle += this.rotationSpeed;
    }
  
    edges() {
      wrapAroundEdges(this.pos);
    }
  
    show() {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.angle);
      image(this.image, 0, 0, this.size, this.size * 0.6);
      pop();
    }
  }
  