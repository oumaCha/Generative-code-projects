class Shockwave {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.radius = 0;
    this.maxRadius = width; // Maximum radius for the shockwave
    this.alpha = 255; // Initial opacity
    this.growthRate = 6; // Controls the rate of radius increase
    this.fadeRate = 5; // Controls the rate of opacity fading
  }

  update() {
    // Increment radius smoothly and reduce opacity
    this.radius = lerp(this.radius, this.maxRadius, 0.05);
    this.alpha -= this.fadeRate;

    // Prevent over-expansion or negative alpha
    this.radius = constrain(this.radius, 0, this.maxRadius);
    this.alpha = max(this.alpha, 0);
  }

  show() {
    noFill();
    stroke(255, this.alpha);
    strokeWeight(4);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }

  isDone() {
    return this.alpha <= 0; // Mark the shockwave as done when fully transparent
  }
}

function triggerFinalExplosionEffects() {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      let shockwave = new Shockwave(width / 2, height / 2);
      fireworks.push(shockwave);
    }, i * 200); // Offset each shockwave by 200ms
  }
  screenShakeDuration = 30;

  // Trigger video playback directly after the final explosion
  showVideo();
}

  
  
  
  