import {GameStates} from "../game/GameStates";
import TwoVector from 'lance-gg/es5/serialize/TwoVector';
import {Entity} from "../service/miniECS/Entity";
import LancePhysic2DObject from "asteroid-common/dist/lance/LancePhysic2DObject";
import {AsteroidGraphics} from "../graphics/AsteroidGraphics";
import {AssetIDGenerator} from "asteroid-common/dist/lance/AssetIDGenerator";
import {LancePhysicNetComponent} from "../lance/LancePhysicNetComponent";

export class AsteroidFactory {
    ids: {[id:string]:any} = {};//hashset

    constructor(public networkGameState: GameStates, public scene: Phaser.Scene) {
    }

    isValidNetBody(netBody:LancePhysic2DObject):boolean{
        return netBody.assetId.startsWith(AssetIDGenerator.ASTEROID_PREFIX);
    }
    checkAndAddId(id:string){
        if(!this.ids[id]) {
            this.ids[id] = true;
        }else{
            throw new Error();
        }
    }
    createFromNetwork(netBody:LancePhysic2DObject):Entity {
        if(!this.isValidNetBody(netBody)){
            throw new Error;
        }
        this.checkAndAddId(netBody.assetId);
        let lancePhysicNetComponent = this.networkGameState.lanceService.createFromNetwork(netBody);
        return this.internalCreateItem(lancePhysicNetComponent,0,0);
    }

    internalCreateItem(lancePhysicNetComponent:LancePhysicNetComponent,x:number,y:number){
        let item = this.networkGameState.miniECS.createNewEntity();
        let customData = lancePhysicNetComponent.body.getCustomData();
        let graphics = new AsteroidGraphics({
            scene: this.scene,
            opt: {}
        },customData.radius,customData.points);
        let lancePhaserLinkComponent = this.networkGameState.lancePhaserLink.create(graphics, lancePhysicNetComponent);
        item.component.push(graphics);
        item.component.push(lancePhysicNetComponent);
        item.component.push(lancePhaserLinkComponent);
        return item;
    }

    create(position:{x:number,y:number},parentVelocity:{x:number,y:number},sizeRadius:number):Entity {
        let lancePhysicNetComponent = this.networkGameState.lanceService.create({
            position: new TwoVector(position.x, position.y),
            velocity: new TwoVector(parentVelocity.x,parentVelocity.y),
            angle:0,//radian
            angleVelocity:0,
            physic:{
                body:{
                    mass: 0.1, damping: 0, angularDamping: 0
                },
                shape:{
                    type:"circle",
                    radius: sizeRadius,
                    collisionGroup: 1,
                    collisionMask: 1
                }
            }
        },AssetIDGenerator.ASTEROID_PREFIX);
        this.checkAndAddId(lancePhysicNetComponent.assetId);
        lancePhysicNetComponent.body.setCustomData({
            asteroidSizeOrder:0,
            asteroidSeed:0,
            points:[]
        });
        return this.internalCreateItem(lancePhysicNetComponent,position.x,position.y);
    }
}
