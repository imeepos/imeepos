import { Browser, Page } from 'puppeteer'
import { BrowserOptions } from './bootstrap'
import { getCookies, setCookies, timeout, waitForSelector } from './utils'
import { hotKeywordTask } from './toutiao/hotKeyword.task';
import { hotBoardTask } from './toutiao/hotBoard.task';
import { listFeedTask } from './toutiao/listFeedTask';

async function checkLogin(page: Page) {
    let loginSuccess = false;
    const userIcon = await page.waitForSelector('.user-icon', { timeout: 1000 }).catch(e => undefined)
    if (userIcon) {
        loginSuccess = true;
        return;
    }
    await waitForSelector(page, '.ttp-login-modal.modal-show', async () => {
        const loginButton = await waitForSelector(page, '.right-container .login-button')
        await loginButton.click().catch(e => console.log(e.message))
        console.log(`点击登录按钮`)
    })
    // 扫码登录
    while (!loginSuccess) {
        await timeout(1000)
        const qrcodeImgElement = await waitForSelector(page, '.ttp-login-modal img')
        const qrcode = await qrcodeImgElement.evaluate(i => i.src)
        console.log({ qrcode: qrcode })
        // web-login-scan-code__content__qrcode-wrapper__mask__toast__text
        const textElement = await waitForSelector(page, '.web-login-scan-code__content__qrcode-wrapper__mask__toast__text')
        let text = await textElement.evaluate(t => t.textContent).catch(e => '')
        let res = await page.waitForSelector('.user-icon', { timeout: 1000 }).catch(e => undefined)
        while (!res) {
            if (text === '点击刷新') {
                await textElement.click()
            }
            text = await textElement.evaluate(t => t.textContent).catch(() => '')
            res = await page.waitForSelector('.user-icon', { timeout: 1000 }).catch(e => undefined)
            await timeout(1000)
            console.log({ text })
        }
        loginSuccess = true;
    }
    setCookies('toutiao.cookies', await page.cookies())
}

const options: BrowserOptions = {
    url: 'https://www.toutiao.com',
    page: async (page: Page, browser?: Browser) => {
        await checkLogin(page)
        console.log(`登录成功`)
        await hotKeywordTask(page);
        await hotBoardTask(page);
        await listFeedTask(page);
        // https://www.toutiao.com/api/pc/list/feed
        await page.close()
        if (browser) await browser.close()
    },
    cookies: getCookies('toutiao.cookies')
}

export default options