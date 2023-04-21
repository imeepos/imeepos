import { Schema, model } from 'mongoose'
export const SysAddonSchema = new Schema({
    name: String,
    version: String,
    author: String,
    main: String,
    install: String,
    upgrade: String,
    uninstall: String,
    hash: String,
    status: Number,
    isdel: Number
})
export const SysAddonModel = model('sys_addon', SysAddonSchema)
export interface ISysAddon {
    name: String,
    version: String,
    author: String,
    main: String,
    install: String,
    upgrade: String,
    uninstall: String,
    hash: String,
    status: Number,
    isdel: Number
}