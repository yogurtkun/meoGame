import Background from "./runtime/background";
import DataBus from "./databus";

let ctx = canvas.getContext('2d')

export default class Main{
    constructor(){
        this.restart();
        wx.onAccelerometerChange(function(res){
            console.log(res);
        });
    }

    update(){
        this.bg.render(ctx);
    }

    loop(){

        this.update();

        if(this.dataBus.gameOver === false){
            this.bg.update();
            ctx.removeEventListener('touchstart', this.touchHandler);
        }
        else{
            ctx.font = '48px serif';
            ctx.fillText("Start",0,0);
        }

        window.requestAnimationFrame(
            this.loop.bind(this),
            canvas
          )
    }

    touchHandler(e){
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;

        if (x <= 24 && y <= 24)
            this.dataBus.gameOver = false;
    }

    restart(){
        this.bg = new Background();
        this.bg.render(ctx);
        this.dataBus = new DataBus();

        canvas.addEventListener('touchstart', this.touchHandler);

        window.requestAnimationFrame(
            this.loop.bind(this),
            canvas
          )
    }
}