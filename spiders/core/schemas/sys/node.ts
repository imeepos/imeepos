import { Schema, model } from 'mongoose'
export const SysNodeSchema = new Schema({
    id: String,
    addon: String,
    env: Object,
    version: String,
    status: Number
})
export const SysNodeModel = model('sys_node', SysNodeSchema)
export interface ISysNode {
    id: string;
    addon: string;
    evn: object;
    version: string;
    status: number;
}