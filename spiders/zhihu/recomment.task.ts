import { Page, HTTPResponse } from 'puppeteer'
import { getPageRes, timeout } from '../utils';
import { saveZhiHuRecomments } from './model';
import axios from 'axios';
export function checkRecommendTask(page: Page): HTTPResponse | undefined {
    const ress = getPageRes(page);
    const recommend = [...ress].find((res: HTTPResponse) => {
        const req = res.request();
        const url = req.url();
        const { pathname, hostname } = new URL(url, 'http://localhost')
        if (hostname === 'www.zhihu.com') {
            if (pathname === '/api/v3/feed/topstory/recommend') {
                return true;
            }
        }
        return false
    });
    return recommend;
}
export async function waitForRecommendTask(page: Page): Promise<void> {
    const res = checkRecommendTask(page)
    if (res) {
        return;
    }
    await timeout(1000)
    return await waitForRecommendTask(page)
}
export async function recommendTask(page: Page) {
    // 推荐
    // https://www.zhihu.com/api/v3/feed/topstory/recommend?action=down&ad_interval=-10&after_id=11&desktop=true&page_number=3&session_token=1aebd32707c796c2fbb8f920018ca2c7
    const recommend = checkRecommendTask(page)
    if (recommend) {
        const recommendData = await recommend.json()
        let { data, paging } = recommendData;
        await saveZhiHuRecomments(data)
        let is_end = paging.is_end
        while (!is_end) {
            await timeout(1000)
            const req = recommend.request();
            const headers = req.headers()
            const getData = async (): Promise<any> => {
                console.log(`get url: ${paging.next}`)
                const { searchParams } = new URL(paging.next)
                const pnumber = Number(searchParams.get('page_number') || '0')
                if (pnumber > 100) {
                    return {
                        data: [],
                        paging: { is_end: true }
                    }
                }
                return axios.get(paging.next, {
                    headers: headers
                }).then(res => res.data).catch(async e => {
                    console.error(e.message)
                    await timeout(1000)
                    return await getData()
                })
            }
            const recommendData = await getData()
            const { data, paging: axiosPaging } = recommendData;
            await saveZhiHuRecomments(data)
            paging = axiosPaging;
            is_end = axiosPaging.is_end
        }
    }
}