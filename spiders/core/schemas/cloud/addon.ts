import { Schema, model } from 'mongoose'
export const CloudAddonVersionSchema = new Schema({
    name: String,
    version: String,
    zip: String,
    icon: String,
    thumbnail: String,
    images: Array<String>,
    upload_time: Date,
    hash: String
})
export const CloudAddonSchema = new Schema({
    name: String,
    author: String,
    status: Number,
    isdel: Number
})

export interface ICloudAddonVersion {
    name: string,
    version: string,
    zip: string,
    icon: string,
    thumbnail: string,
    images: string[],
    upload_time: Date,
    hash: string
}
export interface ICloudAddon {
    name: string,
    author: string,
    status: number,
    isdel: number,
    versions: ICloudAddonVersion[]
}
export class CloudAddonNotFoundError extends Error {
    addon_name: string;
    constructor(name: string) {
        super();
        this.addon_name = name;
    }
}

export const CloudAddonModel = model('cloud_addon', CloudAddonSchema)
export const CloudAddonVersionModel = model('cloud_addon_version', CloudAddonVersionSchema)

export async function getCloudAddon(name: string): Promise<ICloudAddon> {
    const item = await CloudAddonModel.findOne({ name })
    const versions: ICloudAddonVersion[] = await CloudAddonVersionModel.find({ name })
    if (item) {
        return {
            name: item.name || '',
            author: item.author || '',
            status: item.status || 0,
            isdel: item.isdel || 0,
            versions,
        }
    }
    throw new CloudAddonNotFoundError(name)
}