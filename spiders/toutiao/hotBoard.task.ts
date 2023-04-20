
// hot-board

import { Page } from "puppeteer";
import { waitForResponse } from "../utils";
import { saveTouTiaoHotBoards } from "./model";

export async function hotBoardTask(page: Page) {
    // https://www.toutiao.com/hot-event/hot-board/
    // ?origin=toutiao_pc&_signature=_02B4Z6wo00901lPIwXwAAIDDrYS9TwjpwfZT7MXAAPDBNi4Rl97njseDJoyknnLm4qU0JQG1dC7ilkr9wLuCRgl5lR4nyYSz5KNMlqcOJ-rmCAJSJJ1Yu7ojewon1oUK7XhvFUZUVg-WGul999
    const res = await waitForResponse(page, (pathname, hostname, search) => {
        return hostname === 'www.toutiao.com' && pathname === '/hot-event/hot-board/'
    })
    const json = await res.json().catch(e => undefined)
    if (json) {
        const { data, fixed_top_data, fixed_top_style, impr_id, status } = json;
        console.log(`get toutiao hot board ${data.length}`)
        if (status === 'success') {
            if (data && data.length > 0) await saveTouTiaoHotBoards(data)
        }
    }
}