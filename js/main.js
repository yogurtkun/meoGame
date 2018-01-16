import Background from "./runtime/background";

let ctx = canvas.getContext('2d')

export default class Main{
    constructor(){
        this.restart();
    }

    update(){
        this.bg.update(ctx);
        console.log("Hello world!");
    }

    loop(){
        this.update();

        window.requestAnimationFrame(
            this.loop.bind(this),
            canvas
          )
    }

    restart(){
        this.bg = new Background();
        this.bg.render(ctx);

        window.requestAnimationFrame(
            this.loop.bind(this),
            canvas
          )
    }
}