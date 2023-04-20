import { connect } from 'mongoose'
import { countZhiHuAnswer, countZhiHuArticle,countZhiHuAuthor, countZhiHuQuestion, countZhiHuZVideo, getOneZhiHuAnswer } from './zhihu/model'
import { timeout } from './utils'

connect('mongodb://localhost:27017/zhihu').then(() => {
    const count = async () => {
        const answer = await countZhiHuAnswer()
        const article = await countZhiHuArticle()
        const author = await countZhiHuAuthor()
        const question = await countZhiHuQuestion()
        const zvideo = await countZhiHuZVideo()
        const id = await getOneZhiHuAnswer(2982437179)
        const now = new Date()
        console.log(`${now.getHours()}点${now.getMinutes()}分${now.getSeconds()}秒: 总共抓取${answer}个知乎回答,${article}偏文章,${zvideo}个视频,${author}个作者,${question}个问题`)
        await timeout(10000)
        count()
    }
    count()
})