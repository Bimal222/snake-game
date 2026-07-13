const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;
const fruits = ["🍎", "🍌", "🍇", "🍊", "🍓"];

let fruit = fruits[Math.floor(Math.random() * fruits.length)];

let snake = [
    { x: 200, y: 200 }
];

let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};

let score = 0;

let direction = "";

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {

    if (event.key == "ArrowLeft" && direction != "RIGHT") {
        direction = "LEFT";
    }

    if (event.key == "ArrowUp" && direction != "DOWN") {
        direction = "UP";
    }

    if (event.key == "ArrowRight" && direction != "LEFT") {
        direction = "RIGHT";
    }

    if (event.key == "ArrowDown" && direction != "UP") {
        direction = "DOWN";
    }

}

function draw() {

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 400);

    for (let i = 0; i < snake.length; i++) {

        ctx.fillStyle = i == 0 ? "lime" : "green";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

    }

    ctx.font = "20px Arial";
    ctx.fillText(fruit, food.x, food.y + 18);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "LEFT") snakeX -= box;
    if (direction == "UP") snakeY -= box;
    if (direction == "RIGHT") snakeX += box;
    if (direction == "DOWN") snakeY += box;

    // Wrap Around
    if (snakeX < 0) {
        snakeX = 380;
    }

    if (snakeX >= 400) {
        snakeX = 0;
    }

    if (snakeY < 0) {
        snakeY = 380;
    }

    if (snakeY >= 400) {
        snakeY = 0;
    }
    for (let i = 1; i < snake.length; i++) {

        if (snakeX == snake[i].x && snakeY == snake[i].y) {

            clearInterval(game);

            alert("Game Over!\nScore: " + score);

            return;

        }

    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (snakeX == food.x && snakeY == food.y) {

        score++;

        document.getElementById("score").innerHTML = score;

        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };

    } else {

        snake.pop();

    }

    snake.unshift(newHead);

}

let game = setInterval(draw, 150);

function restartGame() {

    location.reload();

}