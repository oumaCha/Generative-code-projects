// inspired from the coding train https://www.youtube.com/watch?v=UcdigVaIYAk
// , the coding train perlin noise flow field https://www.youtube.com/watch?v=BjoM9oKOAKY
// inspired by wind effect with mouse interaction by lucas Ferreira https://codepen.io/lucasjanta/pen/GRBJYvG
// inspired by Barney Codes easy perlin noise flow fields: https://www.youtube.com/watch?v=sZBfLgfsvSk
let particles = [], clouds = [], windLeaves = [];
let cloudImages = [], leafImages = [];
let flowField = [];
const numParticles = 100, numWindLeaves = 100, scale = 20, noiseScale = 0.01;
const cloudSpeed = 0.3, windOffset = 0.01;
let cols, rows, bgImage, zOffset = 0;

function preload() {
  bgImage = loadImage('pngegg.png');
  cloudImages = [loadImage('cloud.png'), loadImage('cloud2.png')];
  leafImages = [loadImage('leaf2.png'), loadImage('leaf3.png')];
}

function setup() {
  createCanvas(1400, 700);
  initializeClouds();
  initializeParticles();
  initializeFlowField();
  initializeWindLeaves();
}

function draw() {
  background(200, 200, 255);

  updateParticles();
  updateClouds();
  image(bgImage, width / 2 - bgImage.width / 6, height / 2 - bgImage.height / 6, bgImage.width / 3, bgImage.height / 3);

  generateFlowField();
  updateWindLeaves();
}

function initializeClouds() {
  for (let i = 0; i < 4; i++) {
    clouds.push({ position: createVector(i * 400, noise(i * noiseScale) * 150 - 20), image: random(cloudImages) });
  }
}

function initializeParticles() {
  for (let i = 0; i < numParticles; i++) particles.push(createVector(random(width), random(height)));
}

function initializeFlowField() {
  cols = floor(width / scale);
  rows = floor(height / scale);
  flowField = new Array(cols * rows);
}

function initializeWindLeaves() {
  for (let i = 0; i < numWindLeaves; i++) windLeaves.push(new WindLeaf());
}

function updateParticles() {
  particles.forEach(p => {
    let n = noise(p.x * noiseScale, p.y * noiseScale, frameCount * windOffset);
    let angle = TAU * n;
    p.add(createVector(cos(angle) * 2, sin(angle) * 2));
    wrapAroundEdges(p);
    fill(255, 204, 0, 150);
    noStroke();
    ellipse(p.x, p.y, 6, 6);
  });
}

function updateClouds() {
  clouds.forEach(cloud => {
    cloud.position.x -= cloudSpeed;
    if (cloud.position.x < -100) {
      cloud.position.set(width + random(100, 300), noise(cloud.position.x * noiseScale) * 150 + 50);
    }
    image(cloud.image, cloud.position.x, cloud.position.y, 300, 150);
  });
}

function generateFlowField() {
  let yOffset = 0;
  for (let y = 0; y < rows; y++) {
    let xOffset = 0;
    for (let x = 0; x < cols; x++) {
      let angle = noise(xOffset, yOffset, zOffset) * PI + PI / 2;
      flowField[x + y * cols] = p5.Vector.fromAngle(angle).setMag(1);
      xOffset += 0.1;
    }
    yOffset += 0.1;
  }
  zOffset += 0.01;
}

function updateWindLeaves() {
  windLeaves.forEach(leaf => {
    leaf.follow(flowField);
    leaf.applyGravity();
    leaf.applyRightwardForce();
    leaf.update();
    leaf.edges();
    leaf.show();
  });
}

function wrapAroundEdges(v) {
  if (v.x > width) v.x = 0;
  if (v.x < 0) v.x = width;
  if (v.y > height) v.y = 0;
  if (v.y < 0) v.y = height;
}

function mouseReleased() {
  noiseSeed(millis());
}


