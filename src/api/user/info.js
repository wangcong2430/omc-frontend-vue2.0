import http from '@/axios/request'
import { commonSrv, permSrv } from '../index'

export function getInfo() {
  return http({
    url: `${commonSrv}/GetUserInfo`,
    method: 'get'
  })
}

// 获取组织架构信息
export function getOrgInfo(id) {
  return http({
    url: `${commonSrv}/GetOrgInfo`,
    method: 'get',
    params: { id }
  })
}

// 获取员工信息列表
export function getStaffList() {
  return http({
    url: `${commonSrv}/GetStaffList`,
    method: 'get'
  })
}

/**
 * 获取自身控制台的权限
 */
export function getMyConsolePerms() {
  return http({
    url: `${permSrv}/GetMyConsolePerms`,
    method: 'get'
  })
}

export function getUserOrgInfo(staff_name) {
  return http({
    url: `${commonSrv}/GetUserOrgInfo`,
    method: 'post',
    data: {
      staff_name
    }
  })
}
