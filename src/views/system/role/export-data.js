// 导出角色配置表
import { formatJson } from '@/utils/export-excel'

export const tHeader = [
  '角色代码',
  '角色名称',
  '角色描述',
  '人员',
  '资源'
]

export const filterVal = [
  'code',
  'name',
  'description',
  'user_name',
  'resources'
]

export function parseConfigsData(data) {
  return new Promise((resolve, reject) => {
    const jsonData = []
    try {
      data.forEach(d => {
        d.users.forEach(c => {
          jsonData.push({
            'code': d.code,
            'name': d.name,
            'description': d.description,
            'user_name': c.user_name,
            'resources': c.resources.join(';')
          })
        })
      })
      const res = formatJson(filterVal, jsonData)
      resolve(res)
    } catch (error) {
      reject(error)
    }
  })
}

