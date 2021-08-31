/**
 * @description 个人主页API路由
 * @author 凉风有信、
 */

const router = require('koa-router')()
router.prefix('/api/profile')

const { loginCheck } = require('../../middlewares/loginChecks')
const { getProfileBlogList } = require('../../controller/blog-profile')
const { follow, unfollow } = require('../../controller/user-relation')
// 将微博列表替换为字符串
const { getBlogListString } = require('../../untils/blog')

// 加载更多
router.get('/loadMore/:userName/:pageIndex', loginCheck, async (ctx, next) => {
    let { userName, pageIndex } = ctx.params
    console.log(pageIndex)
    pageIndex = parseInt(pageIndex)
    const result = await getProfileBlogList(userName, pageIndex)
    // 渲染为html字符串
    result.data.blogListTpl = getBlogListString(result.data.blogList)
    // 返回
    ctx.body = result
})

// 关注和取消关注
router.post('/follow', loginCheck, async (ctx, next) => {
    const { id: myUserId } = ctx.session.userInfo
    const { userId: curUserId } = ctx.request.body
    // controller
    ctx.body = follow(myUserId, curUserId)
})
router.post('/unfollow', loginCheck, async (ctx, next) => {
    const { id: myUserId } = ctx.session.userInfo
    const { userId: curUserId } = ctx.request.body
    // controller
    ctx.body = unfollow(myUserId, curUserId)
})


module.exports = router