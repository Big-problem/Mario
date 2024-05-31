declare const firebase: any;

import PersistMenu from "./PersistMenu";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Menu extends cc.Component {

    @property(cc.AudioClip)
    music1: cc.AudioClip = null;


    start () {
        // console.debug(firebase.auth().currentUser)
        let user = firebase.auth().currentUser;
        cc.audioEngine.playMusic(this.music1, true);
        // cc.find('text_area/life_display').getComponent(cc.Label).string = cc.find('PersistMenu').getComponent(PersistMenu).life.toString();
        cc.find('text_area/name').getComponent(cc.Label).string = user.displayName;
        firebase.database().ref('users/' + user.uid).once('value').then((snapshot) => {
            if(snapshot){
                // console.debug(snapshot.val());
                let datas = snapshot.val();
                cc.find('text_area/level1_score').getComponent(cc.Label).string = datas.L1Score.toString().padStart(7, '0');
                cc.find('text_area/level2_score').getComponent(cc.Label).string = datas.L2Score.toString().padStart(7, '0');
                if(datas.life === 0) cc.find('text_area/life_display').getComponent(cc.Label).string = '5';
                else cc.find('text_area/life_display').getComponent(cc.Label).string = datas.life;

                let btn = cc.find('Canvas/button2');
                if(!datas.isLevel2){
                    btn.getComponent(cc.Button).enabled = false;
                    btn.opacity = 100;
                }
                else{
                    btn.getComponent(cc.Button).enabled = true;
                    btn.opacity = 255;
                }
            }
        })

        firebase.database().ref('Rank').once('value').then((snapshot) => {
            if(snapshot){
                let datas = snapshot.val();
                let ranks = cc.find('RankDisplay').children;
                ranks[5].getComponent(cc.Label).string = datas.L1_1_name;
                if(datas.L1_1_score === -1) ranks[6].getComponent(cc.Label).string = '???????';
                else ranks[6].getComponent(cc.Label).string = datas.L1_1_score.toString().padStart(7, '0');
                
                ranks[7].getComponent(cc.Label).string = datas.L1_2_name;
                if(datas.L1_2_score === -1) ranks[8].getComponent(cc.Label).string = '???????';
                else ranks[8].getComponent(cc.Label).string = datas.L1_2_score.toString().padStart(7, '0');
                
                ranks[9].getComponent(cc.Label).string = datas.L1_3_name;
                if(datas.L1_3_score === -1) ranks[10].getComponent(cc.Label).string = '???????';
                else ranks[10].getComponent(cc.Label).string = datas.L1_3_score.toString().padStart(7, '0');

                ranks[11].getComponent(cc.Label).string = datas.L2_1_name;
                if(datas.L2_1_score === -1) ranks[12].getComponent(cc.Label).string = '???????';
                else ranks[12].getComponent(cc.Label).string = datas.L2_1_score.toString().padStart(7, '0');

                ranks[13].getComponent(cc.Label).string = datas.L2_2_name;
                if(datas.L2_2_score === -1) ranks[14].getComponent(cc.Label).string = '???????';
                else ranks[14].getComponent(cc.Label).string = datas.L2_2_score.toString().padStart(7, '0');

                ranks[15].getComponent(cc.Label).string = datas.L2_3_name;
                if(datas.L2_3_score === -1) ranks[16].getComponent(cc.Label).string = '???????';
                else ranks[16].getComponent(cc.Label).string = datas.L2_3_score.toString().padStart(7, '0');
            }
        });
    }

    Level1() {
        // console.debug("111");
        cc.audioEngine.stopMusic();
        cc.audioEngine.uncache(this.music1);
        cc.find('PersistMenu').getComponent(PersistMenu).level = 1;
        cc.director.loadScene("EnterLevel");
    }

    Level2() {
        // console.debug("111");
        cc.audioEngine.stopMusic();
        cc.audioEngine.uncache(this.music1);
        cc.find('PersistMenu').getComponent(PersistMenu).level = 2;
        cc.director.loadScene("EnterLevel");
    }

    global_rank() {
        cc.find('rank').active = false;
        cc.find('Canvas/button').active = false;
        cc.find('Canvas/button2').active = false;
        cc.find('RankDisplay').active = true;
    }

    exit() {
        cc.find('rank').active = true;
        cc.find('Canvas/button').active = true;
        cc.find('Canvas/button2').active = true;
        cc.find('RankDisplay').active = false;
    }
}
 