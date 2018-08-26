
import ClientEngine from 'lance-gg/es5/ClientEngine';
import LanceRenderer from "./LanceRenderer";
import {LanceNetworkEntity} from "asteroid-common/dist/lance/ecs/LanceNetworkEntity";
import {AssetIDGenerator} from "asteroid-common/dist/lance/const/AssetIDGenerator";
import {ShipGraphics} from "../graphics/ShipGraphics";
import {LancePhaserLink} from "../service/lancePhaserLink/LancePhaserLink";
import LancePhysic2DObject from "asteroid-common/dist/lance/component/LancePhysic2DObject";
import {PlayerInputRule} from "../input/PlayerInputRule";
import {KeyMapper} from "../input/KeyMapper";
import {LanceNetworkComponent} from "asteroid-common/dist/lance/ecs/LanceNetworkComponent";
import {ECS} from "asteroid-common/dist/miniECS/ECS";
import {AsteroidGraphics} from "../graphics/AsteroidGraphics";
import {GenericObjectContainer} from "asteroid-common/dist/lance/component/GenericObjectContainer";
import {AsteroidCreationData} from "asteroid-common/dist/lance/rule/AsteroidCreationRule";
import {BulletGraphics} from "../graphics/BulletGraphics";
import {ShipDataModel} from "asteroid-common/dist/lance/component/ShipDataModel";

export interface ObjectCreationData{
    assetId:string,
    props:any
}

export default class LanceGameModelControler extends ClientEngine {

    constructor(public gameEngine, options,private scene: Phaser.Scene,private lancePhaserLink: LancePhaserLink,private keyMapper: KeyMapper, private ecs: ECS) {
        super(gameEngine, options, LanceRenderer);
    }

    start() {
        super.start();
        this.gameEngine.on("objectAdded",(obj:any)=>{
            if("getComponentType" in obj){
                let lanceNetworkComponent:LanceNetworkComponent = obj as LanceNetworkComponent;
                let parentEntityId = lanceNetworkComponent.getParentEntityId();
                let entity = this.ecs.getEntity(parentEntityId);
                if(entity) {
                    entity.addComponent(lanceNetworkComponent);
                }else{
                    console.error(parentEntityId);
                }
            }
            if(obj instanceof LanceNetworkEntity){
                let lanceNetworkEntity:LanceNetworkEntity = obj as LanceNetworkEntity;
                if(!this.ecs.entityPresent(lanceNetworkEntity.getEntityId())){
                    this.ecs.addEntity(lanceNetworkEntity);
                    //TODO should be in renderer or elsewhere
                    if(lanceNetworkEntity.getEntityId().startsWith(AssetIDGenerator.SHIP_PREFIX)){
                        let ship = lanceNetworkEntity;
                        //create player ship
                        obj.onceComponentType("LancePhysic2DObject",(bodyA)=>{
                            let body = bodyA as LancePhysic2DObject;
                            obj.onceComponentType("ShipDataModel",(shipDataModelA)=> {
                                let shipDataModel = shipDataModelA as ShipDataModel;
                                shipDataModel.read();
                                let shipGraphics = new ShipGraphics({
                                    scene: this.scene,
                                    opt: {}
                                });
                                let lancePhaserLinkComponent = this.lancePhaserLink.create(shipGraphics, body);
                                if(shipDataModel.state.playerId===this.gameEngine.playerId){
                                    //we are the current player add input and camera follow
                                    let playerInputRule = new PlayerInputRule(this.keyMapper, body.id, this);
                                    ship.component.push(shipGraphics);
                                    //create camera
                                    this.scene.cameras.main.startFollow(shipGraphics, true, 0.05, 0.05);    //  Set the camera bounds to be the size of the image
                                    ship.component.push(playerInputRule);
                                }
                                ship.component.push(lancePhaserLinkComponent);
                            });
                        });
                    }
                    if(lanceNetworkEntity.getEntityId().startsWith(AssetIDGenerator.ASTEROID_PREFIX)){
                        let ship = lanceNetworkEntity;
                        //create player ship
                        obj.onceComponentType("LancePhysic2DObject",(bodyA)=>{
                            let body = bodyA as LancePhysic2DObject;
                            obj.onceComponentType("GenericObjectContainer",(genericObjectContainerA)=>{
                                let genericObjectContainer = genericObjectContainerA as GenericObjectContainer;
                                let data:AsteroidCreationData = genericObjectContainer.getData();
                                let asteroidGraphics = new AsteroidGraphics({
                                    scene: this.scene,
                                    opt: {}
                                },data.radius,data.points);
                                let lancePhaserLinkComponent = this.lancePhaserLink.create(asteroidGraphics,body);
                                ship.component.push(asteroidGraphics);
                                ship.component.push(lancePhaserLinkComponent);
                            });
                        });
                    }

                    if(lanceNetworkEntity.getEntityId().startsWith(AssetIDGenerator.BULLET_PREFIX)){
                        let bullet = lanceNetworkEntity;
                        //create player ship
                        obj.onceComponentType("LancePhysic2DObject",(bodyA)=>{
                            let graphics = new BulletGraphics({
                                scene: this.scene,
                                opt: {}
                            },0,0);
                            let lancePhaserLinkComponent = this.lancePhaserLink.create(graphics, bodyA as LancePhysic2DObject);
                            bullet.component.push(graphics);
                            bullet.component.push(lancePhaserLinkComponent);
                        });
                    }
                }else{
                    console.warn("ignore double from server")//TODO how to manage this?
                }
            }
        });
    }

    connect() {
        return super.connect();
    }

    sendInput(input: string, inputOptions: any) {
        super.sendInput(input,inputOptions);
    }

}
