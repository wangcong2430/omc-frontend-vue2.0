/* eslint-disable */
/**
 * COS文件上传
 * 说明：上传前需要调用后台接口获取私钥，上传后的ETag是文件的key，删除文件的时候需要用到，Location是文件的预览或者下载路
 * 路径前面需要带上//才能预览或者下载
 */
import http from '@/axios/request'
import { commonSrv } from '@/api/index'
import sparkMD5 from 'spark-md5'
import { message } from 'ant-design-vue'
const COS = require('@tencent/new-cos-js-sdk-v5')
const bucket = 'iomc-1258344700'
const region = 'ap-guangzhou'

const getCos = () => new COS({
  getAuthorization(options, callback) {
    http({
      method: 'get',
      url: `${commonSrv}/GetCosCredentials`
    }).then((res) => {
      const credentials = res && res.data
      if (!res || !credentials) {
        console.error('credentials invalid')
      }
      const { tmp_secret_id: TmpSecretId, tmp_secret_key: TmpSecretKey, session_token: XCosSecurityToken,
        start_time: StartTime, expired_time: ExpiredTime } = credentials
      callback({
        TmpSecretId,
        TmpSecretKey,
        XCosSecurityToken,
        StartTime,
        ExpiredTime
      })
    }).catch(err => {
      message.error(`上传失败: ${err}`)
    })
  }
})
const md5 = (file) => new Promise((resolve, reject) => {
  const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
  const chunkSize = 1024 * 1024 * 2 // 2MB
  const chunks = Math.ceil(file.size / chunkSize)
  const spark = new sparkMD5.ArrayBuffer()
  const fileReader = new FileReader()
  let currentChunk = 0
  const loadNext = () => {
    const start = currentChunk * chunkSize
    let end = start + chunkSize
    if (end > file.size) {
      end = file.size
    }
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
  }
  fileReader.onload = (e) => {
    console.log('read chunk num:', currentChunk + 1, 'of', chunks)
    spark.append(e.target.result)
    currentChunk++
    if (currentChunk < chunks) {
      loadNext()
    } else {
      const hash = spark.end()
      console.log('computed hash', hash)
      resolve(hash)
    }
  }
  fileReader.onerror = (e) => {
    console.error('md5 error', e)
    reject(e)
  }
  loadNext()
})
/**
 * 单文件上传
 * @param {File} file 文件
 * @param {String} name 文件名称，可选
 */
const uploadFile = async(file, name) => {
  let result = null
  result = new Promise(async(resolve, reject) => {
    if (!name) {
      name = await md5(file)
    }
    const fileName = file.name
    getCos().putObject({
      Bucket: bucket,
      Region: region,
      Key: `/public/${name}/${fileName}`,
      Body: file
    }, (err, data) => {
      if (data && data.statusCode === 200) {
        // 上传成功后返回文件的存储key
        console.log('上传成功', data)
        resolve({
          key: data.ETag.substring(1, data.ETag.length - 1),
          url: `http://${data.Location}`
        })
      } else if (err) {
        console.error('上传失败', err)
        reject(err)
      }
    })
  })
  return result
}

const deleteFile = async(key) => {
  return new Promise(async(resolve, reject) => {
    if (!key) {
      reject('Must provide the cos key of file!!')
    }
    getCos().deleteObject({
      Bucket: bucket,
      Region: region,
      Key: `/public/${key}`
    }, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

/**
 * 批量上传
 * @param {Array} files 文件列表
 */
const uploadFiles = async(files) => {
  let result = null
  result = new Promise(async(resolve, reject) => {
    const fileObjects = files.map(async (file) => {
      const name = await md5(file)
      const fileName = file.name
      return {
        Bucket: bucket,
        Region: region,
        Key: `/public/${name}/${fileName}`,
        Body: file
      }
    })
    getCos().uploadFiles({
      files: fileObjects
    }, (err, data) => {
      if (data && data.statusCode === 200) {
        // 上传成功后返回文件的存储key
        console.log('上传成功', data)
        resolve({
          key: data.ETag.substring(1, data.ETag.length - 1),
          url: `//${data.Location}`
        })
      } else if (err) {
        console.error('上传失败', err)
        reject(err)
      }
    })
  })
  return result
}

export {
  uploadFile,
  deleteFile,
  uploadFiles
}
