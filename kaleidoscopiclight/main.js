let currentSketch = null;

function switchSketch(sketchFunction) {
    // Remove the existing sketch if one is running
    if (currentSketch) {
        // Call the cleanup function for the previous sketch
        if (currentSketch.cleanup) {
            currentSketch.cleanup();
        }
        currentSketch.remove(); // This removes the p5 canvas
    }

    // Initialize the new sketch
    currentSketch = new p5(sketchFunction);
}

// ✅ Always start with `disco.js` on page load
window.onload = function () {
    switchSketch(discoSketch);
};





