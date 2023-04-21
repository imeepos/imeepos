import { Schema, model } from "mongoose";

export const CloudSiteSchema = new Schema({
    siteid: String,
    title: String,
    icon: String,
    desc: String,
    keyword: String,
    appkey: String,
    appsecret: String,
})

export const CloudSiteIpSchema = new Schema({
    ip: String,
    hostname: String,
    siteid: String
})

export const CloudSiteAddonSchema = new Schema({
    siteid: String,
    addon_name: String
})

export const CloudSiteOwnerSchema = new Schema({
    siteid: String,
    openid: String
})
/**
 * 站点
 */
export const CloudSiteModel = model('cloud_site', CloudSiteSchema)
/**
 * 站点IP
 */
export const CloudSiteIpModel = model('cloud_site_ip', CloudSiteIpSchema)
/**
 * 站点应用
 */
export const CloudSiteAddonModel = model('cloud_site_addon', CloudSiteAddonSchema)
/**
 * 站点账号
 */
export const CloudSiteOwnerModel = model('cloud_site_owner', CloudSiteOwnerSchema)