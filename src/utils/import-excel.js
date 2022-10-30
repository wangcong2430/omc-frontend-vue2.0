/**
 * 解析导入的Excel数据成表格数据格式
 * @param {Array} model 需要返回的数据项的格式，顺序需要和表头一致
 * @param {Array} header 表格头部部分
 * @param {Array} sourceData 表格主体部分
 * @returns {Object} 返回表格头部和解析后的主体部分数据
 */
import { set } from 'lodash/object'
import { toString } from 'lodash/lang'

export function import_excel_to_table(model, header, sourceData) {
  const res = []
  sourceData.forEach(data => {
    const row = {}
    header.forEach((head, index) => {
      if (!data[head]) {
        set(row, [model[index]], '')
      } else {
        set(row, [model[index]], toString(data[head]))
      }
    })

    res.push(row)
  })

  return { header, body: res }
}
