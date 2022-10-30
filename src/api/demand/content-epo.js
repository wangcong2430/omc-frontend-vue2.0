import http from '@/axios/request'
import { consumeSrv } from '../index'

export function getEpoCntCategoryList() {
  return http({
    url: `${consumeSrv}/GetEpoCntCategoryList`,
    method: 'get'
  })
}
