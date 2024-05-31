const {ccclass, property} = cc._decorator;

@ccclass
export default class PersistMenu extends cc.Component {

    level: number = -1;
    // life: number = 5;

    start () {
        cc.game.addPersistRootNode(this.node);
    }
    
}
