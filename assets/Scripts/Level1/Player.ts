declare const firebase: any;

import MapCreator2 from "../Level2/MapCreator2";
import PersistMenu from "../Menu/PersistMenu";
import AudioManager from "./AudioManager";
import Countdown from "./Countdown";
import Flower from "./Flower";
import Goomba from "./Goomba";
import keyboardManager from "./KeyboardManager";
import Mushroom from "./Mushroom";
// import Persist from "./Persist";
import Res from "./Res";
import Turtle from "./Turtle";

const {ccclass, property} = cc._decorator;

enum State {
    idle, 
    move,
    jump,
    pause
};

@ccclass
export default class Player extends cc.Component {

    @property(cc.SpriteFrame)
    idle_big: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    jump_big: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    die_pic: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    pole_pic: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    ya_pic: cc.SpriteFrame = null;

    

    @property(cc.Node)
    audioManager: cc.Node = null;
    @property(cc.Node)
    Res: cc.Node = null;
    @property(cc.Node)
    life_display: cc.Node = null;
    @property(cc.Node)
    point_display: cc.Node = null;

    life: number = 1; // 2=>big, 1=>small
    pause: boolean = false;
    hurting: boolean = false;
    again: boolean = false;
    GG: boolean = false;
 
    velX: number = 0;
    maxVelX: number = 250;
    accX: number = 0;
    face_dir: number = 1; // 1: right, 0: left
    // velY: number = 0;
    // maxVelY: number = 200;
    // accY: number = 0;

    isground: boolean = false;
    gravity:number = -1800;
    gravity_small: number = -1800;
    gravity_big: number = -6000;

    
    // height = 62.8 // big Mario
    state: State = State.idle;
    animation: cc.Animation = null;

    point: number = 0;
    final_time: number = 0;
    final_score: number = 0;

    level: number = -1;
    user = null;
    best_score: number = -1;
    database_life: number = -1;
    rank_name: string[] = [];
    rank_score: number[] = [];
  
    
    // break: boolean = false;


    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        //     // cc.PhysicsManager.DrawBits.e_pairBit |
        //     // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        //     cc.PhysicsManager.DrawBits.e_jointBit |
        //     cc.PhysicsManager.DrawBits.e_shapeBit
        //     ;
    }

    start () {
        this.user = firebase.auth().currentUser;
        firebase.database().ref('users/' + this.user.uid).once('value').then((snapshot) => {
            if(snapshot){
                // console.debug(snapshot.val());
                this.database_life = snapshot.val().life
                this.life_display.getComponent(cc.Label).string = this.database_life.toString();
                if(cc.find('PersistMenu').getComponent(PersistMenu).level === 1){
                    this.best_score = snapshot.val().L1Score;
                    this.level = 1;
                }
                else{
                    this.best_score = snapshot.val().L2Score;
                    this.level = 2;
                }
            }
        })
        firebase.database().ref('Rank').once('value').then((snapshot) => {
            if(snapshot){
                let datas = snapshot.val();
                if(cc.find('PersistMenu').getComponent(PersistMenu).level === 1){
                    this.rank_name.push(datas.L1_1_name);
                    this.rank_name.push(datas.L1_2_name);
                    this.rank_name.push(datas.L1_3_name);

                    if(datas.L1_1_score === '??????') this.rank_score.push(-1);
                    else this.rank_score.push(datas.L1_1_score);
                    if(datas.L1_2_score === '??????') this.rank_score.push(-1);
                    else this.rank_score.push(datas.L1_2_score);
                    if(datas.L1_3_score === '??????') this.rank_score.push(-1);
                    else this.rank_score.push(datas.L1_3_score);
                }
                else{
                    this.rank_name.push(datas.L2_1_name);
                    this.rank_name.push(datas.L2_2_name);
                    this.rank_name.push(datas.L2_3_name);
                    
                    if(datas.L2_1_score === '??????') this.rank_score.push(-1);
                    else this.rank_score.push(datas.L2_1_score);
                    if(datas.L2_2_score === '??????') this.rank_score.push(-1);
                    else this.rank_score.push(datas.L2_2_score);
                    if(datas.L2_3_score === '??????') this.rank_score.push(-1);
                    else this.rank_score.push(datas.L2_3_score);
                }
            }
        })
        // console.debug("MASS: ",this.getComponent(cc.RigidBody).getMass())
        this.isground = false;

        this.pause = false;
        this.hurting = false;
        this.again = false;
        this.GG = false;
        this.point = 0;
        // this.life_display.getComponent(cc.Label).string = cc.find('PersistMenu').getComponent(PersistMenu).life.toString();

        this.animation = this.getComponent(cc.Animation);
        this.node.x = 74.429;
        this.node.y = 141.688;

        this.schedule(() => {
            if(!this.again) this.die();
        }, 301)
        
        // this.gravity = this.gravity_small;
        // setTimeout(() => {
            // console.debug("MASS: ", this.getComponent(cc.RigidBody).getMass())
            // this.gravity = this.gravity_small;
            // cc.find('keyboardManager').getComponent(keyboardManager).jumpForce = 38000;
            // this.node.setContentSize(21.6, 32.4)
        //     this.life = 2;
        //     this.change_life();
        // }, 10000);
    }

    add_point(point: number) {
        this.point += point;
        let tmp_string = this.point.toString().padStart(7, '0');
        this.point_display.getComponent(cc.Label).string = tmp_string
    }

    checkState() {
        if(this.velX === 0 && this.isground && this.state != State.idle) {
            this.animation.stop();
            this.getComponent(cc.Sprite).spriteFrame = this.idle_big;
            this.state = State.idle;
        }
        if(this.velX != 0 && this.isground && this.state != State.move){
            this.animation.stop();
            this.animation.play('move');
            this.state = State.move;
        }
        if(!this.isground && this.getComponent(cc.RigidBody).linearVelocity.y > 0 && this.state != State.jump) {
            this.animation.stop();
            this.getComponent(cc.Sprite).spriteFrame = this.jump_big;
            this.state = State.jump;
        }
        if(this.velX > 0) this.face_dir = 1;
        else if(this.velX < 0) this.face_dir = 0;

        if(this.face_dir) this.node.scaleX = 1;
        else this.node.scaleX = -1;
    }

    change_life() {
        // if(this.life === 2) this.gravity = -6000;
        // else if(this.life === 1) this.gravity = -1800;

        // adjust collision box
        if(this.again) return;
        if(this.life === 1){
            ++this.life;
            this.audioManager.getComponent(AudioManager).play_power_up();
        }
        else {
            --this.life;
            this.audioManager.getComponent(AudioManager).play_power_down();
            this.node.runAction(cc.blink(2, 5));
        }
            


        this.pause = true;
        this.state = State.pause;
        let vy = this.getComponent(cc.RigidBody).linearVelocity.y;
        // console.debug("GOGO1")
        this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        // console.debug("GOGO2s")

        if(this.life === 2){
            // console.debug("BIGGER")
            if(this.node.scaleX === 1) this.animation.play('bigger');
            else this.animation.play('bigger_left');

            setTimeout(() => {
                this.pause = false;
                this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                this.gravity = this.gravity_big;
                this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, vy);
                // console.debug("FLYFLYFLY", vy*3)
                cc.find('keyboardManager').getComponent(keyboardManager).jumpForce = 120000;
                this.node.setScale(1, 1);
                this.node.setContentSize(33.6, 64.8);
                let colls = this.getComponents(cc.PhysicsBoxCollider);
                for(let coll of colls){
                    if(coll.tag === 0){
                        coll.size = cc.size(36, 50.3);
                        coll.offset = cc.v2(-0.4, -0.3);
                    }
                    else if(coll.tag === 1){
                        coll.size = cc.size(26.21, 6.86);
                        coll.offset = cc.v2(0.76, -28.76);
                    }
                    else if(coll.tag === 2){
                        coll.size = cc.size(30.3, 7.5);
                        coll.offset = cc.v2(-0.2, 29.1);
                    }
                    else if(coll.tag === 3){
                        coll.size = cc.size(39.1, 69.4);
                        coll.offset = cc.v2(0.2, 0.1);
                    }
                    coll.apply();
                }
            }, 350);
        }
        else if(this.life === 1){
            // console.debug("SMALLER")
            // console.debug("HERE")
            if(this.node.scaleX === 1) this.animation.play('smaller');
            else this.animation.play('smaller_left');

            setTimeout(()=> {
                this.pause = false;
                this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, vy);
                this.gravity = this.gravity_small;
                cc.find('keyboardManager').getComponent(keyboardManager).jumpForce = 38000;
                this.node.setScale(1, 1);
                this.node.setContentSize(21.6, 32.4);
                let colls = this.getComponents(cc.PhysicsBoxCollider);
                for(let coll of colls){
                    if(coll.tag === 0){
                        coll.size = cc.size(21.4, 22);
                        coll.offset = cc.v2(-0.1, 0.1);
                    }
                    else if(coll.tag === 1){
                        coll.size = cc.size(17.3, 4.3);
                        coll.offset = cc.v2(0, -14.1);
                    }
                    else if(coll.tag === 2){
                        coll.size = cc.size(16.6, 4.1);
                        coll.offset = cc.v2(-0.1, 14.2);
                    }
                    else if(coll.tag === 3){
                        coll.size = cc.size(25.5, 35.7);
                        coll.offset = cc.v2(-0.2, 0.3);
                    }
                    coll.apply();
                }
                // let tmp = this.node.x;
                // this.node.x = -100;
                // this.node.x = tmp;
            }, 350)
        }



    }

    die() {
        // console.debug("DIE")
        --this.database_life;
        let new_data = {
            life: this.database_life,
        };
        firebase.database().ref('users/' + this.user.uid).update(new_data);
        // --cc.find('PersistMenu').getComponent(PersistMenu).life;
        this.again = true;
        cc.audioEngine.stopMusic();
        this.audioManager.getComponent(AudioManager).play_again();
        this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        this.animation.stop();
        this.getComponent(cc.Sprite).spriteFrame = this.die_pic;
        this.node.setContentSize(32, 32);
        let go_up = cc.moveBy(0.6, 0, 100);
        let go_down = cc.moveTo(0.8, this.node.x, -100);
        this.node.runAction(cc.sequence(go_up, go_down));
        setTimeout(() => {
            cc.director.removeAll(cc.Animation)
            cc.director.removeAll(cc.Action)
            for(let tmp of cc.find("Map").getComponentsInChildren(Goomba)){
                if(tmp.interval_id != 0) clearInterval(tmp.interval_id);
                // console.debug("CLEAN1")
            }
            for(let tmp of cc.find("Map").getComponentsInChildren(Flower)){
                if(tmp.intervalId != 0) clearInterval(tmp.intervalId);
                // console.debug("CLEAN2")
            }
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN);
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP);
            cc.audioEngine.stopAll();
            setTimeout(() => {
                if(this.database_life) cc.director.loadScene('LoseOneLife');
                else cc.director.loadScene('GameOver');
            }, 1000);
        }, 2500);
    }

    level_clear() {
       
        this.again = true;
        cc.audioEngine.stopMusic();
        this.audioManager.getComponent(AudioManager).play_level_clear();
        this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        this.animation.stop();
        this.getComponent(cc.Sprite).spriteFrame = this.pole_pic;
        // this.node.setContentSize(32, 32);
        // let go_up = cc.moveBy(0.6, 0, 100);
        let go_down = cc.moveTo(1.5, this.node.x, 96 + this.node.getContentSize().height/2);
        let ya = cc.callFunc(() => {
            this.getComponent(cc.Sprite).spriteFrame = this.ya_pic;
            if(this.life === 2){
                this.node.setContentSize(50.4, 64.8);
            }
            this.final_time = cc.find("UI/time_display").getComponent(Countdown).countdown;
            this.final_score = this.final_time * 60 + this.point;
            this.schedule(this.calculate_score, 0);
            
            let new_data = {};
            if(this.final_score > this.best_score && this.level === 1){
                new_data = {
                    isLevel2: true,
                    L1Score: this.final_score,
                }
            }
            else if(this.final_score > this.best_score && this.level === 2){
                new_data = {
                    L2Score: this.final_score,
                }
            }
            else {
                new_data = {
                    isLevel2: true,
                }
            }

            firebase.database().ref('users/' + this.user.uid).update(new_data);

            let new_data2 = {};
            let flag = 0;
            if(this.level === 1 && this.final_score > this.rank_score[0]){
                new_data2 = {
                    L1_1_name: this.user.displayName, 
                    L1_2_name: this.rank_name[0], 
                    L1_3_name: this.rank_name[1], 
                    L1_1_score: this.final_score, 
                    L1_2_score: this.rank_score[0], 
                    L1_3_score: this.rank_score[1], 
                }
                flag = 1;
            }
            else if(this.level === 1 && this.final_score > this.rank_score[1]){
                new_data2 = {
                    L1_2_name: this.user.displayName,
                    L1_3_name: this.rank_name[1], 
                    L1_2_score: this.final_score,
                    L1_3_score: this.rank_score[1], 
                }
                flag = 1;
            }
            else if(this.level === 1 && this.final_score > this.rank_score[2]){
                new_data2 = {
                    L1_3_name: this.user.displayName,
                    L1_3_score: this.final_score,
                }
                flag = 1;
            }
            else if(this.level === 2 && this.final_score > this.rank_score[0]){
                new_data2 = {
                    L2_1_name: this.user.displayName, 
                    L2_2_name: this.rank_name[0], 
                    L2_3_name: this.rank_name[1], 
                    L2_1_score: this.final_score, 
                    L2_2_score: this.rank_score[0], 
                    L2_3_score: this.rank_score[1], 
                }
                flag = 1;
            }
            else if(this.level === 2 && this.final_score > this.rank_score[1]){
                new_data2 = {
                    L2_2_name: this.user.displayName,
                    L2_3_name: this.rank_name[1], 
                    L2_2_score: this.final_score,
                    L2_3_score: this.rank_score[1], 
                }
                flag = 1;
            }
            else if(this.level === 2 && this.final_score > this.rank_score[2]){
                new_data2 = {
                    L2_3_name: this.user.displayName,
                    L2_3_score: this.final_score,
                }
                flag = 1;
            }
            if(flag === 1) firebase.database().ref('Rank').update(new_data2);
        
        })
        this.node.runAction(cc.sequence(go_down, ya));


        // cc.find('PersistMenu').getComponent(PersistMenu).life = 5;
        setTimeout(() => {
            cc.director.removeAll(cc.Animation)
            cc.director.removeAll(cc.Action)
            for(let tmp of cc.find("Map").getComponentsInChildren(Goomba)){
                if(tmp.interval_id != 0) clearInterval(tmp.interval_id);
            }
            for(let tmp of cc.find("Map").getComponentsInChildren(Flower)){
                if(tmp.intervalId != 0) clearInterval(tmp.intervalId);
            }
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN);
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP);
            cc.audioEngine.stopAll();
            cc.director.loadScene('Menu');
        }, 6500);
    }

    fake_level_clear() {
       
        this.again = true;
        this.node.scaleX = 1;
        this.node.x = 3995;
        cc.audioEngine.stopMusic();
        this.audioManager.getComponent(AudioManager).play_level_clear();
        this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        this.animation.stop();
        this.getComponent(cc.Sprite).spriteFrame = this.pole_pic;

        let tmp = cc.instantiate(this.Res.getComponent(Res).mushroom2);
        tmp.setParent(cc.find('Map')); // 一定要設置父節點
        tmp.x = this.node.x;
        tmp.y = 112;

        // this.node.setContentSize(32, 32);
        // let go_up = cc.moveBy(0.6, 0, 100);
        let go_down = cc.moveTo(1.5, this.node.x, 96 + this.node.getContentSize().height/2);
        let die = cc.callFunc(() => {
            // this.getComponent(cc.Sprite).spriteFrame = this.ya_pic;
            // if(this.life === 2){
            //     this.node.setContentSize(50.4, 64.8);
            // }
            // this.final_time = cc.find("UI/time_display").getComponent(Countdown).countdown;
            // this.final_score = this.final_time * 60 + this.point;
            // this.schedule(this.calculate_score, 0);
            this.die();
            tmp.destroy();
        })
        this.node.runAction(cc.sequence(cc.delayTime(3), go_down, die));
        // cc.find('PersistMenu').getComponent(PersistMenu).life = 5;
        // setTimeout(() => {
        //     cc.director.removeAll(cc.Animation)
        //     cc.director.removeAll(cc.Action)
        //     for(let tmp of cc.find("Map").getComponentsInChildren(Goomba)){
        //         if(tmp.interval_id != 0) clearInterval(tmp.interval_id);
        //     }
        //     for(let tmp of cc.find("Map").getComponentsInChildren(Flower)){
        //         if(tmp.intervalId != 0) clearInterval(tmp.intervalId);
        //     }
        //     cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN);
        //     cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP);
        //     cc.audioEngine.stopAll();
        //     cc.director.loadScene('Menu');
        // }, 6500);
    }

    calculate_score(dt: number) {
        this.final_time -= 100 * dt;
        this.point += 6000 * dt;
        cc.find("UI/time_display").getComponent(cc.Label).string = Math.floor(this.final_time).toString();
        this.point_display.getComponent(cc.Label).string = Math.floor(this.point).toString().padStart(7, '0');

        if(this.final_time <= 0){
            this.final_time = 0;
            cc.find("UI/time_display").getComponent(cc.Label).string = this.final_time.toString();
            this.point_display.getComponent(cc.Label).string = this.final_score.toString().padStart(7, '0');
            this.unschedule(this.calculate_score);
        } 

    }

    update (dt: number) {
        // console.debug(this.getComponents(cc.PhysicsBoxCollider)[2].size);
        // console.debug(this.getComponent(cc.RigidBody).linearVelocity
        if(this.pause || this.again) return;

        if(this.node.y < -500 || this.node.y > 1300) this.die();

        this.velX += this.accX;
        if(this.velX >= this.maxVelX) this.velX = this.maxVelX;
        else if(this.velX <= -this.maxVelX) this.velX = -this.maxVelX;

        if(this.node.x < this.node.width/2) this.node.x = this.node.width/2; 

        // this.accY += this.gravity;
        // if(this.accY <= this.gravity) this.accY = this.gravity;
        // this.velY += this.accY;
        // if(this.velY >= this.maxVelY) this.velY = this.maxVelY;
        // else if(this.velY <= -this.maxVelY) this.velY = -this.maxVelY;

        if(this.accX === 0 && this.velX > 0){ // Slow down
            this.velX -= 16;
            if(this.velX <= 0) this.velX = 0;
        }
        else if(this.accX === 0 && this.velX < 0){ // Slow down
            this.velX += 16;
            if(this.velX >= 0) this.velX = 0;
        }
        
        this.node.x += this.velX * dt;


        // if(!this.isground) this.node.y += this.velY * dt;
        // else this.velY = 0;
        // console.debug(this.accY, this.velY, this.node.y);
        // this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, this.gravity);
        this.getComponent(cc.RigidBody).applyForceToCenter(cc.v2(0, this.gravity), true);
        // if(!this.isground) this.node.y -= 300*dt
        // this.node.y += this.velY * dt;

        // this.getComponent(cc.RigidBody).getLinearVelocityFromWorldPoint(cc.v2(this.node.x, this.node.y), );

        // if(this.state === 2){
        //     let res = cc.director.getPhysicsManager().rayCast(cc.v2(this.node.x, this.node.y-30), cc.v2(this.node.x, this.node.y-33 ), cc.RayCastType.Closest);
        //     if(res.length === 0) this.isground = false

        // }
        // console.debug(this.getComponent(cc.RigidBody).linearVelocity
        // console.debug(this.getComponent(cc.RigidBody).linearVelocity.y)

        if(this.getComponent(cc.RigidBody).linearVelocity.y != 0) this.isground = false;
        else this.isground = true;
        // console.debug("ground: ", this.isground, this.velX, this.state);


        this.checkState();

        // console.debug(this.node.x);
    }


    onBeginContact(contact, self: cc.PhysicsBoxCollider, other: cc.PhysicsBoxCollider){
        if(this.again) return;
        // if(other.tag === 28) {
        //     console.debug('here: ', self.tag  ,  self.getComponent(cc.RigidBody).linearVelocity.y)
        // }
        // let points = contact.getWorldManifold().points;
        // let normal = contact.getWorldManifold().normal;
        // console.debug(self.tag, points[0].x, self.node.x)
        // if(self.tag === 0 && other.node.x > self.node.x){
        //     this.getComponent(cc.RigidBody).applyForceToCenter(cc.v2(-10, 0), true);
        // }

        // console.debug(other.tag, self.tag, self.getComponent(cc.RigidBody).linearVelocity.y)

        // if(other.tag != 10)console.debug(self.tag, other.tag)
        
        if(self.tag === 0 && other.tag === 24 && other.getComponent(Turtle).enabled && self.getComponent(cc.RigidBody).linearVelocity.y < 0 && self.node.y > other.node.y+26){ // turtle
            if(this.hurting){
                // console.debug("no kill")
                return;
            }
            this.audioManager.getComponent(AudioManager).play_kick();
            this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 500);
            other.getComponent(cc.Animation).stop();
            other.getComponent(cc.Sprite).spriteFrame = other.getComponent(Turtle).die;
            other.getComponent(Turtle).enabled = false;
            this.add_point(300);
            setTimeout(() => {
                if(other.node.isValid) other.node.destroy();
            }, 200);
        }

        if(self.tag === 1) {
            if(other.tag === 19 && other.getComponent(Goomba).enabled){ // goomba
                if(this.hurting){
                    // console.debug("no kill")
                    return;
                }
                this.audioManager.getComponent(AudioManager).play_kick();
                this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 500);
                clearInterval(other.getComponent(Goomba).interval_id);
                other.getComponent(cc.Sprite).spriteFrame = other.getComponent(Goomba).die;
                other.getComponent(Goomba).enabled = false;
                this.add_point(200);
                setTimeout(() => {
                    if(other.node.isValid) other.node.destroy();
                }, 200);
            }
            else if(other.tag === 24 && other.getComponent(Turtle).enabled){ // turtle
                if(this.hurting){
                    // console.debug("no kill")
                    return;
                }
                this.audioManager.getComponent(AudioManager).play_kick();
                this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 500);
                other.getComponent(cc.Animation).stop();
                other.getComponent(cc.Sprite).spriteFrame = other.getComponent(Turtle).die;
                other.getComponent(Turtle).enabled = false;
                this.add_point(300);
                setTimeout(() => {
                    if(other.node.isValid) other.node.destroy();
                }, 200);
            }
        }
        if(self.tag === 1 && self.getComponent(cc.RigidBody).linearVelocity.y < 0){ // 踩到
            // console.debug("Stand")
            this.isground = true;
            if(other.tag === 6) { // spring
                this.audioManager.getComponent(AudioManager).play_spring();
                // console.debug("Spring")
                if(this.life === 2) this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 1500);
                else if(this.life === 1) this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 1700);
                this.isground = false;
            }
            if(other.tag === 7) { // trap spring
                this.audioManager.getComponent(AudioManager).play_spring();
                // console.debug("Spring")
                this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 3000);
                this.isground = false;
            }
            // else if(other.tag === 21){ // goomba
            //     if(this.hurting){
            //         // console.debug("no kill")
            //         return;
            //     }
            //     this.audioManager.getComponent(AudioManager).play_kick();
            //     this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 500);
            //     clearInterval(other.getComponent(Goomba).interval_id);
            //     other.getComponent(cc.Sprite).spriteFrame = other.getComponent(Goomba).die;
            //     other.getComponent(Goomba).enabled = false;
            //     this.add_point(200);
            //     setTimeout(() => {
            //         if(other.node.isValid) other.node.destroy();
            //     }, 200);
            // }
            // else if(other.tag === 24){ // turtle
            //     if(this.hurting){
            //         // console.debug("no kill")
            //         return;
            //     }
            //     this.audioManager.getComponent(AudioManager).play_kick();
            //     this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 500);
            //     other.getComponent(cc.Animation).stop();
            //     other.getComponent(cc.Sprite).spriteFrame = other.getComponent(Turtle).die;
            //     other.getComponent(Turtle).enabled = false;
            //     this.add_point(300);
            //     setTimeout(() => {
            //         if(other.node.isValid) other.node.destroy();
            //     }, 200);
            // }
            // console.debug('Step', self.getComponent(cc.RigidBody).linearVelocity.y)
        }
        else if(self.tag === 2 && self.getComponent(cc.RigidBody).linearVelocity.y > 0){ // 頭撞到
            if(other.tag >= 14 && other.tag <= 18) { // question
                let x = other.node.x;
                let y = other.node.y;
                other.node.getComponent(cc.Animation).play('question_hit');
                if(other.tag === 17){
                    other.getComponent(cc.PhysicsBoxCollider).tag = 10;
                    other.getComponent(cc.PhysicsBoxCollider).apply();
                    this.audioManager.getComponent(AudioManager).play_coin();
                    setTimeout(() => {
                        let coin = cc.instantiate(this.Res.getComponent(Res).coin);
                        coin.setParent(cc.find('Map'));
                        coin.x = other.node.x;
                        coin.y = other.node.y + 32;
                        let go_up = cc.moveBy(0.17, 0, 50);
                        let go_down = cc.moveBy(0.17, 0, -50);
                        let sequence = cc.sequence(go_up, go_down);
                        coin.runAction(sequence);
                        this.add_point(500);
                        setTimeout(() => {
                            coin.destroy();
                        }, 345);

                        let tmp = cc.instantiate(this.Res.getComponent(Res).question_done);
                        tmp.setParent(cc.find('Map')); // 一定要設置父節點
                        tmp.x = x;
                        tmp.y = y;

                        if(other.node.isValid) other.node.destroy();
                    }, 200);
                }
                else if(other.tag === 15){ // mushroom pop up
                    other.getComponent(cc.PhysicsBoxCollider).tag = 10;
                    other.getComponent(cc.PhysicsBoxCollider).apply();
                    this.audioManager.getComponent(AudioManager).play_mushroom_appear();
                    setTimeout(() => { 
                        let mushroom = cc.instantiate(this.Res.getComponent(Res).mushroom1);
                        mushroom.setParent(cc.find('Map'));
                        mushroom.x = x;
                        mushroom.y = y;

                        let tmp = cc.instantiate(this.Res.getComponent(Res).question_done);
                        tmp.setParent(cc.find('Map')); // 一定要設置父節點
                        tmp.x = x;
                        tmp.y = y;

                        mushroom.runAction(cc.moveTo(1, cc.v2(mushroom.x, mushroom.y + 32)));
                        setTimeout(() => { // 長出來之後
                            if(mushroom.isValid) mushroom.getComponent(Mushroom).enabled = true;
                        }, 1000);

                        if(other.node.isValid) other.node.destroy();
                    }, 200);
                }
                else if(other.tag === 16){ // poison mushroom pop up
                    other.getComponent(cc.PhysicsBoxCollider).tag = 10;
                    other.getComponent(cc.PhysicsBoxCollider).apply();
                    this.audioManager.getComponent(AudioManager).play_mushroom_appear();
                    setTimeout(() => { 
                        let mushroom = cc.instantiate(this.Res.getComponent(Res).mushroom2);
                        mushroom.setParent(cc.find('Map'));
                        mushroom.x = x;
                        mushroom.y = y;

                        let tmp = cc.instantiate(this.Res.getComponent(Res).question_done);
                        tmp.setParent(cc.find('Map')); // 一定要設置父節點
                        tmp.x = x;
                        tmp.y = y;

                        mushroom.runAction(cc.moveTo(1, cc.v2(mushroom.x, mushroom.y + 32)));
                        // setTimeout(() => { // 長出來之後
                        //     if(mushroom.isValid) mushroom.getComponent(Mushroom).enabled = true;
                        // }, 1000);

                        if(other.node.isValid) other.node.destroy();
                    }, 200);
                }
                else if(other.tag === 18){ // ball pop up
                    other.getComponent(cc.PhysicsBoxCollider).tag = 10;
                    other.getComponent(cc.PhysicsBoxCollider).apply();
                    this.audioManager.getComponent(AudioManager).play_mushroom_appear();
                    setTimeout(() => { 
                        let ball = cc.instantiate(this.Res.getComponent(Res).ball);
                        ball.setParent(cc.find('Map'));
                        ball.x = x;
                        ball.y = y+32;
                        if (ball.x === 3128){
                            ball.getComponent(cc.PhysicsCircleCollider).tag = 31;
                            ball.getComponent(cc.PhysicsCircleCollider).apply();
                        }
                        let tmp = cc.instantiate(this.Res.getComponent(Res).question_done);
                        tmp.setParent(cc.find('Map')); // 一定要設置父節點
                        tmp.x = x;
                        tmp.y = y;

                        // mushroom.runAction(cc.moveTo(1, cc.v2(mushroom.x, mushroom.y + 32)));
                        // setTimeout(() => { // 長出來之後
                        //     if(mushroom.isValid) mushroom.getComponent(Mushroom).enabled = true;
                        // }, 1000);

                        if(other.node.isValid) other.node.destroy();
                    }, 200);
                }
            }
            else if(other.tag === 5){ // brick
                other.getComponent(cc.PhysicsBoxCollider).tag = 10;
                other.getComponent(cc.PhysicsBoxCollider).apply();
                // cc.audioEngine.playEffect(this.brick_broke, false);
                // this.break = true;
                this.audioManager.getComponent(AudioManager).play_brick_broke();
                other.node.getComponent(cc.Animation).play('brick_broke');
                setTimeout(() => { 
                    if(other.node.isValid) other.node.destroy();
                }, 200);
            }
            else if(other.tag === 28){ // special base
                // console.debug("Special")
                other.getComponent(cc.Sprite).enabled = true;
                other.getComponents(cc.PhysicsBoxCollider)[0].enabled = false; // Close sensor
                other.getComponents(cc.PhysicsBoxCollider)[1].enabled = true; // activate the base
                other.getComponent(cc.PhysicsBoxCollider).apply();
                self.getComponent(cc.RigidBody).linearVelocity.y *= -0.5;
                // cc.audioEngine.playEffect(this.brick_broke, false);
                // this.break = true;
                // this.audioManager.getComponent(AudioManager).play_brick_broke();
                // other.node.getComponent(cc.Animation).play('brick_broke');
                // setTimeout(() => { 
                //     if(other.node.isValid) other.node.destroy();
                // }, 200);
            }
        }

        // 碰到(上下左右)
        else if(self.tag === 3){
            if(other.tag === 9){ // sensor brick
                for(let brick of cc.find('Map/sensor').children){
                    // console.debug(brick);
                    brick.opacity = 100;
                }
                this.node.opacity = 100;
            }
            if(other.tag === 13){ // mushroom
                other.node.stopAllActions();
                other.node.destroy();
                this.add_point(1000);
                this.scheduleOnce(() => {
                    if(this.life === 1) this.change_life();
                }, 0);
            }
            if(other.tag === 27){ // poison mushroom
                if(this.hurting){
                    // console.debug("doule kill")
                    return;
                }
                this.hurting = true;
                // this.node.group = 'Invincible';
                // this.getComponent(cc.PhysicsBoxCollider).apply();
                // console.debug("HURTing")
                this.scheduleOnce(() => {
                    // if(other.isValid)console.debug("OUCHs", self.tag)

                    this.die();
                    other.node.destroy();
                    // if(other.isValid && this.life === 2) this.change_life();
                    //     setTimeout(() => {
                    //     this.hurting = false;
                    //     this.node.group = 'default';
                    //     this.getComponent(cc.PhysicsBoxCollider).apply();
                    //     // console.debug("not HURTing")
                    // }, 2000);
                }, 0);
            }
            if(other.tag === 29){ // green ball
                other.node.destroy();
                this.add_point(2000);
                this.audioManager.getComponent(AudioManager).play_coin();
                cc.find("Map").getComponent(MapCreator2).finish_map();
            }
            if(other.tag === 31){ // green ball2
                other.node.destroy();
                this.add_point(3000);
                this.audioManager.getComponent(AudioManager).play_coin();
                cc.find('Map/sp2').getComponent(cc.PhysicsBoxCollider).tag = 6;
                cc.find('Map/sp2').getComponent(cc.PhysicsBoxCollider).apply();

                cc.find('Map/real_pole').active = true;
            }
            if(other.tag === 30){ // cloud
                if(this.hurting){
                    // console.debug("doule kill")
                    return;
                }
                this.hurting = true;
                this.node.group = 'Invincible';
                this.getComponent(cc.PhysicsBoxCollider).apply();
                other.getComponent(cc.Sprite).spriteFrame = this.Res.getComponent(Res).angry_cloud;
                // console.debug("HURTing")
                this.scheduleOnce(() => {
                    // if(other.isValid)console.debug("OUCHs", self.tag)

                    if(other.isValid && this.life === 1) this.die();
                    if(other.isValid && this.life === 2) this.change_life();
                    setTimeout(() => {
                        this.hurting = false;
                        this.node.group = 'default';
                        this.getComponent(cc.PhysicsBoxCollider).apply();
                        // console.debug("not HURTing")
                    }, 2000);
                }, 0);
            }
            if(other.tag === 25 && self.node.y > other.getComponent(Flower).startY+32){ // flower
                if(this.hurting || other.getComponent(Flower).rest){
                    // console.debug("doule kill")
                    return;
                }
                this.hurting = true;
                this.node.group = 'Invincible';
                this.getComponent(cc.PhysicsBoxCollider).apply();
                // console.debug("HURTing")
                this.scheduleOnce(() => {
                    // if(other.isValid)console.debug("OUCHs", self.tag)

                    if(other.isValid && this.life === 1) this.die();
                    if(other.isValid && this.life === 2) this.change_life();
                        setTimeout(() => {
                        this.hurting = false;
                        this.node.group = 'default';
                        this.getComponent(cc.PhysicsBoxCollider).apply();
                        // console.debug("not HURTing")
                    }, 2000);
                }, 0);
            }
            if(other.tag === 4){ // pole
                if(self.node.y > 250) this.add_point(5000);
                else this.add_point(2000);
                this.scheduleOnce(() => {
                    this.level_clear();
                }, 0)
            }
            if(other.tag === 32){ // fake pole
                if(self.node.y > 250) this.add_point(5000);
                else this.add_point(2000);
                this.scheduleOnce(() => {
                    this.fake_level_clear();
                }, 0)
            }
        }
        if((self.tag === 0 || self.tag === 2) && other.tag === 21){ // goomba
            if(self.tag === 0 && self.getComponent(cc.RigidBody).linearVelocity.y < 0) return;
            if(other.getComponent(Goomba).enabled === false) return;
            if(this.hurting){
                // console.debug("doule kill")
                return;
            }
            this.hurting = true;
            this.node.group = 'Invincible';
            this.getComponent(cc.PhysicsBoxCollider).apply();
            // console.debug("HURTing")
            this.scheduleOnce(() => {
                // if(other.isValid)console.debug("OUCHs", self.tag)
                
                if(other.isValid && this.life === 1) this.die();
                if(other.isValid && this.life === 2) this.change_life();
                setTimeout(() => {
                    this.hurting = false;
                    this.node.group = 'default';
                    this.getComponent(cc.PhysicsBoxCollider).apply();
                    // console.debug("not HURTing")
                }, 2000);
            }, 0);
        }
        if((self.tag === 0 || self.tag === 2) && other.tag === 24){ // turtle
            if(self.tag === 0 && self.getComponent(cc.RigidBody).linearVelocity.y < 0) return;
            if(other.getComponent(Turtle).enabled === false || !other.isValid) return;
            if(this.hurting){
                // console.debug("doule kill")
                return;
            }
            this.hurting = true;
            this.node.group = 'Invincible';
            this.getComponent(cc.PhysicsBoxCollider).apply();
            // console.debug("HURTing")
            this.scheduleOnce(() => {
                // if(other.isValid)console.debug("OUCHs", self.tag)
                
                if(other.isValid && this.life === 1) this.die();
                if(other.isValid && this.life === 2) this.change_life();
                setTimeout(() => {
                    this.hurting = false;
                    this.node.group = 'default';
                    this.getComponent(cc.PhysicsBoxCollider).apply();
                    // console.debug("not HURTing")
                }, 2000);
            }, 0);
        }

        // console.debug(self.tag, "start")
        // console.debug(contact.getWorldManifold().points[0])
        // if(self.tag === 0 && contact.getWorldManifold().points.x > self.node.x) console.log('Right');
        // if(self.tag === 0 && contact.getWorldManifold().points.x < self.node.x) console.log('Left');
        if(self.tag === 0) {
            this.velX = 0
        }
        if(self.tag === 1) this.isground = true

        
    } 
    onEndContact(contact, self, other){
        if(this.again) return;
        // console.debug("END")
        // let points = contact.getWorldManifold().points;
        // let normal = contact.getWorldManifold().normal;
        // console.debug(self.tag, points[0].x, self.node.x)
        // if(self.tag === 0 && other.node.x > self.node.x){
        //     this.getComponent(cc.RigidBody).applyForceToCenter(cc.v2(-10, 0), true);
        // }
        
        // if(self.tag === 1) this.isground = false

        if(self.tag === 3 && other.tag === 9){
            for(let brick of cc.find('Map/sensor').children){
                brick.opacity = 255;
            }
            this.node.opacity = 255;
        }
        
        if(self.tag === 2 ){ // 頭撞到
            // console.debug("END", other.node)
            // if(other.tag === 5 && this.break){
                // this.break = false;
                // cc.audioEngine.playEffect(this.brick_broke, false);
                // this.audioManager.getComponent(AudioManager).play_brick_broke();
                // other.node.getComponent(cc.Animation).play('brick_broke')
            // }
        }

        // console.debug(self.tag, "end")

    }

    onPreSolve (contact, self, other) {
        if(this.again) return;
        // console.debug(contact.getWorldManifold().points.x)
        // 每次将要处理碰撞体接触逻辑时被调用
        
        if(self.tag === 1) this.isground = true
        // else this.isground = false;
        
        
        let points = contact.getWorldManifold().points;
        // console.debug(self.tag, "presolve ", points.length, points[0].x, self.node.x)
        if(points.length > 0 && self.tag === 0 && points[0].x >= self.node.x){
            this.velX = 0
            // console.log('Right' , this.isground);
            this.scheduleOnce(() => {
                self.node.x -= 2;
            }, 0);
        }
        else if(points.length > 0 && self.tag === 0 && points[0].x < self.node.x){
            this.velX = 0
            // console.log('Left', this.isground);
            this.scheduleOnce(() => {
                // console.debug(this.node.x)
                // self.node.x += 2;
                this.node.x += 2;
                // console.debug(this.node.x)
            }, 0);
        }
    }
}
 