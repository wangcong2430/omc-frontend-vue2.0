// 人力外包相关接口
import http from '@/axios/request'
import { budgetSrv } from '../index'

// 保存人力外包预算填报
export function saveOutsource(data) {
  return http({
    url: `${budgetSrv}/SaveOutsource`,
    method: 'post',
    data
  })
}

