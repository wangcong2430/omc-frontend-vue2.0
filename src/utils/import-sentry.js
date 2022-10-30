// 引入sentry
import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

// 正式环境上报sentry
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://977d139ef0c74410bab087c4100fc7c8@report.url.cn/sentry/2655',
    integrations: [new Integrations.Vue({ Vue, attachProps: true })]
  })
}
