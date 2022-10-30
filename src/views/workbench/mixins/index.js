export default {
  data() {
    return {
      tableData: [],
      indeterminate: false,
      checkAll: false,
      checkedList: []
    }
  },
  methods: {
    onChange(e, list) {
      const checkVal = e.target.checked
      if (checkVal) {
        list.checked = true
        this.checkedList.push(list)
      } else {
        list.checked = false
        this.checkedList = this.checkedList.filter(item => item.record_id !== list.record_id)
      }
      // 过滤掉可以撤销的数据
      const filterTableData = this.tableData.filter(data => {
        const filterIndex = data.opList.findIndex(opt => opt.action === 3)
        return filterIndex === -1
      })
      this.indeterminate = !!this.checkedList.length && this.checkedList.length < filterTableData.length
      this.checkAll = this.checkedList.length === filterTableData.length
    },
    onCheckAllChange(e) {
      const checkVal = e.target.checked
      this.indeterminate = false
      if (checkVal) {
        this.checkAll = true
        this.tableData = this.tableData.map(item => Object.assign({}, item, { checked: true }))
        // 过滤掉可以撤销的数据
        this.checkedList = this.tableData.filter(data => {
          const filterIndex = data.opList.findIndex(opt => opt.action === 3)
          return filterIndex === -1
        })
      } else {
        this.checkAll = false
        this.tableData = this.tableData.map(item => Object.assign({}, item, { checked: false }))
        this.checkedList = []
      }
    }
  }
}
