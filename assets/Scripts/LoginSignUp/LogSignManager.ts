const {ccclass, property} = cc._decorator;

@ccclass
export default class LogSignManager extends cc.Component {

    @property(cc.AudioClip)
    music: cc.AudioClip = null;

    start () {
        cc.audioEngine.playMusic(this.music, true);
    }

    open_sign_up() {
        cc.find('SignUpPage').active = true;
        cc.find('login').active = false;
        cc.find('signUp').active = false;
    }

    open_login() {
        cc.find('LoginPage').active = true;
        cc.find('login').active = false;
        cc.find('signUp').active = false;
    }

    close_page() {
        cc.find('SignUpPage').active = false;
        cc.find('LoginPage').active = false;
        cc.find('login').active = true;
        cc.find('signUp').active = true;
    }

}
