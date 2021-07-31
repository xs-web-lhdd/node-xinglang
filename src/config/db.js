/**
 * @description: 文件存储配置
 * @author: 凉风有信、
 */
const { isProd } = require('../untils/env')

let REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
}

if (isProd) {
    // 生产环境
    let REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}
module.exports = {
    REDIS_CONF
}