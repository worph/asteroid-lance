import {Ship} from "../objects/Ship";
import {phaserReactService} from "../../phaser/PhaserReactService";
import {NetworkGameStates} from "../game/NetworkGameStates";
import {idService} from "../service/IDService";
import {Asteroid} from "../objects/Asteroid";
import {Bullet} from "../objects/Bullet";
import {Identified} from "../service/miniECS/Identified";
import {ShipGraphics} from "../graphics/ShipGraphics";
import {LancePhysicNetComponent} from "../lance/shared/LancePhysicNetComponent";
import TwoVector from 'lance-gg/es5/serialize/TwoVector';

declare var window: any;

export class GameScene extends Phaser.Scene {
    private fps: Phaser.GameObjects.Text;
    private networkGameState: NetworkGameStates;

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
        let parameters = phaserReactService.parameters;
        console.log("parameters : ", parameters);
        let apiServerAdd = parameters.apiServer;

        phaserReactService.onResizeEvent((width, height) => {
            this.cameras.main.setSize(width, height);
        });

        /*{
            //TODO use process input
            ///register input
            //https://hammerjs.github.io/
            let fc = (pointer) => {
                let worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
                let x2 = worldPoint.x;
                let y2 = worldPoint.y;
                let x1 = this.networkGameState.toFollow.x;
                let y1 = this.networkGameState.toFollow.y;

                //let x1 = (this.scene.systems.canvas.width/2) - this.cameras.main.followOffset.x;
                //let y1 = (this.scene.systems.canvas.height/2) - this.cameras.main.getfollowOffset.y;
                //console.log(x2+"/"+y2+"/"+x1+"/"+y1)
                let deltaX = x2 - x1;
                let deltaY = y2 - y1;
                let rad = Math.atan2(deltaY, deltaX); // In radians
                this.networkGameState.toFollow.rotation = rad + (Math.PI / 2.0);
            };
            this.input.on('pointerdown', () => {
                this.networkGameState.toFollow.setBoost(true);
                this.networkGameState.toFollow.shoot();
            }, this);
            this.input.on('pointerup', () => {
                this.networkGameState.toFollow.setBoost(false);
            }, this);
            this.input.on('pointermove', fc, this);
        }*/

        {
            //create graphic
            let worldBoundX = 1920;
            let worldBoundY = 1920;//TODO use server data
            let sprite = this.add.sprite(worldBoundX / 2, worldBoundY / 2, 'background');
            sprite.setScale(worldBoundX / sprite.width, worldBoundY / sprite.height);
            this.cameras.main.setBounds(0, 0, worldBoundX, worldBoundY);
        }

        this.networkGameState = new NetworkGameStates(this, apiServerAdd);
        setTimeout(()=>{
            {
                //create player ship
                let ship = this.networkGameState.miniECS.createNewEntity();
                ship.component.push(new ShipGraphics({
                    scene: this,
                    opt: {}
                }));
                ship.component.push(this.networkGameState.lanceFactory.create({
                    position: new TwoVector(10, 10)
                }));
            }
        },1000)
        /*{
            //create camera
            this.cameras.main.startFollow(this.networkGameState.toFollow, true, 0.05, 0.05);    //  Set the camera bounds to be the size of the image
            this.fps = this.add.text(
                this.sys.canvas.width / 2,
                40,
                "FPS: 60.00",
                {fontSize: '32px', fill: '#FFFFFF'}
            );
        }*/
    }

    update(): void {
        //this.fps.setText("FPS: " + this.sys.game.loop.actualFps.toFixed(2));
    }

}
