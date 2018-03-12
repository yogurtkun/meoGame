import Background from './runtime/background';
import DataBus from './databus';
import Cup from './item/cup';
import Music from './runtime/music';
import Cat, {ACCELERATION, random} from './item/cat';
import {rhythm} from '../music/sen no sakura(low)';
import {screenHeight} from './base/element';

const ctx = canvas.getContext('2d');
const dataBus = new DataBus();
const MUSIC_ONLINE = false;
const GENERATE_SPEED = 30;
let INIT_FRAME = 0;
const UP_RATIO = 1 / 8;

// const MAX_TIME = Math.sqrt(2 * (1 - 1 / 4 - UP_RATIO) * screenHeight / ACCELERATION);

function loadSequence() {
  if (MUSIC_ONLINE === false) {
    return rhythm;
  }
  throw new Error('No rhythm are assigned!');
}

function reorderSequence(oldSeq) {
  const timeSeq = [];
  const speedSeq = [];

  const h = screenHeight * (1 - 1 / 4 - UP_RATIO);

  oldSeq.forEach((stamp, index) => {
    if (stamp !== null) {
      const v1 = -random(0, Math.sqrt(ACCELERATION * screenHeight * UP_RATIO * 2));
      speedSeq.push(v1);

      const v2 = Math.sqrt(v1 * v1 + 2 * ACCELERATION * h);

      const deltaT = (v2 - v1) / ACCELERATION;
      timeSeq.push(Math.floor((index + 1) * GENERATE_SPEED - deltaT));
    } else {
      timeSeq.push(null);
      speedSeq.push(null);
    }
  });

  return {timeSeq, speedSeq};
}

export default class Main {
  constructor() {
    this.restart();
  }

  /**
   * Updata every frame and generate new cat and judge if the cat is in cup
   */
  update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.bg.render(ctx);
    if (dataBus.gameOver === false) {
      this.bg.update();
      canvas.removeEventListener('touchstart', this.touchHandler);
      this.cup.initEvent();

      const genNum = this.timeSeq.indexOf(dataBus.frame);

      if (genNum !== -1) {
        this.onAirCat.push(new Cat(this.level, null, this.sequence[genNum], this.speedSeq[genNum]));
        // console.log(`Gen${genNum}`);
      }

      this.onAirCat.forEach((cat) => {
        cat.update(dataBus.frame);
      });

      if (this.onAirCat.length > 0 && this.onAirCat[0].isTouchGround()) {
        this.onAirCat.shift();
      }
    } else {
      this.bg.drawStart(ctx);
    }

    this.onAirCat.forEach((cat) => {
      cat.drawCat(ctx);
    });

    if (this.onAirCat.length > 0) {
      if (this.cup.isCollideWith(this.onAirCat[0])) {
        this.music.meo(this.onAirCat[0].note);
        this.cup.addNewCat(this.onAirCat[0]);
        this.score += this.onAirCat[0].getScore();
        this.onAirCat.shift();
      }
    }

    if (dataBus.frame > this.timeSeq.length * GENERATE_SPEED && this.onAirCat.length === 0) {
      return false;
    }

    this.cup.drawCup(ctx);
    this.bg.drawScore(this.score, ctx);

    return true;
  }

  /**
   * Frame loop
   */
  loop() {
    if (dataBus.gameOver === false) {
      dataBus.frame += 1;
    }
    if (!this.update()) {
      this.restart();
      return;
    }

    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas,
    );
  }

  touchHandler(e) {
    if (this.bg.start.isClick(e)) {
      dataBus.gameOver = false;
      this.cup.visible = true;
    }
  }

  /**
   * Restart the game and initialize everything.
   */
  restart() {
    this.bg = new Background();
    this.bg.render(ctx);
    this.cup = new Cup();
    this.level = 1;
    this.score = 0;

    this.onAirCat = [];

    this.sequence = loadSequence();
    const autoSeq = reorderSequence(this.sequence);
    this.timeSeq = autoSeq.timeSeq;
    this.speedSeq = autoSeq.speedSeq;

    INIT_FRAME = this.timeSeq[0] - 10;
    dataBus.reset(INIT_FRAME);
    this.music = new Music(this.sequence);
    // console.log(this.timeSeq);

    canvas.addEventListener('touchstart', this.touchHandler.bind(this));

    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas,
    );
  }
}
