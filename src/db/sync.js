/** 
* @description sequelize同步
* @author 凉风有信、
*/
const seq = require('./seq')

const { User } = require('./model/index')
// const seq = require('./sql')


// 测试连接
seq.authenticate().then(() => {
    console.log('auth ok')
}).catch(() => {
    console.log('auth err')
})

// 执行同步
seq.sync({ force: true }).then(() => {
    console.log('同步成功')
    process.exit()
})