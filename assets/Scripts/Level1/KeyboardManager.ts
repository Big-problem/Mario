import PersistMenu from "../Menu/PersistMenu";
import AudioManager from "./AudioManager";
import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class keyboardManager extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    map: cc.Node = null;

    @property(cc.Node)
    camera: cc.Node = null;
    
    @property(cc.Node)
    UI: cc.Node = null;

    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Node)
    audioManager: cc.Node = null;

    input: string = null;

    playerPlayer: Player = null;
    canjump: boolean = true;
    jumpForce: number = 38000;

    bg_page = 1;
    level: number = -1;

    middle: boolean = false;


    // jump(){
    //     setTimeout(() => {

    //     }, 1000);
    // }

    start () {
        this.middle = false;
        this.level = cc.find('PersistMenu').getComponent(PersistMenu).level;
        this.playerPlayer = this.player.getComponent(Player);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (event) => {
            if(event.keyCode === cc.macro.KEY.d || event.keyCode === cc.macro.KEY.right){
                // this.input = 'd';
                this.playerPlayer.accX = 50;
            }
            else if(event.keyCode === cc.macro.KEY.a || event.keyCode === cc.macro.KEY.left){
                // this.input = 'd';
                this.playerPlayer.accX = -50;
            }
            else if(event.keyCode === cc.macro.KEY.w || event.keyCode === cc.macro.KEY.up){
                // this.input = 'd';
                if(this.playerPlayer.isground && this.canjump){
                    // console.debug("JUMP")
                    // this.player.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 500)
                    // this.playerPlayer.accY = 180;
                    this.audioManager.getComponent(AudioManager).play_jump();
                    this.player.getComponent(cc.RigidBody).applyForceToCenter(cc.v2(0, this.jumpForce), true);
                    this.playerPlayer.isground = false;
                    this.canjump = false;
                    // this.jump();
                }
            }
        })

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, (event) => {
            if(event.keyCode === cc.macro.KEY.d || event.keyCode === cc.macro.KEY.right){
                // this.input = null;
                this.playerPlayer.accX = 0;
            }
            else if(event.keyCode === cc.macro.KEY.a || event.keyCode === cc.macro.KEY.left){
                // this.input = 'd';
                this.playerPlayer.accX = 0;
            }
            else if(event.keyCode === cc.macro.KEY.w || event.keyCode === cc.macro.KEY.up){
                this.canjump = true;
                // this.input = 'd';
                // this.playerPlayer.accY = 0;
            }
        })
    }

    // update(dt: number): void {
    //     if(this.playerPlayer.pause || this.playerPlayer.again) return;

    //     if(this.player.x < 17) this.player.x = 17
    //     if(this.map.x <= -3079){
    //         // if(this.player.x >= 480) this.player.x = 480;    
    //         return;
    //     }
    //     else if(this.player.x >= 480){ // Move map, not the player
    //         this.player.x = 480; // player

    //         for(let bg of this.bg.children){ // background
    //             bg.x -= this.playerPlayer.velX * dt;
                
    //             if(bg.x <= -960){
    //                 bg.x += 960 << 1;
    //             }
    //         }

    //         this.map.x -= this.playerPlayer.velX * dt; // map
    //         for(let comp of this.map.getComponentsInChildren(cc.RigidBody)){
    //             comp.syncPosition(false);
    //         }
    //     }
    // }

    // update(dt: number): void {
    //     // console.debug(this.camera.x);
    //     if(this.playerPlayer.pause || this.playerPlayer.again) return;

    //     if(this.player.x < this.camera.x + 17) this.player.x = this.camera.x + 17;
    //     if(this.level === 1 && this.camera.x >= 3080) return;
    //     if(this.level === 2 && this.camera.x >= 3810) return;
        
    //     if(this.camera.x > 0 && this.camera.x > 960*this.bg_page ) {
    //         // console.debug("GOGO")
    //         if((this.bg_page & 1) === 1) this.bg.children[0].x += 960 << 1;
    //         else this.bg.children[1].x += 960 << 1;
    //         ++this.bg_page;
    //     }
    //     if(this.player.x >= this.camera.x + 480){ // Camera move along with the player
    //         // this.player.x = 480; // player
    //         this.player.x = this.camera.x + 480

    //         // for(let bg of this.bg.children){ // background
    //         //     bg.x -= this.playerPlayer.velX * dt;
                
    //         //     if(bg.x <= -960){
    //         //         bg.x += 960 << 1;
    //         //     }
    //         // }

    //         // this.map.x -= this.playerPlayer.velX * dt; // map
    //         this.camera.x += this.playerPlayer.velX * dt;
    //         this.UI.x += this.playerPlayer.velX * dt;
    //         // for(let comp of this.map.getComponentsInChildren(cc.RigidBody)){
    //         //     comp.syncPosition(false);
    //         // }
    //     }
    // }

    update(dt: number): void {
        // console.debug(this.camera.x);
        if(this.playerPlayer.pause || this.playerPlayer.again) return;

        // if(this.player.x < this.camera.x + 17) this.player.x = this.camera.x + 17;
        // if(this.level === 1 && this.camera.x >= 3080) return;
        // if(this.level === 2 && this.camera.x >= 3810) return;
        
        if(this.camera.x > 0 && this.camera.x > 960*this.bg_page ) {
            // console.debug("GOGO")
            if((this.bg_page & 1) === 1) this.bg.children[0].x += 960 << 1;
            else this.bg.children[1].x += 960 << 1;
            ++this.bg_page;
        }
        if(this.camera.x > 0 && this.camera.x < 960*(this.bg_page-1) ) {
            // console.debug("GOGO")
            if((this.bg_page & 1) === 1) this.bg.children[1].x -= 960 << 1;
            else this.bg.children[0].x -= 960 << 1;
            --this.bg_page;
        }




        if(this.player.x >= this.camera.x + 480 && this.playerPlayer.velX > 0){ // Camera move along with the player
            if(this.level === 1 && this.camera.x >= 3080){
                return;
            }
            if(this.level === 2 && this.camera.x >= 3810){
                return;
            }
            this.player.x = this.camera.x + 480
            this.camera.x += this.playerPlayer.velX * dt;
            this.UI.x += this.playerPlayer.velX * dt;
            this.middle = true;
        }
        if(this.middle && this.playerPlayer.velX < 0 && this.player.x <= this.camera.x + 480){
            if(this.camera.x <= 0){
                this.camera.x = 0;
                this.UI.x = 0;
                this.middle = false;
                return;
            }
            this.player.x = this.camera.x + 480
            this.camera.x += this.playerPlayer.velX * dt;
            this.UI.x += this.playerPlayer.velX * dt;
        }
        // if(this.middle && this.playerPlayer.velX)
    }
} 