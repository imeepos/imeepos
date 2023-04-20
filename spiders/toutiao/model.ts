import { Schema, model } from 'mongoose'
import { md5 } from '../utils'
const TouTiaoKeywordSchema = new Schema({
    expiration_timestamp: Number,
    query: String,
    query_id: Number,
    query_id_string: String
})
const TouTiaoKeywordModel = model('toutiao_keyword', TouTiaoKeywordSchema)
export async function saveTouTiaoKeywords(items: any[]) {
    return Promise.all(items.map(item => saveTouTiaoKeyword(item)))
}
export async function saveTouTiaoKeyword(item: any) {
    let weiboArticle = await TouTiaoKeywordModel.findOne({ query_id: item.query_id })
    if (!weiboArticle) {
        weiboArticle = new TouTiaoKeywordModel(item)
        await weiboArticle.save()
    } else {
        await TouTiaoKeywordModel.updateOne({ query_id: item.query_id }, item)
    }
}


const TouTiaoHotBoardSchema = new Schema({
    ClusterId: Number,
    ClusterIdStr: { type: String, require: false },
    ClusterType: Number,
    HotValue: String,
    Image: Object,
    InterestCategory: Array,
    Label: String,
    LabelDesc: String,
    LabelUri: Object,
    LabelUrl: String,
    QueryWord: String,
    Schema: String,
    Title: String,
    Url: String,
    Key: String,
    CreateTime: Date,
    UpdateTime: Date
})

const TouTiaoHotBoardModel = model('toutiao_hot_board', TouTiaoHotBoardSchema)
export async function saveTouTiaoHotBoards(items: any[]) {
    return Promise.all(items.map(item => saveTouTiaoHotBoard(item)))
}
export async function saveTouTiaoHotBoard(item: any) {
    try {
        if (item.Url) {
            const Key = md5(item.Url)
            let weiboArticle = await TouTiaoHotBoardModel.findOne({ Key })
            if (!weiboArticle) {
                item.CreateTime = new Date()
                weiboArticle = new TouTiaoHotBoardModel(item)
                await weiboArticle.save()
            } else {
                item.UpdateTime = new Date()
                await TouTiaoHotBoardModel.updateOne({ Key }, item)
            }
        }
    } catch (e) {
        console.log((e as Error).message, item.Url)
    }
}
const TouTiaoFeedSchema = new Schema({
    abstract: String,
    action_extra: Object,
    activity_label: Object,
    aggr_type: Number,
    allow_download: Boolean,
    anchor_info: Object,
    article_sub_type: Number,
    article_type: Number,
    article_url: String,
    ban_comment: Number,
    ban_danmaku: Number,
    ban_danmaku_send: Number,
    ban_immersive: Number,
    behot_time: Number,
    biz_id: Number,
    bury_count: Number,
    bury_style_show: Number,
    businessExtra: Object,
    can_comment_level: Number,
    categories: Array,
    cell_flag: Number,
    cell_type: Number,
    cloud_content_video_type: Number,
    comment_count: Number,
    common_raw_data: String,
    composition: Number,
    content_decoration: String,
    control_meta: Object,
    cursor: Number,
    danmaku_count: Number,
    data_type: Number,
    decoupling_category_name: String,
    default_danmaku: Number,
    detail_schema: String,
    digg_count: Number,
    display_url: String,
    extensions_ad_raw_data: Object,
    filter_words: Array,
    first_frame_image: Object,
    followers_count: Number,
    gid: String,
    group_flags: Number,
    group_id: String,
    group_source: Number,
    has_video: Boolean,
    history_duration: Number,
    id: String,
    immerse_enter_from: String,
    impression_count: Number,
    is_enter_mixed_stream: Boolean,
    is_key_video: Boolean,
    is_original: Boolean,
    is_subscribe: Boolean,
    itemCell: Object,
    item_id: String,
    item_id_str: String,
    large_image_list: Array,
    log_pb: Object,
    lynx_server: Object,
    lynx_template: Object,
    media_info: Object,
    media_name: String,
    middle_image: Object,
    mobile_preview_vid: String,
    near_id: Number,
    near_id2: Number,
    near_id3: Number,
    play_auth_token: String,
    play_biz_token: String,
    publish_time: Number,
    rank: Number,
    read_count: Number,
    repin_count: Number,
    req_id: String,
    review_visibility_reason: String,
    share_count: Number,
    share_info: Object,
    share_url: String,
    show_more: Object,
    show_portrait: Boolean,
    show_portrait_article: Boolean,
    source: String,
    source_open_url: String,
    tag: String,
    title: String,
    user_bury: Number,
    user_digg: Number,
    user_info: Object,
    user_repin: Number,
    user_repin_time: Number,
    user_verified: Number,
    verified_content: String,
    verify_reason: String,
    verify_status: Number,
    video_detail_info: Object,
    video_duration: Number,
    video_exclusive: Boolean,
    video_id: String,
    video_like_count: Number,
    video_play_info: String,
    video_proportion: Number,
    video_proportion_article: Number,
    video_style: Number,
    video_user_like: Number,
    visibility_level: Number,
    xi_related: Boolean
})

const TouTiaoFeedModel = model('toutiao_feed', TouTiaoFeedSchema)

export async function saveTouTiaoFeeds(items: any[]) {
    return Promise.all(items.map(item => saveTouTiaoFeed(item)))
}
export async function saveTouTiaoFeed(item: any) {
    const { id } = item;
    if (id) {
        let weiboArticle = await TouTiaoFeedModel.findOne({ id })
        if (!weiboArticle) {
            weiboArticle = new TouTiaoFeedModel(item)
            await weiboArticle.save()
        } else {
            await TouTiaoFeedModel.updateOne({ id }, item)
        }
    }
}
