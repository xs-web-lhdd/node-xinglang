/**
 * @description 微博数据模型单元测试
 * @author 凉风有信、
 */

 const { User } = require('../../src/db/model/index')

 test('User模型的各个描述符合预期', () => {
    //  build会构建一个内存的 User 实例，但不会提交到数据库中
     const user = User.build({
        userName: 'zhangliu',
        password: '123',
        nikename: '张六',
        picture: '/xxx.png',
        city: '北京'
     })
    //  验证各个属性
     expect(user.userName).toBe('zhangliu')
     expect(user.nikename).toBe('张六')
     expect(user.password).toBe('123')
     expect(user.gender).toBe(3)
     expect(user.picture).toBe('/xxx.png')
     expect(user.city).toBe('北京')
 })
 