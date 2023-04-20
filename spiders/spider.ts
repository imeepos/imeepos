import { bootstraps } from './bootstrap'
import zhihu from './zhihu.task'
import weibo from './weibo.task'
import toutiao from './toutiao.task'

bootstraps([
    toutiao,
    zhihu,
    weibo
])