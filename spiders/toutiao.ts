import { connection } from 'mongoose'
import { bootstrap } from './bootstrap'
import options from './toutiao.task'
import { connect } from 'mongoose'

connect('mongodb://localhost:27017/weibo').then(()=>{
    bootstrap(options).then(() => {
        return connection.close()
    })
})
