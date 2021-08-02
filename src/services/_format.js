/**
 * @description 数据格式化
 * @author 凉风有信、
 */

const { DEFAULT_PICTURE } = require('../config/constants')

/**
 * 默认用户头像
 * @param {Object} obj 用户对象 
 */
function _formatUserPicture(obj) {
    console.log(DEFAULT_PICTURE)
    if (obj.picture === null ) {
        obj.picture = DEFAULT_PICTURE
    }
    return obj
}

/**
 * 格式化用户信息
 * @param {Array|Object} list 用户列表或者单个用户对象
 */
function formatUser(list) {
    if (list === null) {
        return list
    }
    if (list instanceof Array) {
        // 数组 用户列表
        return list.map(_formatUserPicture)
    }
    // 单个对象
    return _formatUserPicture(list)
}


module.exports = {
    formatUser
}