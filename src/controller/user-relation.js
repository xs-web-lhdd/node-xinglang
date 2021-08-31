/**
 * @description 用户关系---粉丝
 * @author 凉风有信、
 */

const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { getUserByFollower, addFollower, deleteFollower } = require('../services/user-relation')
const { addFollowerFailInfo, deleteFollowerFailInfo } = require('../model/ErrorInfo')
 
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

/**
 * 关注的controller
 * @param {*} myUserId 当前登录的用户id
 * @param {*} curUserId 要关注的用户id
 */
async function follow (myUserId, curUserId) {
    try {
        await addFollower(myUserId, curUserId)
        return new SuccessModel()
    } catch (error) {
        console.log(error.stack)
        return new ErrorModel(deleteFollowerFailInfo)
    }
}

/**
 * 取消关注的controller
 * @param {*} myUserId 当前登录的用户id
 * @param {*} curUserId 要关注的用户id
 */
async function unfollow (myUserId, curUserId) {
    const res = await deleteFollower(myUserId, curUserId)
    if (res) {
        return new SuccessModel()
    }
    return new ErrorModel(addFollowerFailInfo)
}

module.exports = {
    getFans,
    follow,
    unfollow
}