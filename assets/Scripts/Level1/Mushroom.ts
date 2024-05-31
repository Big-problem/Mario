import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Mushroom extends cc.Component {
    
    velX: number = 150;

    gravity:number = -600;
    
    start() {
        this.getComponent(cc.RigidBody).enabledContactListener = true;
        this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        this.getComponent(cc.PhysicsBoxCollider).apply();
    }

    update (dt: number) {
        if(cc.find('Player').getComponent(Player).pause || cc.find('Player').getComponent(Player).again) {
            this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
            return;
        }
        else this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
 

        this.node.x += this.velX * dt;
        // this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -100);
        this.getComponent(cc.RigidBody).applyForceToCenter(cc.v2(0, this.gravity), true);
    }

    onBeginContact(contact, self, other) {
        // console.debug('YOYO', other.tag)
        // if(other.tag === 25) return;
        if(other.tag > 3 && self.tag === 11){
            this.velX *= -1;
        }
        // if(self.tag === 13 && (other.tag === 13 || other.tag === 21 || other.tag === 24)){
        //     this.velX *= -1;
        // }
    }
}
