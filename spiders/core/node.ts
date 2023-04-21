import { randomUUID, UUID } from "crypto";
import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
import { connect } from "mongoose";
import { findSysNode, saveSysNode } from "./model";

export class Node {
    id: UUID;
    constructor() {
        this.id = randomUUID()
    }
}
export class ChildNode extends Node {

}
export class MainNode extends Node {
    constructor() {
        super();
    }
    async start() {
        await connect('mongodb://localhost:27017/weibo')
        const nodes = await findSysNode()
        nodes.map(node => {
            console.log(node)
        })
    }
}

const main = new MainNode()
main.start()