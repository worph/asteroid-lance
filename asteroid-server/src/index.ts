import DistributedAssetsLocator from "./service/DistributedAssetsLocator";
import HelloWorldService from "./service/HelloWorldService";
import AsteroGame from "./game/AsteroGame";
import BroadcasterService from "./service/BroadcasterService";
import * as express from "express"
import {createServer, Server} from 'http';
import * as SocketIO from "socket.io"
import * as cors from 'cors';

////////

let expressApp = express();
expressApp.use(cors());
let httpServer: Server = createServer(expressApp);
let io:SocketIO.Server = SocketIO.listen(httpServer);//, {path: '/socket.io'}
//listen to incoming connexion
httpServer.listen(8085, () => {
    console.log(`Listening on ${httpServer.address().port}`);
});

////////

let helloWorldService: HelloWorldService = new HelloWorldService();
helloWorldService.start(expressApp);

////////


let distributedAssetsLocator: DistributedAssetsLocator = new DistributedAssetsLocator();
distributedAssetsLocator.start(io);


////////
let broadcastService:BroadcasterService = new BroadcasterService();
broadcastService.start(io);


////////

let asteroGame: AsteroGame = new AsteroGame();
asteroGame.start(io,expressApp,distributedAssetsLocator,broadcastService);