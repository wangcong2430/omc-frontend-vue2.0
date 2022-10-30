// 角色权限配置相关api，先配置角色的权限，再配置角色的人员

import http from '@/axios/request'
import { permSrv } from '../index'

/**
 * 获取角色
 * @param {Array} role_codes { 角色code }
 */
export function getRoles(role_codes = []) {
  return http({
    url: `${permSrv}/GetRoles`,
    method: 'post',
    data: { role_codes }
  })
}

/**
 * 新增角色
 * @param {Array} roles { code: 角色代码, name: 角色名称, description: 角色说明, strategry: 角色策略 }
 */
export function addRoles(roles = []) {
  return http({
    url: `${permSrv}/AddRoles`,
    method: 'post',
    data: { roles }
  })
}

/**
 * 更新角色
 * @param {Array} roles { code: 角色代码, name: 角色名称, description: 角色说明, strategry: 角色策略 }
 */
export function updateRoles(roles = []) {
  return http({
    url: `${permSrv}/UpdateRoles`,
    method: 'post',
    data: { roles }
  })
}

/**
 * 删除角色
 * @param {Array} codes { 角色代码 }
 */
export function delRoles(codes = []) {
  return http({
    url: `${permSrv}/DelRoles`,
    method: 'post',
    data: { codes }
  })
}

/**
 * 获取权限列表
 * @param {Array} perms 权限ids
 */
export function getAllPerms(perms = []) {
  return http({
    url: `${permSrv}/GetAllPerms`,
    method: 'post',
    data: { perms }
  })
}

/**
 * 获取角色的用户
 * @param {Array} roles 角色ids
 */
export function getRoleUsers(roles = []) {
  return http({
    url: `${permSrv}/GetRoleUsers`,
    method: 'post',
    data: { roles }
  })
}

/**
 * 给角色添加用户
 * @param {Array} users { role_code: 角色代码, user_names: 用户rtx, resources: 资源4段式列表 }
 */
export function addRoleUsers(users = []) {
  return http({
    url: `${permSrv}/AddRoleUsers`,
    method: 'post',
    data: { users }
  })
}

/**
 * 更新角色下用户的资源
 * @param {Array} users { role_code: 角色代码, user_names: 用户rtx, resources: 资源4段式列表 }
 */
export function UpdateRoleResourcesForUsers(users = []) {
  return http({
    url: `${permSrv}/UpdateRoleResourcesForUsers`,
    method: 'post',
    data: { users }
  })
}

/**
 * 给角色删除用户
 * @param {Array} users { role_code: 角色代码, user_name: 用户rtx, resource: 资源，不传删除用户与名下的资源 }
 */
export function delRoleUsers(users = []) {
  return http({
    url: `${permSrv}/DelRoleUsers`,
    method: 'post',
    data: { users }
  })
}

/**
 * 获取角色权限
 * @param {Array} roles { 角色ids }
 */
export function getRolePerms(roles = []) {
  return http({
    url: `${permSrv}/GetRolePerms`,
    method: 'post',
    data: { roles }
  })
}

/**
 * 给角色添加权限
 * @param {Array} items { id: 角色id, perms: 权限ids }
 */
export function addRolePerms(items = []) {
  return http({
    url: `${permSrv}/AddRolePerms`,
    method: 'post',
    data: { items }
  })
}

/**
 * 删除角色权限
 * @param {Array} items { id: 角色id, perms: 权限ids }
 */
export function delRolePerms(items = []) {
  return http({
    url: `${permSrv}/DelRolePerms`,
    method: 'post',
    data: { items }
  })
}

/**
 * 更新角色权限
 * @param {Array} items { id: 角色id, perms: 权限ids }
 */
export function updateRolePerms(items = []) {
  return http({
    url: `${permSrv}/UpdateRolePerms`,
    method: 'post',
    data: { items }
  })
}

/**
 * 获取所有权限接口信息
 * @param page 页码
 * @param page_size 每页数量
 * @param action 接口名模糊搜索
 */
export function getPerms(page, page_size, action) {
  return http({
    url: `${permSrv}/GetPerms`,
    method: 'get',
    params: {
      page,
      page_size,
      action
    }
  })
}

/**
 * 新建权限接口
 * @param {Array} perms { action: 接口名, mode: 鉴权模式, resource: 鉴权资源规则, description: 接口描述 }
 */
export function addPerms(perms = []) {
  return http({
    url: `${permSrv}/AddPerms`,
    method: 'post',
    data: { perms }
  })
}

/**
 * 删除权限接口
 */
export function delPerms(action = []) {
  return http({
    url: `${permSrv}/DelPerms`,
    method: 'post',
    data: { action }
  })
}

/**
 * 更新权限接口信息
 * @param {Array} perms { action: 接口名, mode: 鉴权模式, resource: 鉴权资源规则, description: 接口描述 }
 */
export function updatePerms(perms = []) {
  return http({
    url: `${permSrv}/UpdatePerms`,
    method: 'post',
    data: { perms }
  })
}
