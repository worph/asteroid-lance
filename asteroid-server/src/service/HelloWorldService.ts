import * as express from 'express'

export default class HelloWorldService {
    public expressApp;

    constructor() {
    }

    private mountRoutes(): void {
        const router = express.Router();
        router.get('/', (req, res) => {
            res.json({
                message: 'Hello World!'
            })
        });
        this.expressApp.use('/hello', router)
    }

    start(expressApp: any):void {
        this.expressApp = expressApp;
        this.mountRoutes();
    }
}
