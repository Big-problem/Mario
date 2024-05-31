# Software Studio 2024 Spring Assignment 2

## Student ID : 109034011 Name : 詹睿軒

### Scoring

|**Basic Component**|**Score**|**Check**|
|:-:|:-:|:-:|
|Complete Game Process|5%|Y|
|Basic Rules|55%|Y|
|Animations|10%|Y|
|Sound Effects|10%|Y|
|UI|10%|Y|

|**Advanced Component**|**Score**|**Check**|
|:-:|:-:|:-:|
|firebase deploy|5%|Y|
|Leaderboard|5%|Y|
|Offline multi-player game|5%|N|
|Online multi-player game|10%|N|
|Others [name of functions]|1-10%|N|

---

## Basic Components Description : 
1. World map : 一共兩張地圖，第一張為正常的馬力歐地圖，玩法非常直觀，吃蘑菇長大、踩死敵人、被敵人撞死之類的，總之難度一顆星。第二關是以超级猫里奥為發想，地圖上充滿危機及陷阱，包含會殺人的香菇、看不見的障礙、特殊通關方法等等，難度4顆星。
2. Player : wad及上左右操控，如果要跳需要鬆開再按一次，不能按住跳不放。可以踩死敵人，若在長大狀態因敵人縮小，會有一小段無敵時間(期間可以直接穿過敵人)
3. Enemies : Goomba，烏龜(踩了就死，不會變龜殼)，水管花(若在花消失時踩水管花不會再出來，離開水管後要隔7~9秒花才會再長出來，是通過第二關的實用小知識)
4. Question Blocks : 撞出錢、撞出可以長大的香菇、撞出可以殺人的香菇、撞出通關道具(綠色球球)
5. Animations : 玩家有跑、跳、死亡、獲勝等動畫。Goomba走路動畫、烏龜走路動畫、花咬人動畫、被撞的磚頭也有動畫、錢錢也有動畫。
6. Sound effects : menu背景音樂、兩個關卡的背景音樂、玩家跳、玩家死、撞破磚頭、撞出錢、撞出香菇、吃香菇、踩敵人、踩彈簧......
7. UI : 生命、分數、倒數計時器都有!

## Advanced Component Description : 

Describe your advanced function and how to use it.
註冊登入就是註冊登入，非常簡單。Global Ranking可以看到所有玩家中的前三名(兩關卡分數個別計算)

## 第二關通關提示
1. 第二個block不能走彈簧，要到兩個水管那邊，再第二個和第三個block之間有一顆隱形方塊
2. 第三個block的其中一顆問號可以撞出綠色球球，需要吃掉它
3. 接下來藉由問號跳過去。之後可以再撞出一顆綠色球球，吃掉它後藉由彈簧跳上去然後越過第一根旗子去找第二根即可通關

# Firebase page link (if you deploy)

    your web page URL: 
    mario-80731.web.app
    mario-80731.firebaseapp.com