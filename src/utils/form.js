// 表单字段操作相关方法，支持三级表单动态新增
import { set } from 'lodash/object'

/**
 * 第一级新增
 * @param {Array} form 表单
 * @param {Object} data 新增的数据
 */
export function addCenter(form, data) {
  return [...form, data]
}

/**
 * 第一级删除
 * @param {Array} form 表单
 * @param {Number} index 第一级index
 */
export function deleteCenter(form, index) {
  return form.filter((item, id) => id !== index)
}

/**
 * 第二级新增
 * @param {Array} form 表单
 * @param {Number} centerId 第一级index
 * @param {Object} data 新增的数据
 * @param {String} listType 第二级表单的Key，默认是lists
 */
export function addBudget(form, centerId, data, listType = 'lists') {
  form[centerId][listType] = [...form[centerId][listType], data]
  return form
}

/**
 * 第二级删除
 * @param {Array} form 表单
 * @param {Number} centerId 第一级index
 * @param {Number} projectId 第二级index
 * @param {String} listType 第二级表单的Key，默认是lists
 */
export function deleteBudget(form, centerId, projectId, listType = 'lists') {
  form[centerId][listType] = form[centerId][listType].filter((item, index) => index !== projectId)
  return form
}

/**
 * 第三级新增
 * @param {Array} form 表单
 * @param {Number} centerId 第一级index
 * @param {Number} projectId 第二级index
 * @param {Object} data 新增的数据
 * @param {String} listType 第二级表单的Key，默认是lists
 * @param {String} childType 第三级表单的Key，默认是child
 */
export function addChild(form, centerId, projectId, data, listType = 'lists', childType = 'child') {
  let formData = form
  if (centerId !== undefined && projectId !== undefined) {
    formData = set(
      form,
      [centerId, listType, projectId, childType],
      [...form[centerId][listType][projectId][childType], data]
    )
  }
  return formData
}

/**
 * 第三级删除
 * @param {Array} form 表单
 * @param {Number} centerId 第一级index
 * @param {Number} projectId 第二级index
 * @param {Number} childId 第三级index
 * @param {String} listType 第二级表单的Key，默认是lists
 * @param {String} childType 第三级表单的Key，默认是child
 */
export function deleteChild(form, centerId, projectId, childId, listType = 'lists', childType = 'child') {
  let formData = form
  if (centerId !== undefined && projectId !== undefined && childId !== undefined) {
    formData = set(
      form,
      [centerId, listType, projectId, childType],
      form[centerId][listType][projectId][childType].filter((child, n) => n !== childId)
    )
  }
  return formData
}

// 新增附件
export function addAttaments(form, centerId, projectId, data, listType = 'lists', attachmentType = 'attachment') {
  let formData = form
  if (centerId !== undefined && projectId !== undefined) {
    formData = set(
      form,
      [centerId, listType, projectId, attachmentType],
      [...form[centerId][listType][projectId][attachmentType], data]
    )
  }
  return formData
}

// 删除附件
export function deleteAttaments(form, centerId, projectId, fileId, listType = 'lists', attachmentType = 'attachment') {
  let formData = form
  if (centerId !== undefined && projectId !== undefined) {
    formData = set(
      form,
      [centerId, listType, projectId, attachmentType],
      form[centerId][listType][projectId][attachmentType].filter((item, index) => index !== fileId)
    )
  }
  return formData
}

/**
 * 设置表单项
 * @param {Array} form 表单
 * @param {Number} centerId 第一级index
 * @param {Number} projectId 第二级index
 * @param {Number} childId 第三级index
 * @param {String} formName 字段key
 * @param {String} formValue 字段value
 * @param {String} listType 第二级表单的Key，默认是lists
 * @param {String} childType 第三级表单的Key，默认是child
 */
export function setFormItem(form, centerId, projectId, childId, formName, formValue, listType = 'lists', childType = 'child') {
  let formData = form
  if (centerId !== undefined && projectId !== undefined) {
    if (childId !== undefined) {
      formData = set(form, [centerId, listType, projectId, childType, childId, formName], formValue)
    } else {
      formData = set(form, [centerId, listType, projectId, formName], formValue)
    }
  } else if (centerId !== undefined && projectId === undefined) {
    formData = set(form, [centerId, formName], formValue)
  }
  return formData
}

export function setAdditionalInfo(form, { create_time, create_user, create_reason, create_cause }) {
  const formData = form
  formData.forEach(item => {
    item.lists.forEach(list => {
      list.child = list.child.map(child => {
        if (child.id) {
          return child
        } else {
          return Object.assign({}, child, {
            create_time,
            create_user,
            create_reason,
            create_cause
          })
        }
      })
    })
  })

  return formData
}

// 解析表单字段名称
export function handleFormValues(values) {
  const result = []
  if (typeof values === 'object' || values instanceof Object) {
    for (const key in values) {
      const name = key.replace(/(-)\d*/g, '')
      const str = key.replace(name, '')
      const strArr = str.split('-')
      result.push({
        centerId: strArr[1] ? Number(strArr[1]) : undefined,
        projectId: strArr[2] ? Number(strArr[2]) : undefined,
        childId: strArr[3] ? Number(strArr[3]) : undefined,
        formName: name,
        formValue: values[key]
      })
    }
  }

  return result
}

// 搜索关联产品代码
function filterProductCodes(val, productCodesOpt) {
  return new Promise((resolve, reject) => {
    const filterData = []
    for (let i = 0, len = productCodesOpt.length; i < len; i++) {
      if (productCodesOpt[i].label.toLowerCase().includes(val.toLowerCase())) {
        filterData.push(productCodesOpt[i])
      }
      // 大于50个停止搜索
      if (filterData.length > 50) {
        break
      }
    }
    resolve(filterData)
  })
}
export function searchProductCode(val, productCodesOpt) {
  return new Promise((resolve, reject) => {
    filterProductCodes(val, productCodesOpt).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// 搜索关联历史项目
export function searchRelatedProject(value, relateProject) {
  return new Promise((resolve, reject) => {
    try {
      const filterData = []
      for (let i = 0, len = relateProject.length; i < len; i++) {
        if (relateProject[i].value.toLowerCase().includes(value.toLowerCase())) {
          filterData.push(relateProject[i])
        }

        // 大于50个停止搜索
        // if (filterData.length > 50) {
        //   break
        // }
      }
      resolve(filterData)
    } catch (error) {
      reject(error)
    }
  })
}
