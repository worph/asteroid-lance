import {PlayerInputRule} from "../input/PlayerInputRule";
import {GameStates} from "../game/GameStates";
import TwoVector from 'lance-gg/es5/serialize/TwoVector';
import {Entity} from "../service/miniECS/Entity";
import LanceAsset from "../lance/shared/LancePhysic2DObject";
import {BulletGraphics} from "../graphics/BulletGraphics";
import {ShipGraphics} from "../graphics/ShipGraphics";
import {ShipFactory} from "./ShipFactory";

export class BulletFactory {
    public static readonly PREFIX:string = "bullet";
    ids: {[id:string]:any} = {};//hashset
    static readonly CONST:{
        SIZE_RADIUS:number
    } = {
        SIZE_RADIUS: 3,
    };

    constructor(public networkGameState: GameStates, public scene: Phaser.Scene) {
    }

    isValidNetBody(netBody:LanceAsset):boolean{
        return netBody.assetId.startsWith(BulletFactory.PREFIX);
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
        return this.internalCreateItem(lancePhysicNetComponent,0,0);
    }

    internalCreateItem(lancePhysicNetComponent,x:number,y:number){
        let item = this.networkGameState.miniECS.createNewEntity();
        let graphics = new BulletGraphics({
            scene: this.scene,
            opt: {}
        },x,y);
        let lancePhaserLinkComponent = this.networkGameState.lancePhaserLink.create(graphics, lancePhysicNetComponent);
        item.component.push(graphics);
        item.component.push(lancePhysicNetComponent);
        item.component.push(lancePhaserLinkComponent);
        return item;
    }

    create(position:{x:number,y:number},rotationRad:number,parentVelocity:{x:number,y:number}):Entity {
        //rotation is in degree
        // create the direction in the correct direction
        let direction = new Phaser.Math.Vector2(
            Math.cos(rotationRad),
            Math.sin(rotationRad)
        );
        let positionUpdate = new Phaser.Math.Vector2(direction.x,direction.y);
        positionUpdate.scale(ShipFactory.CONST.SIZE_RADIUS);//just ahead of the ship
        let velocity = new Phaser.Math.Vector2(direction.x,direction.y);
        velocity.scale(500);
        let lancePhysicNetComponent = this.networkGameState.lanceService.create({
            position: new TwoVector(position.x+positionUpdate.x, position.y+positionUpdate.y),
            velocity: new TwoVector(parentVelocity.x+velocity.x,parentVelocity.y+velocity.y),
            angle:rotationRad,//radian
            angleVelocity:0,
            physic:{
                body:{
                    mass: 0.1, damping: 0, angularDamping: 0
                },
                shape:{
                    type:"circle",
                    radius: BulletFactory.CONST.SIZE_RADIUS,
                    collisionGroup: 1,
                    collisionMask: 1
                }
            }
        },BulletFactory.PREFIX);
        this.checkAndAddId(lancePhysicNetComponent.assetId);
        return this.internalCreateItem(lancePhysicNetComponent,position.x+positionUpdate.x,position.y+positionUpdate.y);
    }
}
