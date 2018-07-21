"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("../const/const");
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: "MainMenuScene"
        });
        this.bitmapTexts = [];
    }
    init() {
        this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    }
    preload() {
        this.load.image('background', 'assets/tests/debug-grid-1920x1920.png');
    }
    create() {
        this.bitmapTexts.push(this.add.text(this.sys.canvas.width / 2 - 150, this.sys.canvas.height / 2 + 40, "PRESS S TO PLAY", { fontSize: '32px', fill: '#FFFFFF' }));
        this.bitmapTexts.push(this.add.text(this.sys.canvas.width / 2 - 150, this.sys.canvas.height / 2 - 60, "A S T E R O I D", { fontSize: '32px', fill: '#FFFFFF' }));
        this.bitmapTexts.push(this.add.text(this.sys.canvas.width / 2 - 150, this.sys.canvas.height / 2 + 80, "HIGHSCORE: " + const_1.CONST.HIGHSCORE, { fontSize: '32px', fill: '#FFFFFF' }));
    }
    update() {
        if (this.startKey.isDown) {
            this.scene.start("GameScene");
        }
    }
}
exports.MainMenuScene = MainMenuScene;
