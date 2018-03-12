let instance;

const MUSIC_DIR = 'audio/music_res/piano_scale_clip/';
/**
 * 统一的音效管理器
 */

export default class Music {
  constructor(sequence) {
    if (instance) {
      return instance;
    }

    instance = this;

    this.meoAudio = {};

    sequence.forEach((rhy) => {
      if (!(rhy in this.meoAudio)) {
        this.meoAudio[rhy] = new Audio();
        this.meoAudio[rhy].src = `${MUSIC_DIR + rhy}.mp3`;
      }
    });
  }

  meo(rhy) {
    this.meoAudio[rhy].currentTime = 0;
    this.meoAudio[rhy].play();
  }
}
