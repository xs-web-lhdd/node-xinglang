/**
 * @description 个人主页API路由
 * @author 凉风有信、
 */

const router = require('koa-router')()
router.prefix('/api/profile')

const { loginCheck } = require('../../middlewares/loginChecks')
const { getProfileBlogList } = require('../../controller/blog-profile')
// 将微博列表替换为字符串
const { getBlogListString } = require('../../untils/blog')

// 加载更多
router.get('/loadMore/:userName/:pageIndex', loginCheck, async () => {
    const { userName, pageIndex } = ctx.params
    pageIndex = parseInt(pageIndex)
    const result = await getProfileBlogList(userName, pageIndex)
    // 渲染为html字符串
    result.data.blogListTpl = getBlogListString(result.data.blogList)
})



module.exports = router