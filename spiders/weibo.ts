import { connection } from 'mongoose'
import { bootstrap } from './bootstrap'
import options from './weibo.task'
bootstrap(options).then(() => {
    return connection.close()
})