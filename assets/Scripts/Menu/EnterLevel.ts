import PersistMenu from "./PersistMenu";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnterLevel extends cc.Component {

    start () {
        // console.debug(cc.find('MenuManager'))
        let level = cc.find('PersistMenu').getComponent(PersistMenu).level;
        if(level === 1) {
            cc.find('Level_1').active = true;
            setTimeout(() => {
                    cc.director.loadScene('Level1');
            }, 3000);
        }
        else if(level === 2) {
            cc.find('Level_2').active = true;
            setTimeout(() => {
                    cc.director.loadScene('Level2');
            }, 3000);
        }
    }
}
