/**
 * @description 用户关系---粉丝
 * @author 凉风有信、
 */

const { SuccessModel } = require('../model/ResModel')
const { getUserByFollower } = require('../services/user-relation')
 
/**
 * 根据用户id获取粉丝列表
 * @param {string} userId 
 */
async function getFans (userId) {
    const { count, userList } = await getUserByFollower(userId)
    return new SuccessModel({
        count,
        userList
    })
}

module.exports = {
    getFans
}