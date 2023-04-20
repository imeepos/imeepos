import { Page } from "puppeteer"
import { waitForResponse, waitForSelector } from "../utils"
import { saveWeiboNews } from "./model";

export async function newsTask(page: Page) {
    // https://weibo.com/ajax/statuses/topic_band?sid=v_weibopro&category=all&page=1&count=10
    let hotTab = await waitForSelector(page, 'div[title="要闻榜"]')
    await hotTab.click().catch()
    const res = await waitForResponse(page, (pathname, hostname, search) => {
        return hostname === 'weibo.com' && pathname === '/ajax/statuses/news'
    });
    const now = new Date()
    console.log(`${now.getMinutes()}:${now.getSeconds()} get url ${res.url()}`)
    const json = await res.json().catch(e => undefined)
    if(json){
        const { data, ok } = json;
        const { band_list } = data;
        console.log(`news task ${band_list.length}`)
        await saveWeiboNews(band_list)
    }
}