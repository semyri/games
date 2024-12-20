const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

let score = 0;
let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,
    color: 'blue'
};
let projectiles = [];
let targets = [];
let isGameOver = false;

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawProjectiles() {
    for (let i = 0; i < projectiles.length; i++) {
        ctx.fillStyle = 'red';
        ctx.fillRect(projectiles[i].x, projectiles[i].y, projectiles[i].width, projectiles[i].height);
    }
}

function drawTargets() {
    for (let i = 0; i < targets.length; i++) {
        ctx.fillStyle = 'green';
        ctx.fillRect(targets[i].x, targets[i].y, targets[i].width, targets[i].height);
    }
}

function updateProjectiles() {
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].y -= projectiles[i].speed;
        if (projectiles[i].y < 0) {
            projectiles.splice(i, 1);
        }
    }
}

function updateTargets() {
    for (let i = 0; i < targets.length; i++) {
        targets[i].y += targets[i].speed;
        if (targets[i].y > canvas.height) {
            targets.splice(i, 1);
            // You might want to decrease the score or handle game over here
        }
    }
}

function createTarget() {
    let size = 30;
    let x = Math.random() * (canvas.width - size);
    let y = -size;
    targets.push({
        x: x,
        y: y,
        width: size,
        height: size,
        speed: 2
    });
}

function checkCollision() {
    for (let i = 0; i < projectiles.length; i++) {
        for (let j = 0; j < targets.length; j++) {
            if (projectiles[i].x < targets[j].x + targets[j].width &&
                projectiles[i].x + projectiles[i].width > targets[j].x &&
                projectiles[i].y < targets[j].y + targets[j].height &&
                projectiles[i].y + projectiles[i].height > targets[j].y) {

                projectiles.splice(i, 1);
                targets.splice(j, 1);
                score++;
                scoreDisplay.textContent = "Score: " + score;
                break;
            }
        }
    }
}

function gameLoop() {
    if (isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over! Score: ' + score, canvas.width / 2 - 120, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawProjectiles();
    drawTargets();
    updateProjectiles();
    updateTargets();
    checkCollision();

    requestAnimationFrame(gameLoop);
}

function shoot() {
    projectiles.push({
        x: player.x + player.width / 2 - 2.5,
        y: player.y,
        width: 5,
        height: 10,
        speed: 8
    });
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft' && player.x > 0) {
        player.x -= player.speed;
    } else if (event.key === 'ArrowRight' && player.x < canvas.width - player.width) {
        player.x += player.speed;
    } else if (event.key === ' ') { // Spacebar for shooting
        shoot();
    }
});

function resetGame() {
    score = 0;
    projectiles = [];
    targets = [];
    isGameOver = false;
    player.x = canvas.width / 2 - player.width / 2;
    scoreDisplay.textContent = "Score: " + score;
    gameLoop();
}

setInterval(createTarget, 2000);
gameLoop();