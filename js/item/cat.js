import Sprite, {screenWidth, screenHeight} from '../base/element';

const CAT_IMG_SRC = 'images/enemy.png';
const CAT_WIDTH = 60;
const CAT_HEIGHT = 60;

export const FALL_TYPE = {
  STRAIGHT: 0,
  CURVE: 1,
};

function rnd(start, end) {
  return Math.floor(Math.random() * (end - start) + start);
}

export default class Cat extends Sprite {
  constructor(level = 1, type = FALL_TYPE.STRAIGHT) {
    super(CAT_IMG_SRC, CAT_WIDTH, CAT_HEIGHT);
    this.x = rnd(0, screenWidth - CAT_WIDTH);
    this.speed = level;
    this.score = level;
    this.fallType = type;
  }

  update() {
    this.y += this.speed;
    if (this.y > screenHeight - CAT_HEIGHT) {
      return false;
    }
    return true;
  }

  getScore() {
    return this.score;
  }
}
