// 研发费需求明细表单字段

const detailModel = {
  uid: 0,
  open: true, // 是否是打开状态
  type: '',
  // checker: '',
  workload_unit: '',
  workload: '',
  workload_amount: '',
  complete_date: null,
  year: new Date().getFullYear(), // 默认为当年
  has_supplicant: '',
  remark: ''
}

const hideModel = [
  'uid',
  'id',
  'open',
  'bill_no',
  'checker',
  'workload_price',
  'type_name',
  'epo_type'
]
const showModel = [
  'type',
  'workload_unit',
  'workload',
  'workload_amount',
  'complete_date',
  'year',
  'has_supplicant',
  'remark'
]

module.exports = {
  detailModel,
  hideModel,
  showModel
}
