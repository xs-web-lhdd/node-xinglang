/**
 * @description json schema验证
 * @author 凉风有信、
 */

const { ErrorModel } = require('../model/ResModel')
// 引入错误信息
const { jsonSchemaFileInfo } = require('../model/ErrorInfo')
/**
 * 生成验证json schema中间件
 * @param {function} userValidate 验证函数
 */
function genValidator(ValidateFn) {
    // 定义中间件函数
    async function validator (ctx, next) {
        // 格式校验
        const data = ctx.request.body
        const error = ValidateFn(data)
        if (error) {
            // 验证失败---返回错误不往下执行
            ctx.body = new ErrorModel(jsonSchemaFileInfo)
            return
        }
        // 验证成功---next继续执行
        await next()
    }
    // 返回中间件
    return validator
}

module.exports = {
    genValidator
}