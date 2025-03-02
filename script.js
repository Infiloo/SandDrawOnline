const canvas = document.getElementById("sandCanvas");
const ctx = canvas.getContext("2d");

let width, height, grid;
const scale = 4;
let currentColor = "yellow";

// Resize canvas and adjust grid dimensions based on window size
function resizeCanvas() {
    width = Math.floor(window.innerWidth / scale);
    height = Math.floor((window.innerHeight - 60) / scale);  // Adjust for the menu bar

    // Adjust the canvas size to fit the screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 60;  // Subtract 60px for the menu

    ctx.scale(scale, scale);  // Scale the context for drawing

    // Create a grid that fits the canvas dimensions
    grid = new Array(width).fill(null).map(() => new Array(height).fill(null));
}

// Update the canvas size whenever the window is resized
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Variable to track if the user is drawing
let isTouching = false;

// Function to update the simulation (gravity effect on sand particles)
function update() {
    for (let y = height - 2; y >= 0; y--) {
        for (let x = 0; x < width; x++) {
            if (grid[x][y] && !grid[x][y + 1]) {
                grid[x][y + 1] = grid[x][y];
                grid[x][y] = null;
            }
        }
    }
}

// Function to draw the grid (sand particles) on the canvas
function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (grid[x][y]) {
                ctx.fillStyle = grid[x][y];
                ctx.fillRect(x, y, 1, 1);  // Draw a square for each sand particle
            }
        }
    }
}

// Function to spawn sand particles when the user touches or clicks the canvas
function spawnSand(x, y) {
    const rect = canvas.getBoundingClientRect();
    const gridX = Math.floor((x - rect.left) / scale);
    const gridY = Math.floor((y - rect.top) / scale);
    
    if (gridX >= 0 && gridX < width && gridY >= 0 && gridY < height) {
        grid[gridX][gridY] = currentColor;  // Assign the current color to the particle
    }
}

// Event listeners for mouse and touch input
canvas.addEventListener("mousedown", () => isTouching = true);
canvas.addEventListener("mouseup", () => isTouching = false);
canvas.addEventListener("mousemove", (event) => {
    if (isTouching) spawnSand(event.clientX, event.clientY);
});

canvas.addEventListener("touchstart", (event) => {
    isTouching = true;
    event.preventDefault();
    spawnSand(event.touches[0].clientX, event.touches[0].clientY);
});

canvas.addEventListener("touchmove", (event) => {
    if (isTouching) {
        event.preventDefault();
        spawnSand(event.touches[0].clientX, event.touches[0].clientY);
    }
});

canvas.addEventListener("touchend", () => isTouching = false);

// Function to set the current color of the sand
function setColor(color) {
    currentColor = color;
}

// Function to open the color picker for custom colors
function openColorPicker() {
    document.getElementById("colorPicker").click();
}

// Main game loop to update and redraw the simulation
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
