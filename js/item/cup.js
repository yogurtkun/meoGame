import Sprite, {screenWidth, screenHeight} from '../base/element';

const CUP_IMAGE_SRC = 'images/dantong.png';
const JUDGE_LINE = Math.floor(screenHeight / 4);

const EXTEND_LEN = 50;

export default class Cup extends Sprite {
  constructor() {
    const cupWidth = Math.floor(screenWidth / 3.2);
    const cupHeight = Math.floor(screenHeight / 4.1);
    super(CUP_IMAGE_SRC, cupWidth, cupHeight);

    this.x = screenWidth / 2 - this.width / 2;
    this.y = screenHeight - JUDGE_LINE;

    this.visible = false;

    this.touch = false;

    this.stack = [];
  }

  drawCup(ctx) {
    let last = this;

    for (let i = 0; i < this.stack.length; i++) {
      this.stack[i].x = last.x + this.stack[i].delta;
      last = this.stack[i];
    }

    this.drawToCanvas(ctx);
    for (let i = 0; i < this.stack.length; i++) {
      this.stack[i].drawToCanvas(ctx);
    }
  }

  isCollideWith(cat) {
    let topCat = this;
    if (this.stack.length !== 0) {
      topCat = this.stack[this.stack.length - 1];
    }

    const centralX = cat.x + cat.width / 2;
    const centralY = cat.y + cat.height / 2;

    if (centralX >= topCat.x &&
      centralX <= topCat.x + topCat.width &&
      centralY >= topCat.y &&
      centralY <= topCat.y + topCat.height / 2
    ) {
      return true;
    }
    return false;
  }

  addNewCat(cat) {
    let topCat = this;
    if (this.stack.length !== 0) {
      topCat = this.stack[this.stack.length - 1];
    }

    cat.delta = cat.x - topCat.x;
    this.stack.push(cat);

    let lastY = screenHeight - JUDGE_LINE;
    for (let i = this.stack.length - 1; i >= 0; i--) {
      this.stack[i].y = lastY;
      if (lastY < screenHeight) {
        this.stack[i].visible = true;
      } else {
        this.stack[i].visible = false;
      }
      lastY += this.stack[i].height;
    }
    this.y = lastY;
    if (lastY < screenHeight) {
      this.visible = true;
    } else {
      this.visible = false;
    }
  }

  initEvent() {
    canvas.addEventListener('touchstart', this.cupStart.bind(this));
    canvas.addEventListener('touchmove', this.cupMove.bind(this));
    canvas.addEventListener('touchend', this.cupEnd.bind(this));
  }

  getDelta() {
    let totalDelta = 0;

    for (let i = 0; i < this.stack.length - 1; i++) {
      totalDelta += this.stack[i].delta;
    }

    return totalDelta;
  }

  getBaseEle() {
    if (this.stack.length < 2) {
      return this;
    }

    return this.stack[this.stack.length - 2];
  }

  setPosition(x) {
    const baseEle = this.getBaseEle();
    const delta = this.getDelta();
    let disX = x - baseEle.width / 2;

    if (disX < -EXTEND_LEN) {
      disX = -EXTEND_LEN;
    } else if (disX > screenWidth - baseEle.width + EXTEND_LEN) {
      disX = screenWidth - baseEle.width + EXTEND_LEN;
    }

    this.x = disX - delta;
  }

  cupStart(e) {
    e.preventDefault();
    let isTouch = false;
    this.stack.forEach((cat) => {
      if (cat.isClick(e)) {
        isTouch = true;
      }
    });
    if (this.isClick(e)) {
      isTouch = true;
    }
    if (!isTouch) {
      return;
    }

    const x = e.touches[0].clientX;
    this.touch = true;
    this.setPosition(x);
  }

  cupMove(e) {
    e.preventDefault();
    if (!this.touch) {
      return;
    }
    this.setPosition(e.touches[0].clientX);
  }

  cupEnd() {
    this.touch = false;
  }
}
