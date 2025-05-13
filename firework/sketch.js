let fireworks = [];
let explosionCounter = 0;
let maxExplosions = 10;
let explosionInterval = 40;
let backgroundColor = [10, 20, 50];
let bubbles = [];
let soundFirework;
let particles = [];
let showBubblesOnly = false;
let videoDisplayed = false;
let seaVideo;
let underwaterSound;
let transitionTimer = 0;
let screenShakeOffset = 0;
let screenShakeDuration = 0;


function preload() {
  soundFirework = loadSound("firework.mp3");
  seaVideo = createVideo("sea.mp4");
  underwaterSound = loadSound("underwater.mp3");
  seaVideo.hide();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  userStartAudio();
  colorMode(HSB);
  noStroke();
  frameRate(60);

  for (let i = 0; i < 30; i++) {
    bubbles.push(new Bubble(random(width), random(height), random(10, 20)));
  }
}

function draw() {
  // Handle screen shake
  if (screenShakeDuration > 0) {
    screenShakeOffset = random(-10, 10);
    screenShakeDuration--;
  } else {
    screenShakeOffset = 0;
  }
  translate(screenShakeOffset, screenShakeOffset);

  // If video is displayed, draw it and exit the draw loop
  if (videoDisplayed) {
    drawVideo();
    return;
  }

  // Draw the sea background
  drawSeaBackground();

  // **1. Update and Display Bubbles Continuously**
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].update();
    bubbles[i].display();
    if (bubbles[i].isOutOfScreen()) {
      bubbles.splice(i, 1); // Remove bubble if it's off-screen
    }
  }

  // **2. Continuously Generate New Bubbles**
  // Add new bubbles only while fireworks are active
  if (!showBubblesOnly && explosionCounter < maxExplosions) {
    // Adjust the modulus value to control bubble generation rate
    if (frameCount % 30 === 0) { // Approximately every 0.5 seconds at 60 FPS
      let newBubbleSize = random(10, 20);
      bubbles.push(new Bubble(random(width), height, newBubbleSize));
    }
  }

  // **Fireworks Handling**
  if (!showBubblesOnly) {
    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update();
      fireworks[i].show();
      if (fireworks[i].isDone()) {
        fireworks.splice(i, 1);
      }
    }

    if (frameCount % explosionInterval === 0 && explosionCounter < maxExplosions) {
      let explosionSize = map(explosionCounter, 0, maxExplosions, 50, width * 0.8);
      let firework = new Firework(random(width), random(height / 3, height / 2), explosionSize);

      if (explosionCounter === maxExplosions - 1) {
        firework.isFinal = true;
      }

      fireworks.push(firework);
      explosionCounter++;

      if (!soundFirework.isPlaying()) {
        soundFirework.play();
      }
    }
  }

  // **Transition to Show Bubbles Only After Fireworks**
  if (fireworks.length === 0 && explosionCounter >= maxExplosions) {
    transitionTimer += 0.01;

    if (transitionTimer >= 1) {
      showBubblesOnly = true;
      if (transitionTimer > 2) {
        showVideo();
      }
    }
  }
}

function drawSeaBackground() {
  for (let y = 0; y < height; y++) {
    let n = map(y, 0, height, 0, 1);
    let originalColor = lerpColor(color(190, 100, 100), color(220, 80, 50), n);
    stroke(originalColor);
    line(0, y, width, y);
  }

  
}

function showVideo() {
  if (!videoDisplayed) {
    seaVideo.loop();
    underwaterSound.loop();
    videoDisplayed = true; // Prevent further calls
  }
}

function drawVideo() {
  let elapsedTime = seaVideo.time();

  if (elapsedTime <= 5) {
    let fadeAmount = map(elapsedTime, 0, 5, 255, 0);
    fill(255, fadeAmount);
    noStroke();
    rect(0, 0, width, height);
  }
  image(seaVideo, 0, 0, width, height); // Render the video
}






