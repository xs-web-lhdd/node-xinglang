/**
 * @description user service
 * @author 凉风有信、
 */

const { User } = require('../db/model/index')
const { formatUser } = require('./_format')

/**
 * 获取用户信息
 * @param {string} userName 用户名
 * @param {string} password 密码
 */
async function getUserInfo(userName, password) {
    // 查询条件
    const whereOpt = {
        userName
    }
    if (password) {
        Object.assign(whereOpt, { password })
    }
    // 查询
    const result = await User.findOne({
        attributes: ['id', 'userName', 'nikename', 'picture', 'city'],
        where: whereOpt
    })
    if (result === null) {
        // 未找到
        return result
    }
    // 格式化处理
    const formatRes = formatUser(result.dataValues)
    return formatRes
}


/**
 * 
 * @param {string} userName 用户名
 * @param {string} password 密码
 * @param {string} gender 性别
 * @param {string} nikename 昵称
 */
async function createUser({ userName, password, gender = 3, nikename }) {
    const result = await User.create({
        userName,
        password,
        nikename : nikename ? nikename : userName,
        gender
    })
    return result.dataValues
}

module.exports = {
    getUserInfo,
    createUser
}