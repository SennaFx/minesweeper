import { canvas } from "./canvas.js";

import {clamp} from './utils.js'

export const game = {
  totalBombs: 10,
  colors: {
    text: { r: 50, g: 50, b: 50 },
    mine: { r: 200, g: 10, b: 180 },
    tileOpen: { r: 242, g: 192, b: 46 },
    tileNormal: { r: 100, g: 157, b: 17 },
    mask: { r: 100, g: 100, b: 100, a: 0.2 },
    highlight: { r: 200, g: 200, b: 200, a: 0.5 },
  },
  settings: {
    width: 800,
    height: 600,
    zoomScale: 1,
    prScale: 1,
    cols: 30,
    rows: 20,
    tileSize: 40,
    animOffset: 40,
    animSpeed: 300,
  },
};

export const GameMode = {
  EASY: 0,
  MEDIUM: 1,
  HARD: 2,
  CUSTOM: 100,
};

export const GameModeDimensions = {
  0: { cols: 10, rows: 8, bombs: 10 },
  1: { cols: 18, rows: 14, bombs: 40 },
  2: { cols: 24, rows: 20, bombs: 99 },
};

export function updateResolution() {
  const { cols, rows } = game.settings;

  const ratio = window.outerHeight / window.outerWidth;
  const screenWidth = Math.floor(window.outerWidth * 0.92);
  const screenHeight = Math.floor(screenWidth * ratio * 0.98);

  let tileSizeX = Math.floor(screenWidth / cols);
  let tileSizeY = Math.floor(screenHeight / rows);
  let tileSize = Math.min(tileSizeX, tileSizeY);
  tileSize = clamp(tileSize, 26, 80);

  let width = cols * tileSize;
  let height = rows * tileSize;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const prScale = Math.floor(window.devicePixelRatio) || 1;

  width = width * prScale;
  height = height * prScale;
  tileSize = tileSize * prScale;

  canvas.width = width;
  canvas.height = height;

  updateSettings(width, height, tileSize, prScale);
}

export function setDimensions(dimensions) {
  const { cols, rows, bombs } = dimensions;

  game.settings.cols = cols;
  game.settings.rows = rows;

  if (!bombs) {
    setTotalBombs(Math.floor(cols * rows * 0.1));
  } else {
    setTotalBombs(bombs);
  }
}

export function setTotalBombs(bombs) {
  game.totalBombs = bombs;
}

export function updateSettings(width, height, tileSize, prScale) {
  game.settings.width = width;
  game.settings.height = height;
  game.settings.tileSize = tileSize;
  game.settings.prScale = prScale;
}

export function scalingFactor() {
  return (1 / game.settings.zoomScale) * game.settings.prScale;
}