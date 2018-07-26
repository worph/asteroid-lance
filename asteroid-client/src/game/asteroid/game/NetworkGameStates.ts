import {Asset} from "../service/Asset";
import {Bullet} from "../objects/Bullet";
import {Ship} from "../objects/Ship";
import {Asteroid} from "../objects/Asteroid";
import NetworkGameManager from "./NetworkGameManager";
import NetworkAssets from "../service/NetworkAssets";

export class NetworkGameStates {

    /* networked items */
    public player: Ship;
    public otherPlayer: { [id: string]: Ship; };
    public asteroids: { [id: string]: Asteroid; };

    public networkAssetSynchronizer: NetworkAssets = new NetworkAssets();
    public broadcasterService: NetworkAssets = new NetworkAssets();
    public networkGameManager: NetworkGameManager = new NetworkGameManager();

    constructor(public scene:Phaser.Scene,public apiServerAdd:string,player:Ship,name:string){
        this.player = player;
        this.otherPlayer = {};
        this.asteroids = {};

        this.bootBroadcasterService(apiServerAdd);
        this.bootNetworkAssetSynchronizer(apiServerAdd);
        this.networkGameManager.start(apiServerAdd+"/asteroid",apiServerAdd, player.id,name);
    }


    createNetworkPayloadFromPlayer(player: Ship): any {
        return {
            id: player.id,
            x: player.x,
            y: player.y,
            r: player.rotation
        }
    }

    updatePlayerFromNetworkPayload(player: Ship, payload: any): void {
        player.setPosition(payload.x, payload.y);
        player.setRotation(payload.r);
    }

    createNetworkPayloadFromBullet(bullet: Bullet): any {
        return {
            id: bullet.id,
            pid:bullet.parentShipId,
            x: bullet.x,
            y: bullet.y,
            vx : bullet.velocity.x,
            vy : bullet.velocity.y,
            r: bullet.rotation,
        }
    }

    updateBulletFromNetworkPayload(bullet: Bullet, payload: any): void {
        bullet.setPosition(payload.x, payload.y);
        bullet.velocity.x = payload.vx;
        bullet.velocity.y = payload.vy;
        bullet.setRotation(payload.r);
    }

    bootBroadcasterService(apiServerAdd: any) {
        this.broadcasterService.onAssetCreatedCallback(asset => {
            if (asset.id.startsWith("player/")) {
                if (this.player.id !== asset.id) {
                    console.log("network player added : " + asset.id);
                    this.otherPlayer[asset.id] = (new Ship({scene: this.scene, opt: {}}, asset.id, false));
                    this.updatePlayerFromNetworkPayload(this.otherPlayer[asset.id], asset);
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
                        this.updateBulletFromNetworkPayload(ship.getBullets()[asset.id], asset);//TODO refactoring deeded djv
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
                    this.updatePlayerFromNetworkPayload(this.otherPlayer[asset.id], asset);
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
        this.broadcasterService.createAsset(this.createNetworkPayloadFromPlayer(this.player));
    }

    createNetworkPayloadFromAsteroid(asteroid: Asteroid): Asset {
        //let body = asteroid.getBody();
        let body:any = asteroid;
        return {
            id: asteroid.id,
            value: [
                body.x,//0
                body.y,//1
                body.rotation,//2
                body.body.velocity.x,//3
                body.body.velocity.y,//4
                0,//5
                0,//6
                0,//7
                body.body.angularVelocity,//8
                asteroid.getSize()]//9
        }
    }

    updateAsteroidFromNetworkPayload(asteroid: Asteroid, payload: Asset): void {
        if(asteroid==undefined){
            console.error("undefined asteroid")
            return;
        }
        //let body = asteroid.getBody();
        let body:any = asteroid;
        body.setPosition(payload.value[0],payload.value[1]);
        body.setRotation(payload.value[2]);
        body.setVelocity(payload.value[3], payload.value[4]);
        //body.setAcceleration(payload.value[5], payload.value[6]);
        //body.setAngularAcceleration(payload.value[7]);
        body.setAngularVelocity(payload.value[8]);
    }

    bootNetworkAssetSynchronizer(apiServerAdd: string) {
        this.networkAssetSynchronizer.onAssetCreatedCallback(asset => {
            if (asset.id.startsWith("asteroid/")) {
                console.log("network asteroid created : " + asset.id);
                let asteroid = new Asteroid({
                    scene: this.scene,
                    opt:{}
                }, asset.id, 0, 0, asset.value[9]);
                this.asteroids[asset.id] = asteroid;
                this.updateAsteroidFromNetworkPayload(this.asteroids[asset.id], asset);
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
                this.updateAsteroidFromNetworkPayload(this.asteroids[asset.id], asset);
            }
        });
        this.networkAssetSynchronizer.start(apiServerAdd+"/distributed");
    }
}