const {ccclass, property} = cc._decorator;

@ccclass
export default class MapCreator2 extends cc.Component {

    /*
        tag: 
              32 => fake pole
              31 => question( 通關要件2 )
              30 => cloud       
              29 => ball sensor      
              28 => special base sensor      
              27 => poison mushroom
              26 => flower(sensor)    
              25 => flower(all)         
              24 => turtle(all)
              23 => turtle(下)      
              22 => turtle(左右)
              21 => 松果(all)
              20 => 松果(下)      
              19 => 松果(左右)
              18 => question( 通關要件 )
              17 => question( Money )
              16 => question(Poison Mushroom)
              15 => question(Mushroom)
              14 => question(Fake)
              13 => 香菇(all)
              12 => 香菇(上下)
              11 => 香菇(左右)
              10 => 純碰撞沒效果 e.g.地板
              9 => 關卡最後的sensor
              8 => tube
              7 => trap spring
              6 => spring
              5 => brick(撞破)
              4 => pole
    */

    @property(cc.Prefab)
    ground1: cc.Prefab = null;

    @property(cc.Prefab)
    brick: cc.Prefab = null;

    @property(cc.Prefab)
    base: cc.Prefab = null;

    @property(cc.Prefab)
    special_base: cc.Prefab = null;

    @property(cc.Prefab)
    tubeUp: cc.Prefab = null;

    @property(cc.Prefab)
    poll: cc.Prefab = null;

    @property(cc.Prefab)
    question: cc.Prefab = null;

    @property(cc.Prefab)
    goomba: cc.Prefab = null;

    @property(cc.Prefab)
    turtle: cc.Prefab = null;

    @property(cc.Prefab)
    flower: cc.Prefab = null;



    tile_width = 32; 

    create_node(pre: cc.Prefab, x: number, y: number, coll: boolean = true, tag: number = 0){
        let tmp = cc.instantiate(pre);
        tmp.setParent(this.node); // 一定要設置父節點
        tmp.x = x;
        tmp.y = y;

        if(coll === false){
            tmp.getComponent(cc.PhysicsBoxCollider).enabled = false;
        }

        if(tag != 0){
            tmp.getComponent(cc.PhysicsBoxCollider).tag = tag;
        }
    }
    setcollider(width: number, height: number, offsetx: number, offsety: number, tag: number) {
        let coll = new cc.Node('coll');
        coll.setParent(this.node);
        coll.addComponent(cc.RigidBody);
        coll.addComponent(cc.PhysicsBoxCollider);
        coll.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        coll.getComponent(cc.PhysicsBoxCollider).size = cc.size(width, height);
        coll.getComponent(cc.PhysicsBoxCollider).offset = cc.v2(offsetx, offsety);
        coll.getComponent(cc.PhysicsBoxCollider).tag = tag;
        coll.getComponent(cc.PhysicsBoxCollider).apply();
    }

    onLoad () { 
        cc.director.getPhysicsManager().enabled = true;

        for(let i = 0; i < this.tile_width*30; i += this.tile_width){ // First block
            this.create_node(this.ground1, i, 0);
        }
        this.setcollider(950, 96, 480, 48, 10);

        for(let i = 600; i < 600 + this.tile_width*3; i += this.tile_width){
            if(i > 600 && i < 650){
                this.create_node(this.question, i, 200, true, 16);
            }
            else this.create_node(this.brick, i, 200);
        }
        this.create_node(this.question, 632, 340, true, 17);
        this.create_node(this.goomba, 444, 118);
        this.create_node(this.goomba, 900, 118);

        this.create_node(this.special_base, 985, 220);

        this.create_node(this.flower, 1427, 176); // Second block
        this.create_node(this.tubeUp, 1400, 80); 
        this.create_node(this.goomba, 1530, 118);
        this.create_node(this.goomba, 1480, 118);
        this.create_node(this.flower, 1627, 126);
        this.create_node(this.tubeUp, 1600, 30);
        this.create_node(this.turtle, 1200, 120);
        for(let i = 1060; i < 1060+this.tile_width*20; i += this.tile_width){ 
            this.create_node(this.ground1, i, 0);
        }
        this.setcollider(635, 96, 1380, 48, 10);

        for(let i = 1340; i < 1340+this.tile_width*10; i += this.tile_width){
            this.create_node(this.base, i, 400);
        }
        for(let i = 1400; i < 1400+this.tile_width*5; i += this.tile_width){
            this.create_node(this.question, i, 500);
        }
        this.create_node(this.turtle, 1590, 433);

        this.create_node(this.special_base, 1716, 250);

        for(let i = 1800; i < 1800+this.tile_width*20; i += this.tile_width){ // Third block
            this.create_node(this.ground1, i, 250);
        }
        this.setcollider(635, 96, 2120, 298, 10);

        for(let i = 1900; i < 1900+this.tile_width*5; i += this.tile_width){
            if(i === 1900 || i === 1996) this.create_node(this.question, i, 470, true, 16);
            else if(i === 1932) this.create_node(this.question, i, 470, true, 18);
            else this.create_node(this.question, i, 470);
        }
        this.create_node(this.goomba, 1932, 362);

        this.create_node(this.brick, 2150, 362, false);
        this.create_node(this.brick, 2150, 394, false);
        this.setcollider(26, 64, 2150, 378, 10);

        this.create_node(this.turtle, 2300, 375);
        
        this.create_node(this.brick, 2400, 362, false);
        this.create_node(this.brick, 2400, 394, false);
        this.setcollider(26, 64, 2400, 378, 10);

        // for(let i = 2600; i < 2600+this.tile_width*20; i += this.tile_width){ // Fourth block
        //     this.create_node(this.ground1, i, 0);
        // }
        // this.setcollider(630, 96, 2920, 48, 10);

        // this.create_node(this.tubeUp, 2700, 96);
        // this.create_node(this.flower, 2877, 192);
        // this.create_node(this.tubeUp, 2850, 96);
        // this.create_node(this.flower, 3027, 192);
        // this.create_node(this.tubeUp, 3000, 96);
        // this.create_node(this.tubeUp, 3150, 96);
        // this.create_node(this.question, 2728, 400, true, 15);
        // this.create_node(this.question, 2878, 400);
        // this.create_node(this.question, 3028, 400, true, 15);
        // this.create_node(this.question, 3178, 400);

        // this.create_node(this.goomba, 2930, 118);
        // this.create_node(this.turtle, 2800, 119);
        // this.create_node(this.turtle, 3100, 119);

        // this.create_node(this.poll, 3900, 240); // Last block
        // for(let i = 3400; i < 3400+this.tile_width*22; i += this.tile_width){
        //     this.create_node(this.ground1, i, 0);
        // }
        // this.setcollider(640, 96, 3720, 48, 10);


        // for(let i = 3556; i < 3556+this.tile_width*4; i += this.tile_width){
        //     for(let j = 112; j < 112+this.tile_width*8; j += this.tile_width){
        //         if(j <= 144 || j >= 304) this.create_node(this.brick, i, j, false);
        //     }
        // }
        // this.setcollider(122, 64, 3604, 128, 10);
        // this.setcollider(122, 64, 3604, 320, 10);

        // let coll = new cc.Node('sensor'); // Set sensor
        // for(let i = 3556; i < 3556+this.tile_width*4; i += this.tile_width){
        //     for(let j = 176; j < 176+this.tile_width*4; j += this.tile_width){
        //         // this.create_node(this.brick, i, j, false);
        //         let tmp = cc.instantiate(this.brick);
        //         tmp.setParent(coll); // 一定要設置父節點
        //         tmp.x = i;
        //         tmp.y = j;
        //         tmp.getComponent(cc.PhysicsBoxCollider).enabled = false;
        //     }
        // }
        
        // coll.setParent(this.node);
        // coll.addComponent(cc.RigidBody);
        // coll.addComponent(cc.PhysicsBoxCollider);
        // coll.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        // coll.getComponent(cc.PhysicsBoxCollider).size = cc.size(110, 100);
        // coll.getComponent(cc.PhysicsBoxCollider).offset = cc.v2(3604, 224);
        // // coll.getComponent(cc.PhysicsBoxCollider).size = cc.size(122, 114);
        // // coll.getComponent(cc.PhysicsBoxCollider).offset = cc.v2(3604, 223);
        // coll.getComponent(cc.PhysicsBoxCollider).tag = 9;
        // coll.getComponent(cc.PhysicsBoxCollider).sensor = true;
        // coll.getComponent(cc.PhysicsBoxCollider).apply();

    }

    start () {
        // console.debug("YEAH!");
    }

    finish_map() {
        for(let i = 2600; i < 2600+this.tile_width*11; i += this.tile_width){ // Fourth block
            this.create_node(this.ground1, i, 0);
        }
        this.setcollider(352, 96, 2776, 48, 10);

        for(let i = 3048; i < 3048+this.tile_width*6; i += this.tile_width){
            this.create_node(this.ground1, i, 0);
        }
        this.setcollider(192, 96, 3144, 48, 10);

        for(let i = 112; i < 112 + this.tile_width*5; i += this.tile_width){
            this.create_node(this.brick, 2616, i, false);
        }
        this.setcollider(26, 160, 2616, 176, 10);
        
        for(let i = 112; i < 112 + this.tile_width*4; i += this.tile_width){
            this.create_node(this.brick, 2648, i, false);
        }
        this.setcollider(26, 128, 2648, 160, 10);
        
        for(let i = 112; i < 112 + this.tile_width*3; i += this.tile_width){
            this.create_node(this.brick, 2680, i, false);
        }
        this.setcollider(26, 96, 2680, 144, 10);

        for(let i = 2712; i < 2712 + this.tile_width * 10; i += this.tile_width){
            this.create_node(this.special_base, i, 208);
        }

        this.create_node(this.question, 2744, 272);
        this.create_node(this.question, 2904, 272);

        this.create_node(this.question, 3096, 208);
        this.create_node(this.question, 3128, 208, true, 16);
        this.create_node(this.question, 3160, 208);
        this.create_node(this.question, 3128, 317, true, 18);





        this.create_node(this.poll, 4000, 240, true, 32); // Last block
        for(let i = 3368; i < 3368+this.tile_width*50; i += this.tile_width){
            this.create_node(this.ground1, i, 0);
        }
        this.setcollider(1600, 96, 4168, 48, 10);


        for(let i = 3556; i < 3556+this.tile_width*10; i += this.tile_width){
            for(let j = 112; j < 112+this.tile_width*12; j += this.tile_width){
                if(j <= 144 || j >= 432) this.create_node(this.brick, i, j, false);
            }
        }
        this.setcollider(314, 64, 3700, 128, 10);
        this.setcollider(314, 64, 3700, 448, 10);

        this.create_node(this.turtle, 3628, 200);
        this.create_node(this.turtle, 3700, 200);
        this.create_node(this.turtle, 3772, 200);

        let coll = new cc.Node('sensor'); // Set sensor
        for(let i = 3556; i < 3556+this.tile_width*10; i += this.tile_width){
            for(let j = 176; j < 176+this.tile_width*10; j += this.tile_width){
                // this.create_node(this.brick, i, j, false);
                let tmp = cc.instantiate(this.brick);
                tmp.setParent(coll); // 一定要設置父節點
                tmp.x = i;
                tmp.y = j;
                tmp.getComponent(cc.PhysicsBoxCollider).enabled = false;
            }
        }

        coll.setParent(this.node);
        coll.group = 'Props';
        coll.addComponent(cc.RigidBody);
        coll.addComponent(cc.PhysicsBoxCollider);
        coll.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        coll.getComponent(cc.PhysicsBoxCollider).size = cc.size(302, 250);
        coll.getComponent(cc.PhysicsBoxCollider).offset = cc.v2(3700, 288);
        // coll.getComponent(cc.PhysicsBoxCollider).size = cc.size(122, 114);
        // coll.getComponent(cc.PhysicsBoxCollider).offset = cc.v2(3604, 223);
        coll.getComponent(cc.PhysicsBoxCollider).tag = 9;
        coll.getComponent(cc.PhysicsBoxCollider).sensor = true;
        coll.getComponent(cc.PhysicsBoxCollider).apply();


    }


    // update (dt) {
        // this.node.x -= 100*dt
    // }
}
