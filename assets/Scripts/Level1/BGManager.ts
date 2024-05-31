const {ccclass, property} = cc._decorator;

@ccclass
export default class BGManager extends cc.Component {

    start () {

    }

    update (dt) {
        // for(let bg of this.node.children){
        //     bg.x -= 100 * dt;
            
        //     if(bg.x <= -960){
        //         bg.x += 960 << 1;
        //     }
        // }
    }
}
