import { Schema } from "mongoose";

const SysUserSchema = new Schema({
    username: String,
    password: String,
    salt: String
})