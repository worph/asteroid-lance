import {Bullet} from "../objects/Bullet";
import {Ship} from "../objects/Ship";
import {Asteroid} from "../objects/Asteroid";
import NetworkGameManager from "./NetworkGameManager";
import NetworkAssets from "../service/network/NetworkAssets";
import {AsteroidPayloadConverter} from "./converters/AsteroidPayloadConverter";
import {ShipPayloadConverter} from "./converters/ShipPayloadConverter";
import {BulletPayloadConverter} from "./converters/BulletPayloadConverter";
import {AssetConverter, IdentifiedConverter} from "../service/network/AssetConverter";
import {ASSET_ACTION, Identified} from "../service/network/Asset";

export class NetworkGameStates {

    public networkGameManager: NetworkGameManager = new NetworkGameManager();

    /* networked items */
    public player: Ship;
    public otherPlayer: { [id: string]: Ship; };
    public asteroids: { [id: string]: Asteroid; };

    public networkAssetSynchronizer: NetworkAssets = new NetworkAssets();
    public broadcasterService: NetworkAssets = new NetworkAssets();

    public asteroidPayloadConverter:AsteroidPayloadConverter = new AsteroidPayloadConverter();
    public shipPayloadConverter:ShipPayloadConverter = new ShipPayloadConverter();
    public bulletPayloadConverter:BulletPayloadConverter = new BulletPayloadConverter();

    constructor(public scene:Phaser.Scene,public apiServerAdd:string,player:Ship,name:string){
        this.player = player;
        this.otherPlayer = {};
        this.asteroids = {};

        this.bootBroadcasterService(apiServerAdd);
        this.bootNetworkAssetSynchronizer(apiServerAdd);
        this.networkGameManager.start(apiServerAdd+"/asteroid",apiServerAdd, player.id,name);
    }

    bootBroadcasterService(apiServerAdd: any) {
        this.broadcasterService.onAssetCreatedCallback(asset => {
            if (asset.id.startsWith("player/")) {
                if (this.player.id !== asset.id) {
                    console.log("network player added : " + asset.id);
                    this.otherPlayer[asset.id] = (new Ship({scene: this.scene, opt: {}}, asset.id, false));
                    this.shipPayloadConverter.updateItemFromNetworkPayload(this.otherPlayer[asset.id], asset);
                } else {
                    console.error("local player added");
                }
            }
            if (asset.id.startsWith("bullet/")) {
                let id = asset.pid;
                console.log("bullet : " + id);
                if (this.player.id !== id) {
                    let ship = this.otherPlayer[id];
                    if(ship==undefined){
                        console.error("ship undefined");
                    }else {
                        ship.createBullet(asset.id, asset.x, asset.y, asset.r);
                        this.bulletPayloadConverter.updateItemFromNetworkPayload(ship.getBullets()[asset.id], asset);//TODO refactoring deeded djv
                    }
                } else {
                    console.error("local player updated");
                }
            }
        });
        this.broadcasterService.onAssetDeletedCallback(asset => {
            if (asset.id.startsWith("player/")) {
                console.log("network player removed : " + asset.id);
                this.otherPlayer[asset.id].destroy();
                delete this.otherPlayer[asset.id];
            }
            if (asset.id.startsWith("bullet/")) {
                let id = asset.pid;
                if (this.player.id !== id) {
                    let ship = this.otherPlayer[id];
                    ship.deleteBullet(asset.id);
                } else {
                    console.error("local player updated");
                }
            }
        });
        this.broadcasterService.onAssetUpdatedCallback(asset => {
            if (asset.id.startsWith("player/")) {
                if (this.player.id !== asset.id) {
                    this.shipPayloadConverter.updateItemFromNetworkPayload(this.otherPlayer[asset.id], asset);
                }
                //we also receive position of local player as percieved by the other => but we don't care
            }
            if (asset.id.startsWith("bullet/")) {
                console.error("unsupported")
                //too much network load => disabled
                /*let id = asset.pid;
                if (this.player.id !== id) {
                    let ship = this.otherPlayer[id];
                    this.updateBulletFromNetworkPayload(ship.getBullets()[asset.id], asset);//TODO refactoring deeded djv
                } else {
                    console.error("local player updated");
                }*/
            }
        });
        this.broadcasterService.start(apiServerAdd+"/broadcaster");
        this.broadcasterService.createAsset(this.shipPayloadConverter.makeNetworkPayloadFromItem(this.player));
    }

    bootNetworkAssetSynchronizer(apiServerAdd: string) {
        this.asteroidPayloadConverter.scene = this.scene;
        //register callbacks
        this.networkAssetSynchronizer.onAssetCreatedCallback(asset => {
            if (asset.id.startsWith("asteroid/")) {
                console.log("network asteroid created : " , asset);
                let asteroid = this.asteroidPayloadConverter.createItemFromNetworkPayload(asset);
                this.asteroids[asset.id] = asteroid;
            }
        });
        this.networkAssetSynchronizer.onAssetDeletedCallback(asset => {
            if (asset.id.startsWith("asteroid/")) {
                console.log("network asteroid removed : " + asset.id);
                this.asteroids[asset.id].destroy();
                delete this.asteroids[asset.id];
            }
        });
        this.networkAssetSynchronizer.onAssetUpdatedCallback(asset => {
            if (asset.id.startsWith("asteroid/")) {
                this.asteroidPayloadConverter.updateItemFromNetworkPayload(this.asteroids[asset.id], asset);
            }
        });
        //start service
        this.networkAssetSynchronizer.start(apiServerAdd+"/distributed");
    }
}