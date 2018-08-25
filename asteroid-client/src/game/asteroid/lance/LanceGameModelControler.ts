
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
import {MiniECS} from "asteroid-common/dist/miniECS/MiniECS";

export interface ObjectCreationData{
    assetId:string,
    props:any
}

export default class LanceGameModelControler extends ClientEngine {

    constructor(public gameEngine, options,private scene: Phaser.Scene,private lancePhaserLink: LancePhaserLink,private keyMapper: KeyMapper, private ecs: MiniECS) {
        super(gameEngine, options, LanceRenderer);
    }

    start() {
        super.start();
        this.gameEngine.on("objectAdded",(obj:any)=>{
            if("getComponentType" in obj){
                let lanceNetworkComponent:LanceNetworkComponent = obj as LanceNetworkComponent;
                let parentEntityId = lanceNetworkComponent.getParentEntityId();
                let entity = this.ecs.getEntity(parentEntityId);
                entity.addComponent(lanceNetworkComponent);
            }
            if(obj instanceof LanceNetworkEntity){
                let lanceNetworkEntity:LanceNetworkEntity = obj as LanceNetworkEntity;
                this.ecs.addEntity(lanceNetworkEntity);
                if(lanceNetworkEntity.getEntityId().startsWith(AssetIDGenerator.SHIP_PREFIX)){
                    let ship = lanceNetworkEntity;
                    //create player ship
                    let shipGraphics = new ShipGraphics({
                        scene: this.scene,
                        opt: {}
                    });
                    obj.onceComponentType("LancePhysic2DObject",(bodyA)=>{
                        let body = bodyA as LancePhysic2DObject;
                        let lancePhaserLinkComponent = this.lancePhaserLink.create(shipGraphics,body );
                        let playerInputRule = new PlayerInputRule(this.keyMapper,body.id,this);
                        ship.component.push(shipGraphics);
                        ship.component.push(playerInputRule);
                        ship.component.push(lancePhaserLinkComponent);
                    });
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
