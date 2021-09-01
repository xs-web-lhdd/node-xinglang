/**
 * @description 博客首页路由
 * @author 凉风有信、
 */

const router = require('koa-router')()
const { loginCheck } = require('../../middlewares/loginChecks')
const { create } = require('../../controller/blog-home')
const { genValidator } = require('../../middlewares/validator')
const { blogValidate } = require('../../validator/blog')
// 加载更多
const { getSquareBlogList } = require('../../controller/blog-square')
const { getBlogListString } = require('../../untils/blog')

router.prefix('/api/blog')

// 创建微博
router.post('/create', loginCheck, genValidator(blogValidate), async (ctx, next) => {
    const { content, image } = ctx.request.body
    const { id: userId } = ctx.session.userInfo
    ctx.body = await create({content, userId, image})
})

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