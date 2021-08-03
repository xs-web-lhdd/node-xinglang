/**
 * @description user controller
 * @author 凉风有信、
 */

const { getUserInfo, createUser, updateUser } = require('../services/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { doCrypto } = require('../untils/cryp')
const { 
    userMsgNotExist, userMsgExist, registerFail, loginFailInfo, changeInfoFailInfo,
    changePasswordFailInfo
} = require('../model/ErrorInfo')
/**
 * 用户名是否存在
 * @param {string} userName 用户名
 */
async function isExist(userName) {
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
 * 注册函数
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

/**
 * 登录函数
 * @param {Object} ctx koa ctx信息
 * @param {string} userName 用户名
 * @param {string} password 密码
 */
async function login({ ctx, userName, password }) {
    // 获取用户信息
    const userInfo = await getUserInfo(userName, doCrypto(password))
    if (!userInfo) {
        // 登陆失败
        return new ErrorModel(loginFailInfo)
    }

    // 登录成功
    // if (ctx.session.userInfo === null) {
    ctx.session.userInfo = userInfo
    // }
    return new SuccessModel()
}

/**
 * 修改基本信息
 * @param {Object} ctx ctx
 * @param {string} nikename 昵称
 * @param {string} city 城市
 * @param {string} picture 头像
 */
async function changerInfo(ctx, {nikename, city, picture}) {
    const { userName } = ctx.session.userInfo
    // serivce修改
    const result = await updateUser(
        {
            newCity: city,
            newNikename: nikename,
            newPicture: picture
        },
        {
            userName
        }
    )
    if (result) {
        // 执行成功
        Object.assign(ctx.session.userInfo, {
            nikename,
            city,
            picture
        })
        return new SuccessModel()
    }
    return new ErrorModel(changeInfoFailInfo)
}

/**
 * 更改用户密码
 * @param {string} userName 用户名
 * @param {string} password 密码
 * @param {string} newPassword 新密码
 */
async function changePassword(userName ,password, newPassword) {
    const result = await updateUser(
        {
            newPassword: doCrypto(newPassword)
        },
        {
            userName,
            password: doCrypto(password)
        }
    )
    if (result) {
        // 执行成果
        return new SuccessModel()
    }
    return new ErrorModel(changePasswordFailInfo)
}

/**
 * 退出登录
 * @param {Object} ctx ctx
 */
async function logout(ctx) {
    delete ctx.session.userInfo
    return new SuccessModel()
}

module.exports = {
    isExist,
    register,
    login,
    changerInfo,
    changePassword,
    logout
}