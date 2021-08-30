/**
 * @description 微博数据相关工具
 * @author 凉风有信、
 */

const fs = require('fs')
const path = require('path')
const ejs = require('ejs')

// 获取blog—list.ejs 的文件内容
const BLOG_LIST_TPL = fs.readFileSync(
    path.join(__dirname, '..', 'views', 'widgets', 'blog-list.ejs')
).toString()

/**
 * 更具blogList渲染出字符串
 * @param {Array} blogList 微博列表
 * @param {Boolean} canReply 是否可以回复
 * @returns 
 */
function getBlogListString(blogList = [], canReply = false) {
    return ejs.render(BLOG_LIST_TPL, {
        blogList,
        canReply
    })
}

module.exports = {
    getBlogListString
}