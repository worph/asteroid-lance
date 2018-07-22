import * as React from 'react';
import './Game.css';
import {Game} from "./phaser/Game";
import {BootScene} from "./asteroid/scenes/BootScene";
import {MainMenuScene} from "./asteroid/scenes/MainMenuScene";
import {GameScene} from "./asteroid/scenes/GameScene";
import Scene = Phaser.Scene;
import {phaserService} from "./phaser/PhaserService";
import {CSSProperties} from "react";
import Button from "@material-ui/core/Button/Button";
import {Menu} from "@material-ui/icons";
import Drawer from "@material-ui/core/Drawer/Drawer";

interface State {
    open: boolean;
    overlayStyle: CSSProperties
}

class AsteroidGame extends React.Component<any, State> {
    state: State = {
        open:false,
        overlayStyle: {
            position: "absolute",
            left: "100px",
            top: "150px",
            width: "150px",
            height: "150px"
        }
    };
    private game: Game;
    private config: GameConfig;
    private canvaName = 'game';

    componentDidMount() {
        setTimeout(() => {
            let elementById = document.getElementById(this.canvaName);
            let offsetWidth = elementById.offsetWidth;//window.innerWidth,
            let offsetHeight = elementById.offsetHeight;//window.innerHeight,
            this.setState({
                overlayStyle: {
                    position: "absolute",
                    left: elementById.getBoundingClientRect().left + "px",
                    top: elementById.getBoundingClientRect().top + "px",
                    width: offsetWidth + "px",
                    height: offsetHeight + "px"
                }
            });
            this.config = {
                title: "Asteroid",
                url: "",
                version: "1.0",
                width: offsetWidth,
                height: offsetHeight,
                type: Phaser.AUTO,
                parent: this.canvaName,
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
            this.game = new Game(this.config);
        }, 0);
    }

    componentWillUnmount() {
        phaserService.destroy();
        this.game.destroy(true);
    }

    public render() {
        return (<div>
                <div id={this.canvaName}></div>
                <div id="caneva-overlay" style={this.state.overlayStyle}>
                    <Drawer open={this.state.open}
                            onClose={()=>{this.setState({open:false})}}>
                        Hello
                    </Drawer>
                    <div style={{position: 'relative'}}>
                        <Button
                            style={{
                                position: 'absolute',
                                top: "10px",
                                right: "10px",
                            }}
                            variant="fab"
                            onClick={()=>{this.setState({open:true})}}
                        ><Menu/></Button>
                    </div></div>
            </div>
        );
    }
}

export default AsteroidGame;
