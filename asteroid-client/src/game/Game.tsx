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
import axios, {AxiosInstance} from "axios";
import Typography from "@material-ui/core/Typography/Typography";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import StarIcon from '@material-ui/icons/Star';
import Chip from "@material-ui/core/Chip/Chip";

interface State {
    open: boolean;
    overlayStyle: CSSProperties;
    scores:{};
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
        },
        scores:{}
    };
    private game: Game;
    private config: GameConfig;
    private canvaName = 'game';
    private httpClient: AxiosInstance;

    componentDidMount() {
        this.httpClient = axios.create();
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
                    mouse: true,
                    touch: true,
                    gamepad: true
                },
                physics: {
                    default: "matter",
                    matter: {
                        debug: true,
                        gravity: {
                            x : 0.0,
                            y: 0.0
                        },
                    },
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

    update(){
        this.httpClient.get(phaserService.parameters.apiServer+'/asteroid-game/scores').then(response => {
            let data = response.data;
            this.setState({scores:data});
        });
    }

    public render() {
        return (<div>
                <div id="caneva-overlay" className="pointerOff" style={this.state.overlayStyle}>
                    <Drawer open={this.state.open}
                            onClose={()=>{this.setState({open:false})}}
                            style={{maxWidth:"50%",wordBreak: "break-all"}}
                    >
                        <Typography component="h1">

                        </Typography>
                        <Chip
                            style={{margin:"20px"}}
                            label={"Hello "+ phaserService.parameters.name}
                        />
                        <Typography>
                            <List>
                                <ListItem>Scores</ListItem>
                                {Object.keys(this.state.scores).map(key => {
                                    let score = this.state.scores[key];
                                    return <ListItem>
                                        <ListItemIcon>
                                            <StarIcon />
                                        </ListItemIcon>{key + " : " +score}</ListItem>;
                                })}
                            </List>
                        </Typography>
                    </Drawer>
                    <div style={{position: 'relative'}}>
                        <Button
                            className="pointerOn"
                            style={{
                                position: 'absolute',
                                top: "10px",
                                right: "10px",
                            }}
                            variant="fab"
                            onClick={()=>{this.setState({open:true});this.update();}}
                        ><Menu/></Button>
                    </div></div>
                <div id={this.canvaName}></div>
            </div>
        );
    }
}

export default AsteroidGame;
