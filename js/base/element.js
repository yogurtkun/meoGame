export const screenWidth = window.innerWidth;
export const screenHeight = window.innerHeight;
/**
 * 游戏基础的精灵类
 */
export default class Sprite {
  constructor(imgSrc = '', width = 0, height = 0, x = 0, y = 0) {
    this.img = new Image();
    this.img.src = imgSrc;

    this.width = width;
    this.height = height;

    this.x = x;
    this.y = y;

    this.visible = true;
  }

  /**
   * 将精灵图绘制在canvas上
   */
  drawToCanvas(ctx) {
    if (!this.visible) {
      return;
    }

    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }

  isClick(e) {
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    if ((x >= this.x && x <= this.x + this.width) && (y >= this.y && y <= this.y + this.height)) {
      return true;
    }
    return false;
  }
}
