class Predator {
    constructor() {
      this.position = createVector(width / 2, height / 2); // Start in the center
      this.velocity = createVector(0, 0); // Reset velocity
      this.acceleration = createVector(0, 0); // Reset acceleration
      this.target = createVector(0, 0);
      this.maxForce = 0.9;
      this.maxSpeed = 10;
      this.size = 120;
    }
  
    update(targetX, targetY) {
      this.target.set(targetX, targetY);
      let desiredVelocity = p5.Vector.sub(this.target, this.position);
      let distance = desiredVelocity.mag();
      if (distance > 0) {
        let speed = this.maxSpeed;
        if (distance < 200) {
          speed = map(distance, 0, 100, 0, this.maxSpeed);
        }
        desiredVelocity.setMag(speed);
        let steering = p5.Vector.sub(desiredVelocity, this.velocity);
        steering.limit(this.maxForce);
        this.acceleration.add(steering);
      }
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxSpeed);
      this.position.add(this.velocity);
      this.acceleration.mult(0);
    }
  
    display() {
      image(predatorImg, this.position.x - this.size / 2, this.position.y - this.size / 2, this.size, this.size);
    }
  }
  