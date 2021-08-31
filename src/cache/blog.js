/**
 * @description 微博相关缓存
 * @author 凉风有信、
 */

const { get, set } = require('./_redis')
const { getBlogListByUser } = require('../services/blog')

// 微博前缀
const KEY_PREFIX = 'weibo:square=>:'

/**
 * 获取广场缓存
 * @param {number} pageIndex 
 * @param {number} pageSize 
 */
async function getSquareCacheList (pageIndex, pageSize) {
    const key = `${KEY_PREFIX}${pageIndex}-${pageSize}`

    // 尝试获取缓存
    const cacheRes = await get(key)
    if (cacheRes !== null) {
        // 获取缓存成功
        return cacheRes
    }
    // 没有缓存，读取数据库
    const res = await getBlogListByUser({pageIndex, pageSize})
    // 设置缓存
    set(key, res, 60)
    return res
}

module.exports= {
    getSquareCacheList
}