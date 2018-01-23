const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

const BG_IMG_SRC   = 'images/bg.jpg'
const BG_WIDTH     = 512
const BG_HEIGHT    = 512

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