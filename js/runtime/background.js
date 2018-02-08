import Sprite,{screenHeight,screenWidth} from "../base/element"

const BG_IMG_SRC   = 'images/bg.jpg'
const BG_WIDTH     = 512
const BG_HEIGHT    = 512

const START_ICON = 'images/start.png'

export default class Background{
    constructor(){
        this.img = new Image();
        this.img.src = BG_IMG_SRC;
        this.top = 0;
    }

    update(ctx){
        this.top += 2;
        if(this.top > window.innerHeight){
            this.top = 0;
        }
    }

    drawStart(ctx){
        this.start = new Sprite(START_ICON,100,50,screenWidth/2-50,screenHeight/2-25);
        this.start.drawToCanvas(ctx);
    }

    drawScore(score,ctx){
        ctx.font="30px Verdana";
        ctx.fillStyle = "#f0f0f0"; 
        ctx.fillText("Score:"+score,10,30);
    }

    render(ctx){
        ctx.drawImage(
            this.img,
            0,
            -window.innerHeight + this.top,
            window.innerWidth,
            window.innerHeight
        )
        ctx.drawImage(
            this.img,
            0,
            this.top,
            window.innerWidth,
            window.innerHeight
        )
    }
}