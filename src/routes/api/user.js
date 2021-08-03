/**
 * @description user API路由
 * @author 凉风有信、
 */

const router = require('koa-router')()
const { isExist, register, login, changerInfo } = require('../../controller/user')
const { userValidate } = require('../../validator/user')
const { genValidator } = require('../../middlewares/validator')
const { loginCheck } = require('../../middlewares/loginChecks')
router.prefix('/api/user')

// 注册路由
router.post('/register', genValidator(userValidate), async (ctx, next) => {
    const { userName, password, gender } = ctx.request.body
    ctx.body = await register({ userName, password, gender })
})

// 用户名是否存在
router.post('/isExist', async (ctx, next) => {
    const { userName } = ctx.request.body
    ctx.body = await isExist(userName)
})

// 登录
router.post('/login', async (ctx, next) => {
    const { userName, password } = ctx.request.body
    ctx.body = await login({ctx, userName, password})
})

// 修改个人信息
router.patch('/changeInfo', async (ctx, next) => {
    const { nikename, city, picture } = ctx.request.body
    ctx.body = await changerInfo(ctx, {nikename, city, picture})
})

module.exports = router