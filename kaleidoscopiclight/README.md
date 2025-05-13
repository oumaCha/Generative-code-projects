# Kaleidoscope Project

this project dedicated to create kaleidoscope effects , each Kaleidoscope have different menu bar options where user can manipulate the parameter to his own interest. 

## DiscoSketch

### Interactive Visual Sketch
The kaleidoscope effect features particle animations, music synchronization, and customizable options. It uses **p5.js** for creative coding and interactive visualizations.

### Key Features
- **Global Variables**: Control particle properties like position, speed, and color. 
- **DiscoController Class**: Manages GUI options for particle settings and music.
- **Main Animation**: Particles react to sound amplitude, changing size and moving dynamically. A hexagonal grid and particle interactions create evolving patterns.
- **User Interaction**: Adjust particle settings, toggle music, save images, and switch between visualizations.

### Functions
- `particles()`: Updates particle positions and interactions.
- `playMusic()`: Controls background music.
- `saveImage()`: Saves the current view as an image.
- `switchView()`: Switches between different visualizations.


## Sketch.js

### Interactive Pattern Generator
This sketch uses **p5.js** to create a dynamic visual pattern with light effects and color transitions.

### Key Features
- **Variables**: Control shapes, light effects, and colors.
- **Controller Class**: Manages light size and fullscreen mode.
- **Main Functions**: Draws rotating shapes and tessellated patterns. The background color and light effect change dynamically.
- **Interactivity**: Customize colors and toggle fullscreen using a GUI.


## new.js

# Kaleidoscope Effect

this kaleidoscope effect use  image to split into multiple slices, rotated, and mirrored to create a symmetrical, rotating kaleidoscope pattern. The user can interact with the effect to adjust various parameters such as the number of pieces, animation speed, and the section of the image used to generate the effect.

### How the Kaleidoscope Effect Works

- **Image Division**: The image is divided into slices or "pieces," determined by the `pieces` parameter.
- **Rotation and Mirroring**: Each slice is rotated and mirrored to create the symmetrical kaleidoscope effect.
- **Dynamic Adjustment**: 
  - The user can control the number of pieces, with more pieces resulting in a more complex and detailed pattern.
  - The position of the image section being used to generate the kaleidoscope effect is adjusted dynamically with `xshift` and `yshift`.
- **Image Section Application**: The `imgSection` is applied to the kaleidoscope graphics. For each piece of the kaleidoscope, the image is mirrored and rotated to form the final pattern.

### User Interaction

- **Adjust Parameters**: 
  - The user can adjust the number of kaleidoscope pieces.
  - The speed of the animation can be controlled.
  - The position of the image section can be modified using the GUI.
  
- **Image Upload**: The user can upload a new image to replace the default one, allowing for a personalized kaleidoscope effect.