import { SysNodeModel, ISysNode } from './schemas/sys/node'
import { SysAddonModel, ISysAddon } from './schemas/sys/addon'

export async function saveSysNode(id: string, model: Partial<ISysNode>) {
    let item = await SysNodeModel.findOne({ id })
    if (!item) {
        item = new SysNodeModel({ ...model, id })
        await item.save()
    } else {
        await SysNodeModel.updateOne({ id }, model)
    }
}
export async function findSysNode() {
    return await SysNodeModel.find({ status: 1 })
}

/**
 * addon
 */
export async function downloadSysAddon(name: string, version: string) {

}
export async function installSysAddon(name: string, version: string) {
    await downloadSysAddon(name, version)
}
export async function updateSysAddon(name: string, version: string) {
    await SysAddonModel.updateOne({ name }, { version })
}
export async function unInstallSysAddon(name: string, version: string) {

}
export async function findSysAddon() {
    return await SysAddonModel.find({ status: 1, isdel: 0 })
}