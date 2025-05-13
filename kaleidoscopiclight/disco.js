function discoSketch(p) {
  let s = 100; // Triangle side length
  let num = 12; // Number of particles
  let minimal = 60; // Distance for linking particles
  let speed = 0.05; // Rotation speed
  let X = new Array(num);
  let Y = new Array(num);
  let VX = new Array(num);
  let VY = new Array(num);
  let r = new Array(num);
  let g = new Array(num);
  let b = new Array(num);
  let colorChange = false;
  let bgm;
  let amplitude;
  let discoController;
  let particleTrailLength = 20; // Length of the trail
  let gui; 
  
  function DiscoController() {
    this.Side = 100;
    this.Line = 60;
    this.Music = false;
    this.Screenshot = false;
    this.colorR = 255;
    this.colorG = 255;
    this.colorB = 255;
    this.shape = "Circle";
    this.Navigation = "Disco";
  }

  p.preload = () => {
    bgm = p.loadSound("song.mp3");
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    amplitude = new p5.Amplitude();

    let gui = new dat.GUI();
    discoController = new DiscoController();
    gui.add(discoController, "Line", 30, 120).name("Line Distance");
    gui.add(discoController, "Side", 60, 200).name("Triangle Size");
    gui.add(discoController, "Music").onChange(playMusic);
    gui.add(discoController, "Screenshot").onChange(saveImage);
    gui.add(discoController, "colorR", 0, 255).name("Red");
    gui.add(discoController, "colorG", 0, 255).name("Green");
    gui.add(discoController, "colorB", 0, 255).name("Blue");
    gui.add(discoController, "shape", ["Circle", "Square", "Triangle"]).name("Particle Shape");
    gui.add(discoController, "Navigation", ["Disco", "New", "Sketch"]).name("Switch View").onChange(switchView);
     
    p.gui = gui; // Assign GUI reference for proper cleanup
    // Initialize particle positions and velocities
    for (let i = 0; i < num; i++) {
      X[i] = p.random(0, s * 2);
      Y[i] = p.random(0, s * Math.sqrt(3));
      VX[i] = p.random(-speed, speed);
      VY[i] = p.random(-speed, speed);
      r[i] = p.random(255);
      g[i] = p.random(255);
      b[i] = p.random(255);
    }

    
  };


 // Function to clean up GUI when switching sketches
 function cleanup() {
  if (p.gui) {
    p.gui.destroy();  // Properly destroy the GUI
    p.gui = null;
  }
}

  p.draw = () => {
    let level = amplitude.getLevel();
    p.background(0, 50);

    minimal = discoController.Line;
    s = discoController.Side;
    let l0 = p.map(p.mouseX, 0, p.width, 100, 200);
    let l1 = p.map(p.mouseY, 0, p.height, 100, 200);

    p.translate(p.width / 2, p.height / 2);

    for (let i = 0; i < 6; i++) {
      p.push();
      p.rotate((i * p.TWO_PI) / 6);
      p.translate(0, l0);

      p.push();
      p.rotate(level * 100);
      particles();
      p.pop();

      for (let j = 0; j < 6; j++) {
        p.push();
        p.rotate((j * p.TWO_PI) / 6);
        p.translate(0, l1);

        p.push();
        p.rotate(level * 100);
        particles();
        p.pop();

        p.pop();
      }

      p.pop();
    }
  };

  function particles() {
    for (let i = 0; i < num; i++) {
      // Update particle positions with sound-responsive size
      let particleSize = p.map(amplitude.getLevel(), 0, 1, 5, 20);
      if (X[i] < Y[i] / Math.sqrt(3)) {
        VX[i] *= -1;
        VY[i] *= -1;
        X[i] = Y[i] / Math.sqrt(3);
      }
      if (X[i] > -Y[i] / Math.sqrt(3) + s * 2) {
        VX[i] *= -1;
        VY[i] *= -1;
        X[i] = -Y[i] / Math.sqrt(3) + s * 2;
      }
      if (Y[i] > s * Math.sqrt(3)) {
        VY[i] *= -1;
        Y[i] = s * Math.sqrt(3) - 10;
      }
      if (Y[i] < 0) {
        VY[i] *= -1;
        Y[i] = 0;
      }
      X[i] += VX[i];
      Y[i] += VY[i];

      // Draw particles with trails
      p.fill(discoController.colorR, discoController.colorG, discoController.colorB, 150);
      if (discoController.shape === "Circle") {
        p.ellipse(X[i], Y[i], particleSize);
      } else if (discoController.shape === "Square") {
        p.rect(X[i], Y[i], particleSize, particleSize);
      } else if (discoController.shape === "Triangle") {
        p.triangle(X[i] - 5, Y[i] + 5, X[i] + 5, Y[i] + 5, X[i], Y[i] - 5);
      }

      // Draw links between particles with smooth color transitions
      for (let n = 0; n < num; n++) {
        let d = p.dist(X[n], Y[n], X[i], Y[i]);
        if (d < minimal) {
          p.colorMode(p.HSB);
          p.stroke(
            colorChange ? (1 - d / minimal) * 330 : (d / minimal) * 330,
            70,
            100
          );
          p.strokeWeight(0.5);
          p.line(X[n], Y[n], X[i], Y[i]);
        }
      }
    }
  }

  function playMusic() {
    if (discoController.Music) {
      bgm.loop();
    } else {
      bgm.stop();
    }
  }

  function saveImage() {
    p.save("disco_" + p.month() + "-" + p.day() + "_" + p.hour() + "-" + p.minute() + "-" + p.second() + ".jpg");
  }

  function switchView() {
    // Clean up the old GUI if it exists
    cleanup();

    if (discoController.Navigation === "New" && typeof newSketch === "function") {
      switchSketch(newSketch);
    } else if (discoController.Navigation === "Sketch" && typeof sketchSketch === "function") {
      switchSketch(sketchSketch);
    } else {
      // Default to Disco sketch if no valid view
      switchSketch(discoSketch);
    }
  }
}

function switchSketch(newSketch) {
  new p5(newSketch);

}

