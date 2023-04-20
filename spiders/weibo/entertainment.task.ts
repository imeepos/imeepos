import { Page } from "puppeteer"
import { waitForResponse, waitForSelector } from "../utils"
import { saveWeiboEntertainments } from "./model";

export async function entertainmentTask(page: Page) {
    // https://weibo.com/ajax/statuses/topic_band?sid=v_weibopro&category=all&page=1&count=10
    let hotTab = await waitForSelector(page, 'div[title="文娱榜"]')
    await hotTab.click().catch()
    const res = await waitForResponse(page, (pathname, hostname, search) => {
        return hostname === 'weibo.com' && pathname === '/ajax/statuses/entertainment'
    });
    const json = await res.json().catch(e => undefined)
    if (!json) return;
    const { data, http_code, ok } = json;
    const { band_list } = data;
    console.log(`entertainment task ${band_list.length}`)
    await saveWeiboEntertainments(band_list)
}