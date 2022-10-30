// 公共服务接口
import http from '@/axios/request'
import { commonSrv } from '../index'

/**
 * Excel模板下载
 */
export function getExcelTpl(items) {
  return http({
    url: `${commonSrv}/GetExcelTpl`,
    method: 'post',
    data: items,
    responseType: 'blob'
  })
}

/**
 * 解析execl模板
 * @param {String} file_url 模板文件地址
 */
export function parseExeclTpl(file_url) {
  return http({
    url: `${commonSrv}/ParseExeclTpl`,
    method: 'post',
    data: { file_url, return_file: 1 },
    responseType: 'blob'
  })
}
