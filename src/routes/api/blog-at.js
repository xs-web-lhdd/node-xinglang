/**
 * @description 加载更多
 * @author 凉风有信、
 */

const router = require('koa-router')()
router.prefix('/api/atMe')

const { loginCheck } = require('../../middlewares/loginChecks')
const { getAtMeBlogList } = require('../../controller/blog-at')
const { getBlogListString } = require('../../untils/blog')

// 加载更多
router.get('/loadMore/:pageIndex', loginCheck, async (ctx, next) => {
    let { pageIndex } = ctx.params
    pageIndex = parseInt(pageIndex)
    const { id: userId } = ctx.session.userInfo
    const result = await getAtMeBlogList(userId, pageIndex)
    // 渲染为html字符串
    result.data.blogListTpl = getBlogListString(result.data.blogList)
    // 返回
    ctx.body = result
})

module.exports = router