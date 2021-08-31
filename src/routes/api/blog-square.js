/**
 * @description 个人主页API路由
 * @author 凉风有信、
 */

const router = require('koa-router')()
router.prefix('/api/square')
 
const { loginCheck } = require('../../middlewares/loginChecks')
const { getSquareBlogList } = require('../../controller/blog-square')
// 将微博列表替换为字符串
const { getBlogListString } = require('../../untils/blog')
 
// 加载更多
router.get('/loadMore/:pageIndex', loginCheck, async (ctx, next) => {
    let { pageIndex } = ctx.params
    pageIndex = parseInt(pageIndex)
    const result = await getSquareBlogList(pageIndex)
    // 渲染为html字符串
    result.data.blogListTpl = getBlogListString(result.data.blogList)
    // 返回
    ctx.body = result
})
 
 
 
module.exports = router