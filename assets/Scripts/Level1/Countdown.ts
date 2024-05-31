import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Countdown extends cc.Component {

    countdown = 300;
    start () {
        let label = this.getComponent(cc.Label);
        let PlayerPlayer = cc.find("Player").getComponent(Player);
        this.schedule(() => {
            if(PlayerPlayer.again) return; 
            --this.countdown;
            this.countdown = this.countdown > 0 ? this.countdown : 0;
            label.string = this.countdown.toString();
        }, 1);

    }

}
