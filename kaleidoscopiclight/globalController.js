var globalController = {
    // Shared properties
    music: false,
    fullscreen: false,
  
    // Music control method
    toggleMusic: function() {
      if (this.music) {
        bgm.loop(); // Assuming bgm is the audio object
      } else {
        bgm.stop();
      }
    },
  
    // Fullscreen control method
    toggleFullscreen: function() {
      this.fullscreen = !this.fullscreen;
      fullscreen(this.fullscreen);
    },
  
    // Settings for each view
    discoSettings: {
      sideLength: 100,
      numParticles: 12,
      minimalDistance: 60,
      rotationSpeed: 0.05
    },
  
    newSettings: {
      pieces: 5,
      border: 0,
      xShift: 3,
      yShift: 1,
      speed: 14
    },
  
    sketchSettings: {
      lightSize: 50,
      palette: 0
    }
  };
  