declare const firebase: any;


const {ccclass, property} = cc._decorator;

@ccclass
export default class Login extends cc.Component {

    start () {

    }

    async login() {
        let email = cc.find("LoginPage/Email/EmailEnter").getComponent(cc.EditBox).string;
        let password = cc.find("LoginPage/Password/PasswordEnter").getComponent(cc.EditBox).string;

        try {
            const auth = firebase.auth();
            // setLoading(true)
            await auth.signInWithEmailAndPassword(email, password);
            
            // alert("Welcome back!")
            cc.audioEngine.stopMusic();
            cc.director.loadScene('Menu');
            // navigate("/chatroom")
          } catch (error) {
            // console.log("ERROR: ", error);
            alert("ERROR: " + error)
          }





















    }

















}
