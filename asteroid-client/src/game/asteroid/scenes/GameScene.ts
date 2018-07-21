import {Asteroid} from "../objects/Asteroid";
import {Bullet} from "../objects/Bullet";
import {Ship} from "../objects/Ship";
import {CONST} from "../const/const";
import NetworkAssets from "../service/NetworkAssets";
import NetworkGameManager from "../service/NetworkGameManager";
import {Asset} from "../service/Asset";
import {game} from "../game";

export class GameScene extends Phaser.Scene {
    private player: Ship;
    private otherPlayer: { [id: string]: Ship; };
    private asteroids: { [id: string]: Asteroid; };
    private score: number;
    private bitmapTexts: Phaser.GameObjects.Text[];
    private gotHit: boolean;
    private networkAssetSynchronizer: NetworkAssets = new NetworkAssets();
    private broadcasterService: NetworkAssets = new NetworkAssets();
    private networkGameManager: NetworkGameManager = new NetworkGameManager();
    private socket: any;

    constructor() {
        super({
            key: "GameScene"
        });
    }

    makeid(length: number) {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
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

    bootBroadcasterService() {
        this.broadcasterService.onAssetCreatedCallback(asset => {
            if (asset.id.startsWith("player/")) {
                if (this.player.id !== asset.id) {
                    console.log("network player added : " + asset.id);
                    this.otherPlayer[asset.id] = (new Ship({scene: this, opt: {}}, asset.id, false));
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
        this.broadcasterService.start("http://127.0.0.1:8085/broadcaster");
        this.broadcasterService.createAsset(this.createNetworkPayloadFromPlayer(this.player));
    }

    createNetworkPayloadFromAsteroid(asteroid: Asteroid): Asset {
        return {
            id: asteroid.id,
            value: [
                asteroid.x,//0
                asteroid.y,//1
                asteroid.rotation,//2
                asteroid.getBody().velocity.x,//3
                asteroid.getBody().velocity.y,//4
                asteroid.getBody().acceleration.x,//5
                asteroid.getBody().acceleration.y,//6
                asteroid.getBody().angularAcceleration,//7
                asteroid.getBody().angularVelocity,//8
                asteroid.getSize()]//9
        }
    }

    updateAsteroidFromNetworkPayload(asteroid: Asteroid, payload: Asset): void {
        asteroid.x = payload.value[0];
        asteroid.y = payload.value[1];
        asteroid.rotation = (payload.value[2]);//why no physic for this
        asteroid.getBody().setVelocity(payload.value[3], payload.value[4]);
        asteroid.getBody().setAcceleration(payload.value[5], payload.value[6]);
        asteroid.getBody().setAngularAcceleration(payload.value[7]);
        asteroid.getBody().setAngularVelocity(payload.value[8]);
    }

    bootNetworkAssetSynchronizer() {

        {
            this.networkAssetSynchronizer.onAssetCreatedCallback(asset => {
                if (asset.id.startsWith("asteroid/")) {
                    console.log("network asteroid created : " + asset.id);
                    let asteroid = new Asteroid({
                        scene: this, x: 0, y: 0,
                        size: asset.value[9]
                    }, asset.id);
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
            this.networkAssetSynchronizer.start("http://127.0.0.1:8085/distributed");
        }
    }

    create(): void {
        let worldBoundX = 1920;
        let worldBoundY = 1920;
        this.add.sprite(worldBoundX/2, worldBoundY/2, 'background');
        this.physics.world.setBounds(0,0,worldBoundX,worldBoundY,true,true,true,true);
        let currentPlayerId = "player/" + this.makeid(64);
        this.player = new Ship({scene: this, opt: {}}, currentPlayerId, true);
        this.player.onBulletCreated(id => {
            this.broadcasterService.createOrUpdateAsset(this.createNetworkPayloadFromBullet(this.player.getBullets()[id]));
        });
        this.cameras.main.startFollow(this.player);    //  Set the camera bounds to be the size of the image
        this.cameras.main.setBounds(0, 0, worldBoundX, worldBoundY);
        this.otherPlayer = {};
        this.asteroids = {};
        this.score = 0;
        this.bitmapTexts = [];
        this.bitmapTexts.push(
            this.add.text(
                this.sys.canvas.width / 2,
                40,
                "" + this.score,
                {fontSize: '32px', fill: '#FFFFFF'}
            )
        );
        this.gotHit = false;
        this.bootBroadcasterService();
        this.bootNetworkAssetSynchronizer();
        {
            this.networkGameManager.start("http://127.0.0.1:8085/asteroid", currentPlayerId);
        }
    }

    update(): void {
        let ship = this.player;
        ship.update();
        this.broadcasterService.updateAsset(this.createNetworkPayloadFromPlayer(ship));
        this.broadcasterService.setPause(true);
        this.networkAssetSynchronizer.setPause(true);
        // update distant player bullet
        Object.keys(this.otherPlayer).forEach(key => {
            this.otherPlayer[key].updateBullets();
        });

        // check collision between asteroids and bullets
        Object.keys(this.asteroids).forEach((key) => {
            let asteroid = this.asteroids[key];
            this.networkAssetSynchronizer.updateAsset(this.createNetworkPayloadFromAsteroid(asteroid));
            Object.keys(ship.getBullets()).forEach(bkey => {
                let bullet = ship.getBullets()[bkey];
                if(asteroid.getBody()!=undefined) {
                    if (Phaser.Geom.Intersects.RectangleToRectangle(bullet.getBody(), asteroid.getBody())) {
                        this.networkAssetSynchronizer.deleteAsset(this.createNetworkPayloadFromAsteroid(asteroid));
                        this.asteroids[asteroid.id].destroy();
                        delete this.asteroids[asteroid.id];
                        this.networkGameManager.updateScore(asteroid.id,this.player.id,asteroid.getSize());
                    }
                }
            });
            asteroid.update();
        });

        // check collision between asteroids and ship
        Object.keys(this.asteroids).forEach((key) => {
            let asteroid = this.asteroids[key];
            if (Phaser.Geom.Intersects.RectangleToRectangle(asteroid.getBody(), ship.getBody())) {
                //ship.setActive(false);
                this.gotHit = true;
            }
        });
        this.broadcasterService.setPause(false);
        this.networkAssetSynchronizer.setPause(false);
    }

}
