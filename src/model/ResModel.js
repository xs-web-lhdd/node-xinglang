/**
 * @description response 数据模型
 * @author 凉风有信、
 */

/**
 * 基础模块
 */
class BaseModel {
    constructor({error, data, message}) {
        this.error = error
        if (data) {
            this.data = data
        }
        if (message) {
            this.message = message
        }
    }
}

/**
 * 成功的数据模型
 */
class SuccessModel extends BaseModel{
    constructor(data = {}) {
        super({
            error: 0,
            data
        }) 
    }
}

/**
 * 失败数据模型
 */
class ErrorModel extends BaseModel {
    constructor({ error, message }) {
        super({
            error,
            message
        })
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}