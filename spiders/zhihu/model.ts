import { Schema, model } from 'mongoose'
const ZhiHuHotSchema = new Schema({
    title: String,
    desc: String,
    url: String,
    hot: String,
    image: String,
    answer_count: Number,
    month: Number,
    day: Number,
    year: Number
});
const ZhiHuHotModel = model('zhihu_hot', ZhiHuHotSchema)
const ZhiHuAuthorSchema = new Schema({
    avatar_url: String,
    followers_count: Number,
    gender: Number,
    headline: String,
    id: String,
    is_followed: Boolean,
    is_following: Boolean,
    is_org: Boolean,
    name: String,
    url: String,
    url_token: String,
    user_type: String
})
const ZhiHuAuthorModel = model('zhihu_author', ZhiHuAuthorSchema)
const ZhiHuQuestionSchema = new Schema({
    answer_count: Number,
    author: Schema.Types.Mixed,
    bound_topic_ids: Array<Number>,
    comment_count: Number,
    created: Number,
    detail: String,
    excerpt: String,
    follower_count: Number,
    id: Number,
    is_following: Boolean,
    question_type: String,
    relationship: Object,
    title: String,
    type: String,
    url: String
})
const ZhiHuQuestionModel = model('zhihu_question', ZhiHuQuestionSchema)
const ZhiHuAnswerSchema = new Schema({
    answer_type: String,
    comment_count: Number,
    content: String,
    created_time: Number,
    excerpt: String,
    excerpt_new: String,
    favorite_count: Number,
    id: Number,
    is_copyable: Boolean,
    is_labeled: Boolean,
    preview_text: String,
    preview_type: String,
    reshipment_settings: String,
    thanks_count: Number,
    type: String,
    updated_time: Number,
    url: String,
    visited_count: Number,
    voteup_count: Number,
    author: Object,
    question: Object,
    relationship: Object,
})
const ZhiHuAnswerModel = model('zhihu_answer', ZhiHuAnswerSchema)
const ZhiHuArticleSchema = new Schema({
    id: Number,
    type: String,
    url: String,
    author: Object,
    title: String,
    comment_permission: String,
    created: Number,
    updated: Number,
    voteup_count: Number,
    voting: Number,
    comment_count: Number,
    linkbox: Object,
    excerpt: String,
    excerpt_new: String,
    preview_type: String,
    preview_text: String,
    column: Object,
    content: String,
    is_labeled: String,
    visited_count: String,
    favorite_count: String
})
const ZhiHuArticleModel = model('zhihu_article', ZhiHuArticleSchema)
const ZhiHuZVideoSchema = new Schema({
    id: String,
    type: String,
    title: String,
    description: String,
    vote_count: Number,
    comment_count: Number,
    author: Object,
    thumbnail_extra_info: Object,
    play_count: Number,
    excerpt: String
})
const ZhiHuZVideoModel = model('zhihu_zvideo', ZhiHuZVideoSchema)


async function saveZhiHuAuthor(author: any) {
    let zhiHuAuthor = await ZhiHuAuthorModel.findOne({ id: author.id })
    if (zhiHuAuthor) {
        await ZhiHuAuthorModel.updateOne({ id: author.id }, author)
    } else {
        zhiHuAuthor = new ZhiHuAuthorModel(author)
        await zhiHuAuthor.save()
    }
    return zhiHuAuthor;
}
async function saveZhiHuQuestion(question: any) {
    let zhiHuQuestion = await ZhiHuQuestionModel.findOne({ id: question.id })
    if (zhiHuQuestion) {
        await ZhiHuQuestionModel.updateOne({ id: question.id }, { ...question })
    } else {
        zhiHuQuestion = new ZhiHuQuestionModel(question)
        await zhiHuQuestion.save()
    }
    return zhiHuQuestion;
}
async function saveZhiHuRecomment(item: any) {
    try {
        const { target } = item;
        const { type } = target;
        if (type === 'article') {
            await saveZhiHuArticle(item)
        } else if (type === 'answer') {
            await saveZhiHuAnswer(item)
        } else if (type === 'zvideo') {
            await saveZhiHuZVideo(item)
        } else {
            console.log({ type, item })
        }
    } catch (e) {
        throw e;
    }
}
async function saveZhiHuZVideo(item: any) {
    const { target } = item;
    const { author, id } = target;
    await saveZhiHuAuthor(author)
    let zhiHuZVideo = await ZhiHuZVideoModel.findOne({ id })
    if (zhiHuZVideo) {
        await ZhiHuZVideoModel.updateOne({ id }, { ...target })
    } else {
        zhiHuZVideo = new ZhiHuZVideoModel(target)
        await zhiHuZVideo.save()
    }
    return zhiHuZVideo.toJSON();
}
async function saveZhiHuArticle(item: any) {
    const { target } = item;
    const { author, id } = target;
    await saveZhiHuAuthor(author)
    let zhiHuRecomment = await ZhiHuArticleModel.findOne({ id })
    if (zhiHuRecomment) {
        await ZhiHuArticleModel.updateOne({ id }, { ...target })
    } else {
        zhiHuRecomment = new ZhiHuArticleModel(target)
        await zhiHuRecomment.save()
    }
    return zhiHuRecomment.toJSON();
}
async function saveZhiHuAnswer(item: any) {
    const { target } = item;
    const { id, author, question } = target;
    await saveZhiHuAuthor(author)
    await saveZhiHuQuestion(question)
    let zhiHuRecomment = await ZhiHuAnswerModel.findOne({ id })
    if (zhiHuRecomment) {
        await ZhiHuAnswerModel.updateOne({ id }, { ...target })
    } else {
        zhiHuRecomment = new ZhiHuAnswerModel(target)
        await zhiHuRecomment.save()
    }
    return zhiHuRecomment.toJSON();
}

export async function saveZhiHuRecomments(data: any[]) {
    return await Promise.all(data.map(item => saveZhiHuRecomment(item)))
}

export async function saveZhiHuHot(json: any) {
    const { data } = json;
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()
    const day = now.getDate()
    await ZhiHuHotModel.deleteMany({
        day, year, month
    })
    return Promise.all(data.map(async (item: any) => {
        const { target, feed_specific } = item;
        const { image_area, excerpt_area, metrics_area, title_area, link } = target;
        const zhiHuHot = new ZhiHuHotModel({
            title: title_area.text,
            desc: excerpt_area.text,
            url: link.url,
            hot: metrics_area.text,
            image: image_area.url,
            answer_count: feed_specific.answer_count,
            year,
            month,
            day
        })
        await zhiHuHot.save()
    }))
}