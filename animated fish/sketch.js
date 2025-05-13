// sketch.js
let bgImage, startBgImage, predatorImg;
let sound, catchSound;
const numFish = 100;
const flock = [];
let predator;
let numFishes = numFish;
let fishGoneMessage = null;
let gameOver = false;
let startButton, retryButton;
let gameStarted = false;
const TAIL_LENGTH = 20; // Tail history length for each fish
const TAIL_SCALE = 0.95; // Scale factor for tail circles

function preload() {
  bgImage = loadImage("Asset/sea1.jpg");
  startBgImage = loadImage("Asset/start.jpg"); // New background for start screen
  sound = loadSound("Asset/underwater.mp3");
  predatorImg = loadImage('Asset/shark1.png');
  catchSound = loadSound('Asset/eating.mp3'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  sound.loop();

  // Create Start Button
  startButton = createButton("Start Game");
  startButton.position(width / 2 - 50, height / 2 - 20);
  startButton.style("font-size", "20px");
  startButton.style("padding", "10px 20px");
  startButton.style("background-color", "#4CAF50");
  startButton.style("color", "white");
  startButton.style("border", "none");
  startButton.style("border-radius", "5px");
  startButton.style("cursor", "pointer");
  startButton.mousePressed(startGame);

  // Create Retry Button (hidden initially)
  retryButton = createButton("Retry");
  retryButton.position(width / 2 - 40, height / 2 + 50);
  retryButton.style("font-size", "20px");
  retryButton.style("padding", "10px 20px");
  retryButton.style("background-color", "#F44336");
  retryButton.style("color", "white");
  retryButton.style("border", "none");
  retryButton.style("border-radius", "5px");
  retryButton.style("cursor", "pointer");
  retryButton.hide();
  retryButton.mousePressed(restartGame);
}

function draw() {
  if (!gameStarted) {
    image(startBgImage, 0, 0, width, height); // Display the start background image
    fill(255);
    textSize(30);
    textAlign(CENTER, CENTER);
    text("Welcome to the Game! Click Start to Begin", width / 2, height / 2 - 80);
    return; // Skip the rest of the draw loop if the game hasn't started
  }

  // Main game logic after starting
  image(bgImage, 0, 0, width, height);

  predator.update(mouseX, mouseY);
  predator.display();

  for (let i = flock.length - 1; i >= 0; i--) {
    let boid = flock[i];
    boid.edges();
    boid.flock(flock, predator);
    boid.update();
    boid.display();

    let dPredator = predator.position.dist(boid.pos);
    if (dPredator < 50) {
      if (!boid.isHealthy) {
        displayGameOver();
        return;
      }
      flock.splice(i, 1);
      numFishes--;
      catchSound.play();
    }
  }

  displayFishesCount();

  if (numFishes === 0 && !gameOver) {
    displayGameOver();
  }
}

function startGame() {
  gameStarted = true;
  startButton.hide(); // Hide the Start Button

  // Initialize fish and predator
  for (let i = 0; i < numFish; i++) {
    flock.push(new Boid());
  }
  predator = new Predator();
}

function restartGame() {
  gameOver = false;
  numFishes = numFish;
  flock.length = 0; // Clear the existing fish
  for (let i = 0; i < numFish; i++) {
    flock.push(new Boid());
  }
  predator = new Predator(); // Recreate predator to reset its state
  retryButton.hide(); // Hide the retry button
  loop(); // Restart the draw loop
}

function displayMessage(message, position) {
  push();
  textSize(30);
  fill(255);
  textAlign(CENTER);
  text(message, position.x, position.y);
  pop();
}

function displayFishesCount() {
  push();
  textSize(20);
  fill(255);
  textAlign(RIGHT, TOP);
  text(`Total Fish: ${numFishes}`, width - 20, 20);
  pop();
}

function displayGameOver() {
  push();
  textSize(70);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2);
  pop();
  gameOver = true;
  noLoop(); // Stop the draw loop
  retryButton.show(); // Show the Retry Button
}

