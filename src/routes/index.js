const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
<<<<<<< HEAD
    title: 'Hello Koa 2!'
=======
    title: '前端开发者',
    isMe: true,
    blogList: [
      { id: 1, title: 'aaa' },
      { id: 2, title: 'bbb' },
      { id: 3, title: 'ccc' },
      { id: 4, title: 'ddd' }
    ]
>>>>>>> dad563316d53037f13a23006a9ffd376b077032f
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
