# omc-frontend

## 前序准备

你需要在本地安装 [node](http://nodejs.org/) 和 [git](https://git-scm.com/)。本项目技术栈基于 [ES2015+](http://es6.ruanyifeng.com/)、[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh-cn/)、[vue-router](https://router.vuejs.org/zh-cn/) 、[vue-cli](https://github.com/vuejs/vue-cli) 、[axios](https://github.com/axios/axios) 和 [ant-design-vue](http://vue.ant-design.cn/docs/vue/introduce-cn/)，开发环境请求数据可以使用[Mock.js](https://github.com/nuysoft/Mock)进行模拟或者设置proxy，详情见vue.config.js文件。

## 开发

```bash
# 安装依赖
npm install

# 启动服务
npm run serve
```

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

## Browsers support

Modern browsers and Internet Explorer 10+.

## 备注

1、修改或者新增mock数据需要重新启动服务才能生效
2、启动本地服务需要本地配置hosts：127.0.0.1   local.iomc.oa.com
3、后端接口文档地址：http://test.iomc.oa.com/swagger/index.html、https://git.code.oa.com/omc/proto（pb文件格式）
4、本地新增一个.env.local文件，新增一个本地环境变量 VUE_APP_LOCAL_ROUTER_MODE = 'hash'

"# omc-frontend-vue2.0" 
