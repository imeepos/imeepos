import { Schema } from "mongoose";

export const SysSettingSchema = new Schema({
    hostname: String,
    key: String,
    secret: String
})

