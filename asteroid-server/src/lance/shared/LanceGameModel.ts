import GameEngine from 'lance-gg/es5/GameEngine';
import DynamicObject from 'lance-gg/es5/serialize/DynamicObject';
import P2PhysicsEngine from 'lance-gg/es5/physics/P2PhysicsEngine';
import LancePhysic2DObject from "./LancePhysic2DObject";
import InputDefinition from "./InputDefinition";
import {WallMaker} from "./WallMaker";

export default class LanceGameModel extends GameEngine{
    physicsEngine: any;
    private world: any;

    constructor(options) {
        super(options);
        this.physicsEngine = new P2PhysicsEngine({ gameEngine: this });
        this.physicsEngine.world.defaultContactMaterial.friction = 0;
    }

    registerClasses(serializer){
        serializer.registerClass(DynamicObject);
        serializer.registerClass(LancePhysic2DObject);
    }

    initWorld(){
        super.initWorld({
            worldWrap: false,
            width: 1920,
            height: 1920
        });
        let wallMaker = new WallMaker(this);
        wallMaker.setBounds(0,0,1920,1920);
    }

    start() {
        super.start();
        this.on('collisionStart', e => {
            /*
            //TODO physic collision rule
            this.physicService.eventEmitter.on(this.networkGameState.toFollow.id, (body: Identified) => {
                //you touch something (except bullet) => you die
                if (!body.id.startsWith(NetBullet.ID_PREFIX)) {
                    this.scene.restart();
                    this.networkGameState.networkGameManager.notifyEndGame(this.networkGameState.toFollow.id);
                }
            });

            this.networkGameState.toFollow.onBulletCreated(id => {
                let bullet = this.networkGameState.toFollow.getBullets()[id];
                this.networkGameState.createOrUpdateAsset(bullet);
                let handle = (body: Identified) => {
                    if (body.id !== this.networkGameState.toFollow.id) {
                        if (body.id.startsWith(NetAsteroid.ID_PREFIX)) {
                            //delete asteroid
                            let asteroid = body as NetAsteroid;
                            this.networkGameState.deleteAsset(asteroid);
                            this.networkGameState.asteroids[asteroid.id].destroy();
                            delete this.networkGameState.asteroids[asteroid.id];
                            this.networkGameState.networkGameManager.updateScore(asteroid.id, this.networkGameState.toFollow.id, asteroid.getSize());
                        }
                        //delete bullet
                        this.networkGameState.deleteAsset(bullet);
                        this.networkGameState.toFollow.getBullets()[id].destroy();
                        delete this.networkGameState.toFollow.getBullets()[id];
                        //this.physicService.eventEmitter.off(bullet.id, handle);
                    }
                };
                //this.physicService.eventEmitter.on(bullet.id, handle);
            });*/
        });
    };

    processInput(inputData, playerId, isServer) {
        let gameEngine = this;
        super.processInput(inputData, playerId);
        if(inputData.input==InputDefinition.CREATE){
            let options = inputData.options;
            let lanceAsset = new LancePhysic2DObject(gameEngine,null,options.props);
            lanceAsset.assetId = options.assetId;
            this.addObjectToWorld(lanceAsset);
        }
        if(inputData.input==InputDefinition.ROTATE_RIGHT){
            let options = inputData.options;
            let obj = this.world.queryObject({
                id: options.id,
            });
            //obj.isRotatingRight = options.state;
            obj.physicsObj.angle += options.speed;
            obj.refreshFromPhysics();
        }
        if(inputData.input==InputDefinition.ROTATE_LEFT){
            let options = inputData.options;
            let obj = this.world.queryObject({
                id: options.id,
            });
            //obj.isRotatingLeft = options.state;
            obj.physicsObj.angle -= options.speed;
            obj.refreshFromPhysics();
        }
        if(inputData.input==InputDefinition.ACCELERATE){
            let options = inputData.options;
            let obj = this.world.queryObject({
                id: options.id,
            });
            //obj.isAccelerating = options.state;
            obj.physicsObj.applyForceLocal([options.vector.x,options.vector.y]);
            obj.refreshFromPhysics();
        }
    };

    addObjectToWorld(item: any) {
        super.addObjectToWorld(item);
    }

    on(event: string, callback: (data:any)=>void) {
        super.on(event,callback)
    }

    once(event: string, callback: (data:any)=>void) {
        super.once(event,callback)
    }
}
