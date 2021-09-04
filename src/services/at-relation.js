/**
 * @description 微博 @ 用户关系 services
 * @author 凉风有信、
 */

const { AtRelation, User, Blog } = require('../db/model')
const { formatBlog, formatUser } = require('./_format')

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

/**
 * 获取 @ 用户的微博列表
 * @param {*} param0 
 */
async function getAtUserBlogList ({ userId, pageIndex, pageSize}) {
    const res = await Blog.findAndCountAll({
        offset: pageIndex * pageSize,
        limit: pageSize,
        order: [
            ['id', 'desc']
        ],
        include: [
            {
                model: AtRelation,
                where: { userId },
                attribute: ['userId', 'blogId']
            },
            {
                model: User,
                attribute: ['userName', 'nikeName', 'picture']
            }
        ]
    })
    // res.rows 每一列
    // res.count 总数量
    // 格式化博客
    let blogList = res.rows.map(item => item.dataValues)
    blogList = formatBlog(blogList)
    // 格式化用户信息
    blogList = blogList.map(blogItem => {
        blogItem.user = formatUser(blogItem.user.dataValues)
        return blogItem
    })
    return {
        count: res.count,
        blogList
    }
}

module.exports = {
    createAtRelation,
    getAtRelationCount,
    getAtUserBlogList
}