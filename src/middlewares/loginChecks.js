/**
 * @description 登录验证的中间件
 * @author 凉风有信、
 */

const { loginCheckFailInfo } = require('../model/ErrorInfo')
const { ErrorModel } = require('../model/ResModel')

/**
 * API登录校验
 * @param {Object} ctx ctx
 * @param {Function} next next
 */
async function loginCheck(ctx, next) {
    if (ctx.session && ctx.session.userInfo) {
        await next()
        return
    }
    // 未登录
    ctx.body = new ErrorModel(loginCheckFailInfo)
}

/**
 * view页面登录校验
 * @param {Object} ctx ctx
 * @param {Function} next next
 */
async function loginRedirect(ctx, next) {
    if (ctx.session && ctx.session.userInfo) {
        await next()
        return
    }
    // 未登录
    const curUrl = ctx.url
    ctx.redirect('/login?url=' + encodeURIComponent(curUrl)) 
}


module.exports = {
    loginCheck,
    loginRedirect
}