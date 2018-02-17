import Sprite, {screenWidth, screenHeight} from '../base/element';

const CAT_IMG_SRC = 'images/enemy.png';
const CAT_WIDTH = 60;
const CAT_HEIGHT = 60;

export const FALL_TYPE = {
  STRAIGHT: 0,
  CURVE: 1,
};

function random(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

export default class Cat extends Sprite {
  constructor(level = 1, type = null) {
    super(CAT_IMG_SRC, CAT_WIDTH, CAT_HEIGHT);
    this.t = 0;
    this.score = level;
    this.type = type === null ? random(0, 1) : type; // Currently randomly pick from straight line or curve line.
    this.init();
  }

  init() {
    if (this.type === FALL_TYPE.STRAIGHT) {
      this.x = random(0, screenWidth - CAT_WIDTH);
      this.y = 0;
    } else if (this.type === FALL_TYPE.CURVE) {
      this.x = random(0, 1) === 0 ? 0 : screenWidth - CAT_WIDTH;
      this.a = random(CAT_WIDTH - screenWidth, screenWidth - CAT_WIDTH) / (screenHeight - CAT_HEIGHT) * 15;
      this.y = 0;
    } else {
      throw new Error('The type of Cat is invalid!');
    }
  }

  isTouchWall() {
    if (this.x < 0 || this.x + this.width > screenWidth) {
      return true;
    }
    return false;
  }

  acceleration(t) {
    return 1 + t / 20;
  }

  update() {
    this.t++;

    if (this.type === FALL_TYPE.STRAIGHT) {
      this.y += this.acceleration(this.t);
    } else if (this.type === FALL_TYPE.CURVE) {
      this.y += this.acceleration(this.t);
      this.x += this.a;
    }

    if (this.isTouchWall()) {
      this.a = 0 - this.a;
    }

    if (this.y > screenHeight - CAT_HEIGHT) {
      return false;
    }
    return true;
  }

  getScore() {
    return this.score;
  }
}
