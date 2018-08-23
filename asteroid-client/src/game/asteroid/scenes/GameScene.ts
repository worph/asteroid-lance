import {phaserReactService} from "../../phaser/PhaserReactService";
import {NetworkGameStates} from "../game/NetworkGameStates";
import {ShipGraphics} from "../graphics/ShipGraphics";
import TwoVector from 'lance-gg/es5/serialize/TwoVector';
import {PlayerInputRule} from "../input/PlayerInputRule";

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
            let entity = this.networkGameState.shipFactory.create();
        },1000)
        /*{
            //create camera
            this.cameras.main.startFollow(this.networkGameState.toFollow, true, 0.05, 0.05);    //  Set the camera bounds to be the size of the image
        }*/
        this.fps = this.add.text(
            this.sys.canvas.width / 2,
            40,
            "FPS: 60.00",
            {fontSize: '32px', fill: '#FFFFFF'}
        );
    }

    update(): void {
        this.networkGameState.update();
        this.fps.setText("FPS: " + this.sys.game.loop.actualFps.toFixed(2));
    }

}
