/**
 * @description user service
 * @author 凉风有信、
 */

const { User } = require('../db/model/index')
const { formatUser } = require('./_format')
const { addFollower } = require('./user-relation')

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
    const data = result.dataValues

    // 自己关注自己（为了方便首页获取数据）
    addFollower(data.id, data.id)
    
    return data
}

/**
 * 更新用户信息
 * @param {Object} param0 要修改的内容 {newPassword, newCity, newPicture, newNikename}
 * @param {Object} param1 要查询的条件 {userName, password}
 */
async function updateUser({newPassword, newCity, newPicture, newNikename}, {userName, password}) {
    // 拼接修改内容
    const updateData = {}
    if (newPassword) {
        updateData.password = newPassword
    }
    if (newCity) {
        updateData.city = newCity
    }
    if (newPicture) {
        updateData.picture = newPicture
    }
    if (newNikename) {
        updateData.nikename = newNikename
    }
    // 拼接查询条件
    const whereData = {
        userName
    }
    if (password) {
        whereData.password = password
    }
    // 修改
    const result = await User.update(updateData, {
        where: whereData
    })
    // 修改成功行数为 1 就会代表修改成功
    return result[0] > 0
}


module.exports = {
    getUserInfo,
    createUser,
    updateUser
}