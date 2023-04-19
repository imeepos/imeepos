import { Page, Browser } from 'puppeteer';
import { URL } from 'url';
import { connect } from 'mongoose'
import { timeout, getCookies, setCookies } from './utils'
import { BrowserOptions, bootstrap } from './bootstrap'
import { recommendTask, waitForRecommendTask } from './zhihu/recomment.task';
import { hotTask } from './zhihu/hot.task';

const options: BrowserOptions = {
    url: 'https://www.zhihu.com/',
    cookies: getCookies('zhihu.cookies'),
    page: async (page: Page, b: Browser) => {
        const url = page.url()
        const { pathname, hostname } = new URL(url, 'http://localhost')
        let currentPathName = pathname;
        if (currentPathName === '/signin') {
            const tabs = await page.waitForSelector('.SignFlow-tab:nth-of-type(2)')
            if (tabs) {
                await tabs.click()
            }
            const username = await page.waitForSelector('input[name="username"]')
            if (username) {
                username.type('18639118753')
            }
            const password = await page.waitForSelector('input[name="password"]')
            if (password) {
                password.type('Yang1989.')
            }
            const submit = await page.waitForSelector('.SignFlow-submitButton')
            if (submit) {
                await submit.click()
                let yidunModal = await page.waitForSelector('.yidun_modal', { timeout: 1000 }).catch(e => undefined)
                while (!yidunModal) {
                    await submit.click().then(() => console.log(`login button click`))
                    yidunModal = await page.waitForSelector('.yidun_modal', { timeout: 1000 }).catch(e => undefined)
                }
            }
            const cookies = await page.cookies();
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
        await waitForRecommendTask(page);
        recommendTask(page)
        await hotTask(page)
        await timeout(1000 * 60)
    }
}
connect('mongodb://localhost:27017/zhihu').then(() => {
    bootstrap(options)
});
