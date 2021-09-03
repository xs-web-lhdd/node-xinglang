/**
 * @description 微博 @ 关系controller
 * @author 凉风有信、
 */

const { SuccessModel } = require('../model/ResModel')
const { getAtRelationCount } = require('../services/at-relation')

async function getAtMeCount (userId) {
    // service拿到数量
    const count = await getAtRelationCount(userId)
    return new SuccessModel({
        count
    })
}

module.exports = {
    getAtMeCount
}