import Background from "./runtime/background";
import DataBus from "./databus";
import Cup from "./item/cup";
import Music from "./runtime/music"

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

        if (this.cup.touch && this.dataBus.frame % 30 == 0 ) {
            this.music.meo();
        }

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
        this.music = new Music();

        canvas.addEventListener('touchstart', this.touchHandler.bind(this));

        window.requestAnimationFrame(
            this.loop.bind(this),
            canvas
          )
    }
}