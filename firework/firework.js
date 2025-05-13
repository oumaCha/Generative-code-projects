class Firework {
    constructor(startX, targetY, size) {
      this.pos = createVector(startX, 0);
      this.target = createVector(startX, targetY);
      this.size = size;
      this.exploded = false;
      this.particles = [];
      this.timer = 30;
      this.isFinal = false; // Mark if this is the final firework
      this.flashTimer = 0; // Flash timer for the final explosion
  
      // Random color for the firework before explosion (rounded state)
      this.fireworkColor = color(random(360), 100, 100); // Random color in HSB mode
  
      // Random color for the explosion after it explodes (watery tones)
      this.explosionColor = color(random(180, 210), 80, 100); // Unique watery explosion color
    }
  
    update() {
      if (!this.exploded) {
        this.pos.x = lerp(this.pos.x, this.target.x, 0.05);
        this.pos.y = lerp(this.pos.y, this.target.y, 0.05);
  
        if (p5.Vector.dist(this.pos, this.target) < 5) {
          this.timer--;
          if (this.timer <= 0) {
            this.exploded = true;
            this.generateParticles();
  
            // Trigger a flash if it's the final firework
            if (this.isFinal) {
              this.flashTimer = 60; // 1-second bright flash
              triggerFinalExplosionEffects(); // Additional effects
            }
          }
        }
      } else {
        for (let p of this.particles) {
          p.update();
        }
        this.particles = this.particles.filter((p) => !p.isDone());
      }
    }
  
    generateParticles() {
      // Play the sound when the firework explodes
      if (soundFirework && soundFirework.isLoaded()) {
        soundFirework.play();
      }
  
      let numParticles = int(this.size / 2) + random(10, 20);
      for (let i = 0; i < numParticles; i++) {
        let angle = random(TWO_PI);
        let speed = random(2, this.size / 20);
        let vel = createVector(cos(angle) * speed, sin(angle) * speed);
        // Pass the firework's explosion color to each particle
        this.particles.push(new Particle(this.pos.x, this.pos.y, vel, this.explosionColor));
      }
    }
  
    show() {
      if (!this.exploded) {
        // Show the firework with the color before explosion (rounded state)
        fill(this.fireworkColor);
        noStroke();
        ellipse(this.pos.x, this.pos.y, 12); // Bigger circle for rounded appearance
      } else {
        for (let p of this.particles) {
          p.show();
        }
  
        // Flash effect for the final explosion
        if (this.isFinal && this.flashTimer > 0) {
          let brightness = map(this.flashTimer, 60, 0, 255, 0); // Bright to dim
          fill(255, brightness);
          rect(0, 0, width, height); // Full-screen flash
          this.flashTimer--;
        }
      }
    }
  
    isDone() {
      return this.exploded && this.particles.length === 0;
    }
  }
  
  
  
  
  
  