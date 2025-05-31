const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreboard = document.getElementById('scoreboard');

const grid = 20;
let count = 0;
let snake, apple, score, gameOver;

function resetGame() {
    snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 4 };
    apple = { x: getRandomInt(0, 20) * grid, y: getRandomInt(0, 20) * grid };
    score = 0;
    gameOver = false;
    updateScore();
}

function updateScore() {
    scoreboard.textContent = `점수: ${score}`;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function drawSpaceCat() {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = 'bold 40px Pretendard, Arial, sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(' /\\_/\\', canvas.width / 2, canvas.height / 2 - 40);
    ctx.fillText('( >_< )', canvas.width / 2, canvas.height / 2);
    ctx.fillText(' /   \\', canvas.width / 2, canvas.height / 2 + 40);
    ctx.restore();

    ctx.font = 'bold 32px Pretendard, Arial, sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText('으앙 쥬금', canvas.width / 2, canvas.height / 2 + 90);
    ctx.font = '20px Pretendard, Arial, sans-serif';
    ctx.fillText('R키를 눌러 다시 시작', canvas.width / 2, canvas.height / 2 + 120);
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawSpaceCat();
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    if (++count < 4) return;
    count = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
        drawGameOver();
        return;
    }

    // Move snake
    snake.x += snake.dx;
    snake.y += snake.dy;

    // Check wall collision
    if (
        snake.x < 0 ||
        snake.x >= canvas.width ||
        snake.y < 0 ||
        snake.y >= canvas.height
    ) {
        gameOver = true;
        drawGameOver();
        return;
    }

    snake.cells.unshift({ x: snake.x, y: snake.y });
    if (snake.cells.length > snake.maxCells) snake.cells.pop();

    // Draw apple
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x, apple.y, grid-1, grid-1);

    // Draw snake and check collision
    ctx.fillStyle = 'lime';
    for (let i = 0; i < snake.cells.length; i++) {
        const cell = snake.cells[i];
        ctx.fillRect(cell.x, cell.y, grid-1, grid-1);
        // Check apple collision
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            score++;
            updateScore();
            apple.x = getRandomInt(0, 20) * grid;
            apple.y = getRandomInt(0, 20) * grid;
        }
        // Check self collision (only head)
        if (i !== 0 && cell.x === snake.cells[0].x && cell.y === snake.cells[0].y) {
            gameOver = true;
        }
    }
}

document.addEventListener('keydown', function(e) {
    if (gameOver && (e.key === 'r' || e.key === 'R')) {
        resetGame();
        return;
    }
    if (gameOver) return;
    if (e.key === 'ArrowLeft' && snake.dx === 0) {
        snake.dx = -grid; snake.dy = 0;
    } else if (e.key === 'ArrowUp' && snake.dy === 0) {
        snake.dy = -grid; snake.dx = 0;
    } else if (e.key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = grid; snake.dy = 0;
    } else if (e.key === 'ArrowDown' && snake.dy === 0) {
        snake.dy = grid; snake.dx = 0;
    }
});

resetGame();
requestAnimationFrame(gameLoop);
