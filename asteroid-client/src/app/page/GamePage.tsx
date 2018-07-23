import {Component} from 'react'
import * as React from 'react'
import AsteroidGame from "../../game/Game";
import {phaserService} from "../../game/phaser/PhaserService";

export default class GamePage extends Component<{
    match: any,
    history: any
}, void> {

    componentWillMount() {
        const match = this.props.match; // coming from React Router.
        /*{isExact:true
        params:{memeid: "toto"}
        path:"/meme/:memeid"
        url:"/meme/toto"}*/
        let player = match.params.player;
        player = decodeURIComponent(player);
        phaserService.parameters = {
            name: player,
            //apiServer: "http://127.0.0.1:8085"
            apiServer:"http://asteroidserver.game.rphstudio.net"
        }
    }

    render() {
        return (<AsteroidGame/>)
    }
}
