declare const firebase: any;

import PersistMenu from "./PersistMenu";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOver extends cc.Component {

    @property(cc.AudioClip)
    music: cc.AudioClip = null;

    start () {
        let user = firebase.auth().currentUser;
        let new_data = {
            life: 5,
        };
        firebase.database().ref('users/' + user.uid).update(new_data);


        // cc.find('PersistMenu').getComponent(PersistMenu).life = 5;
        cc.audioEngine.playEffect(this.music, false);
        setTimeout(() => {
            cc.audioEngine.stopAllEffects()
            cc.director.loadScene('Menu');
        }, 6000);
    }
    
}
