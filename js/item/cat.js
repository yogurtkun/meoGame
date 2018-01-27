import Sprite, { screenWidth, screenHeight } from "../base/element"

const CAT_IMG_SRC = 'images/enemy.png'
const CAT_WIDTH   = 60
const CAT_HEIGHT  = 60

function rnd(start, end){
    return Math.floor(Math.random() * (end - start) + start)
  }

export default class Cat extends Sprite{
    constructor(level){
        super(CAT_IMG_SRC,CAT_WIDTH,CAT_HEIGHT);

        this.x = rnd(0,screenWidth - CAT_WIDTH);

        this.visible = true;
        this.speed = level*20;

        this.delta = 0;
    }

    update(frame){
        if(frame % 20 == 0){
            this.y += this.speed;
        }

        if (this.y > screenHeight - CAT_HEIGHT) {
            return false;
        }else{
            return true;
        }
    }

}