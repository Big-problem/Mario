import PersistMenu from "../Menu/PersistMenu";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoseOneLife extends cc.Component {


    start () {
        // console.debug("HEre");
        let level = cc.find('PersistMenu').getComponent(PersistMenu).level;
        if(level === 1){
            setTimeout(() => {
                cc.director.loadScene('Level1');
            }, 1500);
        }
        else if(level === 2){
            setTimeout(() => {
                cc.director.loadScene('Level2');
            }, 1500);
        }
    }


}
