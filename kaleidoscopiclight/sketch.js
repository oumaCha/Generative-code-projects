function sketchSketch(p) {
  let h = Math.sqrt(3) / 2 * 100; // Height of the triangles
  let shapes;
  let hex;
  let bgColor;
  let lightSize = 50; // Size of the light effect
  let lightPos;
  let lightColor;
  let startPos; // Starting position (top-left corner)
  let palette;
  let controller;
  let colorControllers = []; // Array to store color controllers


  class Controller {
    constructor() {
      this.lightSize = 50; // Adjust light size
      this.fullscreen = false; // Toggle fullscreen
    }
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight); // Use full window size
    
    controller = new Controller();
    h = Math.sqrt(3) / 2 * 200;
    startPos = p.createVector(0, 0); // Top-left corner as the starting point

    shapes = p.createGraphics(400, Math.ceil(h));
    shapes.noStroke();
    shapes.angleMode(p.DEGREES);

    hex = p.createGraphics(400, 400);
    hex.angleMode(p.DEGREES);

    // Define the color palette
    palette = ['#2F4F4F', '#3B3B6D', '#4B0082', '#556B2F', '#8B0000'];

    // Set up the GUI menu
    const gui = new dat.GUI();
    p.gui = gui; // Save the GUI instance for cleanup
    
    gui.add(controller, 'fullscreen').name('Fullscreen').onChange(toggleFullscreen);
  
    // Add color pickers for each color in the palette
    for (let i = 0; i < palette.length; i++) {
      const colorController = gui.addColor({ [`Color ${i + 1}`]: palette[i] }, `Color ${i + 1}`);
      colorController.onChange((newColor) => {
        palette[i] = newColor; // Update the palette dynamically
      });
      colorControllers.push(colorController); // Store the controller
    }
  };

  const toggleFullscreen = () => {
    p.fullscreen(controller.fullscreen);
  };

  const colorFromPalette = (n) => {
    return p.color(palette[n % palette.length]); // Get colors from the palette
  };

  p.draw = () => {
    // Dynamic background color
    let lerpColorVal = p.map(p.sin(p.frameCount * 0.01), -1, 1, 0, 1);
    bgColor = p.lerpColor(colorFromPalette(2), colorFromPalette(3), lerpColorVal);
    p.background(bgColor);

    drawTriangle();
    drawHex();

    // Dynamic light effect (pulse and move)
    lightPos = p.createVector(p.mouseX, p.mouseY);

    // Calculate distance from start position (top-left corner)
    let distance = p.dist(lightPos.x, lightPos.y, startPos.x, startPos.y);

    // Normalize the distance to control how much the color changes
    let normDistance = p.map(distance, 0, p.width, 0, 1); // From 0 to 1 across the width of the canvas

    // Lerp between two colors based on the distance
    lightColor = p.lerpColor(colorFromPalette(0), colorFromPalette(palette.length - 1), normDistance);

    // Fill the screen with tessellated shapes
    tessellate();

    drawLightEffect(lightPos, controller.lightSize, lightColor); // Use menu-controlled light size
  };

  const drawTriangle = () => {
    const ctx = shapes.drawingContext;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(50, 0); // Triangle top point
    ctx.lineTo(100, h); // Triangle bottom-right
    ctx.lineTo(0, h); // Triangle bottom-left
    ctx.clip();
    shapes.clear();
    shapes.rotate(p.frameCount);
    shapes.fill(colorFromPalette(0));
    shapes.rect(20, 20, 100, 100); // Small rectangle
    shapes.fill(colorFromPalette(2));
    shapes.triangle(0, 20, 160, 180, 0, 200); // Small triangle
    shapes.fill(colorFromPalette(1));
    shapes.triangle(40, 0, 100, 60, 60, 120); // Additional triangle
    shapes.fill(colorFromPalette(4));
    shapes.ellipse(200, 100, 160); // Circle in the triangle
    shapes.fill(colorFromPalette(1));
    shapes.ellipse(-50, -50, 50);
    shapes.fill(colorFromPalette(5));
    shapes.ellipse(-40, -46, 20);
    shapes.fill(colorFromPalette(0));
    shapes.triangle(-60, 0, -30, -40, -30, 0); // Another triangle
    shapes.fill(colorFromPalette(3));
    shapes.rect(-45, 0, 40, 800); // Rectangle along the triangle height
    shapes.rotate(17);
    shapes.fill(colorFromPalette(4));
    shapes.rect(60, 80, 20, 80);
    shapes.rotate(37);
    shapes.fill(colorFromPalette(6));
    shapes.rect(60, 80, 40, 80);
    shapes.rotate(180);
    shapes.fill(colorFromPalette(0));
    shapes.triangle(20, 40, 160, 180, 0, 200); // Final triangle
    shapes.translate(20, 0);
    shapes.rotate(20);
    shapes.fill(colorFromPalette(3));
    shapes.rect(0, 0, 20, 800);
    ctx.restore();
  };

  const drawHex = () => {
    hex.push();
    hex.clear();
    hex.translate(200, 200); // Center of the hexagon
    hex.push();
    hex.scale(1 / p.pixelDensity());
    hex.rotate(30);
    for (let i = 0; i < 3; i++) {
      hex.drawingContext.drawImage(shapes.elt, -20 * p.pixelDensity(), 0);
      hex.scale(-1, 1);
      hex.rotate(60);
      hex.drawingContext.drawImage(shapes.elt, -20 * p.pixelDensity(), 0);
      hex.rotate(60);
      hex.scale(-1, 1);
    }
    hex.pop();
    hex.pop();
  };

  const drawLightEffect = (position, size, lightColor) => {
    p.push();
    p.noStroke();

    // Transparent white shadowy glow (translucent layers)
    for (let i = 5; i > 0; i--) {
      let alpha = p.map(i, 1, 5, 100, 30); // Fading alpha for each layer (more transparent)
      let layerSize = size * (1 + i * 0.3); // Gradually larger circles
      p.fill(255, 255, 255, alpha); // Transparent white color
      p.ellipse(position.x, position.y, layerSize, layerSize);
    }

    // Core subtle white circle
    p.fill(255, 255, 255, 100); // A bit transparent for the core
    p.ellipse(position.x, position.y, size, size);

    // Radiating rings with transparent white effect
    let ringSize = size * 1.5 + (p.frameCount % 60) * 2; // Expanding ring
    p.noFill();
    p.strokeWeight(1);

    p.ellipse(position.x, position.y, ringSize, ringSize);

    p.pop();
  };

  const tessellate = () => {
    p.push();
    const hexWidth = h * 2; // Width of a single hexagon
    const hexHeight = h * 1.5; // Height of a single hexagon (with overlap)

    // Calculate the number of hexagons needed to fill the screen
    const cols = p.ceil(p.width / hexWidth) + 1; // Add 1 to ensure overlap
    const rows = p.ceil(p.height / hexHeight) + 1;

    // Loop through rows and columns to draw the hexagons
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        p.push();
        const x = col * hexWidth + (row % 2 === 0 ? 0 : hexWidth / 2); // Offset every other row
        const y = row * hexHeight;
        p.translate(x, y);
        p.scale(1 / p.pixelDensity());
        p.drawingContext.drawImage(hex.elt, -200 * p.pixelDensity(), -200 * p.pixelDensity());
        p.pop();
      }
    }
    p.pop();
  };


  function removeGUI() {
    if (gui) {
        gui.destroy();  // Remove the dat.GUI instance
    }
  }
}



