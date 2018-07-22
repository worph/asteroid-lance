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
        phaserService.parameters = {name:player}
    }

    render() {
        return (<AsteroidGame/>)
    }
}
