/**
 * @description 加密方法
 * @author 凉风有信、
 */

const crypto = require('crypto')

// 密钥
const { CRYPTO_SECRECT_KEY } = require('../config/secrectkeys')


/**
 * md5加密
 * @param {string} content 明文
 */
function _md5(content) {
    const md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')
}

/**
 * 加密
 * @param {string} content 明文 
 */
function doCrypto(content) {
    const str = `password=${content}&key=${CRYPTO_SECRECT_KEY}`
    return _md5(str)
}

module.exports = {
    doCrypto
}