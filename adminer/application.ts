import express from 'express'

export class Application {
    app: express.Express;
    constructor() {
        this.app = express()
    }
    use(){
        this.app.use()
    }
}