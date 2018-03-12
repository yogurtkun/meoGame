import Sprite, {screenWidth, screenHeight} from '../base/element';

const CAT_WIDTH = 60;
const CAT_HEIGHT = 60;

const SCALE_SIZE = 3;
export const ACCELERATION = 0.2;

const CAT_TYPE = {
  0: 's',
  1: 'm',
  2: 'l',
};

const TYPE_NUM = {
  s: 5,
  m: 7,
  l: 4,
};

const TYPE_SCOPE = {
  s: 1.5,
  m: 1.1,
  l: 1,
};

export const FALL_TYPE = {
  STRAIGHT: 0,
  CURVE: 1,
};

export function random(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

function generateCat() {
  const catType = CAT_TYPE[random(0, 2)];
  const catNum = random(1, TYPE_NUM[catType]);
  const imgSrc = `images/${catType}${catNum}.png`;

  return [imgSrc, catType];
}

export default class Cat extends Sprite {
  constructor(level = 1, type = null, note = 0, initSpeed = 0) {
    const catImg = generateCat();
    super(catImg[0], CAT_WIDTH, CAT_HEIGHT);
    this.ready = false;
    setTimeout(() => {
      this.height = Math.floor(this.img.naturalHeight / SCALE_SIZE * TYPE_SCOPE[catImg[1]]);
      this.width = Math.floor(this.img.naturalWidth / SCALE_SIZE * TYPE_SCOPE[catImg[1]]);

      this.init();
      this.ready = true;
    }, 100);

    this.initSpeed = initSpeed;
    this.note = note;
    this.t = 0;
    this.trails = [];
    this.score = level;
    this.fallen = true;
    this.type = type === null ? random(0, 1) : type; // Currently randomly pick from straight line or curve line.
  }

  drawCat(ctx) {
    if (!this.ready) {
      return;
    }
    this.trails.forEach((pos) => {
      ctx.drawImage(
        this.img,
        pos[0],
        pos[1],
        this.width,
        this.height,
      );
    });

    this.drawToCanvas(ctx);
  }

  init() {
    if (this.type === FALL_TYPE.STRAIGHT) {
      this.x = random(0, screenWidth - this.width);
      this.y = 1 / 8 * screenHeight;
    } else if (this.type === FALL_TYPE.CURVE) {
      this.x = random(0, 1) === 0 ? 0 : screenWidth - this.width;
      // this.a = random(this.width - screenWidth, screenWidth - this.width) / (screenHeight - this.height) * 15;
      this.a = ACCELERATION;
      this.y = 1 / 8 * screenHeight;
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

  isTouchGround() {
    if (this.y > screenHeight - this.height) {
      return true;
    }
    return false;
  }

  getPosition(t) {
    return screenHeight / 8 + this.initSpeed * t + ACCELERATION * t * t / 2;
  }

  update() {
    if (!this.ready) {
      return;
    }
    this.t++;
    if (this.trails.length > 5) {
      this.trails.shift();
    }
    this.trails.push([this.x, this.y]);

    if (this.type === FALL_TYPE.STRAIGHT) {
      this.y = this.getPosition(this.t);
    } else if (this.type === FALL_TYPE.CURVE) {
      this.y = this.getPosition(this.t);
      this.x += this.a * 20;
    }

    if (this.isTouchWall()) {
      this.a = 0 - this.a;
    }
  }

  getScore() {
    this.fallen = false;
    return this.score;
  }
}
