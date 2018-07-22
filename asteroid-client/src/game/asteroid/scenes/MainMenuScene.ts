
export class MainMenuScene extends Phaser.Scene {
    private startKey: Phaser.Input.Keyboard.Key;
    private bitmapTexts: Phaser.GameObjects.Text[] = [];

    constructor() {
        super({
            key: "MainMenuScene"
        });
    }

    init(): void {
        this.startKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.S
        );
    }

    create(): void {
        this.bitmapTexts.push(
            this.add.text(
                this.sys.canvas.width / 2 - 150,
                this.sys.canvas.height / 2 + 40,
                "PRESS S TO PLAY",
                {fontSize: '32px', fill: '#FFFFFF'}
            )
        );

        this.bitmapTexts.push(
            this.add.text(
                this.sys.canvas.width / 2 - 150,
                this.sys.canvas.height / 2 - 60,
                "A S T E R O I D",
                {fontSize: '32px', fill: '#FFFFFF'}
            )
        );

        this.bitmapTexts.push(
            this.add.text(
                this.sys.canvas.width / 2 - 150,
                this.sys.canvas.height / 2 + 80,
                "HIGHSCORE: " + 0,
                {fontSize: '32px', fill: '#FFFFFF'}
            )
        );
    }

    update(): void {
        if (this.startKey.isDown) {
            this.scene.start("GameScene");
        }
    }
}
