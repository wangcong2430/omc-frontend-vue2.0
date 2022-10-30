import * as Sentry from '@sentry/browser'

/**
 * 自定义sentry上报事件
 * @param {Error} error
 */
export function uploadSentryErrorEvent(error) {
  // 正式环境上报
  if (process.env.NODE_ENV !== 'production') {
    return
  }
  Sentry && Sentry.withScope(function(scope) {
    // 设置请求信息
    scope.setExtra('request headers', error.config.headers)
    // scope.setExtra('request data', error.config.data || error.config.params || '没有请求参数') // 不上报请求数据，避免用户提交信息泄露

    // 接口错误设置响应信息
    if (error.response) {
      scope.setExtra('response status', error.response.status)
      scope.setExtra('response headers', error.response.headers)
      // scope.setExtra('response data', error.response.data) // 不上报响应数据，避免用户信息泄露
    }
    // 接口成功，但接口状态为系统错误
    if (error.data) {
      scope.setExtra('response gwCode', error.data.gwCode)
      scope.setExtra('response gwMsg', error.data.gwMsg)
      // scope.setExtra('response data', JSON.stringify(error.data.response)) // 不上报响应数据，避免用户信息泄露
    }
    // 创建异常描述
    const err = new Error('接口地址：' + error.config.url)
    err.name = '接口请求错误'
    // 手动捕获异常
    Sentry.captureException(err)
  })
}
