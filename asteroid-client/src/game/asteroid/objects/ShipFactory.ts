import {ShipGraphics} from "../graphics/ShipGraphics";
import {PlayerInputRule} from "../input/PlayerInputRule";
import {GameStates} from "../game/GameStates";
import TwoVector from 'lance-gg/es5/serialize/TwoVector';
import {Entity} from "../service/miniECS/Entity";
import LanceAsset from "asteroid-common/dist/lance/LancePhysic2DObject";
import {BulletFactory} from "./BulletFactory";

export class ShipFactory {
    public static readonly PREFIX:string = "ship";
    shipIds: {[id:string]:any} = {};//hashset
    static readonly CONST:{
        SIZE_RADIUS:number
    } = {
        SIZE_RADIUS: 20,
    };

    constructor(public networkGameState: GameStates, public scene: Phaser.Scene, private bulletFactory:BulletFactory) {
    }

    isValidNetBody(netBody:LanceAsset):boolean{
        return netBody.assetId.startsWith(ShipFactory.PREFIX);
    }
    checkAndAddShipId(id:string){
        if(!this.shipIds[id]) {
            this.shipIds[id] = true;
        }else{
            throw new Error();
        }
    }
    createFromNetwork(netBody:LanceAsset):Entity {
        if(!this.isValidNetBody(netBody)){
            throw new Error;
        }
        this.checkAndAddShipId(netBody.assetId);
        //create player ship
        let ship = this.networkGameState.miniECS.createNewEntity();
        let shipGraphics = new ShipGraphics({
            scene: this.scene,
            opt: {}
        });
        let lancePhysicNetComponent = this.networkGameState.lanceService.createFromNetwork(netBody);
        let lancePhaserLinkComponent = this.networkGameState.lancePhaserLink.create(shipGraphics, lancePhysicNetComponent);
        ship.component.push(shipGraphics);
        ship.component.push(lancePhysicNetComponent);
        ship.component.push(lancePhaserLinkComponent);
        return ship;
    }

    create():Entity {
        //create player ship
        let ship = this.networkGameState.miniECS.createNewEntity();
        let shipGraphics = new ShipGraphics({
            scene: this.scene,
            opt: {}
        });
        let lancePhysicNetComponent = this.networkGameState.lanceService.create({
            position: new TwoVector((Math.random()*100)+20, (Math.random()*100)+20),
            velocity: new TwoVector(0, 0),
            angle:0,//rad
            angleVelocity:0,
            physic:{
                body:{
                    mass: 0.1, damping: 0, angularDamping: 0
                },
                shape:{
                    type:"circle",
                    radius: ShipFactory.CONST.SIZE_RADIUS,
                    collisionGroup: 1,
                    collisionMask: 1
                }
            }
        },ShipFactory.PREFIX);
        this.checkAndAddShipId(lancePhysicNetComponent.assetId);
        let lancePhaserLinkComponent = this.networkGameState.lancePhaserLink.create(shipGraphics, lancePhysicNetComponent);
        let playerInputRule = new PlayerInputRule(this.networkGameState.keyMapper, lancePhysicNetComponent,this.bulletFactory);
        ship.component.push(shipGraphics);
        ship.component.push(playerInputRule);
        ship.component.push(lancePhysicNetComponent);
        ship.component.push(lancePhaserLinkComponent);
        return ship;
    }
}
