import {Ship} from "../objects/Ship";
import {phaserReactService} from "../../phaser/PhaserReactService";
import {NetworkGameStates} from "../game/NetworkGameStates";
import {PhysicService} from "../service/PhysicService";
import {idService} from "../service/IDService";
import {Identified} from "../service/network/Asset";
import {Asteroid} from "../objects/Asteroid";
import {Bullet} from "../objects/Bullet";

declare var window: any;

export class GameScene extends Phaser.Scene {
    private fps: Phaser.GameObjects.Text;
    private networkGameState: NetworkGameStates;
    private physicService: PhysicService;

    constructor() {
        super({
            key: "GameScene"
        });
    }

    preload(): void {
        //this.load.image('background','/assets/tests/debug-grid-1920x1920.png');
        this.load.image('background', '/assets/astronomy-astrophotography-black-207529.jpg');
    }

    create(): void {
        this.physicService = new PhysicService(this.matter);
        let parameters = phaserReactService.parameters;
        console.log("parameters : ", parameters);
        let apiServerAdd = parameters.apiServer;

        phaserReactService.onResizeEvent((width, height) => {
            this.cameras.main.setSize(width,height);
        });

        {
            ///register input
            //https://hammerjs.github.io/
            let fc = (pointer) => {
                let worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
                let x2 = worldPoint.x;
                let y2 = worldPoint.y;
                let x1 = this.networkGameState.player.x;
                let y1 = this.networkGameState.player.y;

                //let x1 = (this.scene.systems.canvas.width/2) - this.cameras.main.followOffset.x;
                //let y1 = (this.scene.systems.canvas.height/2) - this.cameras.main.getfollowOffset.y;
                //console.log(x2+"/"+y2+"/"+x1+"/"+y1)
                let deltaX = x2 - x1;
                let deltaY = y2 - y1;
                let rad = Math.atan2(deltaY, deltaX); // In radians
                this.networkGameState.player.rotation = rad + (Math.PI / 2.0);
            };
            this.input.on('pointerdown', () => {
                this.networkGameState.player.setBoost(true);
                this.networkGameState.player.shoot();
            }, this);
            this.input.on('pointerup', () => {
                this.networkGameState.player.setBoost(false);
            }, this);
            this.input.on('pointermove', fc, this);
        }
        {
            //create background
            let worldBoundX = 1920;
            let worldBoundY = 1920;
            let sprite = this.add.sprite(worldBoundX / 2, worldBoundY / 2, 'background');
            sprite.setScale(worldBoundX / sprite.width, worldBoundY / sprite.height);
            this.matter.world.setBounds(0, 0, worldBoundX, worldBoundY);
            this.cameras.main.setBounds(0, 0, worldBoundX, worldBoundY);
        }

        this.networkGameState = new NetworkGameStates(this, apiServerAdd, new Ship({
            scene: this,
            opt: {}
        }, "player/" + idService.makeid(64), true), parameters.name);

        if(false) {
            this.physicService.eventEmitter.on(this.networkGameState.player.id, (body: Identified) => {
                //you touch something (except bullet) => you die
                if (!body.id.startsWith(Bullet.ID_PREFIX)) {
                    this.scene.restart();
                    this.networkGameState.networkGameManager.notifyEndGame(this.networkGameState.player.id);
                }
            });
        }

        this.networkGameState.player.onBulletCreated(id => {
            let bullet = this.networkGameState.player.getBullets()[id];
            this.networkGameState.createOrUpdateAsset(bullet);
            let handle = (body: Identified) => {
                if (body.id !== this.networkGameState.player.id) {
                    if (body.id.startsWith(Asteroid.ID_PREFIX)) {
                        //delete asteroid
                        let asteroid = body as Asteroid;
                        this.networkGameState.deleteAsset(asteroid);
                        this.networkGameState.asteroids[asteroid.id].destroy();
                        delete this.networkGameState.asteroids[asteroid.id];
                        this.networkGameState.networkGameManager.updateScore(asteroid.id, this.networkGameState.player.id, asteroid.getSize());
                    }
                    //delete bullet
                    this.networkGameState.deleteAsset(bullet);
                    this.networkGameState.player.getBullets()[id].destroy();
                    delete this.networkGameState.player.getBullets()[id];
                    this.physicService.eventEmitter.off(bullet.id, handle);
                }
            };
            this.physicService.eventEmitter.on(bullet.id, handle);
        });
        this.cameras.main.startFollow(this.networkGameState.player,true, 0.05, 0.05);    //  Set the camera bounds to be the size of the image
        this.fps = this.add.text(
            this.sys.canvas.width / 2,
            40,
            "FPS: 60.00",
            {fontSize: '32px', fill: '#FFFFFF'}
        );

        let body = this.matter.add.gameObject(this.fps, {});
    }

    update(): void {
        this.physicService.update();//applies all collision event received
        this.networkGameState.netWorkAssetManager.update();//applies network event
        this.fps.setText("FPS: " + this.sys.game.loop.actualFps.toFixed(2));
        let ship = this.networkGameState.player;
        ship.update();
        this.networkGameState.updateAsset(ship);
        // update distant player bullet
        Object.keys(this.networkGameState.otherPlayer).forEach(key => {
            this.networkGameState.otherPlayer[key].updateBullets();
        });

        /*// check collision between asteroids and bullets
        Object.keys(this.asteroids).forEach((key) => {
            let asteroid = this.asteroids[key];
            this.networkAssetSynchronizer.updateAsset(this.makeNetworkPayloadFromItem(asteroid));
            Object.keys(ship.getBullets()).forEach(bkey => {
                let bullet = ship.getBullets()[bkey];
                if(asteroid.getBody()!=undefined) {
                    if (Phaser.Geom.Intersects.RectangleToRectangle(bullet.getBody(), asteroid.getBody())) {
                        this.networkAssetSynchronizer.deleteAsset(this.makeNetworkPayloadFromItem(asteroid));
                        this.asteroids[asteroid.id].destroy();
                        delete this.asteroids[asteroid.id];
                        this.networkGameManager.updateScore(asteroid.id,this.player.id,asteroid.getSize());
                    }
                }
            });
            asteroid.update();
        });*/

        // check collision between asteroids and ship
        /*Object.keys(this.asteroids).forEach((key) => {
            let asteroid = this.asteroids[key];
            if (Phaser.Geom.Intersects.RectangleToRectangle(asteroid.getBody(), ship.getBody())) {
                //ship.setActive(false);
                this.gotHit = true;
            }
        });*/
    }

}
