

const server = require('./server')

test('json 接口返回格式正确', async () => {
    // const res = await server.post('/login').send({
    //     userName: 'zhangsan',
    //     password: '123'
    // })

    const res = await server.get('/json')

// 判断对象相等用toEqual
    expect(res.body).toEqual({
        title: 'koa2 json'
    })

    expect(res.body.title).toBe('koa2 json')
})