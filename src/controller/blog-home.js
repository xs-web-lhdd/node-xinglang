/**
 * @description 微博首页
 * @author 凉风有信、
 */

const xss = require('xss')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { createBlogFailInfo } = require('../model/ErrorInfo')
const { createBlog, getFollowerBlogList } = require('../services/blog')
const { PAGE_SIZE, REG_FOR_AT_WHO } = require('../config/constants')
const { getUserInfo } = require('../services/user')
const { createAtRelation } = require('../services/at-relation')

/**
 * 创建微博
 * @param {Object} params 创建微博所需要的参数 {content, image, id}
 */
async function create({userId, content, image}) {
    // 分析content中@的用户
    // content例如： 你好@王五 - wangwu，你好@李四 - lisi
    const atUserNameList = []
    content = content.replace(
        REG_FOR_AT_WHO,
        (matchStr, nikeName, userName) => {
            // 目的是获取用户名
            atUserNameList.push(userName)
            return matchStr // 让替换不生效，然而获取用户名
        }
    )

    // 根据 @ 用户名获取用户信息
    const atUserList = await Promise.all(
        atUserNameList.map(userName => getUserInfo(userName))
    )
    // 根据用户信息获取用户 id
    const atUserIdList = atUserList.map(userInfo => userInfo.id)
    console.log('=====================',atUserIdList)

    try {
        const blog = await createBlog({
            userId,
            content: xss(content),
            image
        })

        // 创建 @ 关系
        // blog.id
        await Promise.all(
            atUserIdList.map(userId => createAtRelation(blog.id, userId))
        )
        
        // 返回

        return new SuccessModel(blog)
    } catch (ex) {
        console.error(ex.message, ex.stack)
        return ErrorModel(createBlogFailInfo)
    }
}

/**
 * 获取首页微博列表
 * @param {*} userId 用户id
 * @param {*} pageIndex 页数
 */
async function getHomeBlogList (userId, pageIndex=0) {
    const res = await getFollowerBlogList({userId, pageIndex, pageSize: PAGE_SIZE})
    const { count, blogList } = res
    // 拼接返回数据
    return new SuccessModel({
        isEmpty: blogList.length === 0,
        blogList,
        pageSize: PAGE_SIZE,
        pageIndex,
        count
    })
}

module.exports = {
    create,
    getHomeBlogList
}