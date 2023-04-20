import { Page } from "puppeteer";
import { waitForResponse } from "../utils";
import { saveTouTiaoFeeds } from "./model";


export async function listFeedTask(page: Page) {
    // https://www.toutiao.com/api/pc/list/feed?
    // offset=0&channel_id=94349549395&max_behot_time=0&category=pc_profile_channel&disable_raw_data=true&aid=24
    const req = await waitForResponse(page, (pathname, hostname, search) => {
        return hostname === 'www.toutiao.com' && pathname === '/api/pc/list/feed'
    })
    const json = await req.json().catch(e => undefined)
    if (json) {
        const { data, has_more, message, next, offset } = json
        console.log(`get toutiao list feed ${data.length}`)
        if (message === 'success') {
            if (data && data.length > 0) {
                await saveTouTiaoFeeds(data)
            }
        }
    }
}