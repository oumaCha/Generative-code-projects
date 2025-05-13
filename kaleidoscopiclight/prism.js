class PrismLight {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isDragging = false;
    }

    display() {
        fill(255, 0, 0); // Red color for the prism light
        ellipse(this.x, this.y, 30, 30); // Draw the prism light as a circle
    }

    updatePosition() {
        if (this.isDragging) {
            this.x = mouseX;
            this.y = mouseY;
        }
    }

    startDrag() {
        this.isDragging = true;
    }

    stopDrag() {
        this.isDragging = false;
    }
}

