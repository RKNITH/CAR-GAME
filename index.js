const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const introScreen = document.getElementById('intro');
const playButton = document.getElementById('playButton');
const instructionButton = document.getElementById('instructionButton');
const aboutButton = document.getElementById('aboutButton');

const bgImage = new Image();
bgImage.src = 'bg.png';

const mainCarImage = new Image();
mainCarImage.src = 'main car.png';

const car1Image = new Image();
car1Image.src = 'car 1.png';

const car2Image = new Image();
car2Image.src = 'car 2.png';

const car3Image = new Image();
car3Image.src = 'car 3.png';

let mainCarX = 350;
let mainCarY = 495;
let mainCarXChange = 0;
let mainCarYChange = 0;
let car1X = getRandomX();
let car1Y = 100;
let car2X = getRandomX();
let car2Y = 100;
let car3X = getRandomX();
let car3Y = 100;
let score = 0;
let highscore = localStorage.getItem('highscore') || 0;
let gameInterval;

function getRandomX() {
    return Math.random() * (canvas.width - 178 - 490) + 178;
}

function drawImage(image, x, y) {
    ctx.drawImage(image, x, y);
}

function drawText(text, x, y, size, color) {
    ctx.font = `${size}px Arial`;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

function resetGame() {
    mainCarX = canvas.width / 2 - mainCarImage.width / 2;
    mainCarY = canvas.height - mainCarImage.height - 5;
    car1X = getRandomX();
    car1Y = -100;
    car2X = getRandomX();
    car2Y = -200;
    car3X = getRandomX();
    car3Y = -300;
    score = 0;
}

function startGame() {
    introScreen.style.display = 'none';
    canvas.style.display = 'block';
    resetGame();
    gameInterval = setInterval(gameLoop, 1000 / 60);
}

function gameLoop() {
    update();
    render();
}

function update() {
    mainCarX += mainCarXChange;
    mainCarY += mainCarYChange;

    if (mainCarX < 178) mainCarX = 178;
    if (mainCarX > canvas.width - mainCarImage.width - 178) mainCarX = canvas.width - mainCarImage.width - 178;
    if (mainCarY < 0) mainCarY = 0;
    if (mainCarY > canvas.height - mainCarImage.height) mainCarY = canvas.height - mainCarImage.height;

    car1Y += 10;
    car2Y += 10;
    car3Y += 10;

    if (car1Y > canvas.height) {
        car1Y = -100;
        car1X = getRandomX();
        score++;
    }
    if (car2Y > canvas.height) {
        car2Y = -150;
        car2X = getRandomX();
        score++;
    }
    if (car3Y > canvas.height) {
        car3Y = -200;
        car3X = getRandomX();
        score++;
    }

    if (checkCollision(car1X, car1Y) || checkCollision(car2X, car2Y) || checkCollision(car3X, car3Y)) {
        endGame();
    }

    if (score > highscore) {
        highscore = score;
        localStorage.setItem('highscore', highscore);
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    drawImage(mainCarImage, mainCarX, mainCarY);
    drawImage(car1Image, car1X, car1Y);
    drawImage(car2Image, car2X, car2Y);
    drawImage(car3Image, car3X, car3Y);
    drawText(`Score: ${score}`, canvas.width - 150, 30, 25, 'red');
    drawText(`Highscore: ${highscore}`, canvas.width - 200, 60, 25, 'red');
}

function checkCollision(carX, carY) {
    const distance = Math.sqrt((carX - mainCarX) ** 2 + (carY - mainCarY) ** 2);
    return distance < 50;
}

function endGame() {
    clearInterval(gameInterval);
    alert('Game Over');
    startGame();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') mainCarXChange = 5;
    if (e.key === 'ArrowLeft') mainCarXChange = -5;
    if (e.key === 'ArrowUp') mainCarYChange = -5;
    if (e.key === 'ArrowDown') mainCarYChange = 5;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') mainCarXChange = 0;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') mainCarYChange = 0;
});

playButton.addEventListener('click', startGame);
instructionButton.addEventListener('click', () => alert('Instructions: Use arrow keys to move the car.'));
aboutButton.addEventListener('click', () => alert('About: Car game developed by Pratyusha Chaturvedi.'));

// Ensure the canvas resizes with the window
window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    resetGame();
    render();
}

// Initial canvas setup
resizeCanvas();
