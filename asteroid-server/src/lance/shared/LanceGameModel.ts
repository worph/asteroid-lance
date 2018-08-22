import SimplePhysicsEngine from 'lance-gg/es5/physics/SimplePhysicsEngine';
import GameEngine from 'lance-gg/es5/GameEngine';
import NetShip from "./NetShip";
import DynamicObject from 'lance-gg/es5/serialize/DynamicObject';
import LanceAsset from "./LanceAsset";
import InputDefinition from "./InputDefinition";

export default class LanceGameModel extends GameEngine{
    private physicsEngine: any;
    private world: any;

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({
            gameEngine: this,
            collisions: {
                type: 'brute'
            }
        });
    }

    registerClasses(serializer){
        serializer.registerClass(DynamicObject);
        serializer.registerClass(NetShip);
        serializer.registerClass(LanceAsset);
    }

    initWorld(){
        super.initWorld({
            worldWrap: true,
            width: 1920,
            height: 1920
        });
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
            let lanceAsset = new LanceAsset(gameEngine,null,options.props);
            lanceAsset.assetId = options.assetId;
            this.addObjectToWorld(lanceAsset);
        }
    };

    addObjectToWorld(item: any) {
        super.addObjectToWorld(item);
    }

    on(s: string, param2: (e:any)=>void) {

    }
}
