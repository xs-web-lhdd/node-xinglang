/**
 * @description 微博 @ 关系controller
 * @author 凉风有信、
 */

const { PAGE_SIZE } = require('../config/constants')
const { SuccessModel } = require('../model/ResModel')
const { getAtRelationCount, getAtUserBlogList } = require('../services/at-relation')
const { updateAtRelation } = require('../services/at-relation')

/**
 * 获取 @ 我的微博数量
 * @param {*} userId userId
 */
async function getAtMeCount (userId) {
    // service拿到数量
    const count = await getAtRelationCount(userId)
    return new SuccessModel({
        count
    })
}

/**
 * 获取 @ 我的微博列表
 * @param {number} userId userId
 * @param {number} pageIndex pageIndex
 */
async function getAtMeBlogList (userId, pageIndex = 0) {  
    // service
    const res = await getAtUserBlogList({ userId, pageIndex, pageSize: PAGE_SIZE })
    const { count, blogList } = res
    // 返回
    return new SuccessModel({
        isEmpty: blogList.length === 0,
        blogList,
        pageSize: PAGE_SIZE,
        pageIndex,
        count
    })
}

/**
 * 标记为已读
 * @param {string} userId userId
 */
async function markAsRead (userId) {
    try {
        const res = await updateAtRelation({ newIsRead: true }, { userId, isRead: false })
    } catch (error) {
        console.log(error.stack)
    }
    // 无需返回
    // return new SuccessModel()
}

module.exports = {
    getAtMeCount,
    getAtMeBlogList,
    markAsRead
}