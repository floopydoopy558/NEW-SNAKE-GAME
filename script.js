const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scale = 20;
canvas.width = 600;
canvas.height = 400;

let snake = [
  { x: 80, y: 80 },
  { x: 60, y: 80 },
  { x: 40, y: 80 }
];
let direction = 'RIGHT';
let food = generateFood();
let score = 0;

document.addEventListener("keydown", changeDirection);

function gameLoop() {
  if (isGameOver()) return;
  
  setTimeout(function() {
    clearCanvas();
    moveSnake();
    drawFood();
    drawSnake();
    drawScore();
    gameLoop();
  }, 100);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
  const head = { ...snake[0] };
  
  switch (direction) {
    case 'UP': head.y -= scale; break;
    case 'DOWN': head.y += scale; break;
    case 'LEFT': head.x -= scale; break;
    case 'RIGHT': head.x += scale; break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    food = generateFood();
  } else {
    snake.pop();
  }
}

function generateFood() {
  const x = Math.floor(Math.random() * (canvas.width / scale)) * scale;
  const y = Math.floor(Math.random() * (canvas.height / scale)) * scale;
  return { x, y };
}

function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "green" : "lime";  // Head is darker green
    ctx.fillRect(segment.x, segment.y, scale, scale);
    if (index === 0) drawSnakeMouth(segment);  // Add mouth to the snake's head
  });
}

function drawSnakeMouth(head) {
  ctx.beginPath();
  ctx.moveTo(head.x + scale / 2, head.y + scale / 2);
  ctx.lineTo(head.x + scale, head.y + scale / 4);
  ctx.lineTo(head.x + scale, head.y + (3 * scale) / 4);
  ctx.closePath();
  ctx.fillStyle = "black";
  ctx.fill();
}

function drawFood() {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(food.x + scale / 2, food.y + scale / 2, scale / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function changeDirection(event) {
  if (event.key === "ArrowUp" && direction !== 'DOWN') direction = 'UP';
  if (event.key === "ArrowDown" && direction !== 'UP') direction = 'DOWN';
  if (event.key === "ArrowLeft" && direction !== 'RIGHT') direction = 'LEFT';
  if (event.key === "ArrowRight" && direction !== 'LEFT') direction = 'RIGHT';
}

function isGameOver() {
  const head = snake[0];
  
  // Check if snake hits the wall
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    alert("Game Over! Score: " + score);
    document.location.reload();
    return true;
  }
  
  // Check if snake collides with itself
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      alert("Game Over! Score: " + score);
      document.location.reload();
      return true;
    }
  }
  
  return false;
}

gameLoop();
