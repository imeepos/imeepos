import { Page } from "puppeteer"
import { timeout, waitForResponse, waitForSelector } from "../utils"
import axios from "axios";
import { saveWeiboTopics } from "./model";

export async function topicBandTask(page: Page) {
    // https://weibo.com/ajax/statuses/topic_band?sid=v_weibopro&category=all&page=1&count=10
    let hotTab = await waitForSelector(page, 'div[title="话题榜"]')
    await hotTab.click().catch()
    const res = await waitForResponse(page, (pathname, hostname, search) => {
        return hostname === 'weibo.com' && pathname === '/ajax/statuses/topic_band'
    });
    const req = res.request()
    async function topic_band(page: number): Promise<any> {
        const url = new URL(req.url(), 'http://localhost')
        url.searchParams.set('page', `${page}`)
        const now = new Date()
        console.log(`${now.getMinutes()}:${now.getSeconds()} get url ${url.toString()}`)
        const json = await axios.get(url.toString(), {
            headers: req.headers()
        }).then(req => req.data).catch(async (e) => {
            const message = e.message || ''
            console.log(`topic band error status: ${e.status}, message: ${e.message}, url: ${url.toString()}`)
            if (message.includes('414')) {
                await timeout(1000 * Math.random() * 30)
            } else {
                await timeout(1000)
            }
            return await topic_band(page)
        });
        const { data, ok } = json;
        const { category, statuses, total_data_num, total_num } = data;
        console.log(`topic brand ${statuses.length}`)
        if (ok === 1) {
            if (statuses.length > 0) {
                await saveWeiboTopics(statuses)
                if (total_num != total_data_num) {
                    await topic_band(page + 1)
                }
            }
        }
    }
    const json = await res.json().catch(e => undefined)
    if (json) {
        const { data, ok } = json;
        const { category, statuses, total_data_num, total_num } = data;
        if (statuses.length > 0) {
            await saveWeiboTopics(statuses)
            if (total_data_num !== total_num) {
                await topic_band(2)
            }
        }
    }
}