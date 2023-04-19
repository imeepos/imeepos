import { launch, Page, Browser, Protocol } from 'puppeteer'
import { setPageRes } from './utils';
export interface BrowserOptions {
    url: string;
    page?: (res: Page, b: Browser) => Promise<void>;
    cookies?: Protocol.Network.CookieParam[];
}
export async function bootstrap(options: BrowserOptions) {
    const borwser = await launch({
        headless: false,
        ignoreHTTPSErrors: true,
        defaultViewport: {
            width: 980,
            height: 760
        }
    })
    const page = await borwser.newPage()
    page.removeAllListeners()
    await page.setJavaScriptEnabled(true);
    await page.setRequestInterception(true);
    await page.setCookie(...(options.cookies || []));
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined
        })
    });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36')
    Object.defineProperty(page, '__reqs', [])
    page.on('request', req => {
        req.continue()
    })
    page.on('response', (res) => {
        setPageRes(page, res)
    })
    page.on('close', () => {
        // console.log(`close`)
    })
    page.on('console', (event) => {
        console.log(`console`, event.text())
    })
    page.on('dialog', () => {
        // console.log(`dialog`)
    })
    page.on('domcontentloaded', () => {
        // console.log(`domcontentloaded`)
    })
    page.on('error', () => {
        console.log(`error`)
    })
    page.on('frameattached', () => {
        // console.log(`frameattached`)
    })
    page.on('framedetached', (event) => {
        // console.log(`framedetached`, event.url())
    })
    page.on('framenavigated', (event) => {
        // console.log(`framenavigated`, event.url())
    })
    page.on('load', () => {
        // console.log(`load`)
    })
    page.on('metrics', () => {
        // console.log(`metrics`)
    })
    page.on('pageerror', (event) => {
        console.log(`pageerror`, event.message)
    })
    page.on('popup', (page) => {
        // console.log(`popup`)
    })
    page.on('requestfailed', (event) => {
        // console.log(`requestfailed`)
        // event.respond({ status: 200, headers: {}, contentType: 'text/html', body: '' })
    })
    page.on('requestfinished', (event) => {
        // const res = event.response()
        // let type = ``
        // if (res) {
        //     type = res.headers()['content-type']
        // }
    })
    page.on('requestservedfromcache', () => {
        // console.log(`requestservedfromcache`)
    })
    page.on('workercreated', (event) => {
        // console.log(`workercreated`, event.url())
    })
    page.on('workerdestroyed', (event) => {
        // console.log(`workerdestroyed`, event.url())
    })
    await page.goto(options.url, { waitUntil: ['networkidle0'] })
    options.page && await options.page(page, borwser)
}