let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
    constructor() {
        if ( instance )
            return instance

        instance = this

        this.reset();
    }

    reset() {
        this.gameOver = true;
        this.frame = 0;
    }

}
