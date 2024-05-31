import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Flower extends cc.Component {

    startY: number = -1;
    rest: boolean = true;
    intervalId: number = 0;
    sequence: cc.ActionInterval = null;

    start () {
        this.startY = this.node.y;
        // console.debug("Start;: ", this.startY);
        let tmp = cc.callFunc(() => {
            this.rest = this.rest === false ? true : false;
        });
        let go_up = cc.moveBy(2, 0, 64);
        let go_down = cc.moveBy(2, 0, -64);
        this.sequence = cc.sequence(tmp, go_up, go_down, tmp);
        this.intervalId = setInterval(() => {
            if(!this.isValid || !this.node.isValid){
                clearInterval(this.intervalId);
                this.intervalId = 0;
            }
            else this.node.runAction(this.sequence);
        }, (Math.random()*2 + 7)*1000)
    }

    update(dt: number) {
        // console.debug(this.node.y)
        if(cc.find('Player').getComponent(Player).again) {
            this.node.stopAllActions();
            clearInterval(this.intervalId);
        }
        // if(this.node.y > this.startY+5){
        //     this.rest = false;
        //     console.debug("HERE");
        // }
        // else{
        //     this.rest = true;
        //     console.debug("There");
        // }
        // console.debug(this.rest);
    }

    onBeginContact(contact, self: cc.PhysicsBoxCollider, other: cc.PhysicsBoxCollider) {
        // console.debug(this.rest ,  self.tag,  other.tag )
        if(/*this.rest && */self.tag === 26 && other.tag === 3){
            // console.debug("Clear", this.intervalId)
            clearInterval(this.intervalId);
            this.intervalId = 0;
            // console.debug("Stop")
        }
    }

    onEndContact(contact, self: cc.PhysicsBoxCollider, other: cc.PhysicsBoxCollider) {
        // console.debug(this.rest ,  self.tag === 26 ,  other.tag === 3)
        if(/*this.rest && */ self.tag === 26 && other.tag === 3){
            this.intervalId = setInterval(() => {
                this.node.runAction(this.sequence);
            }, (Math.random()*2 + 7)*1000)
            // console.debug("WORK", this.intervalId)
            // console.debug("start")
        }
    }
}
