import { Page, Browser } from 'puppeteer';
import { URL } from 'url';
import { timeout, getCookies, setCookies, waitForSelector } from './utils'
import { BrowserOptions } from './bootstrap'
import { recommendTask, waitForRecommendTask } from './zhihu/recomment.task';
import { hotTask } from './zhihu/hot.task';

const options: BrowserOptions = {
    url: 'https://www.zhihu.com/',
    cookies: getCookies('zhihu.cookies'),
    page: async (page: Page, b?: Browser) => {
        const url = page.url()
        const { pathname, hostname } = new URL(url, 'http://localhost')
        let currentPathName = pathname;
        if (currentPathName === '/signin') {
            const qrcodeElement = await waitForSelector(page, 'img.Qrcode-qrcode')
            const src = await qrcodeElement.evaluate(img => img.src)
            console.log(`扫码登录：${src}`)
            let url = page.url()
            const { pathname, hostname } = new URL(url, 'http://localhost')
            currentPathName = pathname;
            while (currentPathName !== '/') {
                await timeout(1000)
                let url = page.url()
                const { pathname, hostname } = new URL(url, 'http://localhost')
                currentPathName = pathname;
            }
            const cookies = await page.cookies();
            console.log(`登录成功保存cookies`)
            setCookies('zhihu.cookies', cookies)
        }
        const close = await page.waitForSelector('.Modal-closeButton', { timeout: 1000 }).catch(e => undefined)
        if (close) {
            await close.click();
        }
        while (currentPathName !== '/') {
            await timeout(1000)
            let url = page.url()
            const { pathname, hostname } = new URL(url, 'http://localhost')
            currentPathName = pathname;
        }
        // 推荐
        await waitForRecommendTask(page);
        recommendTask(page);
        // 热点
        await hotTask(page);
        await page.close();
        b && await b.close();
    }
}

export default options;