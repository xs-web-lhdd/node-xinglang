/**
 * @description utils controller
 * @author 凉风有信、
 */

const path = require('path')
const { ErrorModel, SuccessModel } = require('../model/ResModel')
const { uploadFileSizeFailInfo } = require('../model/ErrorInfo')
const fse = require('fs-extra')
const { exists } = require('fs')

// 文件存储目录
const DIST_FOLDER_PATH = path.join(__dirname, '..', '..', 'uploadfiles')
// 文件最大体积是1M
const MAX_SIZE = 1024 * 1024 * 1024


// 判断是否有文件目录
fse.pathExists(DIST_FOLDER_PATH).then(exist => {
    if (!exist) {
        fse.ensureDir(DIST_FOLDER_PATH)
    }
})

/**
 * 保存文件
 * @param {string} name 文件名称
 * @param {string} type 文件类型 
 * @param {number} size 文件大小
 * @param {string} filePath 文件路径
 */
async function saveFile({ size, name, filePath, type }) {
    if (size > MAX_SIZE) {
        // 删除文件后再返回错误
        await fse.remove(filePath)
        return new ErrorModel(uploadFileSizeFailInfo)
    }

    // 移动文件
    const fileName = Date.now() + '.' + name // 防止重名
    const distFilePath = path.join(DIST_FOLDER_PATH, fileName) // 文件目的地
    await fse.move(filePath, distFilePath)

    // 返回信息
    return new SuccessModel({
        url: '/' + fileName
    })
}


module.exports = {
    saveFile
}
