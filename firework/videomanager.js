class VideoManager {
    constructor(videoFile, soundFile) {
      this.video = createVideo(videoFile);
      this.underwaterSound = loadSound(soundFile);
      this.videoDisplayed = false;
      this.transitionTimer = 0;
      this.screenShakeOffset = 0;
      this.screenShakeDuration = 0;
      this.video.hide();
    }
  
    startShake() {
      this.screenShakeDuration = 30;
    }
  
    update() {
      if (this.screenShakeDuration > 0) {
        this.screenShakeOffset = random(-10, 10);
        this.screenShakeDuration--;
      } else {
        this.screenShakeOffset = 0;
      }
    }
  
    drawVideo() {
      if (!this.videoDisplayed) return;
  
      let elapsedTime = this.video.time();
      if (elapsedTime <= 5) {
        let fadeAmount = map(elapsedTime, 0, 5, 255, 0);
        fill(255, fadeAmount);
        noStroke();
        rect(0, 0, width, height);
      }
      image(this.video, 0, 0, width, height);
    }
  
    showVideo() {
      if (!this.videoDisplayed) {
        this.video.loop();
        this.underwaterSound.loop();
        this.video.show();
        this.videoDisplayed = true;
      }
    }
  }
  