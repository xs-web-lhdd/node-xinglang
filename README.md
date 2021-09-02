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