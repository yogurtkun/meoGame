import Background from './runtime/background';
import DataBus from './databus';
import Cup from './item/cup';
import Music from './runtime/music';
import Cat from './item/cat';
import rhythm from '../music/test';

const ctx = canvas.getContext('2d');
const dataBus = new DataBus();
const MUSIC_ONLINE = false;

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
    if (dataBus.gameOver === false) {
      this.bg.update();
      canvas.removeEventListener('touchstart', this.touchHandler);
      this.cup.initEvent();
      if (!this.cat) {
        this.cat = new Cat(this.level);
      }
      if (!this.cat.update(dataBus.frame)) {
        return false;
      }
    } else {
      this.bg.drawStart(ctx);
    }

    if (this.cat) {
      this.cat.drawCat(ctx);
      if (this.cup.isCollideWith(this.cat)) {
        this.music.meo();
        this.cup.addNewCat(this.cat);
        this.score += this.cat.getScore();
        this.cat = null;
      }
    }

    this.cup.drawCup(ctx);
    this.bg.drawScore(this.score, ctx);

    return true;
  }

  /**
   * Frame loop
   */
  loop() {
    dataBus.frame += 1;
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
    this.cat = null;
    this.level = 1;
    this.score = 0;

    this.onAirCat = [];

    this.Sequence = loadSequence();

    canvas.addEventListener('touchstart', this.touchHandler.bind(this));

    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas,
    );
  }
}
