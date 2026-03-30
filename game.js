const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const roadWidth = 2000;
const segmentLength = 200;
const rumbleLength = 3;
const cameraHeight = 1000;
const drawDistance = 300;

let position = 0;
let speed = 0;
let maxSpeed = 200;
let playerX = 0; // -1 esquerda, 1 direita

let segments = [];

// Criar pista com curvas
for (let i = 0; i < 500; i++) {
  segments.push({
    index: i,
    curve: Math.sin(i / 30) * 2 // curva suave
  });
}

// Projeção pseudo-3D
function project(p, cameraX, cameraY, cameraZ) {
  let dz = p.z - cameraZ;
  let scale = cameraHeight / dz;

  p.screenX = (1 + scale * (p.x - cameraX)) * canvas.width / 2;
  p.screenY = (1 - scale * (p.y - cameraY)) * canvas.height / 2;
  p.screenW = scale * roadWidth * canvas.width / 2;
}

// Loop
function update() {
  speed += 0.5;
  if (speed > maxSpeed) speed = maxSpeed;

  position += speed;

  if (position >= segments.length * segmentLength) {
    position = 0;
  }
}

// Render pista
function render() {
  ctx.fillStyle = "#87CEEB"; // céu
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#228B22"; // grama
  ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

  let baseSegment = Math.floor(position / segmentLength);
  let basePercent = (position % segmentLength) / segmentLength;

  let x = 0;
  let dx = 0;

  for (let n = 0; n < drawDistance; n++) {
    let segment = segments[(baseSegment + n) % segments.length];

    let p1 = {
      x: x,
      y: 0,
      z: n * segmentLength
    };

    let p2 = {
      x: x + dx,
      y: 0,
      z: (n + 1) * segmentLength
    };

    x += dx;
    dx += segment.curve;

    project(p1, playerX * roadWidth, cameraHeight, position);
    project(p2, playerX * roadWidth, cameraHeight, position);

    // estrada
    ctx.fillStyle = n % 2 ? "#555" : "#666";
    drawQuad(
      p1.screenX - p1.screenW,
      p1.screenY,
      p1.screenX + p1.screenW,
      p1.screenY,
      p2.screenX + p2.screenW,
      p2.screenY,
      p2.screenX - p2.screenW,
      p2.screenY
    );
  }

  // carro (player)
  ctx.fillStyle = "red";
  ctx.fillRect(
    canvas.width / 2 + playerX * 300 - 25,
    canvas.height - 120,
    50,
    80
  );
}

// Desenhar estrada
function drawQuad(x1, y1, x2, y2, x3, y3, x4, y4) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.lineTo(x4, y4);
  ctx.closePath();
  ctx.fill();
}

// Controles
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") playerX -= 0.1;
  if (e.key === "ArrowRight") playerX += 0.1;
});

// Touch (mobile)
document.addEventListener("touchmove", e => {
  let touchX = e.touches[0].clientX;
  playerX = (touchX / canvas.width) * 2 - 1;
});

// Loop principal
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();