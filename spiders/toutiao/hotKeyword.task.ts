import { Page } from "puppeteer";
import { waitForResponse } from "../utils";
import { saveTouTiaoKeywords } from "./model";

export async function hotKeywordTask(page: Page) {
    // https://www.toutiao.com/search/suggest/hot_words/?_signature=_02B4Z6wo00f01IuMSfgAAIDBdcA1y4dnxNyLqE1AAEaoHBu47Xr0f533e2BRgcH2YGYgXZt5Qe2FcMcc2EPr13KhQ1ST5x7-WcI7J6pANyPLr7TYiqHNnjN.1rJZb2.UAsYWBbOhgT-0e0-rd3
    const req = await waitForResponse(page, (pathname, hostname, search) => {
        return hostname === 'www.toutiao.com' && pathname === '/search/suggest/hot_words/'
    })
    const json = await req.json();
    const { message, data } = json;
    if (message === 'success') {
        console.log(`get toutiao hot keyword ${data.length}`)
        if (data && data.length > 0) {
            await saveTouTiaoKeywords(data)
        }
    }
}