import {EventEmitter} from 'eventemitter3';

export class KeyMapper {
    public action = new EventEmitter<string>();

    private shootKey: Phaser.Input.Keyboard.Key;
    private cursors: CursorKeys;
    public static readonly SHOOT = "SHOOT";
    public static readonly BOOST = "BOOST";
    public static readonly LEFT = "LEFT";
    public static readonly RIGHT = "RIGHT";

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


    constructor(public currentScene:any){
        // input
        this.cursors = this.currentScene.input.keyboard.createCursorKeys();
        this.shootKey = this.currentScene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
    }

    private handleInput(): void {
        if (this.cursors.up.isDown) {
            this.action.emit(KeyMapper.BOOST,"ok");
        }
        //TODO https://labs.phaser.io/edit.html?src=src\physics\matterjs\rotate%20body%20with%20cursors.js
        if (this.cursors.right.isDown) {
            this.action.emit(KeyMapper.RIGHT,"ok");
        } else if (this.cursors.left.isDown) {
            this.action.emit(KeyMapper.LEFT,"ok");
        }

        if (this.shootKey.isDown) {
            this.action.emit(KeyMapper.SHOOT,"ok");
        }
    }

    update(){
        this.handleInput();
    }
}