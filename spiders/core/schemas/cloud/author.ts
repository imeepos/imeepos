import { Schema, model } from "mongoose";

export const CloudAuthorSchema = new Schema({
    openid: String,
    username: String,
    password: String,
    salt: String
})
/**
 * 账号
 */
export const CloudAuthorModel = model('cloud_author', CloudAuthorSchema)
