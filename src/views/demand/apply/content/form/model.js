// 内容制作费需求明细表单字段model
import moment from 'moment'

// 公共的表单模板
export const commonTemplateParams = {
  name: {
    id: 'name',
    title: '物件名称',
    validate: 'required'
  },
  workload_unit: {
    id: 'workload_unit',
    title: '工作量单位',
    validate: 'required',
    option: ''
  },
  complete_date: {
    id: 'complete_date',
    title: '期望完成日期',
    validate: 'date|required',
    default: moment().format('YYYY/MM/DD')
  },
  level: {
    id: 'level',
    title: '制作等级',
    option: ''
  },
  test: {
    id: 'test',
    title: '是否测试单',
    option: '是|否'
  },
  supplicant: {
    id: 'supplicant',
    title: '意向供应商'
  },
  remark: {
    id: 'remark',
    title: '备注信息',
    validate: ''
  },
  production_staff: { // 新增制作人员
    id: 'production_staff',
    title: '制作人员',
    validate: ''
  }
}

export const defaultUnitKey = '(默认)'

/**
 * 解析下载模板参数
 * @param {Array} workloadUnits 工作量单位
 * @param {Object} selectedCategory 选中的物件类别
 * @returns {Array}
 */
export function formatTplParams(
  workloadUnits,
  selectedCategory,
  isShowGrade
) {
  let defaultUnit = ''
  const handleWorkloadUnits = workloadUnits.map(item => {
    if (item.id === selectedCategory.workloadUnit) {
      defaultUnit = `${item.label}${defaultUnitKey}`
      return `${item.label}${defaultUnitKey}`
    }
    return item.label
  }).join('|')
  const templateParams = [
    commonTemplateParams.name,
    {
      ...commonTemplateParams.workload_unit,
      option: handleWorkloadUnits,
      default: defaultUnit
    },
    commonTemplateParams.complete_date
    // commonTemplateParams.workload_amount
  ]
  // 是否有制作等级
  if (selectedCategory.levelOpts && selectedCategory.levelOpts.length > 0 && isShowGrade.isDepart && isShowGrade.isBase) {
    templateParams.push({
      ...commonTemplateParams.level,
      option: selectedCategory.levelOpts.map(item => item.label).join('|')
    })
  }
  // 是否有意向供应商
  templateParams.push(commonTemplateParams.supplicant)
  // if (selectedCategory.supplicantOpt && selectedCategory.supplicantOpt.length > 0) {
  //   templateParams.push({
  //     ...commonTemplateParams.supplicant,
  //     option: selectedCategory.supplicantOpt.map(item => item.label).join('|')
  //   })
  // }
  // 是否有测试单
  if (selectedCategory.hasTest) {
    templateParams.push(commonTemplateParams.test)
  }
  // 属性
  selectedCategory.attributeSetting.forEach(attr => {
    if (attr.componentName === 'DemandSelectField') { // 下拉组件
      // 多选
      if (attr.multiple === '1') {
        templateParams.push({
          id: `attribute-${attr.id}-multiple`,
          title: attr.title,
          default: '涉及多选，可前台填写，也可填写值并用;隔开，选项见批注',
          validate: attr.form_value.replace(/\|/g, ';')
        })
      } else {
        templateParams.push({
          id: `attribute-${attr.id}`,
          title: attr.title,
          validate: attr.is_required === 1 ? 'required' : '',
          option: attr.form_value
        })
      }
    } else if (attr.componentName === 'DemandInputField') { // 单个输入
      templateParams.push({
        id: `attribute-${attr.id}`,
        title: attr.title,
        validate: attr.is_required === 1 ? 'required' : ''
      })
    } else if (attr.componentName === 'DemandMutilInputField') { // 多个输入
      attr.fields.forEach((field, index) => {
        templateParams.push({
          id: `attribute-${attr.id}-${index}`,
          title: `${attr.title}(${field.label})`,
          validate: attr.is_required === 1 ? 'required' : ''
        })
      })
    }
  })

  // 数量/预估工作量
  if (!selectedCategory.hasBreakdown ||
        (selectedCategory.hasBreakdown && !selectedCategory.breakdownSetting.length)
  ) {
    // 数量
    templateParams.push({
      id: `count`,
      title: '数量/预估工作量',
      validate: 'number|required'
    })
  } else {
    // 预估工作量
    selectedCategory.breakdownSetting.forEach(option => {
      templateParams.push({
        id: `breakdown-${option.id}`,
        title: option.title,
        validate: 'number|required'
      })
    })
  }

  // 符合条件时制作人员
  if (Object.values(isShowGrade).every(item => item === true)) {
    templateParams.push({
      id: 'production_staff',
      default: '涉及多个制作人员，填写值并用;隔开，选项见批注',
      title: '制作人员',
      validate: ''
    })
  }

  // 非2d & 3d 服务品类时,添加预算
  if (!isShowGrade.category) {
    templateParams.push({
      id: 'workload_amount',
      title: '预估预算花费',
      validate: 'number'
    })
  }
  // 备注
  templateParams.push(commonTemplateParams.remark)

  return templateParams
}

/**
 * 解析模板导入数据
 * @param {Array} data 数据源：{row: Array}
 * @param {Array} levelOpts 制作等级
 * @param {Array} supplicantOpt 意向供应商
 */
export function formatImportTplData(data, levelOpts, supplicantOpt, attributeSetting) {
  return new Promise((resolve, reject) => {
    const result = []
    try {
      data.forEach(item => {
        const param = {}
        const testField = item.row.find(r => r.id === 'test')
        const levelField = item.row.find(r => r.id === 'level')
        item.row.forEach(r => {
          const key = r.id
          if (key === 'complete_date') { // 日期的需要转换成moment格式
            param[key] = moment(r.value)
          } else if (key === 'test') {
            param[key] = r.value === '是' ? 1 : 2
          } else if (key === 'level' && !levelOpts.length) {
            param[key] = 'NA'
          } else if (key === 'supplicant' && supplicantOpt.length > 0 && r.value) {
            const newSupplicantOpt = handleSupplicant(testField, levelField, supplicantOpt, levelOpts)
            const formatSupplicant = newSupplicantOpt.find(opt => opt.value.includes(r.value)) // 模糊匹配
            // 意向供应商如果没有匹配的，模板中填入无效
            if (formatSupplicant) {
              param[key] = formatSupplicant.value
            } else {
              param[key] = ''
            }
          } else if (key === 'workload_unit' && r.value.includes(defaultUnitKey)) {
            param[key] = r.value.replace(defaultUnitKey, '')
          } else if (key.search(/attribute-[0-9]{1,}-multiple/) > -1) {
            const newKey = key.replace(/-multiple/, '')
            param[newKey] = r.value.split(';')
          } else if (key === 'production_staff') {
            if (r.value === '') {
              param[key] = undefined
            } else {
              param[key] = r.value.split(';')
            }
          } else {
            const id = r.id.replace(/attribute-/g, '')
            if (attributeSetting && Array.isArray(attributeSetting)) {
              const targetOpt = attributeSetting.find(item => id === item.id)
              if (targetOpt && !targetOpt.form_value.includes(r.value)) {
                param[key] = ''
              } else {
                param[key] = r.value
              }
            } else {
              param[key] = r.value
            }
          }
        })
        result.push(param)
      })
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

// 根据是否测试单和制作等级处理供应商数据
function handleSupplicant(testField, levelField, supplicantOpt, levelOpts) {
  const isTest = testField ? testField.value === '是' : false
  const level = levelField ? levelField.value : ''
  let newSupplicantOpt = []
  const currentLevel = levelOpts.find(opt => opt.label === level)
  if (currentLevel) {
    newSupplicantOpt = supplicantOpt.filter(item => {
      // 没有制作等级配置，判断是否测试单配置
      if (!Array.isArray(item.grade_id) || !item.grade_id.length) {
        if (item.is_test.includes(isTest)) {
          return true
        }
        return false
      }
      // 有制作等级配置，两者都需要判断
      return item.is_test.includes(isTest) && item.grade_id.includes(toString(currentLevel.id))
    })
  } else {
    newSupplicantOpt = supplicantOpt.filter(item => {
      return item.is_test.includes(isTest)
    })
  }

  return newSupplicantOpt
}
