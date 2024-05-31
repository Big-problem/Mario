import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Turtle extends cc.Component {

    @property(cc.SpriteFrame)
    die: cc.SpriteFrame = null;

    startX: number = 0;
    velX: number = 0;

    gravity:number = -800;

    player: cc.Node = null;

    start () {
        this.startX = this.node.x;
        this.player = cc.find('Player');

        if(this.node.x > 3500){
            this.node.opacity = 100;
        }
        
    }

    update (dt: number) {
        // console.debug("Check", this.node.x+cc.find("Map").x);
        if(this.player.getComponent(Player).pause || this.player.getComponent(Player).again) {
            this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
            return;
        }
        else this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        
        if(this.player.x >= this.node.x - 961 && this.velX === 0){
            // console.debug(this.startX, "Left");
            this.velX = -100;
        }
        // else if(this.player.x >= this.node.x+tmpx - 961 && this.startX > 1900 && this.velX === 0){
        //     // console.debug(this.startX, "Right")
        //     this.velX = 100
        // }
        this.node.x += this.velX * dt;

        this.getComponent(cc.RigidBody).applyForceToCenter(cc.v2(0, this.gravity), true);

        // if(this.node.y > 400 && (this.node.x >= 1610 || this.node.x <= 1356)){
        //     // console.debug(this.node.scaleX);
        //     this.velX *= -1;
        //     this.node.scaleX *= -1;
        // }
        if(this.node.y > 400 && ((this.node.x >= 1610 && this.node.scaleX === -1) || (this.node.x <= 1356 && this.node.scaleX === 1))){
            // console.debug(this.node.scaleX);
            this.velX *= -1;
            this.node.scaleX *= -1;
        }


        if(this.node.x > 3500 && ((this.node.x >= 3810 && this.node.scaleX === -1) || (this.node.x <= 3580 && this.node.scaleX === 1))){
            this.velX *= -1;
            this.node.scaleX *= -1;
        }
    }

    onBeginContact(contact, self, other) {
        // console.debug('YOYO', other.tag, self.tag)
        // if(self.tag === 22) console.debug("YOYO@: ", self.node.x, self.node.y, other.node.x, other.node.y, other.node.name)
        if(other.tag > 3 && self.tag === 22){
            this.velX *= -1;
            this.node.scaleX *= -1;
        }
        // if(self.tag === 24 && (other.tag === 13 || other.tag === 21 || other.tag === 24)){
        //     this.velX *= -1;
        //     this.node.scaleX *= -1;
        // }
    }

}
