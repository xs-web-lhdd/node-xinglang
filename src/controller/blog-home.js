/**
 * @description 微博首页
 * @author 凉风有信、
 */

const xss = require('xss')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { createBlogFailInfo } = require('../model/ErrorInfo')
const { createBlog, getFollowerBlogList } = require('../services/blog')
const { PAGE_SIZE } = require('../config/constants')

/**
 * 创建微博
 * @param {Object} params 创建微博所需要的参数 {content, image, id}
 */
async function create({userId, content, image}) {
    try {
        const blog = await createBlog({
            userId,
            content: xss(content),
            image
        })
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