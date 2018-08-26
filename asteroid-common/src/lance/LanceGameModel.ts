import GameEngine from 'lance-gg/es5/GameEngine';
import DynamicObject from 'lance-gg/es5/serialize/DynamicObject';
import P2PhysicsEngine from 'lance-gg/es5/physics/P2PhysicsEngine';
import LancePhysic2DObject from "./component/LancePhysic2DObject";
import InputDefinition from "./const/InputDefinition";
import {WallMaker} from "./rule/WallMaker";
import AsteroidCreationRule from "./rule/AsteroidCreationRule";
import BulletRule from "./rule/BulletRule";
import {PlayerConnexionRule} from "./rule/PlayerConnexionRule";
import {ShipFactory} from "./object/ShipFactory";
import {LanceNetworkEntity} from "./ecs/LanceNetworkEntity";
import {AsteroidFactory} from "./object/AsteroidFactory";
import {GenericObjectContainer} from "./component/GenericObjectContainer";
import {BulletFactory} from "./object/BulletFactory";
import {SyncRandomNumberGenerator} from "./SyncRandomNumberGenerator";
import {AssetIDGenerator} from "./AssetIDGenerator";
import {ShipDataModel} from "./component/ShipDataModel";

export default class LanceGameModel extends GameEngine {
    physicsEngine: any;
    world: any;
    worldWidth = 1920;
    worldHeight = 1920;

    private asteroidCreationRule: AsteroidCreationRule;
    private bulletRule: BulletRule;
    private shipFactory: ShipFactory;
    private playerConnexionRule: PlayerConnexionRule;
    private asteroidFactory: AsteroidFactory;
    private bulletFactory: BulletFactory;
    private syncRandomNumberGenerator: SyncRandomNumberGenerator;
    private assetIDGenerator: AssetIDGenerator;

    constructor(options) {
        super(options);
        this.physicsEngine = new P2PhysicsEngine({gameEngine: this});
        this.physicsEngine.world.defaultContactMaterial.friction = 0;


        this.syncRandomNumberGenerator = new SyncRandomNumberGenerator();
        this.assetIDGenerator = new AssetIDGenerator(this.syncRandomNumberGenerator);

        /////////////////////////////////////////////
        //Set up factories
        /////////////////////////////////////////////
        this.shipFactory = new ShipFactory(this,this.assetIDGenerator);
        this.bulletFactory = new BulletFactory(this,this.assetIDGenerator);
        this.asteroidFactory = new AsteroidFactory(this,this.assetIDGenerator);

        /////////////////////////////////////////////
        //Set up rules
        /////////////////////////////////////////////

        //TODO reenable
        //this.asteroidCreationRule = new AsteroidCreationRule(this.worldWidth, this.worldHeight, this,this.asteroidFactory);
        //this.bulletRule = new BulletRule(this);
        this.playerConnexionRule = new PlayerConnexionRule(this,this.shipFactory);


        /////////////////////////////////////////////
        //Set up update loop
        /////////////////////////////////////////////

        this.on("preStep",(data:{step:number,isReenact:boolean})=>{
            this.syncRandomNumberGenerator.update(data.step);//TODO is this usefull since the true random is defined by process input.
        });

        this.on("postStep",(data:{step:number,isReenact:boolean})=>{
            this.update();
            //console.log(this.syncRandomNumberGenerator.getRandomAPI().integer(1, 100) + "/" + data.step + " / "+ data.isReenact);
        });
    }

    registerClasses(serializer) {
        serializer.registerClass(DynamicObject);
        serializer.registerClass(LancePhysic2DObject);
        serializer.registerClass(GenericObjectContainer);
        serializer.registerClass(LanceNetworkEntity);
        serializer.registerClass(ShipDataModel);
    }

    initWorld() {
        super.initWorld({
            worldWrap: false,
            width: this.worldWidth,
            height: this.worldHeight
        });
        let wallMaker = new WallMaker(this);
        wallMaker.setBounds(0, 0, this.worldWidth, this.worldHeight);
    }

    start() {
        super.start();
        this.on('collisionStart', e => {
            /*
            //TODO put this logic in an external class
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
        this.syncRandomNumberGenerator.update(inputData.step+inputData.messageIndex);
        //TODO put this logic in an external class
        let gameEngine = this;
        super.processInput(inputData, playerId);
        if (inputData.input == InputDefinition.SHOOT) {
            console.log("input data steep : "+inputData.step);
            let options = inputData.options;
            let obj = this.world.queryObject({
                id: options.id,
            });
            this.bulletFactory.create(obj.position,obj.angle,obj.velocity);
        }else if (inputData.input == InputDefinition.ROTATE_RIGHT) {
            let options = inputData.options;
            let obj = this.world.queryObject({
                id: options.id,
            });
            //obj.isRotatingRight = options.state;
            obj.physicsObj.angle += options.speed;
            obj.refreshFromPhysics();
        }else if (inputData.input == InputDefinition.ROTATE_LEFT) {
            let options = inputData.options;
            let obj = this.world.queryObject({
                id: options.id,
            });
            //obj.isRotatingLeft = options.state;
            obj.physicsObj.angle -= options.speed;
            obj.refreshFromPhysics();
        }else if (inputData.input == InputDefinition.ACCELERATE) {
            let options = inputData.options;
            let obj = this.world.queryObject({
                id: options.id,
            });
            //obj.isAccelerating = options.state;
            obj.physicsObj.applyForceLocal([options.vector.x, options.vector.y]);
            obj.refreshFromPhysics();
        }else{
            console.error("unkown input");
        }
    };

    addObjectToWorld(item: any) {
        super.addObjectToWorld(item);
    }

    on(event: string, callback:(data:any)=>void) {
        super.on(event, callback)
    }

    once(event: string, callback:(data:any)=>void) {
        super.once(event, callback)
    }

    update(): void {
        //TODO reenable
        //this.asteroidCreationRule.update();
        //this.bulletRule.update();
    }
}
