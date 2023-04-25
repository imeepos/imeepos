import express, { Request, Response } from 'express';
import { dirname } from 'path';
let appRoot: string = ``
function setAppRoot(root: string): void {
    appRoot = root;
}
function getAppRoot(): string {
    return appRoot
}
function success(data: any) {
    if (data instanceof ResponseSuccess) {
        return { success: true, message: data.message, name: data.name, data: data.data, stack: data.lines }
    }
    return { success: true, message: 'ok', data }
}
function fail(msg: string | Error) {
    if (typeof msg === 'string') {
        return { success: false, message: msg }
    } else {
        if (msg instanceof CoreError) {
            return { success: false, message: msg.message, data: { name: msg.name, stack: msg.lines, message: msg.message } }
        }
        return { success: false, message: msg.message, data: { name: msg.name, stack: msg.stack, message: msg.message } }
    }
}
export class CoreError extends Error {
    lines: string | undefined;
    constructor(name: string, msg: string) {
        super(msg)
        this.name = name;
        this.lines = this.getErrorFileAndLines()
    }
    save() {
    }
    private getErrorFileAndLines(): string | undefined {
        const stack = this.stack;
        if (stack) {
            const stacks = stack.split('\n')
            if (stacks.length > 1) {
                const stack_message = stacks[1];
                if (typeof stack_message === 'string') {
                    const root = getAppRoot()
                    return stack_message.replace(root, '').replace('at /', '').trim()
                }
            }
        }
    }
}
export class ReqResError extends CoreError {
    constructor(public req: Request, public res: Response, name: string, msg: string) {
        super(name, msg)
    }
}
export class ResponseSuccess extends ReqResError {
    constructor(req: Request, res: Response, public data: any) {
        super(req, res, 'ResponseSuccess', 'ok')
        this.save()
    }
}
export class ResponseFail extends ReqResError {
    constructor(req: Request, res: Response, key: string) {
        super(req, res, 'ResponseFail', `${key} is required`)
        this.save()
    }
}
export async function bootstrap() {
    setAppRoot(dirname(__filename))
    const app = express();
    app.get('/', (req, res, next) => {
        res.json({
            success: true,
            message: 'ok',
            data: 'hello world!'
        });
    });
    app.get('/run', (req, res, next) => {
        const { name, version } = req.query;
        if (!name) {
            return res.json(fail(new ResponseFail(req, res, 'name')))
        }
        if (!version) {
            return res.json(fail(new ResponseFail(req, res, 'version')))
        }
        return res.json(success(new ResponseSuccess(req, res, { name, version })))
    });
    app.listen(8888, '0.0.0.0', () => {
        console.log(`app start at http://localhost:8888`)
    })
}

bootstrap()
