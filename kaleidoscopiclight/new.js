function newSketch(p) {
  let xshift = 3;
  let yshift = 1;
  let pieces = 5;
  let wh; // Window height or window width
  let xcounter = 0;
  let ycounter = 0;
  let img;
  let imgSection;
  let piemask;
  let angle;
  let kaleidoscopeGraphics;
  let newController;
  let fileInput;
  

  p.preload = () => {
    img = p.loadImage(
      "https://plus.unsplash.com/premium_photo-1677005405455-fbcdfb13f668?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      () => console.log("Image loaded successfully."),
      () => console.error("Failed to load image.")
    );
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(10);
    wh = p.min(p.windowWidth, p.windowHeight);

    if (img) {
      imgSection = img.get(0, 0, wh, wh);
    } else {
      console.warn("Image not loaded yet.");
    }

    // Initialize dat.GUI menu
    newController = new NewController();
    const gui = new dat.GUI();
    p.gui = gui; // Save the GUI instance for cleanup
    gui.add(newController, "pieces", [3, 5, 7, 9]).name("Pieces").onChange(updatePieces);
    gui.add(newController, "xShift", -10, 10, 0.1).name("X Shift").onChange(updateShift);
    gui.add(newController, "yShift", -10, 10, 0.1).name("Y Shift").onChange(updateShift);
    gui.add(newController, "speed", 1, 70, 1).name("Speed").onChange(updateSpeed);
    gui.add(newController, "replaceImage").name("Upload Photo");

    // Create hidden file input for uploading images
    fileInput = p.createFileInput(handleFile);
    fileInput.hide();

    updatePieces();
    kaleidoscopeGraphics = p.createGraphics(p.width, p.height);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    wh = p.min(p.windowWidth, p.windowHeight);
    kaleidoscopeGraphics = p.createGraphics(p.width, p.height);

    if (!newController) {
      console.warn("newController not initialized yet.");
      return;
    }

    updatePieces();
  };

  const updatePieces = () => {
    if (!newController) {
      console.warn("newController is undefined, skipping updatePieces.");
      return;
    }

    pieces = newController.pieces;
    angle = p.TWO_PI / (pieces * 2);

    piemask = p.createGraphics(wh, wh);
    piemask.arc(0, 0, wh * 2, wh * 2, 0, angle, p.PIE);
  };

  const updateShift = () => {
    xshift = newController.xShift;
    yshift = newController.yShift;
  };

  const updateSpeed = () => {
    p.frameRate(newController.speed);
  };

  p.draw = () => {
    p.clear();

    if (!img || img.width === 0 || img.height === 0) {
      console.error("Image not loaded or undefined.");
      return;
    }

    imgSection = img.get(xcounter, ycounter, wh, wh);
    imgSection.mask(piemask);

    kaleidoscopeGraphics.clear();
    kaleidoscopeGraphics.push();
    kaleidoscopeGraphics.translate(p.width / 2, p.height / 2);

    for (let i = 0; i < pieces * 2; i++) {
      kaleidoscopeGraphics.push();
      let rotationAngle = angle * i;
      kaleidoscopeGraphics.rotate(rotationAngle);

      if (i % 2 == 0) {
        kaleidoscopeGraphics.image(imgSection, 0, 0);
      } else {
        kaleidoscopeGraphics.scale(-1, 1);
        kaleidoscopeGraphics.image(imgSection, 0, 0);
      }
      kaleidoscopeGraphics.pop();
    }
    kaleidoscopeGraphics.pop();

    p.image(kaleidoscopeGraphics, 0, 0);

    // Update xcounter and ycounter safely
    xcounter += xshift;
    if (xcounter + wh > img.width) xcounter = 0;
    if (xcounter < 0) xcounter = img.width - wh;

    ycounter += yshift;
    if (ycounter + wh > img.height) ycounter = 0;
    if (ycounter < 0) ycounter = img.height - wh;
  };

  function NewController() {
    this.pieces = 5;
    this.border = 0;
    this.xShift = 3;
    this.yShift = 1;
    this.speed = 14;
    this.replaceImage = function () {
      fileInput.elt.click();
    };
  }

  const handleFile = (file) => {
    if (file.type === "image") {
      p.loadImage(
        file.data,
        (uploadedImg) => {
          img = uploadedImg;
          xcounter = 0;
          ycounter = 0;
          console.log("New image loaded successfully.");
        },
        () => console.error("Failed to load uploaded image.")
      );
    } else {
      console.error("Please upload a valid image file.");
    }
  };

  function removeGUI() {
    if (gui) {
        gui.destroy();  // Remove the dat.GUI instance
    }
  }
}



