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
const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
    enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'ejs'
}))

// session配置
app.keys = ['huCdd^^*232*&']
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
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
})

module.exports = app
