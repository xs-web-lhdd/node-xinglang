/**
 * @description 微博 @ 用户关系 services
 * @author 凉风有信、
 */

const { AtRelation } = require('../db/model')

/**
 * 创建微博 @ 用户关系
 * @param {number} blogId 微博 id
 * @param {number} userId 用户 id
 */
async function createAtRelation (blogId, userId) {
    const result = await AtRelation.create({
        blogId,
        userId
    })
    return result.dataValues
}

/**
 * 获取 @ 用户数量
 * @param {number} userId userId
 */
async function getAtRelationCount (userId) {
    const res = await AtRelation.findAndCountAll({
        where: {
            userId,
            isRead: false
        }
    })
    return res.count
}

module.exports = {
    createAtRelation,
    getAtRelationCount
}