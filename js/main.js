import Background from "./runtime/background";
import DataBus from "./databus";
import Cup from "./item/cup";

let ctx = canvas.getContext('2d')

export default class Main{
    constructor(){
        this.restart();
    }

    update(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.bg.render(ctx);
        if(this.dataBus.gameOver === false){
            this.bg.update();
            canvas.removeEventListener('touchstart', this.touchHandler);
            this.cup.initEvent();
        }
        else{
            this.bg.drawStart(ctx);
        }

        this.cup.drawToCanvas(ctx);
    }

    loop(){
        this.dataBus.frame += 1;
        this.update();

        window.requestAnimationFrame(
            this.loop.bind(this),
            canvas
          )
    }

    touchHandler(e){
        if (this.bg.start.isClick(e)){
            this.dataBus.gameOver = false;
            this.cup.visible = true;
        }
    }

    restart(){
        this.bg = new Background();
        this.bg.render(ctx);
        this.dataBus = new DataBus();
        this.cup = new Cup();

        canvas.addEventListener('touchstart', this.touchHandler.bind(this));

        window.requestAnimationFrame(
            this.loop.bind(this),
            canvas
          )
    }
}