import { launch, Page, Browser, Protocol, Device } from 'puppeteer'
import { setPageRes } from './utils';
import { extname } from 'path';
import { connect } from 'mongoose';
export const MacBook: Device = {
    userAgent: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36`,
    viewport: {
        width: 1098,
        height: 605,
        isLandscape: false,
        isMobile: false
    }
}
export interface BrowserOptions {
    url: string;
    page?: (res: Page, b?: Browser) => Promise<void>;
    cookies?: Protocol.Network.CookieParam[];
    device?: Device;
    init?: () => Promise<any>;
}
export async function bootstraps(tasks: BrowserOptions[]) {
    await connect('mongodb://localhost:27017/weibo')
    const borwser = await launch({
        headless: false,
        ignoreHTTPSErrors: true
    })
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i]
        task.init && await task.init();
        await bootstrap(task, borwser)
    }
    await borwser.close();
    // await connection.close();
}
export async function bootstrap(options: BrowserOptions, _borwser?: Browser) {
    let borwser = _borwser;
    if (!borwser) {
        borwser = await launch({
            headless: true,
            ignoreHTTPSErrors: true
        })
    }
    const context = borwser.defaultBrowserContext();
    await context.overridePermissions(options.url, ["geolocation"]);
    const page = await borwser.newPage()
    const device = options.device || MacBook;
    await page.emulate(device)
    page.removeAllListeners()
    await page.setJavaScriptEnabled(true);
    await page.setRequestInterception(true);
    await page.setCookie(...(options.cookies || []));
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined
        })
    });
    Object.defineProperty(page, '__reqs', [])
    const ignoreExtnames: string[] = [
        '.ico', '.png', '.jpeg', '.jpg', '.svg', '.bmp', '.gif', '.ttf', '.eot', '.woff', '.woff2',
        '.mp3', '.mp4'
    ]
    page.on('request', req => {
        const url = new URL(req.url(), 'http://localhost')
        const path = url.pathname;
        const ext = extname(path).toLowerCase()
        if (ignoreExtnames.includes(ext)) {
            req.respond({
                status: 200,
                contentType: 'text/plain',
                body: 'not found'
            })
        } else {
            req.continue()
        }
    })
    page.on('response', (res) => {
        setPageRes(page, res)
    })
    page.on('close', () => {
        // console.log(`close`)
    })
    page.on('console', (event) => {
        // console.log(`console`, event.text())
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

    await page.goto(options.url, { waitUntil: ['networkidle0'], timeout: 10000 }).catch(e => {
        console.log(`open fail ${options.url}`)
    }).finally(async () => {
        options.page && await options.page(page, _borwser ? undefined : borwser).catch(e => {
            console.log(e.message, { url: page.url() })
        })
    });
}