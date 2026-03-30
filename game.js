const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 120,
  width: 50,
  height: 80,
  speed: 6
};

let enemies = [];
let speed = 5;

// Criar inimigos
function spawnEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 50),
    y: -100,
    width: 50,
    height: 80
  });
}

// Controles mobile + teclado
document.addEventListener("touchmove", e => {
  player.x = e.touches[0].clientX - player.width / 2;
});

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") player.x -= player.speed * 10;
  if (e.key === "ArrowRight") player.x += player.speed * 10;
});

// Loop principal
function gameLoop() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Estrada
  ctx.fillStyle = "gray";
  ctx.fillRect(canvas.width / 4, 0, canvas.width / 2, canvas.height);

  // Player
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Inimigos
  ctx.fillStyle = "white";
  enemies.forEach((enemy, index) => {
    enemy.y += speed;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    // colisão
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      alert("Game Over!");
      document.location.reload();
    }

    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
    }
  });

  requestAnimationFrame(gameLoop);
}

// Spawn automático
setInterval(spawnEnemy, 1200);

gameLoop();