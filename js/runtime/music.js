let instance;

/**
 * 统一的音效管理器
 */

export default class Music {
  constructor() {
    if (instance) {
      return instance;
    }

    instance = this;

    this.meoAudio = new Audio();
    this.meoAudio.src = 'audio/meow.mp3';
  }

  meo() {
    this.meoAudio.currentTime = 0;
    this.meoAudio.play();
  }
}
