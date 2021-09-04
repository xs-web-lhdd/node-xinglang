const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
// 引入session redis
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
// 引入配置
const { REDIS_CONF } = require('./config/db')
// 引入环境
const { isProd } = require('./untils/env')
// 引入密钥
const { SESSION_SECRECT_KEY } = require('./config/secrectkeys')
// 标准引入路径
const path = require('path')

// 路由
const atApiRouter = require('./routes/api/blog-at')
const squareApiRouter = require('./routes/api/blog-square')
const profileApiRouter = require('./routes/api/blog-profile')
const blogHomeApiRouter = require('./routes/api/blog-home')
const blogViewRouter = require('./routes/view/blog')
const utilsApiRouter = require('./routes/api/utils')
const userViewRouter = require('./routes/view/user')
const userApiRouter = require('./routes/api/user')
const errorViewRouter = require('./routes/view/error')

// error handler
let onerrorConf = {}
if (isProd) {
    // 生产环境就跳到错误页，如果是开发环境将错误暴露出来方便改bug
    onerrorConf = {
        redirect: '/error'  // 遇到错误时就跳转到错误页（重定向）
    }
}
onerror(app, onerrorConf)

// middlewares
app.use(bodyparser({
    enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(require('koa-static')(path.join(__dirname, '..', 'uploadfiles'))) // 标准路径拼接

app.use(views(__dirname + '/views', {
    extension: 'ejs'
}))

// session配置
app.keys = [SESSION_SECRECT_KEY] // 密钥
// session如果不用的时候不会往redis里面塞数据和设置cookie
app.use(session({
    key: 'weibo.sid',   // cookie name 默认是 'koa.sid'
    prefix: 'weibo:sess:', // redis key的前缀 默认是 'koa:sess:'
    cookie: {
        path: '/',
        httpOnly: true,     // 只能server端改cookie
        maxAge: 24 * 60 * 60 * 1000,   // ms
    },
    store: redisStore({
        all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
    })
}))

// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

// routes
app.use(atApiRouter.routes(), atApiRouter.allowedMethods())
app.use(squareApiRouter.routes(), squareApiRouter.allowedMethods())
app.use(profileApiRouter.routes(), profileApiRouter.allowedMethods())
app.use(blogHomeApiRouter.routes(), blogHomeApiRouter.allowedMethods())
app.use(blogViewRouter.routes(), blogViewRouter.allowedMethods())
app.use(utilsApiRouter.routes(), utilsApiRouter.allowedMethods())
app.use(userViewRouter.routes(), userViewRouter.allowedMethods())
app.use(userApiRouter.routes(), userApiRouter.allowedMethods())
app.use(errorViewRouter.routes(), errorViewRouter.allowedMethods()) // 注册的时候包含404的路由一定要写到最下面，声明的时候可以写到前面

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
})

module.exports = app
