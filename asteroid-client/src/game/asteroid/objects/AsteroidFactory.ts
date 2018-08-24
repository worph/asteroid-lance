import {NetworkGameStates} from "../game/NetworkGameStates";
import TwoVector from 'lance-gg/es5/serialize/TwoVector';
import {Entity} from "../service/miniECS/Entity";
import LanceAsset from "../lance/shared/LancePhysic2DObject";
import {AsteroidGraphics} from "../graphics/AsteroidGraphics";

export class AsteroidFactory {
    public static readonly PREFIX:string = "asteroid";
    ids: {[id:string]:any} = {};//hashset

    constructor(public networkGameState: NetworkGameStates, public scene: Phaser.Scene) {
    }

    isValidNetBody(netBody:LanceAsset):boolean{
        return netBody.assetId.startsWith(AsteroidFactory.PREFIX);
    }
    checkAndAddId(id:string){
        if(!this.ids[id]) {
            this.ids[id] = true;
        }else{
            throw new Error();
        }
    }
    createFromNetwork(netBody:LanceAsset):Entity {
        if(!this.isValidNetBody(netBody)){
            throw new Error;
        }
        this.checkAndAddId(netBody.assetId);
        let lancePhysicNetComponent = this.networkGameState.lanceService.createFromNetwork(netBody);
        return this.internalCreateItem(lancePhysicNetComponent,0,0, );
    }

    internalCreateItem(lancePhysicNetComponent,x:number,y:number,sizeRadius:number){
        let item = this.networkGameState.miniECS.createNewEntity();
        let graphics = new AsteroidGraphics({
            scene: this.scene,
            opt: {}
        },sizeRadius);
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
        },AsteroidFactory.PREFIX);
        this.checkAndAddId(lancePhysicNetComponent.assetId);
        return this.internalCreateItem(lancePhysicNetComponent,position.x,position.y,sizeRadius);
    }
}
