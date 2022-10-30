以在Vue中使用为例：

安装wujie

npm i @tencent/wujie -S


自定义fetch

export const wujieFetch = function(url, options) {
  // 替换url中包含主应用的域名成子应用的域名
  let tmpUrl = url
  if (url.includes(window.location.host)) {
    tmpUrl = url.replace(window.location.host, 'mytable.oa.com')
  }
  const exclude = ['https://cdn-go.cn', 'https://vfiles.gtimg.cn', 'http://pingjs.qq.com']
  return window
    .fetch(tmpUrl, {
      ...options,
      credentials: exclude.some(host => url.toString().includes(host)) ? 'omit' : 'include',
      headers: {
        'Origin': window.location.origin
      }
    })
    .then(
      response => response,
      error => {
        console.error(error)
        return { text: () => '' }
      }
    )
}


创建微前端组件

<template>
  <div id="micro-container" ref="subAppContainer"></div>
</template>
<script>
import { startApp } from '@tencent/wujie'
import { wujiFetch } from '@/utils/micro-config'

export default {
  name: 'MicroPage',
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  mounted() {
    const meta = this.$route.meta
    const relativeUrl = this.url || (meta && meta.url)
    if (this.$refs['subAppContainer'] && !!relativeUrl) {
      this.$nextTick(() => {
        startApp({
          name: 'mytable',
          url: `//mytable.oa.com/${relativeUrl}`,
          sync: true,
          el: this.$refs['subappContainer'],
          fetch: wujiFetch,
		  props: {}
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>

可以通过传url或者在主应用注册路由并在meta中定义url，其中url为微前端的页面相对url，可以在mytable中复制。

使用微前端组件

<micro-page :url="worksheet/mytable/test_test/222/5/11" />或者在路由表中引用
import MicroPage from '@/views/components/micro-page'
{
path: '/test',
name: 'Test',
component: MicroPage,
meta: {
url: 'worksheet/mytable/test_test/222/5/11'
}
},


MyTable表单项管理列和顶部操作菜单支持插槽，可以控制默认操作的显示和自定义操作嵌入

$wujie是微前端主应用传递过来的props数据协议
 {
  baseUrl: string, // 接口请求根路径，保持和微前端页面的根路径一致，例如：https://mytable.woa.com
  hideDefaultEdit: boolean, // 管理列是否隐藏默认的编辑操作
  hideDefaultDelete: boolean, // 管理列是否隐藏默认的删除操作
  hideAddBtn: boolean, // 是否隐藏默认的新增按钮
  hideExportBtn: boolean, // 是否隐藏默认的导出按钮
  fixedControlCol: boolean, // 是否固定管理操作列
  bordered: boolean, // 表格是否展示外边框和列边框
  hideActionCol: boolean, // 隐藏操作列，默认显示
  showIndexCol: boolean, // 显示序号列，默认不显示
  hideGetImportTemp: boolean, // 是否隐藏默认的下载导入模板按钮
  hideImportBtn: boolean, // 是否隐藏默认的导入按钮
  showRowSelection: boolean, // 列表项是否可选择
  rowSelectionDisabled: (record: 每一行的数据) => boolean, // 列表项可选择的条件
  actions: [ // 自定义的操作
   {
     key: string, // 唯一标识
     label: string, // 显示中文,
     type: "default" | "link" | "dashed" | "primary" | "ghost" | "danger" // 按钮的类型
     callback: (record: any) => void, // 按钮点击的回调，record为表单项中某一行的数据
     refresh: boolean // 是否重新刷新表单数据
   }
  ],
  operations: [ // 表单项自定义的管理操作
   {
     key: string, // 唯一标识
     label: string, // 显示中文,
     type: "default" | "link" | "dashed" | "primary" | "ghost" | "danger" // 按钮的类型
     callback: (record: any) => void, // 按钮点击的回调，record为表单项中某一行的数据
     refresh: boolean, // 是否重新刷新表单数据
     hiddenFun: (record: any) => boolean, // 是否隐藏，返回boolean
   }
  ],
  filters: [ // 表单项默认筛选项和对应值
   {
     key:  string, // 字段名
     value: string | array, // 字段值
   }
  ],
  extraColFields: [ 额外展示的字段，适用于展示一个关联对象的多个字段
   {
      label: 字段中文名,
      key: 字段名, 例如：soft_id.type，用.号隔开
      index: 插入位置，从左边0开始计算，往index后插入
      options: [{ label: 下拉选项名称, value: 下拉选项值 }]，可选，使用下拉类型字段,
      width: 字段宽度，可选,
      fixed: 固定right|left，可选
    }
  ],
  dynamicFields: [ 动态插入的字段，适用于业务方需要根据表格数据的某种条件动态插入表格中
     {
       label: 字段中文名
       key: 字段key
       index: 插入位置，从左边0开始计算，往index后插入
       fillValueFun: (data: any) => string 填充出数据的函数，业务方可以自定义，data是表格数据
       width: 字段宽度，可选,
       fixed: 固定right|left，可选
     }
  ],
  dynamicFilters: [{ 动态插入的搜索条件，需要注意在数据中有该字段
    key: string，字段key
    value: string，默认值
    type: number，组件类型，默认为1-文本，常用的有8-数字、10-日期选择、9-CheckBox、5-下拉框、13-多选下拉框、10001-年份选择
    label: string，显示标题
    options: []{label: string, value: string}, 下拉选择项，可选，下拉框必传
    props: any，组件的props，可以根据antd组件传入
    onChange: (value: any, forms: []) => void，value是变化的值，forms是所有搜索项的配置，包括当前的值
  }],
  relatedFilters: [{ // 关联的搜索字段，不显示在子应用的搜索条件栏，主要用于和主应用做关联搜索
    key: string，字段名称
    value: string，字段值
    op: string，过滤条件'like'|'='，（'like'：模糊匹配、'='：精确匹配)，默认是'='
  }],
  mountedCallback: () => {}, // mytable表单项组件渲染完成回调
  unmountedCallback: () => {} // mytable表单项组件销毁完成回调
 }
6、内置事件通信
在主应用中的调用方式：

import { bus } from '@tencent/wujie';
bus.$emit('refresh-worksheet');
// 监听方式
bus.$on('xxx', (data) => {})

1）refresh-worksheet：刷新表单项数据事件，参数可以传入props，子应用$on，主应用$emit
2）set-dark-theme: 切换暗黑模式事件，子应用$on，主应用$emit
3）set-light-theme: 切换浅色模式事件，子应用$on，主应用$emit
4）mytable-mounted: mytable表单项的渲染完成事件，子应用$emit，主应用$on
5）mytable-unmounted: mytable表单项的销毁完成事件，子应用$emit，主应用$on
6) mytable-search-action: mytable表单项查询钩子，参数是查询的条件，比如：[{field: 字段key, value: 字段值}]，子应用$emit，主应用$on
7) mytable-reset-action: mytable表单项查询重置钩子，没有参数，子应用$emit，主应用$on,
8) set-language: 设置页面语言类型，目前支持中文和英文，可选值为'zh'、'en'，主应用$emit，子应用$on,
9) mytable-select-row: 选中行的钩子事件，参数是所有选中行的数据，子应用$emit，主应用$on
10) update-filter-config：更新搜索项事件，参数可以传入props，子应用$on，主应用$emit