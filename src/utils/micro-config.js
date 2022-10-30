/**
 * 子应用的全路径:
 * worksheet/:project/:schema为MyTable的表单列表路径
 * page为MyTable的自定义页面路径
 * 以下配置为微前端在当前系统的路由前缀，完整的路径还需要加上worksheet/:project/:schema或者page
 */
export const microAppPaths = [
  '/report/rd-detail',
  // '/report/cp-detail',
  '/report/ob-budget',
  '/report/art-workload',
  '/report/ob-source',
  '/budget/rd-adjustment',
  '/budget/cp-adjustment',
  '/budget/cp-add',
  '/budget/cp-predict',
  '/budget/rd-add',
  '/budget/rd-predict',
  '/report/ob-detailed',
  '/report/ob-product'
]

export const wujiFetch = function(url, options) {
  console.log('wujiFetch options', options)
  // 替换url中包含主应用的域名成子应用的域名
  let tmpUrl = url
  let microHost = 'mytable.oa.com'
  if (window.location.hostname.endsWith('.woa.com')) {
    microHost = microHost.replace('.oa.com', '.woa.com')
  }
  if (url.includes(window.location.host)) {
    tmpUrl = url.replace(window.location.host, microHost)
  }
  const exclude = ['https://cdn-go.cn', 'https://vfiles.gtimg.cn', 'http://pingjs.qq.com']
  const headers = (options && options.headers) || {}
  return window
    .fetch(tmpUrl, {
      ...options,
      credentials: exclude.some(host => url.toString().includes(host)) ? 'omit' : 'include',
      headers: {
        ...headers,
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
