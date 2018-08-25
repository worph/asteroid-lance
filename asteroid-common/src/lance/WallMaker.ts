import LanceGameModel from "./LanceGameModel";

export class WallMaker {
    private walls: { [id: string]: any } = {};


    constructor(private gameEngine: LanceGameModel) {
        this.gameEngine = gameEngine;
    }

    /**
     * Convert pixel value to p2 physics scale (meters) and inverses it.
     * By default Phaser uses a scale of 20px per meter.
     * If you need to modify this you can over-ride these functions via the Physics Configuration object.
     *
     * @method Phaser.Physics.P2#pxmi
     * @param {number} v - The value to convert.
     * @return {number} The scaled value.
     */
    pxmi(v) {
        return v;// * -0.05;
    }

    /**
     * Sets the bounds of the Physics world to match the given world pixel dimensions.
     * You can optionally set which 'walls' to create: left, right, top or bottom.
     * If none of the walls are given it will default to use the walls settings it had previously.
     * I.e. if you previously told it to not have the left or right walls, and you then adjust the world size
     * the newly created bounds will also not have the left and right walls.
     * Explicitly state them in the parameters to override this.
     *
     * @method Phaser.Physics.P2#setBounds
     * @param {number} x - The x coordinate of the top-left corner of the bounds.
     * @param {number} y - The y coordinate of the top-left corner of the bounds.
     * @param {number} width - The width of the bounds.
     * @param {number} height - The height of the bounds.
     */
    setBounds(x, y, width, height) {
        this.setupWall('top', x, y, 0);
        this.setupWall('left', x, y, -1.5707963267948966);
        this.setupWall('right', x + width, y, 1.5707963267948966);
        this.setupWall('bottom', x, y + height, -3.141592653589793);
    }

    /**
     * Internal method called by setBounds. Responsible for creating, updating or
     * removing the wall body shapes.
     *
     * @method Phaser.Physics.P2#setupWall
     * @private
     * @param {boolean} create - True to create the wall shape, false to remove it.
     * @param {string} wall - The wall segment to update.
     * @param {number} x - The x coordinate of the wall.
     * @param {number} y - The y coordinate of the wall.
     * @param {float} angle - The angle of the wall.
     * @param {boolean} [setCollisionGroup=true] - If true the Bounds will be set to use its own Collision Group.
     */
    setupWall(wall, x, y, angle) {
        let game = this.gameEngine;
        let p2 = game.physicsEngine.p2;
        this.walls[wall] = new p2.Body({mass: 0, position: [this.pxmi(x), this.pxmi(y)], angle: angle});
        this.walls[wall].addShape(new p2.Plane());
        game.physicsEngine.world.addBody(this.walls[wall]);
    }
}