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

        this.stack = [];
    }

    drawCup(ctx){
        this.drawToCanvas(ctx);
        let last = this;

        for(var i = 0 ; i < this.stack.length ; i ++){
            this.stack[i].x = last.x + this.stack[i].delta;
            last = this.stack[i];
            this.stack[i].drawToCanvas(ctx);
        }
    }

    isCollideWith(cat){
        var topCat = this;
        if(this.stack.length !== 0)
            topCat = this.stack[this.stack.length - 1];

        let centralX = cat.x + cat.width/2;
        let centralY = cat.y + cat.height/2;

        if (centralX >= topCat.x &&
            centralX <= topCat.x + topCat.width &&
            centralY >= topCat.y &&
            centralY <= topCat.y + topCat.height/2
        ) {
            return true;
        }else{
            return false;
        }
    }

    addNewCat(cat){
        var topCat = this;
        if(this.stack.length !== 0)
            topCat = this.stack[this.stack.length - 1];
        
        cat.delta = cat.x - topCat.x;
        cat.y = topCat.y - cat.height;
        this.stack.push(cat);
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