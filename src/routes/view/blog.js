/**
 * @description 微博view路由
 * @author 凉风有信、
 */

const router = require('koa-router')()
const { loginRedirect } = require('../../middlewares/loginChecks')
const { getProfileBlogList } = require('../../controller/blog-profile')
const { getSquareBlogList } = require('../../controller/blog-square')
const { getFans, getFollowers } = require('../../controller/user-relation')
const { isExist} = require('../../controller/user')
const { getHomeBlogList } = require('../../controller/blog-home')
const { getAtMeCount, getAtMeBlogList } = require('../../controller/blog-at')
const { markAsRead } = require('../../controller/blog-at')

// 首页
router.get('/', loginRedirect, async (ctx, next) => {
    // 获得当前登陆人的信息
    const userInfo = ctx.session.userInfo
    const { id: userId } = userInfo

    // 获取第一页数据
    const result = await getHomeBlogList(userId)
    const { isEmpty, blogList, pageSize, pageIndex, count } = result.data

    // 获取粉丝
    const fansResult = await getFans(userInfo.id)
    const { count: fansCount, userList: fansUserList } = fansResult.data 

    // 获取关注人列表
    const followersResult = await getFollowers(userInfo.id)
    const { count: followersCount, userList: followersUserList } = followersResult.data

    // 获取 @ 数量
    const atCountResult = await getAtMeCount(userId)
    const { count: atCount } = atCountResult.data

    await ctx.render('index', {
        blogData: {
            isEmpty, blogList, pageSize, pageIndex, count
        },
        userData: {
            userInfo,
            fansData: {
                count: fansCount,
                list: fansUserList
            },
            followersData: {
                count: followersCount,
                list: followersUserList
            },
            atCount
        }
    })
})

// 个人主页
router.get('/profile', loginRedirect, async (ctx, next) => {
    const { userName } = ctx.session.userInfo
    ctx.redirect(`/profile/${userName}`)
})
router.get('/profile/:userName', loginRedirect, async (ctx, next) => {

    // 已登录用户的信息
    const myUserInfo = ctx.session.userInfo
    const myUserName = myUserInfo.userName

    let curUserInfo
    const { userName: curUserName } = ctx.params
    const isMe = myUserName === curUserName
    if (isMe) {
        // 是当前登录用户
        curUserInfo = myUserInfo
    } else {
        // 不是当前登录用户
        const existResult = await isExist(curUserName)
        if (existResult.error !== 0) {
            // 用户名不存在
            return
        }
        // 用户名存在
        curUserInfo = existResult.data
    }
    // 获取微博第一页数据
    const res = await getProfileBlogList(curUserName, 0)
    const { isEmpty, blogList, pageSize, pageIndex, count } = res.data

    // 获取粉丝
    const fansResult = await getFans(curUserInfo.id)
    const { count: fansCount, userList: fansUserList } = fansResult.data

    // 获取关注人列表
    const followersResult = await getFollowers(curUserInfo.id)
    const { count: followersCount, userList: followersUserList } = followersResult.data

    // 我是否关注了此人
    const amIFollowed = fansUserList.some(item => {
        return item.userName === myUserName
    })

    // 获取 @ 数量
    const atCountResult = await getAtMeCount(curUserInfo.id)
    const { count: atCount } = atCountResult.data

    await ctx.render('profile', {
        blogData: {
            isEmpty, blogList, pageSize, pageIndex, count
        },
        userData: {
            userInfo: curUserInfo,
            isMe,
            fansData: {
                count: fansCount,
                list: fansUserList
            },
            amIFollowed,
            followersData: {
                count: followersCount,
                list: followersUserList
            },
            atCount
        }
    })
})

// 广场
router.get('/square', loginRedirect, async (ctx, next) => {
    // 获取微博数据，第一页
    const result = await getSquareBlogList(0)
    const { isEmpty, blogList, pageSize, pageIndex, count } = result.data || {}

    await ctx.render('square', {
        blogData: {
            isEmpty,
            blogList,
            pageSize,
            pageIndex,
            count
        }
    })
})

// atMe
router.get('/at-me', loginRedirect, async (ctx, next) => {
    const { id: userId } = ctx.session.userInfo
    // 获取 @ 数量
    const atCountResult = await getAtMeCount(userId)
    const { count: atCount } = atCountResult.data
    // 获取第一页列表
    const result= await getAtMeBlogList(userId)
    const { blogList, count, isEmpty, pageIndex, pageSize } = result.data
    // 渲染页面
    await ctx.render('atMe', {
        atCount,
        blogData: {
            blogList,
            count,
            isEmpty,
            pageIndex,
            pageSize
        }
    })

    // 标记为已读
    if (atCount > 0) {
        await markAsRead(userId)
    }
})

module.exports = router