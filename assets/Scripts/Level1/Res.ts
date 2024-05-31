const {ccclass, property} = cc._decorator;

@ccclass
export default class Res extends cc.Component {

    @property(cc.Prefab)
    question_done: cc.Prefab = null;

    @property(cc.Prefab)
    mushroom1: cc.Prefab = null;

    @property(cc.Prefab)
    mushroom2: cc.Prefab = null;

    @property(cc.Prefab)
    coin: cc.Prefab = null;

    @property(cc.Prefab)
    ball: cc.Prefab = null;

    @property(cc.SpriteFrame)
    angry_cloud: cc.SpriteFrame = null;
}
