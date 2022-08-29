import { objToRgb, isOutOfBounds } from "./utils.js";

import { Animation, AnimationType } from "./animations.js";

import {
  ctx,
  text,
  fill,
  rect,
  circle,
  drawImage,
  loadImage,
} from "./canvas.js";

import { game } from "./settings.js";

import { GAME_STATE } from "./game.js";

const flagImg = loadImage("flag.png");

export class Tile {
  constructor(x, y) {
    this.position = { x, y };
    this.value = 0;
    this.isMine = false;
    this.isRevealed = false;
    this.isHighlighted = false;
    this.hasFlag = false;
    this.size = game.settings.tileSize;
    this.timeOffset = 0;

    const { tileNormal, tileOpen, text, mask, mine, highlight } = game.colors;
    const { animSpeed } = game.settings;

    this.colorAnimation = new Animation(
      tileNormal,
      tileOpen,
      animSpeed,
      AnimationType.color
    );

    this.textColorAnimation = new Animation(
      tileNormal,
      text,
      animSpeed,
      AnimationType.color
    );

    this.rectAnimation = new Animation(
      0,
      this.size,
      animSpeed,
      AnimationType.scale
    );

    this.color = objToRgb(tileNormal);
    this.textColor = objToRgb(text);
    this.maskColor = objToRgb(mask);
    this.mineColor = objToRgb(mine);
    this.highlightColor = objToRgb(highlight);

    this.shouldAnimate = false;
  }

  getNeighbors(board) {
    const { cols, rows } = game.settings;
    const neighbors = [];

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let x = this.position.x + j;
        let y = this.position.y + i;

        if (isOutOfBounds(x, y, cols, rows)) continue;

        const tile = board[x + y * cols];
        if (tile !== this) {
          neighbors.push(tile);
        }
      }
    }

    return neighbors;
  }

  toggleHighlight() {
    this.isHighlighted = !this.isHighlighted;
  }

  reveal(offset = performance.now()) {
    if (this.isRevealed) return;

    this.isRevealed = true;
    this.hasFlag = false;
    this.timeOffset = offset;

    GAME_STATE.revealeds++;

    this.enableAnimations(offset);
  }

  enableAnimations(offset) {
    this.shouldAnimate = true;
    this.rectAnimation.start(offset);
    this.colorAnimation.start(offset);
    this.textColorAnimation.start(offset);
  }

  colorAnim() {
    this.textColorAnimation.update();
    this.textColor = objToRgb(this.textColorAnimation.frames());
  }

  rectAnim() {
    this.rectAnimation.update();
    this.colorAnimation.update();

    const { tileSize } = game.settings;

    const tempColor = objToRgb(this.colorAnimation.frames());
    const scale = this.rectAnimation.frames();

    const offset = tileSize / 2 - scale / 2;

    fill(tempColor);
    rect(offset, offset, scale, scale);

    if (this.rectAnimation.isOver()) this.color = tempColor;
  }

  animate() {
    this.colorAnim();
    this.rectAnim();
    if (this.colorAnimation.isOver() && this.rectAnimation.isOver())
      this.shouldAnimate = false;
  }

  setFlag() {
    if (this.isRevealed) return;
    this.hasFlag = !this.hasFlag;
  }

  render() {
    ctx.save();
    ctx.translate(this.position.x * this.size, this.position.y * this.size);

    // main rect
    fill(this.color);
    rect(0, 0, this.size, this.size);

    if (this.shouldAnimate) this.animate();

    // mask
    if ((this.position.x + this.position.y) % 2) {
      fill(this.maskColor);
      rect(0, 0, this.size, this.size);
    }

    if (this.isHighlighted) {
      fill(this.highlightColor);
      rect(0, 0, this.size, this.size);
    }

    const offset = Math.floor(this.size / 2);

    if (this.hasFlag) {
      drawImage(flagImg, offset / 2, offset / 2, offset, offset);
    }

    if (this.isRevealed) {
      if (this.value > 0) {
        fill(this.textColor);
        text(
          this.value,
          Math.floor(this.size * 0.36),
          Math.floor(this.size * 0.65),
          offset
        );
      }

      if (this.isMine && !this.shouldAnimate) {
        fill(this.mineColor);
        circle(offset, offset, offset / 2);
      }
    }

    ctx.restore();
  }
}
