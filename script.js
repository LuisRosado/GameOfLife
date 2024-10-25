let rows = 50;
let cols = 50;
let grid = Array.from({ length: rows }, () => Array(cols).fill(false));
let running = false;
let interval;
let speed = 200;

const gameElement = document.getElementById('game');

function setup() {
    gameElement.style.gridTemplateColumns = `repeat(${cols}, 12px)`;
    draw();
}

function randomizeGrid() {
    grid = grid.map(row => row.map(() => Math.random() < 0.2));
    draw();
}

function clearGrid() {
    grid = Array.from({ length: rows }, () => Array(cols).fill(false));
    draw();
}

function toggleCell(i, j) {
    grid[i][j] = !grid[i][j];
    draw();
}

function draw() {
    gameElement.innerHTML = '';
    grid.forEach((row, i) => {
        row.forEach((cell, j) => {
            const cellElement = document.createElement('div');
            cellElement.className = cell ? 'cell alive' : 'cell';
            cellElement.onclick = () => toggleCell(i, j);
            gameElement.appendChild(cellElement);
        });
    });
}

function update() {
    const newGrid = grid.map(arr => [...arr]);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const aliveNeighbors = getAliveNeighbors(i, j);
            if (grid[i][j]) {
                newGrid[i][j] = aliveNeighbors === 2 || aliveNeighbors === 3;
            } else {
                newGrid[i][j] = aliveNeighbors === 3;
            }
        }
    }

    grid = newGrid;
    draw();
}

function getAliveNeighbors(x, y) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    return directions.reduce((acc, [dx, dy]) => {
        const newX = x + dx;
        const newY = y + dy;
        if (newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
            return acc + (grid[newX][newY] ? 1 : 0);
        }
        return acc;
    }, 0);
}

function toggleGame() {
    running = !running;
    if (running) {
        interval = setInterval(update, speed);
    } else {
        clearInterval(interval);
    }
}

function changeSpeed(value) {
    speed = value;
    if (running) {
        clearInterval(interval);
        interval = setInterval(update, speed);
    }
}

function changeSize(size) {
    rows = cols = parseInt(size);
    grid = Array.from({ length: rows }, () => Array(cols).fill(false));
    setup();
}

function saveGrid() {
    localStorage.setItem('savedGrid', JSON.stringify(grid));
}

function loadGrid() {
    const savedGrid = JSON.parse(localStorage.getItem('savedGrid'));
    if (savedGrid) {
        grid = savedGrid;
        draw();
    }
}

setup();