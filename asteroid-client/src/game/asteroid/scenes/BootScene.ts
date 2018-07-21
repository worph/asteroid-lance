export class BootScene extends Phaser.Scene {
    constructor() {
        super({
            key: "BootScene"
        });
    }

    toto = null;

    update(): void {
        this.scene.start("MainMenuScene");
    }
}
