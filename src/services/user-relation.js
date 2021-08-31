/**
 * @description 用户关系
 * @author 凉风有信、
 */

const { User, UserRelation } = require('../db/model/index')
const { formatUser } = require('./_format')
const Sequelize = require('sequelize')

/**
 * 获取关注该用户的用户列表
 * @param {string} followerId 
 */
async function getUserByFollower (followerId) {
    const result = await User.findAndCountAll({
        attributes: ['id', 'nikeName', 'userName', 'picture'],
        order: [
            ['id', 'desc']
        ],
        include: [
            {
                model: UserRelation,
                where: {
                    followerId,
                    userId: {
                        [Sequelize.Op.ne]: followerId
                    }
                }
            }
        ]
    })
    // result.count 是查询总数
    // result.rows 是查询结果、数组
    
    // 格式化
    let userList = result.rows.map(row => row.dataValues)
    userList = formatUser(userList)

    return {
        count: result.count,
        userList
    }
}

/**
 * 获取关注人列表
 * @param {*} userId 
 */
async function getFollowersByUser (userId) {
    const result = await UserRelation.findAndCountAll({
        order: [
            ['id', 'desc']
        ],
        include: [
            {
                model: User,
                attributes: ['id', 'nikeName', 'userName', 'picture']
            }
        ],
        where: {
            userId,
            followerId: {
                [Sequelize.Op.ne]: userId
            }
        }
    })

    // 格式化
    let userList = result.rows.map(row => row.dataValues)
    userList = userList.map(item => {
        let user = item.user.dataValues
        user = formatUser(user)
        return user
    })

    return {
        count: result.count, // 查询出来的总数
        userList
    }
}

/**
 * 关注数据层
 * @param {*} userId 用户id
 * @param {*} followerId 被关注用户id
 */
async function addFollower (userId, followerId) {
    const result = await UserRelation.create({
        userId,
        followerId
    })
    return result.dataValues
}

async function deleteFollower (userId, followerId) {
    const result = await UserRelation.destroy({
        where: {
            userId,
            followerId
        }
    })
    return result > 0
}

module.exports = {
    getUserByFollower,
    addFollower,
    deleteFollower,
    getFollowersByUser
}