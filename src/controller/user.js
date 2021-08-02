/**
 * @description user controller
 * @author 凉风有信、
 */

const { getUserInfo, createUser } = require('../services/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { doCrypto } = require('../untils/cryp')
const { 
    userMsgNotExist, userMsgExist, registerFail 
} = require('../model/ErrorInfo')
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
        return new ErrorModel(userMsgNotExist)
    }
}

/**
 * 
 * @param {string} userName 用户名
 * @param {string} password 密码
 * @param {number} gender 性别（1是男 2是女 三是保密）
 */
async function register({ userName, password, gender }) {
    const userInfo = await getUserInfo(userName)
    if (userInfo) {
        return new ErrorModel(userMsgExist)
    }
    // 实现注册 service
    try {
        await createUser({
            userName,
            password: doCrypto(password),
            gender
        })
        return new SuccessModel()
    } catch (ex) {
        console.error(ex.message, ex.stack)
        return new ErrorModel(registerFail)
    }

}

module.exports = {
    isExist,
    register
}