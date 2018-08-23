import {ShipGraphics} from "../graphics/ShipGraphics";
import {PlayerInputRule} from "../input/PlayerInputRule";
import {NetworkGameStates} from "../game/NetworkGameStates";
import TwoVector from 'lance-gg/es5/serialize/TwoVector';
import {Entity} from "../service/miniECS/Entity";
import LanceAsset from "../lance/shared/LancePhysic2DObject";

export class ShipFactory {
    public static readonly PREFIX:string = "ship";
    shipIds: {[id:string]:any} = {};//hashset

    constructor(public networkGameState: NetworkGameStates, public scene: Phaser.Scene) {
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
            position: new TwoVector((Math.random()*100)+20, (Math.random()*100)+20)
        },ShipFactory.PREFIX);
        this.checkAndAddShipId(lancePhysicNetComponent.assetId);
        let lancePhaserLinkComponent = this.networkGameState.lancePhaserLink.create(shipGraphics, lancePhysicNetComponent);
        let playerInputRule = new PlayerInputRule(this.networkGameState.keyMapper, lancePhysicNetComponent);
        ship.component.push(shipGraphics);
        ship.component.push(playerInputRule);
        ship.component.push(lancePhysicNetComponent);
        ship.component.push(lancePhaserLinkComponent);
        return ship;
    }
}