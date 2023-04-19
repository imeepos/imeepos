import { Page } from "puppeteer";
import { getPageRes, timeout } from "../utils";
import { saveZhiHuHot } from "./model";

export async function hotTask(page: Page){
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
            const ress = getPageRes(page);
            // https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50&desktop=true
            const res = [...ress].find(res => {
                const req = res.request();
                const url = req.url();
                const { pathname, hostname } = new URL(url, 'http://localhost')
                if (hostname === 'www.zhihu.com') {
                    if (pathname === '/api/v3/feed/topstory/hot-lists/total') {
                        return true;
                    }
                }
                return false;
            })
            if (res) {
                const json = await res.json();
                await saveZhiHuHot(json)
            }
        }
    }
}