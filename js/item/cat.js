import Sprite, {screenWidth, screenHeight} from '../base/element';

const CAT_WIDTH = 60;
const CAT_HEIGHT = 60;

const SCALE_SIZE = 3;

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

export const FALL_TYPE = {
  STRAIGHT: 0,
  CURVE: 1,
};

function random(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

function generateCat() {
  const catType = CAT_TYPE[random(0, 2)];
  const catNum = random(1, TYPE_NUM[catType]);
  const imgSrc = `images/${catType}${catNum}.png`;

  return imgSrc;
}

export default class Cat extends Sprite {
  constructor(level = 1, type = null) {
    const catImgSrc = generateCat();
    super(catImgSrc, CAT_WIDTH, CAT_HEIGHT);
    setTimeout(() => {
      this.height = Math.floor(this.img.naturalHeight / SCALE_SIZE);
      this.width = Math.floor(this.img.naturalWidth / SCALE_SIZE);
    }, 200);
    this.t = 0;
    this.trails = [];
    this.score = level;
    this.fallen = true;
    this.type = type === null ? random(0, 1) : type; // Currently randomly pick from straight line or curve line.
    this.init();
  }

  drawCat(ctx) {
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
      this.y = 0;
    } else if (this.type === FALL_TYPE.CURVE) {
      this.x = random(0, 1) === 0 ? 0 : screenWidth - this.width;
      this.a = random(this.width - screenWidth, screenWidth - this.width) / (screenHeight - this.height) * 15;
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
    if (this.trails.length > 5) {
      this.trails.shift();
    }
    this.trails.push([this.x, this.y]);

    if (this.type === FALL_TYPE.STRAIGHT) {
      this.y += this.acceleration(this.t);
    } else if (this.type === FALL_TYPE.CURVE) {
      this.y += this.acceleration(this.t);
      this.x += this.a;
    }

    if (this.isTouchWall()) {
      this.a = 0 - this.a;
    }

    if (this.y > screenHeight - this.height) {
      return false;
    }
    return true;
  }

  getScore() {
    this.fallen = false;
    return this.score;
  }
}
