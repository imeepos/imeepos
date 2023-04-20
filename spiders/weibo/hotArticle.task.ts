import { Page } from "puppeteer";
import { timeout, waitForResponse, waitForSelector } from "../utils";
import axios from "axios";
import { saveWeiboTimelines } from "./model";

export async function hotWeiboTask(page: Page, all: boolean = false) {
    let hotTab = await waitForSelector(page, 'div[title="热门"]')
    await hotTab.click().catch()
    // 热门微博-热门
    // https://weibo.com/ajax/feed/hottimeline?since_id=0&refresh=0&group_id=102803&containerid=102803&extparam=discover%7Cnew_feed&max_id=0&count=10
    const res = await waitForResponse(page, (pathname, hostname, search) => {
        return hostname === 'weibo.com' && pathname === '/ajax/feed/hottimeline'
    });
    const req = res.request()
    async function getWeiboHotTimeline(group_id: string, containerid: string, refresh: string = '0', _max_id: string = '0', count: string = '10', to: number = 0): Promise<any> {
        const url = new URL('https://weibo.com/ajax/feed/hottimeline')
        url.searchParams.set('group_id', group_id)
        url.searchParams.set('containerid', containerid)
        url.searchParams.set('refresh', refresh)
        if (refresh === '0') {
            url.searchParams.set('since_id', '0')
        }
        url.searchParams.set('extparam', 'discover|new_feed')
        url.searchParams.set('max_id', _max_id)
        url.searchParams.set('count', count)
        const now = new Date()
        console.log(`${now.getMinutes()}:${now.getSeconds()} get url ${url.toString()}`)
        const data: any = await axios.get(url.toString(), { headers: req.headers() }).then(res => res.data).catch(async e => {
            const message = e.message || ''
            console.log(`hot timeline error status: ${e.status}, message: ${e.message}, url: ${url.toString()}`)
            if (message.includes('414')) {
                await timeout(1000 * Math.random() * 30)
            } else {
                await timeout(1000)
            }
            return await getWeiboHotTimeline(group_id, containerid, refresh, _max_id, count)
        });
        let { ok, total_number, max_id, since_id, statuses } = data;
        if (ok === 1) {
            to += statuses.length;
            if (statuses.length > 0) {
                await saveWeiboTimelines(statuses)
                if (to <= total_number) {
                    await getWeiboHotTimeline(group_id, containerid, '2', max_id, count, to)
                }
            }
        }
    }
    const data = await res.json().catch(e => undefined)
    if (!data) return;
    // let count = 0
    let { ok, total_number, max_id, since_id, statuses } = data;
    if (statuses.length > 0) await saveWeiboTimelines(statuses)
    if (all) {
        // count += statuses.length;
        // await getWeiboHotTimeline('102803', '102803', '2', max_id, '10', count)
        // 热门微博-同城
        // await getWeiboHotTimeline('1028032222', '102803_2222', '0', max_id, '10', 0)
        // 热门微博-榜单
        // await getWeiboHotTimeline('102803600169', '102803_ctg1_600169_-_ctg1_600169', '0', max_id, '10', 0)
        // 热门微博-车展
        // await getWeiboHotTimeline('1028035188', '102803_ctg1_5188_-_ctg1_5188', '0', max_id, '10', 0)
        // 热门微博-明星
        // await getWeiboHotTimeline('1028034288', '102803_ctg1_4288_-_ctg1_4288', '0', max_id, '10', 0)
        // 热门微博-搞笑
        // await getWeiboHotTimeline('1028034388', '102803_ctg1_4388_-_ctg1_4388', '0', max_id, '10', 0)

        // await getWeiboHotTimeline('1028031988', '102803_ctg1_1988_-_ctg1_1988', '0', max_id, '10', 0)
        // 周末
        // await getWeiboHotTimeline('102803600195', '102803_ctg1_600195_-_ctg1_600195', '0', max_id, '10', 0)
        // 三农
        // await getWeiboHotTimeline('1028037188', '102803_ctg1_7188_-_ctg1_7188', '0', max_id, '10', 0)
        // 美妆
        // await getWeiboHotTimeline('1028031588', '102803_ctg1_1588_-_ctg1_1588', '0', max_id, '10', 0)
        // 社会
        // await getWeiboHotTimeline('1028034188', '102803_ctg1_4188_-_ctg1_4188', '0', max_id, '10', 0)
        // 深度
        // await getWeiboHotTimeline('102803600155', '102803_ctg1_600155_-_ctg1_600155', '0', max_id, '10', 0)
        // 财经
        // getWeiboHotTimeline('1028036388', '102803_ctg1_6388_-_ctg1_6388', '0', max_id, '10', 0)

        // 热门榜单
        await getWeiboHotTimeline('1028039999', '102803_ctg1_9999_-_ctg1_9999_home', '0', max_id, '10', 0)
        await getWeiboHotTimeline('1028038899', '102803_ctg1_8899_-_ctg1_8899', '0', max_id, '10', 0)
        await getWeiboHotTimeline('1028038799', '102803_ctg1_8799_-_ctg1_8799', '0', max_id, '10', 0)
        await getWeiboHotTimeline('1028038698', '102803_ctg1_8698_-_ctg1_8698', '0', max_id, '10', 0)
        await getWeiboHotTimeline('1028038998', '102803_ctg1_8998_-_ctg1_8998', '0', max_id, '10', 0)
        await getWeiboHotTimeline('1028038997', '102803_ctg1_8997_-_ctg1_8997', '0', max_id, '10', 0)

        // 话题榜
    }
}

