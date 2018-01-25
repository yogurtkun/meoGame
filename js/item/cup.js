import Sprite, { screenWidth, screenHeight } from "../base/element"

const CUP_IMAGE_SRC = "images/hero.png"
const CUP_WIDTH = 80
const CUP_HEIGHT = 80

export default class Cup extends Sprite {
    constructor() {
        super(CUP_IMAGE_SRC, CUP_WIDTH, CUP_HEIGHT);

        this.x = screenWidth / 2 - this.width / 2;
        this.y = screenHeight - this.height - 20;

        this.visible = false;

        this.touch = false;
    }

    initEvent() {
        canvas.addEventListener('touchstart', this.cupStart.bind(this));
        canvas.addEventListener('touchmove', this.cupMove.bind(this));
        canvas.addEventListener('touchend',this.cupEnd.bind(this));
    }

    setPosition(x) {
        let disX = x - this.width / 2;

        if (disX < 0)
            disX = 0;

        else if (disX > screenWidth - this.width)
            disX = screenWidth - this.width;

        this.x = disX;
    }

    cupStart(e) {
        e.preventDefault();
        if (!this.isClick(e)) {
            return;
        }

        let x = e.touches[0].clientX
        this.touch = true;
        this.setPosition(x);
    }

    cupMove(e){
        e.preventDefault();
        if (!this.touch) {
            return;
        }
        this.setPosition(e.touches[0].clientX);
    }

    cupEnd(e){
        this.touch = false;
    }
}