/**
 * @description 微博首页
 * @author 凉风有信、
 */

const xss = require('xss')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { createBlogFailInfo } = require('../model/ErrorInfo')
const { createBlog } = require('../services/blog')

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

module.exports = {
    create
}