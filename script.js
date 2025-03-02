const canvas = document.getElementById("sandCanvas");
const ctx = canvas.getContext("2d");

let width, height, grid;
const scale = 4;
let currentColor = "yellow";

function resizeCanvas() {
    width = Math.floor(window.innerWidth / scale);
    height = Math.floor((window.innerHeight - 60) / scale);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 60;
    
    ctx.scale(scale, scale);

    grid = new Array(width).fill(null).map(() => new Array(height).fill(null));
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let isTouching = false;

function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (grid[x][y]) {
                ctx.fillStyle = grid[x][y];
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }
}

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

function spawnSand(x, y) {
    const rect = canvas.getBoundingClientRect();
    const gridX = Math.floor((x - rect.left) / scale);
    const gridY = Math.floor((y - rect.top) / scale);
    if (gridX >= 0 && gridX < width && gridY >= 0 && gridY < height) {
        grid[gridX][gridY] = currentColor;
    }
}

canvas.addEventListener("mousedown", () => isTouching = true);
canvas.addEventListener("mouseup", () => isTouching = false);
canvas.addEventListener("mousemove", (event) => { if (isTouching) spawnSand(event.clientX, event.clientY); });

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

function setColor(color) {
    currentColor = color;
}

function openColorPicker() {
    document.getElementById("colorPicker").click();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();