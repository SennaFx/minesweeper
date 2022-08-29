import { Tile } from "./tile.js";

import {
  game,
  GameMode,
  GameModeDimensions,
  setDimensions,
  updateResolution,
} from './settings.js'

import {getTile, getIndices, distance} from './utils.js'
import {showMessage} from './modal.js'
import { pop, push, scale } from "./canvas.js";
import Mouse from "./mouse.js";

export let tilesToBeRendered = []

export const GAME_STATE = {
  paused: true,
  firstClick: true,
  revealeds: 0,
  difficulty: GameMode.EASY,
  customDimensions: null,
  board: [],
  bombs: [],
};

export function restartGame() {
  GAME_STATE.firstClick = true;
  GAME_STATE.revealeds = 0;
  GAME_STATE.bombs = [];
  GAME_STATE.board = [];

  Mouse.ptargetTile = null;
  Mouse.targetTile = null;

  tilesToBeRendered = []

  gameSetup();
}

export function gameSetup() {
  setDimensions(
    GameModeDimensions[GAME_STATE.difficulty] || GAME_STATE.customDimensions
  );
  updateResolution();

  const { cols, rows } = game.settings;

  GAME_STATE.board = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      GAME_STATE.board.push(new Tile(x, y));
    }
  }

  GAME_STATE.paused = false;
  drawBoard();
}

export function gameEnd(won, parent) {
  if (won) {
    showMessage("you won 😎👍");
    return;
  }

  showMessage("you lost 😢");
  revealBombs(parent);
}

export function revealBombs(parent = null) {
  const tile = parent ? parent : GAME_STATE.bombs[0];
  const { animOffset } = game.settings;

  let offset = tile.timeOffset;
  GAME_STATE.bombs.forEach((tile) => {
    tile.reveal(offset);
    offset += animOffset * 3;
  });
}

export function checkWin() {
  const { rows, cols } = game.settings;
  if (GAME_STATE.revealeds >= rows * cols - game.totalBombs) gameEnd(true);
}

export function generateBombs(n, range, x, y) {
  while (n > 0) {
    const rndIndex = Math.floor(Math.random() * GAME_STATE.board.length);
    const tile = GAME_STATE.board[rndIndex];

    let dist = distance(x, y, tile.position.x, tile.position.y);
    if (tile.isMine || dist <= range) continue;

    tile.isMine = true;
    GAME_STATE.bombs.push(tile);
    n--;
  }
}

export function calculateValues() {
  GAME_STATE.bombs.forEach((tile) => {
    const neighbors = tile.getNeighbors(GAME_STATE.board);
    neighbors.forEach((nn) => !nn.isMine && nn.value++);
  });
}

// queue method
export function propagate(tile, offset) {
  const { board } = GAME_STATE;
  const { animOffset } = game.settings;

  let neighbors = tile.getNeighbors(board);

  const queue = [...neighbors];
  const counts = [];

  let n = 0;
  let currentCount = neighbors.length;
  while (queue.length > 0) {
    const tile = queue.shift();
    tile.reveal(offset);
    neighbors = tile.getNeighbors(board);
    counts.push(neighbors.length);

    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];
      if (neighbor.isMine || neighbor.isRevealed) continue;
      neighbor.reveal(offset + animOffset);
      if (neighbor.value === 0) queue.push(neighbor);
    }

    if (++n >= currentCount) {
      n = 0;
      offset += animOffset;
      currentCount = counts.shift();
    }
  }
}

Mouse.move = function (mouseX, mouseY) {
  Mouse.x = mouseX;
  Mouse.y = mouseY;

  const tile = getTile(mouseX, mouseY, GAME_STATE.board);
  if (Mouse.ptargetTile == tile) return;

  // unhighlight previous
  if (Mouse.ptargetTile != null && Mouse.ptargetTile.isHighlighted) {
    Mouse.ptargetTile.toggleHighlight();
    Mouse.ptargetTile.render();
  }

  // highlight next
  if (tile != null && !tile.isRevealed)  {
    tile.toggleHighlight();
    tile.render();
  }

  Mouse.targetTile = tile;
  Mouse.ptargetTile = Mouse.targetTile;
};

Mouse.rightClick = function (mouseX, mouseY) {
  if (GAME_STATE.paused) return;

  const tile = Mouse.targetTile;
  if (tile == null) return;
  tile.setFlag();
  tile.render();
};

Mouse.leftClick = function (mouseX, mouseY) {
  if (GAME_STATE.paused) return;

  const tile = Mouse.targetTile;
  if (tile == null) return;

  if (GAME_STATE.firstClick) {
    const { i, j } = getIndices(mouseX, mouseY);
    generateBombs(game.totalBombs, 3, i, j);
    calculateValues();
    GAME_STATE.firstClick = false;
  }

  if (tile.isRevealed) return;

  if (tile.isMine) {
    tile.reveal();
    gameEnd(false, tile);
    return;
  }

  tile.reveal();
  if (tile.value === 0)
    propagate(tile, tile.timeOffset + game.settings.animOffset);
  checkWin();
};

Mouse.wheel = function(y) {
  // const increment = y * 0.1;
  // game.settings.zoomScale += increment
}

function drawBoard() {
  for (let tile of GAME_STATE.board) {
    tile.render();
  }
}

export function gameLoop() {
  // push()
  // scale(game.settings.zoomScale)

  for (let i = tilesToBeRendered.length - 1; i >= 0; i--) {
    const tile = tilesToBeRendered[i]
    tile.render();
    if (!tile.shouldAnimate) tilesToBeRendered.splice(i, 1)
  }
  
  // pop()
}

// recursive method
function _propagate(tile, offset) {
  const { board } = GAME_STATE;

  const { animOffset } = game.settings;
  const neighbors = tile.getNeighbors(board);
  for (let i = 0; i < neighbors.length; i++) {
    const n = neighbors[i];
    if (n.isMine || n.isRevealed) continue;

    n.reveal(offset);
    if (n.value === 0) propagate(n, n.timeOffset + animOffset);
  }
}