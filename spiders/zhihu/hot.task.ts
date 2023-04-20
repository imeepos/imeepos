import { Page } from "puppeteer";
import { getPageRes, timeout, waitForResponse } from "../utils";
import { saveZhiHuHot } from "./model";

export async function hotTask(page: Page) {
    // hot
    const hot = await page.waitForSelector('.TopstoryTabs-link[aria-controls="Topstory-hot"]')
    if (hot) {
        await hot.click()
        const hotClassName = await hot.evaluate((ele) => {
            return ele.className
        });
        let isActivate = hotClassName.includes('is-active')
        while (!isActivate) {
            await timeout(1000)
            await hot.click()
            const hotClassName = await hot.evaluate((ele) => {
                return ele.className
            });
            isActivate = hotClassName.includes('is-active')
        }
        const hotList = await page.waitForSelector('.HotList-list .HotItem')
        if (hotList) {
            const res = await waitForResponse(page, (pathname, hostname) => {
                return hostname === 'www.zhihu.com' && pathname === '/api/v3/feed/topstory/hot-lists/total'
            })
            const json = await res.json();
            await saveZhiHuHot(json)
        }
    }
}