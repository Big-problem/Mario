const {ccclass, property} = cc._decorator;

@ccclass
export default class AudioManager extends cc.Component {

    @property(cc.AudioClip)
    bg_music: cc.AudioClip = null;


    // Sound Effect
    @property(cc.AudioClip)
    brick_broke: cc.AudioClip = null;

    @property(cc.AudioClip)
    spring: cc.AudioClip = null;

    @property(cc.AudioClip)
    coin: cc.AudioClip = null;

    @property(cc.AudioClip)
    mushroom_appear: cc.AudioClip = null;

    @property(cc.AudioClip)
    power_up: cc.AudioClip = null;

    @property(cc.AudioClip)
    power_down: cc.AudioClip = null;

    @property(cc.AudioClip)
    kick: cc.AudioClip = null;

    @property(cc.AudioClip)
    jump: cc.AudioClip = null;

    @property(cc.AudioClip)
    again: cc.AudioClip = null;

    @property(cc.AudioClip)
    level_clear: cc.AudioClip = null;


    start () {
        cc.audioEngine.playMusic(this.bg_music, true);
    }

    play_brick_broke() {
        cc.audioEngine.playEffect(this.brick_broke, false);
    }

    play_spring() {
        cc.audioEngine.playEffect(this.spring, false);
    }

    play_coin() {
        cc.audioEngine.playEffect(this.coin, false);
    }

    play_mushroom_appear() {
        cc.audioEngine.playEffect(this.mushroom_appear, false);
    }

    play_power_up() {
        cc.audioEngine.playEffect(this.power_up, false);
    }

    play_power_down() {
        cc.audioEngine.playEffect(this.power_down, false);
    }

    play_kick() {
        cc.audioEngine.playEffect(this.kick, false);
    }

    play_jump() {
        cc.audioEngine.playEffect(this.jump, false);
    }

    play_again() {
        cc.audioEngine.playEffect(this.again, false);
    }

    play_level_clear() {
        cc.audioEngine.playEffect(this.level_clear, false);
    }
}
