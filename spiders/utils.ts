import { readFileSync, writeFileSync } from 'fs'
import { Page, HTTPResponse, Protocol } from 'puppeteer'
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