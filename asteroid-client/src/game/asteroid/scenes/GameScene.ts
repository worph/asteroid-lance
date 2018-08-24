import {phaserReactService} from "../../phaser/PhaserReactService";
import {GameStates} from "../game/GameStates";
import {PhaserGraphicComponent} from "../graphics/PhaserGraphicComponent";

declare var window: any;

export class GameScene extends Phaser.Scene {
    private fps: Phaser.GameObjects.Text;
    private gameState: GameStates;

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
        let playerName = parameters.name;

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
        {
            // display FPS
            this.fps = this.add.text(
                this.sys.canvas.width / 2,
                40,
                "FPS: 60.00",
                {fontSize: '32px', fill: '#FFFFFF'}
            );
        }
        {
            // setup game states
            this.gameState = new GameStates(this, apiServerAdd);
            this.gameState.start().then(() => {
                let entity = this.gameState.shipFactory.create();
                //create camera
                let gcomp: PhaserGraphicComponent = entity.getComponentByType(PhaserGraphicComponent) as PhaserGraphicComponent;
                this.cameras.main.startFollow(gcomp, true, 0.05, 0.05);    //  Set the camera bounds to be the size of the image
            });
        }

    }

    update(): void {
        this.gameState.update();
        this.fps.setText("FPS: " + this.sys.game.loop.actualFps.toFixed(2));
    }

}
