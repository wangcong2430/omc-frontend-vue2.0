import axios from 'axios'
import { message, Modal } from 'ant-design-vue'
import {
  blobToJson,
  getFileNameFromDisposition,
  downloadExcelFile
} from './handle'
import { createUuid } from '@/utils/uuid'
import { uploadSentryErrorEvent } from './self-report-sentry'
import { workflowSrv } from '@/api/index'

// 需要弹框提示的接口列表
const errorXhrPaths = [
  `${workflowSrv}/GetAllReviewerSettingList`
]

// 请求错误的接口，阻止用户操作，需要刷新页面
const openXhrErrorModal = (xhrPath) => {
  if (errorXhrPaths.includes(xhrPath)) {
    Modal.destroyAll()
    Modal.error({
      title: '提示',
      content: '系统发生错误，请刷新页面！',
      okText: '刷新',
      maskClosable: false,
      centered: true,
      zIndex: 1000,
      onOk: () => {
        window.location.reload()
      }
    })
  }
}

// create an axios instance
const http = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 60 * 1000 * 15 // request timeout 15min
})

// mark this is a ajax request to return 401 when return 302 + location in the Intelligent Gateway
http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// request interceptor
http.interceptors.request.use(
  config => {
    // do something before request is sent
    return {
      ...config,
      headers: {
        ...config.headers,
        'request-id': createUuid()
      }
    }
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
http.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */
  async response => {
    if (
      response.headers['content-type'] === 'application/octet-stream' ||
      response.headers['content-type'] === 'application/vnd.ms-excel'
    ) {
      const fileName = getFileNameFromDisposition(response.headers['content-disposition'])
      let fileType = 'application/octet-stream;charset=utf-8'
      if (response.config.url === '/iomc.CommonSrv/ParseExeclTpl') {
        fileType = 'application/vnd.ms-excel;charset=utf-8'
      }
      downloadExcelFile(
        response.data,
        fileName,
        fileType
      )
      // 模板导入失败的处理
      if (response.config.url === '/iomc.CommonSrv/ParseExeclTpl') {
        message.error('导入失败，请下载文件查看错误的内容！', 10)
        return Promise.reject(new Error(''))
      }
      return
    }

    let resData = response.data
    // 转化Blob数据成json
    if (response.request && response.request.responseType === 'blob') {
      resData = await blobToJson(resData)
    }
    const res = resData.response

    const { gwCode, gwMsg, requestId } = resData
    const detail = {
      'send': {
        'param': response.config.params,
        'data:': response.config.data,
        'seqId': response.config.headers['request-id'],
        'method': response.config.method
      },
      'back': {
        'code': gwCode,
        'message': gwMsg,
        'data': res
      }
    }

    if (gwCode !== 0) { // 系统错误
      message.error(gwMsg, 5)
      // 上报到sentry
      uploadSentryErrorEvent(response)
      // 打印错误信息
      console.error(
        `
        Request url: ${response.config.url}\n
        Request id: ${requestId}
        gwCode: ${gwCode}
        gwMsg: ${gwMsg}
        Detail: ${JSON.stringify(detail)}
        `
      )
      openXhrErrorModal(response.config.url)
      return Promise.reject(new Error(gwMsg))
    }

    // 返回数据没有response字段错误
    if (!res) {
      // 上报到sentry
      uploadSentryErrorEvent(response)
      return Promise.reject('接口返回数据错误')
    }
    // if the custom code is not 200, it is judged as an error.
    if (res.ret !== 0) {
      if (res.content) {
        message.error(res.content, 5)
        console.error(
          `
          Request url: ${response.config.url}\n
          Request id: ${requestId}
          gwCode: ${gwCode}
          gwMsg: ${gwMsg}
          Detail: ${JSON.stringify(detail)}
          `
        )
        openXhrErrorModal(response.config.url)
        return Promise.reject(new Error(res.content))
      }
      message.error(`${res.msg || 'Request Error!'}`, 5)

      console.error(
        `
        Request url: ${response.config.url}\n
        Request id: ${requestId}
        gwCode: ${gwCode}
        gwMsg: ${gwMsg}
        Detail: ${JSON.stringify(detail)}
        `
      )
      openXhrErrorModal(response.config.url)
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  async error => {
    if (error.response) {
      const res = error.response
      if (res.status === 302 || res.status === 301 || res.status === 401) {
        // 302 | 301 | 401 重载页面，进入IOA登录，开发环境跳到测试环境登录
        if (process.env.NODE_ENV === 'development') {
          window.location.href = `http://passport.oa.com/modules/passport/signout.ashx?url=${window.location.origin}`
        } else {
          window.location.reload()
        }
      } else {
        let errorRes = res.data
        if (res.request.responseType === 'blob') {
          errorRes = await blobToJson(res.data)
        }
        console.error(JSON.stringify(error.response))
        message.error(`${errorRes.error || errorRes.msg || errorRes || `${res.statusText}(${res.status})`}`, 5)
        openXhrErrorModal(res.config.url)
      }
    } else {
      console.error(JSON.stringify(error.response))
      message.error(`${error}`, 5)
    }

    return Promise.reject(error)
  }
)

export default http
