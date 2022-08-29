function isOutOfBounds(x, y, w, h) {
  return x >= w || x < 0 || y >= h || y < 0;
}

function getTile(x, y, board) {
  const { cols, rows } = game.settings;
  const { i, j } = getIndices(x, y);

  if (isOutOfBounds(i, j, cols, rows)) return null;
  return board[i + j * cols];
}

function getIndices(x, y) {
  return {
    i: Math.floor(x / game.settings.tileSize),
    j: Math.floor(y / game.settings.tileSize),
  };
}

function distance(x1, y1, x2, y2) {
  const x = x1 - x2;
  const y = y1 - y2;
  return Math.sqrt(x * x + y * y);
}

function manhattanDistance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function quadraticBezier(p0, p1, p2, t) {
  return lerp(lerp(p0, p1, t), lerp(p1, p2, t), t);
}

function map(value, minA, maxA, minB, maxB) {
  return minB + (value - minA) / (maxA - minA) * (maxB - minB)
}

function clamp(a, b, c) {
  return Math.max(Math.min(a, c), b);
}

function objToRgb(obj) {
  return `rgb(${obj.r}, ${obj.g}, ${obj.b}, ${obj.a || 1})`;
}

function lerpRGB(from, to, t) {
  return {
    r: lerp(from.r, to.r, t),
    g: lerp(from.g, to.g, t),
    b: lerp(from.b, to.b, t),
  };
}
