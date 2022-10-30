<template>
  <div class="table-default">
    <a-table
      :data-source="tableData"
      :columns="columns"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onSelect: onSelectChange,
        onSelectAll: onSelectAll
      }"
      :pagination="false"
      :loading="loading"
    ></a-table>
    <div v-if="pagination && total > 0" class="table-pagination">
      <pagination :total="total" @change="pageChange"></pagination>
    </div>
  </div>
</template>
<script>
/**
 * 支持表格项选择的表格组件，columns项参考antd-vue的Table组件
 * tableData必须传入key字段，并且保证值的唯一性
 * @emits selectChange Triggered when select changes
 * @emits pageChange Triggered when page changes
 */
import Pagination from '@/components/Pagination/index'
import { uniq, uniqBy, difference, differenceBy } from 'lodash/array'

export default {
  name: 'SelectionTable',
  components: {
    Pagination
  },
  props: {
    tableData: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    columns: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    total: {
      type: Number,
      default: 0
    },
    pagination: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  methods: {
    onSelectChange(record, selected, selectedRows) {
      if (selected) {
        // 选择
        this.selectedRowKeys = [...this.selectedRowKeys, record.key]
        this.selectedRows = [...this.selectedRows, record]
      } else {
        this.selectedRowKeys = this.selectedRowKeys.filter(item => item !== record.key)
        this.selectedRows = this.selectedRows.filter(item => item.key !== record.key)
      }
      this.$emit('selectChange', this.selectedRowKeys, this.selectedRows)
    },
    onSelectAll(selected, selectedRows, changeRows) {
      const keys = []
      if (selected) {
        // 选择全部
        selectedRows.forEach(item => {
          keys.push(item.key)
        })
        this.selectedRowKeys = uniq([...this.selectedRowKeys, ...keys])
        this.selectedRows = uniqBy([...this.selectedRows, ...selectedRows], 'key')
      } else {
        changeRows.forEach(item => {
          keys.push(item.key)
        })
        this.selectedRowKeys = difference(this.selectedRowKeys, keys)
        this.selectedRows = differenceBy(this.selectedRows, changeRows, 'key')
      }
      this.$emit('selectChange', this.selectedRowKeys, this.selectedRows)
    },
    pageChange({ page, pageSize }) {
      this.$emit('pageChange', page, pageSize)
    }
  }
}
</script>
<style lang="less" scoped>
.table-pagination {
  margin-top: 20px;
}
</style>
