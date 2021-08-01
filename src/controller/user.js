/**
 * @description user controller
 * @author 凉风有信、
 */

const { getUserInfo } = require('../services/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
/**
 * 用户名是否存在
 * @param {string} userName 用户名
 */
async function isExist(userName) {
    // 业务逻辑处理

    // 调用service获取数据
    const userInfo = await getUserInfo(userName)

    if (userInfo) {
        // 用户名已存在
        return new SuccessModel(userInfo)
    } else {
        // 用户名不存在
        return new ErrorModel({
            error: 10003,
            message: '用户名未存在'
        })
    }
}

module.exports = {
    isExist
}