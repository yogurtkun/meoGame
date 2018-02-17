import Background from './runtime/background';
import DataBus from './databus';
import Cup from './item/cup';
import Music from './runtime/music';
import Cat from './item/cat';

const ctx = canvas.getContext('2d');
const dataBus = new DataBus();

export default class Main {
  constructor() {
    this.restart();
  }

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

  restart() {
    dataBus.reset();

    this.bg = new Background();
    this.bg.render(ctx);
    this.cup = new Cup();
    this.music = new Music();
    this.cat = null;
    this.level = 1;
    this.score = 0;

    canvas.addEventListener('touchstart', this.touchHandler.bind(this));

    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas,
    );
  }
}
