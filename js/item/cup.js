import Sprite, {screenWidth, screenHeight} from '../base/element';

const CUP_IMAGE_SRC = 'images/hero.png';
const CUP_WIDTH = 80;
const CUP_HEIGHT = 80;

export default class Cup extends Sprite {
  constructor() {
    super(CUP_IMAGE_SRC, CUP_WIDTH, CUP_HEIGHT);

    this.x = screenWidth / 2 - this.width / 2;
    this.y = screenHeight - this.height - 20;

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

    let len = 2;
    let lastY = screenHeight - 20;
    if (this.stack.length < 2) {
      this.y = lastY - this.height;
      lastY = this.y;
      len = 1;
    } else {
      this.visible = false;
    }

    const start = this.stack.length - len >= 0 ? this.stack.length - len : 0;

    for (let i = 0; i < this.stack.length; i++) {
      if (i < start) {
        this.stack[i].visible = false;
      } else {
        this.stack[i].y = lastY - this.stack[i].height;
        lastY = this.stack[i].y;
      }
    }
  }

  initEvent() {
    canvas.addEventListener('touchstart', this.cupStart.bind(this));
    canvas.addEventListener('touchmove', this.cupMove.bind(this));
    canvas.addEventListener('touchend', this.cupEnd.bind(this));
  }

  setPosition(x) {
    let disX = x - this.width / 2;

    if (disX < 0) {
      disX = 0;
    } else if (disX > screenWidth - this.width) {
      disX = screenWidth - this.width;
    }

    this.x = disX;
  }

  cupStart(e) {
    e.preventDefault();
    if (!this.isClick(e)) {
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
