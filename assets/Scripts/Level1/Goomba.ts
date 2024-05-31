import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Goomba extends cc.Component {

    @property(cc.SpriteFrame)
    die: cc.SpriteFrame = null;

    startX: number = 0;
    velX: number = 0;

    gravity:number = -400;

    player: cc.Node = null;

    interval_id: number = 0;

    start () {
        this.startX = this.node.x;
        this.player = cc.find('Player');
        this.interval_id = setInterval(() => {
            this.node.scaleX *= -1;
        }, 300);
    }

    update (dt: number) {
        // console.debug("Check", this.node.x+cc.find("Map").x);

        if(cc.find('Player').getComponent(Player).again) {
            clearInterval(this.interval_id);
        }

        if(this.player.getComponent(Player).pause || this.player.getComponent(Player).again) {
            this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
            return;
        }
        else this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        
        if(this.player.x >= this.node.x - 961 && this.startX < 1900 && this.velX === 0){
            // console.debug(this.startX, "Left");
            this.velX = -90;
        }
        else if(this.player.x >= this.node.x - 961 && this.startX > 1900 && this.velX === 0){
            // console.debug(this.startX, "Right")
            this.velX = 90
        }
        this.node.x += this.velX * dt;

        this.getComponent(cc.RigidBody).applyForceToCenter(cc.v2(0, this.gravity), true);
    }

    onBeginContact(contact, self, other) {
        // console.debug(other.tag, self.tag)
        // console.debug('YOYO', other.tag)
        if(other.tag > 3 && other.tag <= 10 && self.tag === 19){
            this.velX *= -1;
        }
        // if(self.tag === 21 && (other.tag === 13 || other.tag === 21 || other.tag === 24)){
        //     this.velX *= -1;
        // }
    }

}
