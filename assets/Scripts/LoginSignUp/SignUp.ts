declare const firebase: any;
// import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SignUp extends cc.Component {

    start () {

    }

    async sign_up() {
        let email = cc.find("SignUpPage/Email/EmailEnter").getComponent(cc.EditBox).string;
        let userName = cc.find("SignUpPage/UserName/UserNameEnter").getComponent(cc.EditBox).string;
        let password = cc.find("SignUpPage/Password/PasswordEnter").getComponent(cc.EditBox).string;

        try {
            // Sign up
            const auth = firebase.auth();
            const result = await auth.createUserWithEmailAndPassword(email, password)
            alert("Sign up successfully! Please wait a few second for proper loading")
            // Upload profile image
            // const storageRef = stoRef(storage, result.user.uid)
            // const uploadTask = uploadBytesResumable(storageRef, imagefile)
            // Register observer
            // uploadTask.on('state_changed', 
            //   () => {
            //   },
            //   (err) => {
            //     setWrong(true)
            //     setWrongmessage(err)
            //   },
            //   () => {
                // getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
            let user = auth.currentUser;
            if(user){
                await user.updateProfile({
                    displayName: userName,
                    // photoURL: downloadURL
                })
            }

            // Save user info to database
            await firebase.database().ref('users/' + user.uid).set({
                uid: result.user.uid,
                username: userName,
                email: email,
                isLevel2: false,
                L1Score: 0, 
                L2Score: 0,
                life: 5
            });

            cc.audioEngine.stopMusic();
            cc.director.loadScene('Menu');
            
            // set(ref(database, 'users/' + result.user.uid), {
            // uid: result.user.uid,
            // username: usernameText,
            // email: emailText,
            // photoURL: downloadURL
            // })


                  // Add the user in to public chat room
                //   await set(ref(database, 'userChats/' + result.user.uid), {
                //     "bdebbe8d-295f-43df-a3fe-d47629ca06b4": {
                //       roomName: "Public Chat Room",
                //       date: serverTimestamp(),
                //       latestMessage: ""
                //     }
                //   })
    
                  // Add new user message in public chat room
                //   const newMessage = {
                //     date: serverTimestamp(),
                //     sender: "SYSTEM192837465",
                //     message: usernameText + " Joined"
                //   }
                //   const newKey = push(child(ref(database), 'chats/bdebbe8d-295f-43df-a3fe-d47629ca06b4')).key;
                //   const updates = {}
                //   updates["/chats/bdebbe8d-295f-43df-a3fe-d47629ca06b4/" + newKey] = newMessage
          
                //   await update(ref(database), updates)
                //   navigate("/chatroom")
                // })
            //   }
            // )
          } catch (err) {
            // console.debug("ERROR: ", err);
            alert("ERROR: " + err);
          }






















        // console.debug(email, userName, password)
    }

    // update (dt) {}
}
