import { Page } from "puppeteer"
import { waitForResponse, waitForSelector } from "../utils"
import { saveWeiboHotSearchs } from "./model";

export async function hotBandTask(page: Page) {
    // https://weibo.com/ajax/statuses/topic_band?sid=v_weibopro&category=all&page=1&count=10
    let hotTab = await waitForSelector(page, 'div[title="热搜榜"]')
    await hotTab.click().catch()
    const res = await waitForResponse(page, (pathname, hostname, search) => {
        return hostname === 'weibo.com' && pathname === '/ajax/statuses/hot_band'
    });
    const req = res.request()
    const json = await res.json().catch(e => undefined)
    if(!json) return;
    const { data, http_code, ok } = json;
    const { band_list } = data;
    console.log(`hot search list ${band_list.length} 个`)
    await saveWeiboHotSearchs(band_list)
}