export const canvas = document.getElementById("game");
export const ctx = canvas.getContext("2d", { alpha: false });

import { game } from './settings.js'

import Mouse from "./mouse.js";

canvas.addEventListener("click", (event) => {
  Mouse.leftClick(
    event.offsetX * game.settings.scale,
    event.offsetY * game.settings.scale
  );
});

canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  Mouse.rightClick(
    event.offsetX * game.settings.scale,
    event.offsetY * game.settings.scale
  );
});

canvas.addEventListener("mousemove", (event) => {
  Mouse.move(
    event.offsetX * game.settings.scale,
    event.offsetY * game.settings.scale
  );
});

export function fill(color) {
  ctx.fillStyle = color;
}

export function loadImage(path) {
  const _img = document.createElement("img");
  _img.src = `../assets/${path}`;
  return _img;
}

export function drawImage(img, dx, dy, width, height) {
  ctx.drawImage(img, dx, dy, width, height);
}

export function text(text, x, y, size) {
  ctx.font = `${size}px Space`;
  ctx.fillText(text, x, y);
}

export function circle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}

export function line(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function rect(x, y, w, h) {
  ctx.fillRect(x, y, w, h);
}

export function background(color) {
  // fill(color);
  ctx.clearRect(0, 0, game.settings.width, game.settings.height);
  // rect(0, 0, game.settings.width, game.settings.height);
}
