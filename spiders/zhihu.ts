import { connection } from 'mongoose'
import { bootstrap } from './bootstrap'
import options from './zhihu.task'
bootstrap(options).then(() => {
    return connection.close()
})
