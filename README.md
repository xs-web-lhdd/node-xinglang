### 项目前置知识：
***
#### Sequelize：

```bash
npm install mysql2 sequelize --save
```
mysql2: node.js操作数据库的工具

1、创建sequelize实例
2、创建表的模型
3、同步数据
4、增、删、改、查操作
```bash
#文件列表
model # 数据模型文件夹
seq.js # sequelize实例
sync.js # 同步
```

##### 初始化sequelize实例：

开发环境下没有使用连接池：

```js
const Sequelize = require('sequelize')

// 数据库名称---用户名---密码
// 数据库类型
const seq = new Sequelize('weibo-code','root','1234567890',{
    host: 'localhost',
    dialect: 'mysql'
})


// 测试连接

// seq.authenticate().then(() => {
//     console.log('mySQL数据库连接成功');
// }).catch(() => {
//     console.log('err');
// })

module.exports = seq
```

##### 建模：

```js
const Sequelize = require('sequelize')

const sql = require('./sql') // 实例

// 创建User模型 --- 数据表名称是users --- 建表的node.js的实现
const User = sql.define('user', {
    // id 会自动创建，并设置为主键，自增，在建表时不需要创建
    userName: {
        type: Sequelize.STRING, // varchar(255)
        allowNull: false // 不允许为空
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nikename: {
        type: Sequelize.STRING
    }
    // 自动创建 createdAt 和 updatedAt
})

// 创建blog模型
const Blog = sql.define('blog', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,// 较长的字符串，适合存内容
        allowNull: false
    },
    userID: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

// 外键关联 --- 谁在前面就先查出谁
// 第一种 --- 先查出blog然后连带查出user
Blog.belongsTo(User, {
    // 创建外键 blog.userID --> User.id
    foreignKey: 'userID',
})
// 第二种 --- 先查出user然后连带查出blog
User.hasMany(Blog, {
	// 创建外键 blog.userID --> User.id
    foreignKey: 'userID'
})

module.exports = {
    User,
    Blog
}
```
#### 同步：
```js
/** 
* @description sequelize同步
* @author 凉风有信、
*/
const seq = require('./seq') // 引入实例

const { User } = require('./model/index') // 引入数据模型
// const seq = require('./sql')


// 测试连接
seq.authenticate().then(() => {
    console.log('auth ok')
}).catch(() => {
    console.log('auth err')
})

// 执行同步
seq.sync({ force: true }).then(() => { // force: true是同步前将所有表清除掉
    console.log('同步成功')
    process.exit()
})
```
#####  创建数据：
```js
const { User } = require('./modle')

!(async function () {

    // 创建用户
    const zhangsan = await User.create({
        userName: 'zhangsan',
        password: '1234',
        nikename: '张三'
    })
    console.log('zhangsan:', zhangsan.dataValues);
    const zhangsanId = zhangsan.dataValues.id
	// 记住返回的数据用.dataValues来查看
})()
```
##### 查询数据：
```js
const { Blog, User } = require('./modle')

!(async function () {

    // 查询一条语句 --- 把所有列查询出来了
    const zhangsan = await User.findOne({
        where: {
            userName: 'zhangsan'
        }
    })
    console.log('zhangsan: ',zhangsan);
		// 指定查询的列 --- attributes
    const zhangsan = await User.findOne({
        attributes: ['userName', 'nikename'], // 查询的列
        where: {
            userName: 'zhangsan'
        }
    })
    console.log(zhangsan.dataValues);

    // 查询一个列表
    const zhnagsanBlogList = await Blog.findAll({
        where: {
            userID: '2'
        },
        order: [
            ['id', 'desc']
        ]
    })
    console.log(zhnagsanBlogList.map(item => item.dataValues));


    // 分页
    const list = await Blog.findAll({
        limit: 2,
        offset: 0,
        order: [
            ['id', 'desc'] // 这是一个数组！！！谨记
        ]
    })
    console.log(list.map(item => item.dataValues));

    // 查询总数
    const blogListAll = await Blog.findAndCountAll({
        limit: 2,
        offset: 0,
        order: [
            ['id', 'desc']
        ]
    })
    // blogListAll.count 返回总数（不考虑limit offset）
    // blogListAll.rows.length 返回当前数量（考虑limit offset）
    console.log(blogListAll.count,blogListAll.rows.map(item => item.dataValues));

    // 连表查询1
    const blogListWithUser = await Blog.findAndCountAll({
        order: [
            ['id', 'desc']
        ],
        include: [
            {
                model: User,
                attributes: ['userName', 'nikeName'],
                where: {
                    userName: 'zhangsan'
                }
            }
        ]
    })
    
    // 连表查询2
    const userListWithUser = await User.findAndCountAll({
        attributes: ['nikeName', 'userName'],
        include: [
            {
                model: Blog
            }
        ]
    })
})()

```
**在上面连表查询1中有一个细节就是`Blog.findAndCountAll`里面想通过Blog连带查询出User必须要定义外键`Blog.belongsTo(User, {
    foreignKey: 'userID',
})`
否则是查询不出来得，同理如果想查询User然后连带查询出Blog必须要定义外键`User.hasMany(Blog, {
    foreignKey: 'userID'
})`
否则也是查询不出来得，这两种区别就是顺序得先后还有查询时是谁包含谁这点区别**
##### 更新数据：
```js
    const updateRes = await User.update(
        {
            nikeName: '张三'
        },
        {
            where: {
                userName: 'zhangsan'
            }
        }
    )
    // updateRes 是一个数组，通过判断updateRes的第一项是否大于0来判断是否更新成功
```
##### 删除数据：
```js
    const deleRes = await Blog.destroy({
        where: {
            id: 4
        }
    })
    // 返回的是删除的条数，所以可以通过跟0的比较来判断是否删除成功
```
##### sequelize连接池：
![](https://i.loli.net/2021/09/01/95Pleu3cYG6OD4w.png)
作用：连接数据库
线下用左图，线上用右图（更稳定）
代码演示：
```js
const Sequelize = require('sequelize')

const conf = {
	host: 'localhost',
	dialect: 'mysql'
}

// 线上环境使用连接池
conf.pool = {
    max: 5,       // 最大连接数量
    min: 0,       // 最小连接数量
    idle: 10000   // 如果一个连接池10秒之内没有被使用那就释放
}

// 数据库名称---用户名---密码
const seq = new Sequelize('weibo-code','root','1234567890', conf)

module.exports = seq
```


***

#### Redis:
redis是内存数据库用来在该项目中做缓存，redis特点是：速度快，用户体验比较好，在该项目中微博广场页和登陆后用户信息存储在redis中（在启动项目的时候一定要连接上redis否则项目进不去）
	
redis安装教程：https://www.runoob.com/redis/redis-install.html
安装：
```bash
npm install redis --save
```

node.js连接redis：
```js
/**
 * @description: 连接redis的方法 get set
 * @author: 凉风有信、
 */

const redis = require('redis')
const { REDIS_CONF } = require('../config/db') // 引入redis配置---端口6379---主机127.0.0.1

// 创建客户端 --- 接收两个参数一个是端口，一个是主机
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', err => {
    console.error('redis error', err)
})

/**
 * 往redis中设置键值对
 * @param {string} key 键
 * @param {string} val 值 
 * @param {number} timeout 过期时间 秒
 */
function set(key, val, timeout = 60 * 60) {
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val)
    redisClient.expire(key, timeout)
}

/**
 * 读取redis中的值
 * @param {string} key 键 
 */
function get(key) {
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            if (val === null) {
                resolve(null)
                return
            }
            // 尝试变成对象
            try {
                resolve(JSON.parse(val))
            } catch (ex) {
                resolve(val)
            }
        })
    })
    return promise
}

module.exports = {
    set,
    get
}
```

本项目中将配置单独拎出来，这在为后期开发做铺垫，具体代码：

```js
/**
 * @description: 文件存储配置
 * @author: 凉风有信、
 */
const { isProd } = require('../untils/env')

let REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
}

let MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '1234567890',
    port: '3306',
    database: 'weibo-code'
}

if (isProd) {
    // 生产环境
    REDIS_CONF = {
        // 线上redis配置
        port: 6379,
        host: '127.0.0.1'
    }

    MYSQL_CONF = {
        // 线上mySQL配置
        host: 'localhost',
        user: 'root',
        password: '1234567890',
        port: '3306',
        database: 'weibo-code'
    }
}
module.exports = {
    REDIS_CONF,
    MYSQL_CONF
}
```
项目中环境变量：
```js
/**
 * @description: 环境变量
 * @author: 凉风有信、
 */

const ENV = process.env.NODE_ENV

module.exports = {
    isDev: ENV === 'dev',
    notDev: ENV !== 'dev',
    isProd: ENV === 'production',
    notProd: ENV !== 'production',
    isTest: ENV === 'test',
    notTest: ENV !== 'test'
}
```
**里顺便说一下，只要是合理的设计，任何看似复杂的东西都是为了更加简单！！！**

***

#### cookie和session：
在该项目中session存储在redis中，至于为什么就不再一一赘述了，网上一搜一大堆。
在koa中配置：
先安装依赖：
```bash
npm install koa-redis koa-generic-session --save
```
app.js：
```js
// 引入session redis
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
// 引入Redis配置
const { REDIS_CONF } = require('./config/db')
// 引入密钥
const { SESSION_SECRECT_KEY } = require('./config/secrectkeys')

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
    ttl: 24 * 60 * 60 * 1000, // redis过期时间，不写默认跟cookie过期时间一致
    store: redisStore({
        all: `${REDIS_CONF.host}:${REDIS_CONF.port}` // '127.0.0.1:6369'
    })
}))
```
***
#### jest单元测试：
###### 单元测试：
 - 个功能或接口，给定输入，得到输出，看输出是否负责要求
 - 需要手动编写代码用例，然后统一执行
 - 意义：能一次性执行所有单测，短时间内验证所有功能是否正常

###### 使用jest：
 - *.test.js文件结尾
 - 常用的断言
 - 测试http接口

###### 安装jest：

```bash
npm install jest --save-dev
```
然后在package.json中配置一个test的执行命令：
```json
"test": "cross-env NODE_ENV=test jest --runInBand --forceExit --colors"
```
runInBand： 顺序执行
forceExit： 强制退出
colors： 颜色高亮

###### 测试http接口：
先安装一个插件：
```bash
npm install supertest --save-dev
```
新建一个server.js，代码演示：
```js
const request = require('supertest')
const server = require('../src/app').callback()

module.exports = request(server)
```
举一个测试接口的用例
```js
const server = require('./server') // 就是引入上面那段代码

test('json 接口返回数据格式正确', async () => {
  const res = await server.get('/json')
  // 对象用toEqual
  expect(res.body).toEqual({
    title: 'json'
  })
  // 字符串用toBe
  expect(res.body.title).toBe('json')
})
```

***
#### Elint：
###### 安装elint：
```bash
npm install eslint babel-eslint --save-dev
```
###### 配置：
```json
{
    "parser": "babel-eslint",
    "env": {
        "es6": true,
        "commonjs": true,
        "node": true
    },
    "rules": {
        "indent": ["error", 4], // 缩进空格
        "quotes": [
            "error",
            "single", // 单双引号
            {
              "allowTemplateLiterals": true // 是否允许模板字符串
            }
        ],
        "semi": [
            "error",
            "never" // 是否需要分号
        ]
    }
}
```
***
##### jwt：
什么是jwt：
- jwt： json web token

- 用户认证成功之后，serve端返回一个加密的token返回给客户端

- 客户端后续每次请求都带token，以示当前的用户信息

具体jwt登录实现可以参考：https://github.com/xs-web-lhdd/manager/tree/master-server

***

### Node.js+Koa+Sequelize仿新浪微博：

#### 项目起步准备：

##### 技术方案设计：

- 架构设计
- 页面（模板，路由）和API设计
- 数据模型设计
##### 整体架构设计：
![](https://i.loli.net/2021/09/02/vAKigCoYuyBrM6z.png)

##### API：
```bash
/api/user/register	注册
/api/user/isExist   用户名是否存在
/api/user/login 	登录
/api/user/changeInfo修改用户信息
/api/utils/upload   图片上传
/api/user/changePassword修改密码
/api/user/logout	退出登录
/api/blog/create    创建微博
/api/blog/loadMore/:pageIndex加载更多
/api/profile/follow 关注
/api/profile/unFollow取消关注
```
##### 关系型数据库三大范式：
规则：
- 属性的原子性： 每一列都不可再拆解

- 记录的唯一性：有唯一标识（主键），其他属性都依赖于主键

- 字段的冗余性：不存在数据冗余和传递依赖（引用数据而不是拷贝数据）
  好处：

- 数据规范严谨，不易出错

- 占用空间更小

- 访问速度更快

  ![](https://i.loli.net/2021/09/02/kNle8AghJ5O9jiE.png)
***
#### 用户管理：

sequelize数据类型统一：
```js
/**
 * @description 封装sequelize数据类型
 * @author 凉风有信、
 */

const Sequelize = require('sequelize')

module.exports = {
    STRING: Sequelize.STRING,
    DECIMAL: Sequelize.DECIMAL,
    TEXT: Sequelize.TEXT,
    INTEGER: Sequelize.INTEGER,
    BOOLEAN: Sequelize.BOOLEAN
}
```

##### 用户的数据模型：

```js
const seq = require('../seq')

const { STRING, DECIMAL } = require('../types')
// users
const User = seq.define('user', {
    userName: {
        type: STRING,
        allowNull: false,
        unique: true,
        comment: '用户名唯一'
    },
    password: {
        type: STRING,
        allowNull: false,
        comment: '密码'
    },
    nikename: {
        type: STRING,
        allowNull: false,
        comment: '昵称'
    },
    gender: {
        type: DECIMAL,
        allowNull: false,
        defaultValue: 3,
        comment: '性别（1是男性 2是女性 3是保密）'
    },
    picture: {
        type: STRING,
        comment: '头像存图片地址'
    },
    city: {
        type: STRING,
        comment: '城市'
    }
})

module.exports = User
```

##### 统一的返回格式：

```js
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
```
也可参考：https://github.com/xs-web-lhdd/jingdong/tree/server/src/res-models
				   https://github.com/xs-web-lhdd/manager/blob/master-server/utils/util.js

##### 统一错误码：

```js
module.exports = {
    // 用户信息已存在
    userMsgExist: {
        error: 10001,
        message: '用户名已存在'
    },
    // 注册失败
    registerFail: {
        error: 10002,
        message: '注册失败'
    },
    // 用户名不存在
    userMsgNotExist: {
        error: 10003,
        message: '用户名不存在'
    },
    // 登录失败
    loginFailInfo: {
        error: 10004,
        message: '登录失败，用户名或密码错误'
    },
    // 未登录
    loginCheckFailInfo: {
        error: 10005,
        message: '您尚未登录'
    },
    // 修改密码失败
    changePasswordFailInfo: {
        error: 10006,
        message: '修改密码失败，请重试'
    },
    // 上传文件过大
    uploadFileSizeFailInfo: {
        error: 10007,
        message: '上传文件尺寸过大'
    },
    // 修改基本信息失败
    changeInfoFailInfo: {
        error: 10008,
        message: '修改基本信息失败'
    },
    // json schema 校验失败
    jsonSchemaFileInfo: {
        error: 10009,
        message: '数据格式校验错误'
    },
    // 删除用户失败
    deleteUserFailInfo: {
        error: 10010,
        message: '删除用户失败'
    },
    // 添加关注失败
    addFollowerFailInfo: {
        error: 10011,
        message: '添加关注失败'
    },
    // 取消关注失败
    deleteFollowerFailInfo: {
        error: 10012,
        message: '取消关注失败'
    },
    // 创建微博失败
    createBlogFailInfo: {
        error: 11001,
        message: '创建微博失败，请重试'
    },
    // 删除微博失败
    deleteBlogFailInfo: {
        error: 11002,
        message: '删除微博失败，请重试'
    }
}
```

##### 密码加密：
```js
/**
 * @description 加密方法
 * @author 凉风有信、
 */

const crypto = require('crypto')

// 密钥
const { CRYPTO_SECRECT_KEY } = require('../config/secrectkeys')


/**
 * md5加密
 * @param {string} content 明文
 */
function _md5(content) {
    const md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')
}

/**
 * 加密
 * @param {string} content 明文 
 */
function doCrypto(content) {
    const str = `password=${content}&key=${CRYPTO_SECRECT_KEY}`
    return _md5(str)
}

module.exports = {
    doCrypto
}
```
##### 校验：
安装ajv：
```bash
npm install ajv --save
```
官网地址： https://www.npmjs.com/package/ajv
###### ajv校验使用：
```js
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
```
#### 用户设置：
##### 图片上传：
安装依赖：
```bash
npm install formidable-upload-koa --save
```
npm官网： https://www.npmjs.com/package/formidable-upload-koa

项目中代码演示：

```js
/**
 * @description utils 路由
 * @author 凉风有信、
 */

const router = require('koa-router')()
const koaForm = require('formidable-upload-koa')
const { loginCheck } = require('../../middlewares/loginChecks')
const { saveFile } = require('../../controller/utils')
router.prefix('/api/utils')

// 上传图片
router.post('/upload',loginCheck, koaForm(), async (ctx, next) => {
    const file = ctx.req.files['file'] // 在ctx.req.files里获取到上传的文件，['file']是前端input上传文件组件的name属性值
    const { size, path, name, type } = file
    // controller
    ctx.body = await saveFile({
        name,
        filePath: path,
        size,
        type
    })
})

module.exports = router
```

一些网友的博客： 

- https://blog.csdn.net/ojb98K/article/details/107590088
- https://blog.csdn.net/qq_39197547/article/details/81316856

***
##### 文件移动：

安装依赖：
```bash
npm install fs-extra --save
```
npm官网：https://www.npmjs.com/package/fs-extra
使用举例：
```js
const fse = require('fs-extra') // 引入fse

// 删除文件
await fse.remove(filePath) // 涉及到对文件的操作就是对IO的操作，就要使用异步
// 移动文件---第一个参数是文件原本的地址，第二个参数是文件移动后的地址
await fse.move(filePath, distFilePath)
```
一些用法介绍的博客：

- https://juejin.cn/post/6844903641594216455
- https://blog.csdn.net/LUCKWXF/article/details/104209022
- https://www.jianshu.com/p/d6990a03d610
- https://javascript.shop/2016/08/nodejs-file-methods-fs-extra

项目中保存文件的具体代码：

```js
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
        // 如果目录不存在就创建一个目录
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
    const fileName = Date.now() + '.' + name // 使用时间戳防止重名
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

```
在上面代码中把**uploadfiles**这个文件夹做成静态文件目录可以被访问，**记得要在app.js中进行设置**：`app.use(require('koa-static')(path.join(__dirname, '..', 'uploadfiles'))) // 标准路径拼接`
***

##### 预防XSS攻击：
###### 安装XSS：
```bash
npm install xss --save
```
使用举例：
```js
const xss = require('xss') // 引入

// 使用：
content = xss(content)
```
***

##### **关注关系：**重难点！！！
   在数据模型里面userId是关注人，followerId是被关注人，比如userId是张三，followId是李四，那么他们之间的关系就是张三关注李四，如果张三又关注了王五，那么就会又一个新的列里面userId就是张三，followId是王五，这样查找张三的关注列表直接去userRelation中查找userId是张三列就可以了，同理，如果想查找张三的粉丝列表那就去userRelation中查找followerId是张三的就可以了，要是还是理解不了就去mysql的可视化数据中查询全部userrelations自然就会明白！！！

###### 代码演示：

```js
const { User, UserRelation } = require('../db/model/index')
const { formatUser } = require('./_format')
const Sequelize = require('sequelize')

/**
 * 获取粉丝列表
 * @param {string} followerId 
 */
// 比如查询我的粉丝，那就是去userrealtion表中查询followId中有我的所有列，查询出来的是userId的数组，由于在外键定义时是User在前，因此先查询User再查询userrelation。
async function getUserByFollower (followerId) {
    const result = await User.findAndCountAll({
        attributes: ['id', 'nikeName', 'userName', 'picture'],
        order: [
            ['id', 'desc']
        ],
        include: [
            {
                model: UserRelation,
                where: { // 因为followId在UserRealtion这个表下面，所以查询的时候条件要写在UserRelation下面
                    followerId,
                    userId: {
                        [Sequelize.Op.ne]: followerId
                    }
                }
            }
        ]
    })
    // result.count 是查询总数
    // result.rows 是查询结果、数组
    
    // 格式化
    let userList = result.rows.map(row => row.dataValues)
    userList = formatUser(userList)

    return {
        count: result.count,
        userList
    }
}

/**
 * 获取关注人列表
 * @param {*} userId 
 */
// 把userId当作我的用户Id，那么用我的用户Id去userrelation中查找userId是我的用户Id的所有的表，查询出来的是followId的数组，因为followId外键连接User表中的每一列的id，所以顺带把用户信息查询出来（id, nikeName, userName, picture
async function getFollowersByUser (userId) {
    const result = await UserRelation.findAndCountAll({
        order: [
            ['id', 'desc']
        ],
        include: [
            {
                model: User,
                attributes: ['id', 'nikeName', 'userName', 'picture']
            }
        ],
        where: {// 这个查询也是查询UserRelation这个表，因此条件是写在这里，不能写在include里面的User下面
            userId,
            followerId: {
                [Sequelize.Op.ne]: userId // followId不等于userId
            }
        }
    })

    // 格式化
    let userList = result.rows.map(row => row.dataValues)
    userList = userList.map(item => {
        let user = item.user.dataValues
        user = formatUser(user)
        return user
    })

    return {
        count: result.count, // 查询出来的总数
        userList
    }
}
```

> 这里where条件的位置取决于在那个表中查找（查找粉丝和查找关注人都是在userrelation中查找，但第一种是先找User后找userrelation，因此where在include中，第二中先找userRelation后找User，因此where在include外边），attribute的位置取决于查找时返回谁的数据（返回的都是User的信息，因此第一种User先查找，所以attribute在include外边，第二种User后查找，因此attribute跟User一级，在include里边）

***

#### 首页自己微博和关注人微博：三表查询（比较难理解）
##### 建立外键：
```js
// Blog的userId连接UserRelation中的followerId，不写targetKey默认就是id，写了就以写的为准
Blog.belongsTo(UserRelation, {
    foreignKey: 'userId',
    targetKey: 'followerId'
})
// 在这里数据库可视化工具中可能不会显示这个外键关系，但是并不影响数据模型之间的联系也不影响我们连表查询
```
##### 自己关注自己：牛逼操作！！！
自己关注自己可能让大家有点迷离，其实这是简化查询的一个很妙的操作，在这个项目中首页需要获取自己的微博和关注人的微博，如果分开查询关注人的微博和自己的微博那样相对比较麻烦，可以通过自己关注自己简化操作：自己关注自己，那么首页只需要获取关注人的微博即可（里面含有自己的微博），这样首页获取微博的操作就会简化许多，但是这样做还有两个bug需要处理，一是首页关注人列表里面会有自己，二十自己粉丝列表种会有自己，解决这两个bug的解决方案是：在查询用户的粉丝列表和关注人列表的时候让userId和followerId不相等即可：
```js
// 获取粉丝列表：通过附加条件筛选出自己关注自己的那一列
userId: {
    [Sequelize.Op.ne]: followerId // 注意userId和followerId顺序别弄反了
}
// 获取关注人列表：
followerId: {
    [Sequelize.Op.ne]: userId // followId不等于userId
}
```
##### 三表查询：
查询关注人的微博：
```js
/**
 * 获取关注着的微博
 * @param {*} param0 查询条件
 */
async function getFollowerBlogList ({userId, pageIndex=0, pageSize = PAGE_SIZE}) {
    const result = await Blog.findAndCountAll({
        limit: pageSize,
        offset: pageSize * pageIndex,
        order: [
            ['id', 'desc']
        ],
        include: [
            {
                model: User,
                attributes: ['userName', 'nikeName', 'picture']
            },
            {
                model: UserRelation,
                attributes: ['userId', 'followerId'],
                where: { userId }
            }
        ]
    })
    // 格式化
    let blogList = result.rows.map(row => row.dataValues)
    blogList = blogList.map(item => {
        item.user = formatUser(item.user.dataValues)
        return item
    })

    return {
        count: result.count,
        blogList
    }
}
```
