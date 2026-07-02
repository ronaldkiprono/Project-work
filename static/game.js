const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const message = document.getElementById("message");
const restartButton = document.getElementById("restartButton");
const playButton = document.getElementById("playButton");
const startMenu = document.getElementById("startMenu");
const difficultyButtons = document.getElementsByName("difficulty");
const boxSize = 20;
const canvasSize = 400;

let snake;
let food;
let direction;
let nextDirection;
let score;
let gameRunning;
let gameLoop;
let gameSpeed = 120;
let paused= false;


function startGame() {
    snake = [
        { x: 10 * boxSize, y: 10 * boxSize },
        { x: 9 * boxSize, y: 10 * boxSize },
        { x: 8 * boxSize, y: 10 * boxSize }
    ];

    direction = "RIGHT";
    nextDirection = "RIGHT";

    food = createFood();

    score = 0;
    scoreText.textContent = score;

    gameRunning = true;
    paused = false;
    message.textContent = "Use the arrow keys to controll the snake";

    clearInterval(gameLoop);
    gameLoop = setInterval(updateGame, gameSpeed);
}


function createFood() {
    let foodPosition;

    do {
        foodPosition = {
            x: Math.floor(Math.random() * 20) * boxSize,
            y: Math.floor(Math.random() * 20) * boxSize
        };
    } while (
        snake.some(part => part.x === foodPosition.x && part.y === foodPosition.y)
    );

    return foodPosition;
}


function updateGame() {
    if (paused) {
      return;
    }

    direction = nextDirection;

    const head = { ...snake[0] };

    if (direction === "UP") {
        head.y -= boxSize;
    }

    if (direction === "DOWN") {
        head.y += boxSize;
    }

    if (direction === "LEFT") {
        head.x -= boxSize;
    }

    if (direction === "RIGHT") {
        head.x += boxSize;
    }

    if (checkCollision(head)) {
        endGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreText.textContent = score;
        food = createFood();
    } else {
        snake.pop();
    }

    drawGame();
}


function checkCollision(head) {
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvasSize ||
        head.y >= canvasSize
    ) {
        return true;
    }

    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}


function drawGame() {
  // Draw background
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(food.x, food.y, boxSize, boxSize);

  // Draw snake
  snake.forEach((part, index) => {
    if (index === 0) {
      ctx.fillStyle = "#86efac";
    } else {
      ctx.fillStyle = "#22c55e";
    }

    ctx.fillRect(part.x, part.y, boxSize, boxSize);
  });

  // Draw pause overlay
  if (paused) {
    // Dark transparent overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pause text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME PAUSED", canvas.width / 2, canvas.height / 2);

    // Small instruction
    ctx.font = "20px Arial";
    ctx.fillText("Press P to Resume", canvas.width / 2, canvas.height / 2 + 40);
  }
}


function changeDirection(newDirection) {
    const oppositeDirections = {
        UP: "DOWN",
        DOWN: "UP",
        LEFT: "RIGHT",
        RIGHT: "LEFT"
    };

    if (newDirection !== oppositeDirections[direction]) {
        nextDirection = newDirection;
    }
}


function endGame() {
    gameRunning = false;
    clearInterval(gameLoop);

    message.textContent = "Game Over! Your score was " + score;
}

function togglePause() {
  if (!gameRunning) {
    return;
  }

  paused = !paused;

  if (paused) {
    drawGame();
  } else {
    message.textContent = "";
  }
}


document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp") {
        changeDirection("UP");
    }

    if (event.key === "ArrowDown") {
        changeDirection("DOWN");
    }

    if (event.key === "ArrowLeft") {
        changeDirection("LEFT");
    }

    if (event.key === "ArrowRight") {
        changeDirection("RIGHT");
    }
    if (event.key === "p" || event.key === "P") {
      togglePause();
    }
});


restartButton.addEventListener("click", startGame);

playButton.addEventListener("click", function () {
  difficultyButtons.forEach((button) => {
    if (button.checked) {
      if (button.value === "easy") {
        gameSpeed = 180;
      }

      if (button.value === "medium") {
        gameSpeed = 120;
      }

      if (button.value === "hard") {
        gameSpeed = 70;
      }
    }
  });

  startMenu.style.display = "none";
  startGame();
});


