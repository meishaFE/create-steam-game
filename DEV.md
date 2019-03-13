# 开发文档

## create-steam-game

`create-steam-game` 基本参考 `create-react-app` 的做法。

全局安装后可以 通过 `create-steam-game gameName` 来创建新的游戏，会创建相应的游戏文件夹，并且安装 `steam-game-scripts`，然后调用 `steam-game-scripts` 中的 `init.js`，来安装相应的依赖和复制默认的文件，安装好的目录文件如下：

```
.
└── package.json
└── src
    ├── App.vue
    ├── assets
    ├── components
    ├── config
    ├── filters
    ├── lang
    ├── main.js
    ├── router.js
    ├── store.js
    ├── utils
    └── views
```

`create-steam-game` 主要的文件是 index.js，流程主要为：

```
  1. 检查文件夹名是否规范
  2. 判断文件夹是否存在并创建
  3. 非空文件夹则退出
  4. 创建 package.json
  5. 调用 `steam-game-scripts/init.js` 复制模版
```

## steam-game-scripts

steam-game-scripts 的主要工作是负责搭建和打包项目。

```bash
steam-game-scripts start # 开发
steam-game-scripts build # 打包
steam-game-scripts test # 测试
```

项目结构

```
.
├── bin // node 可执行的命令
│   └── index.js
├── build // 用来打包的配置
│   ├── build.js
│   ├── check-versions.js
│   ├── happypack.js
│   ├── utils.js
│   ├── vue-loader.conf.js
│   ├── webpack.base.conf.js
│   ├── webpack.dev.conf.js
│   ├── webpack.prod.conf.js
│   ├── webpack.test.conf.js
│   └── webpackDevServer.config.js
├── config // 配置，参考 vue 工程化项目
│   ├── dev.env.js
│   ├── index.js
│   └── prod.env.js
├── package-lock.json
├── package.json
├── scripts
│   ├── build.js // 执行打包命令时调用的 js
│   ├── init.js // 执行 init 命令时调用的 js
│   └── start.js // 执行开发命令时调用的 js
└── template
```

## steam-game-commonjs

steam-game-commonjs 主要为 steam 游戏通用的一些 js 的集合。通过 rollup 打包后，手动发到 cdn，即可达到其他游戏同步更新的目的（这里可以考虑更改为使用自己的服务器来发布）

项目结构如下：

```
.
├── package.json
├── rollup.config.js
└── src
    ├── config
    │   ├── api.js // 通用 api
    │   └── index.js
    ├── index.js
    ├── lib
    │   ├── d3.js // d3 辅助函数
    │   ├── date.js // 日期相关函数
    │   ├── filters.js // 过滤器的函数
    │   ├── fullScreen.js // 全屏切换监听
    │   ├── geo.js // 计算
    │   ├── http.js // http 请求函数
    │   ├── init.js // 初始化
    │   ├── lang.js // 语言相关
    │   ├── type.js // 类型检查
    │   └── utils.js
    ├── minigameStore
    │   └── index.js
    └── utils
        ├── freeze.js // 冻结对象的方法
        └── setObjectConst.js // 设置对象的常量属性的方法，可以保证变量不可以被重新赋值
```

## 相关资料

1.  lerna 资料
    1.  [lerna](https://github.com/lerna/lerna)
    2.  [使用 lerna 优雅地管理多个 package](https://zhuanlan.zhihu.com/p/35237759)
2.  rollup
    1.  [rollup js](https://rollupjs.org/)
3.  package 包发布
    1.  [npm 文档](https://docs.npmjs.com/)
    2.  [Creating and publishing unscoped public packages](https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages)
