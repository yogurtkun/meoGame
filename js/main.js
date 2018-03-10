import Background from './runtime/background';
import DataBus from './databus';
import Cup from './item/cup';
import Music from './runtime/music';
import Cat from './item/cat';
import {rhythm} from '../music/test';

const ctx = canvas.getContext('2d');
const dataBus = new DataBus();
const MUSIC_ONLINE = false;
const GENERATE_SPEED = 80;

function loadSequence() {
  if (MUSIC_ONLINE === false) {
    return rhythm;
  }
  throw new Error('No rhythm are assigned!');
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
    const genNum = Math.floor(dataBus.frame / GENERATE_SPEED) - 1;
    if (dataBus.gameOver === false) {
      this.bg.update();
      canvas.removeEventListener('touchstart', this.touchHandler);
      this.cup.initEvent();

      if (dataBus.frame % GENERATE_SPEED === 0) {
        if (this.sequence[genNum] !== null && genNum < this.sequence.length) {
          this.onAirCat.push(new Cat(this.level, null, genNum));
        }
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
        this.music.meo();
        this.cup.addNewCat(this.onAirCat[0]);
        this.score += this.onAirCat[0].getScore();
        this.onAirCat.shift();
      }
    }

    if (this.onAirCat.length === 0 && genNum >= this.sequence.length + 2) {
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
    dataBus.reset();

    this.bg = new Background();
    this.bg.render(ctx);
    this.cup = new Cup();
    this.music = new Music();
    this.level = 1;
    this.score = 0;

    this.onAirCat = [];

    this.sequence = loadSequence();

    canvas.addEventListener('touchstart', this.touchHandler.bind(this));

    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas,
    );
  }
}
