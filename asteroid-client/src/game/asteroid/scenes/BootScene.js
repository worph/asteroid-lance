"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BootScene extends Phaser.Scene {
    constructor() {
        super({
            key: "BootScene"
        });
        this.toto = null;
    }
    update() {
        this.scene.start("MainMenuScene");
    }
}
exports.BootScene = BootScene;
