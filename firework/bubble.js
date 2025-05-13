class Bubble {
    constructor(x, y, size) {
      this.pos = createVector(x, y);
      this.size = size;
      this.vel = createVector(0, random(-0.5, -2));
    }
  
    update() {
      this.pos.add(this.vel);
    }
  
    isOutOfScreen() {
      return this.pos.y < 0;
    }
  
    display() {
      fill(200, 50, 255, 0.5);
      ellipse(this.pos.x, this.pos.y, this.size);
    }
  }
  
  