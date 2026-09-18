const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
const gridSize = 20;

const fruits = ["🍎", "🍌", "🍇", "🍊", "🍓"];
let fruit = fruits[Math.floor(Math.random() * fruits.length)];

let snake = [{ x: 200, y: 200 }];

let food = generateFood();
let score = 0;

let direction = "";
let speed = 150;
let game;
let paused = false;
let playerName = "";
let startTime = 0;

// ----------------------------
// INPUT HANDLING
// ----------------------------
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const key = event.key;

    if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

// ----------------------------
// FOOD GENERATOR (NO OVERLAP)
// ----------------------------
function generateFood() {
    let newFood;

    while (true) {
        newFood = {
            x: Math.floor(Math.random() * gridSize) * box,
            y: Math.floor(Math.random() * gridSize) * box
        };

        // Ensure food does NOT spawn inside snake body
        let overlap = snake.some(part => part.x === newFood.x && part.y === newFood.y);
        if (!overlap) break;
    }

    return newFood;
}

// ----------------------------
// DRAW SNAKE EYES (DIRECTIONAL)
// ----------------------------
function drawEyes(headX, headY) {
    ctx.fillStyle = "white";

    if (direction === "LEFT") {
        ctx.beginPath();
        ctx.arc(headX - 4, headY - 4, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(headX - 4, headY + 4, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    if (direction === "RIGHT") {
        ctx.beginPath();
        ctx.arc(headX + 4, headY - 4, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(headX + 4, headY + 4, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    if (direction === "UP") {
        ctx.beginPath();
        ctx.arc(headX - 4, headY - 4, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(headX + 4, headY - 4, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    if (direction === "DOWN") {
        ctx.beginPath();
        ctx.arc(headX - 4, headY + 4, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(headX + 4, headY + 4, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ----------------------------
// MAIN DRAW FUNCTION
// ----------------------------
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 400);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = i === 0 ? "#ee7728" : "#d45c2c";
        ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2 - 2, 0, Math.PI * 2);
        ctx.fill();

        if (i === 0) {
            drawEyes(snake[i].x + box / 2, snake[i].y + box / 2);
        }
    }

    // Draw fruit
    ctx.font = "20px Arial";
    ctx.fillText(fruit, food.x, food.y + 18);

    // Movement
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    // Wrap-around
    if (snakeX < 0) snakeX = 380;
    if (snakeX >= 400) snakeX = 0;
    if (snakeY < 0) snakeY = 380;
    if (snakeY >= 400) snakeY = 0;

    // Self-collision
    for (let i = 1; i < snake.length; i++) {

        if (snakeX === snake[i].x && snakeY === snake[i].y) {

            clearInterval(game);

            let playTime = Math.floor(
                (Date.now() - startTime) / 1000
            );

            let minutes = Math.floor(playTime / 60);

            let seconds = playTime % 60;

            alert(
                "🎉 GAME OVER! 🎉\n\n" +
                "Player: " + playerName + "\n" +
                "Score: " + score + "\n" +
                "Time: " + minutes + " min " + seconds + " sec"
            );

            return;
        }
    }

    // New head
    let newHead = { x: snakeX, y: snakeY };

    // Fruit eaten
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById("score").innerHTML = score;

        food = generateFood();
        fruit = fruits[Math.floor(Math.random() * fruits.length)];

        // Increase speed (minimum 60ms)
        speed = Math.max(60, speed - 5);
        clearInterval(game);
        game = setInterval(draw, speed);

    } else {
        snake.pop();
    }

    snake.unshift(newHead);
}

// ----------------------------
// GAME CONTROLS
// ----------------------------
function startGame() {

    if (game) return;

    // Get player name
    playerName = document.getElementById("playerName").value.trim();

    // Name is required
    if (playerName === "") {
        alert("Please enter your name!");
        return;
    }

    // Start time
    startTime = Date.now();

    if (!direction) {
        direction = "RIGHT";
    }

    // Hide intro
    document.getElementById("introScreen").style.display = "none";

    // Show game
    document.getElementById("gameArea").style.display = "flex";

    // Hide start button
    document.getElementById("startBtn").style.display = "none";

    // Show pause button
    document.getElementById("pauseBtn").style.display = "inline";

    // Start game
    game = setInterval(draw, speed);
}

function pauseGame() {
    if (!paused) {
        clearInterval(game);
        paused = true;
        document.getElementById("pauseBtn").innerHTML = "▶ Resume";
    } else {
        game = setInterval(draw, speed);
        paused = false;
        document.getElementById("pauseBtn").innerHTML = "⏸ Pause";
    }
}

function restartGame() {
    location.reload();
}
