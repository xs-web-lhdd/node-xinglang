/**
 * @description json schema 校验
 * @author 凉风有信、
 */

const Ajv = require('ajv')
const ajv = new Ajv({
    // allErrors: true     // 输出所有错误（所有错误找全后返回）---比较慢
})

/**
 * 
 * @param {Object} schema json schema规则
 * @param {Object} data 待校验的数据
 */
function validate(schema, data = {}) {
    const valid = ajv.validate(schema, data)
    if (!valid) {
        return ajv.errors[0]
    }
}

module.exports = validate