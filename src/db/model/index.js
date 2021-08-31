/**
 * @description 数据模型入口文件
 * @author 凉风有信、
 */


const User = require('./User')
const Blog = require('./Blog')
const UserRelation = require('./UserRelation')

// 创建外键
Blog.belongsTo(User, {
    foreignKey: 'userId'
})

// 关注与被关注外键
UserRelation.belongsTo(User, {
    foreignKey: 'followerId'
})

User.hasMany(UserRelation, {
    foreignKey: 'userId'
})

// 首页---外键连接
Blog.belongsTo(UserRelation, {
    foreignKey: 'userId',
    targetKey: 'followerId'
})

module.exports = {
    User,
    Blog,
    UserRelation
}