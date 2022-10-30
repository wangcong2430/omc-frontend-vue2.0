// 导出配置表
import { formatJson } from '@/utils/export-excel'

export const tHeader = [
  '部门',
  '类型',
  '财管人员',
  'GM人员',
  'VP人员'
]

export const filterVal = [
  'dept_name',
  'type',
  'finmgr',
  'gm',
  'vp'
]

export function parseConfigsData(data) {
  return new Promise((resolve, reject) => {
    try {
      const res = formatJson(filterVal, data)
      resolve(res)
    } catch (error) {
      reject(error)
    }
  })
}
