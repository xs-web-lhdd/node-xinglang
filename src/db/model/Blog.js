/**
 * @description 用户数据模型
 * @author 凉风有信、
 */

const seq = require('../seq')

const { STRING, TEXT, INTEGER } = require('../types')
// blogs
const Blog = seq.define('blog', {
    userId: {
        type: INTEGER,
        allowNull: false,
        comment: '用户id'
    },
    content: {
        type: TEXT,
        allowNull: false,
        comment: '微博内容'
    },
    image: {
        type: STRING,
        allowNull: true,
        comment: '微博图片'
    }
})
 
module.exports = Blog