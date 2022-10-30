/* eslint-disable */
// 接入aegis上报，正式环境上报
const origin = window.location.origin
if (
  process.env.NODE_ENV === 'production' &&
  origin === 'http://iomc.oa.com'
) {
  new Aegis({
    id: 'InwcejxpkKyfAymHjb', // 项目ID，即上报key
    reportApiSpeed: true, // 接口测速
    reportAssetSpeed: true // 静态资源测速
  })
}
