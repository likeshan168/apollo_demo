使用Node能够使用ES6语法
1. 安装插件

在 npm 模块或应用目录下执行

# 安装 core 和命令行工具
$ npm install --save-dev babel-core babel-cli 
# 安装所有插件
$ npm install --save-dev babel-plugin-transform-strict-mode babel-plugin-transform-es2015-modules-commonjs  babel-plugin-transform-es2015-spread babel-plugin-transform-es2015-destructuring babel-plugin-transform-es2015-parameters

2. 添加配置文件

在应用根目录下面创建对应的配置文件 .babelrc,

{
  "plugins": [
    "transform-strict-mode",
    "transform-es2015-modules-commonjs",
    "transform-es2015-spread",
    "transform-es2015-destructuring",
    "transform-es2015-parameters"
  ]
}

3. 文件组织

由于 Node.js本身有加载器， 所以不需要将所有文件打包成一个文件， 推荐的做法是， 添加一个 src 目录， 用于存放 ES6 脚本， 然后将整个目录打包到 lib 目录下， 对应的脚本为

babel src --out-dir lib
开发调试的时候， 可以直接用 babel-cli 模块提供 babel-node 代替 node 直接启动 src 目录下面的入口脚本。

babel-node src/index.js
最后， 将命令封装到 package.json 里面

{
  "name": "my-awasome-es6-package",
  "version": "1.0.0",
  "description": "use es6 in node",
  "main": "lib/index.js",
  "scripts": {
    "start": "babel-node src/index.js",
    "build": "babel src --out-dir lib"
  },
  "devDependencies": {
    "babel-cli": "~6.3.17",
    "babel-core": "~6.3.26",
    "babel-plugin-syntax-object-rest-spread": "^6.3.13",
    "babel-plugin-transform-es2015-modules-commonjs": "^6.3.16",
    "babel-plugin-transform-es2015-spread": "^6.3.14",
    "babel-plugin-transform-object-rest-spread": "^6.3.13",
    "babel-polyfill": "^6.3.14"
  }
}
我们就可以使用下面的命令启动和编译我们的代码了

# npm run build 构建脚本
# npm start 使用 babel-node 启动进程
这里的注意点：

模块入口 main 应该指向构建后的脚本， 这样用你模块的用户不需要去进行编译， 以及线上运行得时候不用去编译。
babel-node 不适合用于生产环境，生产环境应使用编译后的代码。 不过在开发环境里面使用还是挺方便的。