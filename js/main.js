import Background from "./runtime/background";
import DataBus from "./databus";

let ctx = canvas.getContext('2d')

export default class Main{
    constructor(){
        this.restart();
    }

    update(){
        this.bg.render(ctx);
        if(this.dataBus.gameOver === false){
            this.bg.update();
            canvas.removeEventListener('touchstart', this.touchHandler);
        }
        else{
            this.bg.drawStart(ctx);
        }
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
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;

        if (this.bg.isStart(x,y)){
            this.dataBus.gameOver = false;
        }
    }

    restart(){
        this.bg = new Background();
        this.bg.render(ctx);
        this.dataBus = new DataBus();

        canvas.addEventListener('touchstart', this.touchHandler.bind(this));

        window.requestAnimationFrame(
            this.loop.bind(this),
            canvas
          )
    }
}