/**
 * @description 用户关注关系
 * @author 凉风有信、
 */

const seq = require('../seq')

const { INTEGER } = require('../types')

const UserRelation = seq.define('userRelation', {
    userId: {
        type: INTEGER,
        allowNull: false,
        comment: '用户id'
    },
    followerId: {
        type: INTEGER,
        allowNull: false,
        comment: '被关注用户id'
    }
})

module.exports = UserRelation