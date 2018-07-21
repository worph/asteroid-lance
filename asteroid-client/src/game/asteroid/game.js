"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("phaser");
const BootScene_1 = require("./scenes/BootScene");
const MainMenuScene_1 = require("./scenes/MainMenuScene");
const GameScene_1 = require("./scenes/GameScene");
const config = {
    title: "Asteroid",
    url: "",
    version: "1.0",
    width: window.innerWidth,
    height: window.innerHeight,
    type: Phaser.AUTO,
    parent: "game",
    scene: [BootScene_1.BootScene, MainMenuScene_1.MainMenuScene, GameScene_1.GameScene],
    input: {
        keyboard: true,
        mouse: false,
        touch: false,
        gamepad: false
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    backgroundColor: "#000000",
    pixelArt: false,
    antialias: true
};
class Game extends Phaser.Game {
    constructor(config) {
        super(config);
    }
}
exports.Game = Game;
window.onload = () => {
    exports.game = new Game(config);
};
