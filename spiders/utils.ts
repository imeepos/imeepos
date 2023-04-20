import { readFileSync, writeFileSync } from 'fs'
import { Page, HTTPResponse, Protocol, ElementHandle, NodeFor } from 'puppeteer'
export function timeout(time: number) {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => resolve(), time)
    })
}
const response = new Map<Page, Set<HTTPResponse>>()
export function getPageRes(page: Page): Set<HTTPResponse> {
    return response.get(page) || new Set<HTTPResponse>
}
export function setPageRes(page: Page, res: HTTPResponse) {
    const ress = getPageRes(page)
    ress.add(res)
    response.set(page, ress)
}

export function getCookies(key: string = `zhihu.cookies`): Protocol.Network.CookieParam[] {
    try {
        const str = readFileSync(key).toString('utf-8')
        return JSON.parse(str)
    } catch (e) {
        return []
    }
}

export function setCookies(key: string = `zhihu.cookies`, cookies: Protocol.Network.CookieParam[]) {
    try {
        writeFileSync(key, JSON.stringify(cookies))
        return;
    } catch (e) {
        return;
    }
}

export async function waitForSelector<Selector extends string>(page: Page, selector: Selector): Promise<ElementHandle<NodeFor<Selector>>> {
    let ele = await page.waitForSelector(selector, { timeout: 1000 }).catch(e => undefined)
    while (!ele) {
        await timeout(1000)
        console.log(`wait for selector: ${selector}`)
        ele = await page.waitForSelector(selector, { timeout: 1000 }).catch(e => undefined)
    }
    return ele;
}
export async function getPageResponse(page: Page, check: (pathname: string, hostname: string, searchParams: URLSearchParams) => boolean){
    const ress = getPageRes(page);
    // https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50&desktop=true
    return [...ress].find(res => {
        const req = res.request();
        const url = req.url();
        const { pathname, hostname, searchParams } = new URL(url, 'http://localhost')
        return check(pathname, hostname, searchParams)
    })
}
export async function waitForResponse(page: Page, check: (pathname: string, hostname: string, searchParams: URLSearchParams) => boolean) {
    let res = await getPageResponse(page, check)
    while(!res){
        await timeout(1000)
        res = await getPageResponse(page, check)
    }
    return res;
}