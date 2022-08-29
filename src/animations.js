import {
  clamp,
  lerp,
  lerpRGB,
} from './utils.js'

export const AnimationType = {
  color: 0,
  scale: 1,
};

export class Animation {
  constructor(from, to, delay, type) {
    this.startTime = 0;
    this.delay = delay;

    this.to = to;
    this.from = from;
    this.current = from;

    this.over = false;
    this.animFun = lerp;

    switch (type) {
      case AnimationType.color:
        this.animFun = lerpRGB;
        break;
    }
  }

  start(t) {
    this.startTime = t;
  }

  isOver() {
    return this.over;
  }

  update() {
    if (this.over) return;

    let tdiff = performance.now() - this.startTime;
    let t = clamp(tdiff / this.delay, 0, 1);
    this.current = this.animFun(this.current, this.to, t);
    if (t >= 1) this.over = true;
  }

  frames() {
    return this.current;
  }
}
