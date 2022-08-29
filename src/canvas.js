const canv = document.getElementById("game");
const ctx = canv.getContext("2d", {alpha: false});

canv.addEventListener("click", (event) => {
  leftClick(event.offsetX * game.settings.scale, event.offsetY * game.settings.scale);
});

canv.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  rightClick(event.offsetX * game.settings.scale, event.offsetY * game.settings.scale);
});

canv.addEventListener("mousemove", event => {
  mouseMove(event.offsetX * game.settings.scale, event.offsetY * game.settings.scale) 
})

function fill(color) {
  ctx.fillStyle = color;
}

function loadImage(path) {
  const _img = document.createElement("img");
  _img.src = `../assets/${path}`;
  return _img;
}

function drawImage(img, dx, dy, width, height) {
  ctx.drawImage(img, dx, dy, width, height);
}

function text(text, x, y, size) {
ctx.font = `${size}px Space`;
  ctx.fillText(text, x, y);
}

function circle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}

function line(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function rect(x, y, w, h) {
  ctx.fillRect(x, y, w, h);
}

function background(color) {
  // fill(color);
  ctx.clearRect(0, 0, game.settings.width, game.settings.height);
  // rect(0, 0, game.settings.width, game.settings.height);
}
