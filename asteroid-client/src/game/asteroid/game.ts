import "phaser";
import {BootScene} from "./scenes/BootScene";
import {MainMenuScene} from "./scenes/MainMenuScene";
import {GameScene} from "./scenes/GameScene";

const config: GameConfig = {
    title: "Asteroid",
    url: "",
    version: "1.0",
    width: window.innerWidth,
    height: window.innerHeight,
    type: Phaser.AUTO,
    parent: "game",
    scene: [BootScene, MainMenuScene, GameScene],
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

export class Game extends Phaser.Game {
    constructor(config: GameConfig) {
        super(config);
    }
}

export let game;

window.onload = () => {
    game = new Game(config);
};
