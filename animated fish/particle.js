class Particle {
    constructor(x, y, isHealthy, motility) {
      this.pos = createVector(x, y);
      this.isHealthy = isHealthy;
      this.motility = motility;
      this.history = [];
      this.xoff = random(20000);
      this.yoff = random(40000);
      this.layer = random([1, 2]);  // Assign random layer
      this.scaleFactor = random(0.5, 2.0); // Add this line for unique scaling
    }
 
    update() {
        const speedFactor = { 'low': 0.15, 'medium': 0.9, 'high': 0.7 }[this.motility];
        this.xoff += 0.007 * speedFactor * this.scaleFactor; // Multiply with unique scaleFactor
        this.yoff += 0.007 * speedFactor * this.scaleFactor; // Multiply with unique scaleFactor
        this.pos.set(
          map(noise(this.xoff), 0, 1, 0, width + 20),
          map(noise(this.yoff), 0, 1, 0, height + 40)
        );
    
        this.history.push(this.pos.copy());
    
        if (this.history.length > TAIL_LENGTH) {
          this.history.shift();
        }
      }

      show() {
        if (this.isHealthy) {
          fill("#A4CCCE");
          noStroke();
        } else {
          fill("#AE9A93");
          noStroke();
        }
    
        // Adding the noise offset to the position for a 'sketchy' appearance
        let noiseOffset = random(-0.5, 0.5); // A small random offset
    
        for (let i = 0; i < this.history.length; i++) {
          const pos = this.history[i];
          ellipse(pos.x + noiseOffset, pos.y + noiseOffset, (i + 2) * TAIL_SCALE, (i + 2) * TAIL_SCALE);
        }
        
        
        if (this.history.length >= TAIL_LENGTH) {
            const head = this.history[this.history.length - 1];
            const eyeOffsetX = 5;
            const eyeOffsetY = 3;
            const eyeSize = 3;
      
            if (this.isHealthy) {
              fill(0); // Eyes for healthy fish
              ellipse(head.x - eyeOffsetX, head.y - eyeOffsetY, eyeSize);
              ellipse(head.x + eyeOffsetX, head.y - eyeOffsetY, eyeSize);
            } else {
              stroke("#580000"); // Eyes (X marks) for unhealthy fish
              line(head.x - eyeOffsetX - 1.5, head.y - eyeOffsetY - 1.5, head.x - eyeOffsetX + 1.5, head.y - eyeOffsetY + 1.5);
              line(head.x - eyeOffsetX + 1.5, head.y - eyeOffsetY - 1.5, head.x - eyeOffsetX - 1.5, head.y - eyeOffsetY + 1.5);
              stroke("#470000");
              line(head.x + eyeOffsetX - 1.5, head.y - eyeOffsetY - 1.5, head.x + eyeOffsetX + 1.5, head.y - eyeOffsetY + 1.5);
              line(head.x + eyeOffsetX + 1.5, head.y - eyeOffsetY - 1.5, head.x + eyeOffsetX - 1.5, head.y - eyeOffsetY + 1.5);
            }
          }
        }
      }
      