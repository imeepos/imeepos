import { Browser, Page } from 'puppeteer'
import { BrowserOptions } from './bootstrap'
import { getCookies, setCookies, timeout, waitForSelector } from './utils'
import { URL } from 'url'
import { hotWeiboTask } from './weibo/hotArticle.task'
import { topicBandTask } from './weibo/topicBand.task'
import { hotBandTask } from './weibo/hotBand.task'
import { entertainmentTask } from './weibo/entertainment.task'
import { newsTask } from './weibo/news.task'
async function waitForPassportNavigate(page: Page) {
    const url = page.url();
    const { pathname, hostname } = new URL(url, 'https://localhost')
    if (hostname === 'passport.weibo.com') {
        if (pathname === '/visitor/visitor') {
            // passport weibo
            await timeout(500)
            return true;
        }
    }
    setCookies('weibo.cookies', await page.cookies())
    await timeout(500)
    return false;
}
async function checkLoginBtnClickSuccess(page: Page): Promise<boolean> {
    const form_login_register = await page.waitForSelector('a[node-type="qrcode_tab"]', { timeout: 1000 }).catch(e => undefined)
    if (form_login_register) {
        return true;
    }
    let loginBtn = await waitForSelector(page, 'a[node-type="loginBtn"]')
    await loginBtn.click();
    console.log(`点击登录按钮`)
    return checkLoginBtnClickSuccess(page)
}
async function checkLogin(page: Page) {
    const url = page.url();
    const { pathname, hostname } = new URL(url, 'https://localhost')
    if (hostname === 'weibo.com') {
        if (pathname === '/login.php') {
            // click login button
            await checkLoginBtnClickSuccess(page)
            // click qrcode tab
            let qrcode_tab = await waitForSelector(page, 'a[node-type="qrcode_tab"]')
            let cls = await qrcode_tab.evaluate(i => i.className).catch(e => '')
            while (!cls.includes('cur')) {
                await timeout(1000)
                await qrcode_tab.click().catch(e => {
                    console.log(e.message, qrcode_tab)
                });
                cls = await qrcode_tab.evaluate(i => i.className).catch(e => '')
            }
            let qrcode = await waitForSelector(page, 'img[node-type="qrcode_src"]')
            let loginQrCodeUrl = await qrcode.evaluate(i => i.src).catch(e => '')
            while (!loginQrCodeUrl.includes('v2.qr.weibo.cn')) {
                await timeout(1000)
                loginQrCodeUrl = await qrcode.evaluate((img) => img.src).catch(e => '')
            }
            // .res_succ > .res_info
            let scanResultTip = await waitForSelector(page, '.res_succ > .res_info')
            const tipText = await scanResultTip.evaluate(i => i.textContent).catch(e => '')
            console.log(`扫码结果：${tipText}`)
            let url = page.url()
            const { pathname, hostname } = new URL(url, 'https://localhost')
            let isIndex = pathname === '/'
            while (!isIndex) {
                await timeout(1000)
                let url = page.url()
                const { pathname, hostname } = new URL(url, 'https://localhost')
                isIndex = pathname === '/'
            }
            setCookies('weibo.cookies', await page.cookies())
        }
        if (pathname === '/newlogin') {
            // div.woo-modal-main .LoginPop_main_SAOC0 LoginPop_mabox_3Lyr6 > img
            let qrcode = await page.waitForSelector('.LoginPop_mabox_3Lyr6 img', { timeout: 1000 }).catch(e => undefined)
            while (!qrcode) {
                const followbtn = await page.waitForSelector('.follow-btn_followbtn_FNC50', { timeout: 1000 }).catch(e => undefined)
                if (followbtn) {
                    await followbtn.click({ clickCount: 2 }).then(() => {
                        console.log(`随便点击一个关注按钮，弹出登录二维码`)
                    })
                }
                qrcode = await page.waitForSelector('.LoginPop_mabox_3Lyr6 img', { timeout: 1000 }).catch(e => undefined)
            }
            let loginQrCodeUrl = await qrcode.evaluate((img) => img.src).catch(e => '')
            while (!loginQrCodeUrl.includes('v2.qr.weibo.cn')) {
                await timeout(1000)
                loginQrCodeUrl = await qrcode.evaluate((img) => img.src).catch(e => '')
            }
            console.log(`请扫描下面的二维码登录：${loginQrCodeUrl}`)
            // 等待扫码 .LoginPop_mabox_3Lyr6 .woo-tip-text
            let scanResultTip = await waitForSelector(page, '.LoginPop_mabox_3Lyr6 .woo-tip-text')
            let tipText = await scanResultTip.evaluate(i => i.textContent).catch(e => '')
            console.log(`扫码结果：${tipText}`)
            let url = page.url()
            const { pathname, hostname } = new URL(url, 'https://localhost')
            let isIndex = pathname === '/'
            while (!isIndex) {
                await timeout(1000)
                let url = page.url()
                const { pathname, hostname } = new URL(url, 'https://localhost')
                isIndex = pathname === '/'
                if (!isIndex) {
                    tipText = await scanResultTip.evaluate(i => i.textContent).catch(e => '')
                    console.log(`扫码结果：${tipText}`)
                    if (tipText) {
                        if (tipText.includes('登录失败')) {
                            let btn = await waitForSelector(page, '.LoginPop_mabox_3Lyr6 .woo-tip-text a')
                            await btn.click().catch()
                            // 重新获取
                            loginQrCodeUrl = await qrcode.evaluate((img) => img.src).catch(e => '')
                            console.log(`请扫描下面的二维码登录：${loginQrCodeUrl}`)
                            scanResultTip = await waitForSelector(page, '.LoginPop_mabox_3Lyr6 .woo-tip-text')
                            let tipText = await scanResultTip.evaluate(i => i.textContent).catch(e => '')
                            console.log(`扫码结果：${tipText}`)
                        }
                    }
                }
            }
            setCookies('weibo.cookies', await page.cookies())
        }
    }
}
const options: BrowserOptions = {
    url: 'https://weibo.com',
    page: async (page: Page, browser?: Browser) => {
        while (await waitForPassportNavigate(page)) { }
        await checkLogin(page).catch(e => console.log(e.message))
        console.log(`登录成功，开始执行任务！`)
        await hotWeiboTask(page, true)
        await topicBandTask(page)
        await hotBandTask(page)
        await entertainmentTask(page)
        await newsTask(page)
        await page.close()
        browser && await browser.close();
    },
    cookies: getCookies('weibo.cookies')
}

export default options;