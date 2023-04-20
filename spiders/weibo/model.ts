import { Schema, model } from 'mongoose'

const WeiboUserSchema = new Schema({
    avatar_hd: String,
    avatar_large: String,
    domain: String,
    follow_me: Boolean,
    following: Boolean,
    icon_list: Array,
    id: Number,
    idstr: String,
    mbrank: Number,
    mbtype: Number,
    pc_new: Number,
    planet_video: Boolean,
    profile_image_url: String,
    profile_url: String,
    screen_name: String,
    v_plus: Number,
    verified: Boolean,
    verified_type: Number,
    weihao: String
})

const WeiboUserModel = model('weibo_user', WeiboUserSchema)

export async function saveWeiboUser(item: any) {
    let weiboArticle = await WeiboUserModel.findOne({ id: item.id })
    if (!weiboArticle) {
        weiboArticle = new WeiboUserModel(item)
        await weiboArticle.save()
    } else {
        await WeiboUserModel.updateOne({ id: item.id }, item)
    }
}

const WeiboTimelineSchema = new Schema({
    annotations: Array,
    attitudes_count: Number,
    attitudes_status: Number,
    buttons: Array,
    can_edit: Boolean,
    comment_manage_info: Object,
    comments_count: Number,
    content_auth: Number,
    created_at: Date,
    customIcons: Array,
    extra_button_info: Object,
    favorited: Boolean,
    followBtnCode: Object,
    geo: Object,
    hide_from_prefix: Number,
    id: Number,
    idstr: String,
    isLongText: Boolean,
    is_controlled_by_server: Number,
    is_paid: Boolean,
    is_show_bulletin: Number,
    mblog_menus_new: Array<Object>,
    mblog_vip_type: Number,
    mblogid: String,
    mblogtype: Number,
    mid: String,
    mlevel: Number,
    number_display_strategy: Object,
    page_info: Object,
    pic_ids: Array,
    pic_num: Number,
    pictureViewerSign: Boolean,
    rcList: Array,
    region_name: String,
    reposts_count: Number,
    rid: String,
    share_repost_type: Number,
    showFeedComment: Boolean,
    showFeedRepost: Boolean,
    showPictureViewer: Boolean,
    source: String,
    text: String,
    textLength: Number,
    text_raw: String,
    title: Object,
    url_struct: Object,
    user: Object,
    visible: Object
})

const WeiboTimelineModel = model('weibo_timeline', WeiboTimelineSchema)
export async function saveWeiboTimelines(items: any[]) {
    return Promise.all(items.map(item => saveWeiboTimeline(item)))
}
export async function saveWeiboTimeline(item: any) {
    let weiboArticle = await WeiboTimelineModel.findOne({ id: item.id })
    await saveWeiboUser(item.user)
    if (!weiboArticle) {
        weiboArticle = new WeiboTimelineModel(item)
        await weiboArticle.save()
    } else {
        await WeiboTimelineModel.updateOne({ id: item.id }, item)
    }
}

export const WeiboTopicSchema = new Schema({
    category: String,
    claim: String,
    images_url: String,
    mblog: Object,
    mention: Number,
    mid: String,
    rank: Number,
    read: Number,
    summary: String,
    topic: String
})

export const WeiboTopicModel = model('weibo_topic', WeiboTopicSchema)
export async function saveWeiboTopics(items: any[]) {
    return await Promise.all(items.map(item => saveWeiboTopic(item)))
}
export async function saveWeiboTopic(item: any) {
    let weiboArticle = await WeiboTopicModel.findOne({ mid: item.mid })
    if (!weiboArticle) {
        weiboArticle = new WeiboTopicModel(item)
        await weiboArticle.save()
    } else {
        await WeiboTopicModel.updateOne({ mid: item.mid }, item)
    }
}

const WeiboHotSearchSchema = new Schema({
    ad_info: Object,
    category: String,
    channel_type: String,
    emoticon: String,
    expand: Number,
    extension: Number,
    flag: Number,
    fun_word: Number,
    icon_desc: String,
    icon_desc_color: String,
    is_new: Number,
    label_name: String,
    note: String,
    num: Number,
    onboard_time: Number,
    rank: Number,
    raw_hot: Number,
    realpos: Number,
    small_icon_desc: String,
    small_icon_desc_color: String,
    star_name: Object,
    star_word: Number,
    subject_label: String,
    subject_querys: Object,
    topic_flag: Number,
    word: String,
    word_scheme: String
})

const WeiboHotSearchModel = model('weibo_hot_search', WeiboHotSearchSchema)

export async function saveWeiboHotSearchs(items: any[]) {
    return await Promise.all(items.map(item => saveWeiboHotSearch(item)))
}
export async function saveWeiboHotSearch(item: any) {
    let weiboArticle = await WeiboHotSearchModel.findOne({ note: item.note, category: item.category })
    if (!weiboArticle) {
        weiboArticle = new WeiboHotSearchModel(item)
        await weiboArticle.save()
    } else {
        await WeiboHotSearchModel.updateOne({ note: item.note, category: item.category }, item)
    }
}

const WeiboEntertainmentSchema = new Schema({
    ad_info: Object,
    category: String,
    circle_hot: Number,
    display_flag: String,
    emoticon: String,
    ever_in_board: String,
    expand: Number,
    flag: Number,
    grade: String,
    hot_num: Number,
    hot_rank_position: Number,
    icon_desc: String,
    icon_desc_color: String,
    imp_support: Number,
    imp_support_time: Number,
    is_hot: Number,
    main_board_flag: Number,
    manual_grade: String,
    mid: String,
    note: String,
    num: Number,
    on_main_board_time: Number,
    onboard_time: Number,
    out_index: Number,
    realpos: Number,
    scene_flag: Number,
    small_icon_desc: String,
    small_icon_desc_color: String,
    star_name: Array<String>,
    subject_querys: Object,
    topic_flag: Number,
    topic_image: String,
    word: String,
    word_scheme: String
})


const WeiboEntertainmentModel = model('weibo_entertainment', WeiboEntertainmentSchema)

export async function saveWeiboEntertainments(items: any[]) {
    return await Promise.all(items.map(item => saveWeiboEntertainment(item)))
}
export async function saveWeiboEntertainment(item: any) {
    let weiboArticle = await WeiboEntertainmentModel.findOne({ note: item.note, category: item.category })
    if (!weiboArticle) {
        weiboArticle = new WeiboEntertainmentModel(item)
        await weiboArticle.save()
    } else {
        await WeiboEntertainmentModel.updateOne({ note: item.note, category: item.category }, item)
    }
}

const WeiboNewsSchema = new Schema({
    category: String,
    claim: String,
    dot_icon: Number,
    images_url: String,
    mention: Number,
    rank: Number,
    read: Number,
    summary: String,
    topic: String
})

const WeiboNewsModel = model('weibo_news', WeiboNewsSchema)

export async function saveWeiboNews(items: any[]) {
    return await Promise.all(items.map(item => saveWeiboNew(item)))
}
export async function saveWeiboNew(item: any) {
    let weiboArticle = await WeiboNewsModel.findOne({ topic: item.topic, category: item.category })
    if (!weiboArticle) {
        weiboArticle = new WeiboNewsModel(item)
        await weiboArticle.save()
    } else {
        await WeiboNewsModel.updateOne({ topic: item.topic, category: item.category }, item)
    }
}