<template>
  <div>
    <a-pagination
      v-model="currentPage"
      :page-size="currentPageSize"
      :total="total"
      :show-size-changer="showSizeChanger"
      :item-render="itemRender"
      :page-size-options="pageSizeOptions"
      class="pagination-wrapper omc-pagination"
      @change="triggerChange"
      @showSizeChange="onShowSizeChange"
    />
  </div>
</template>
<script>
/**
 * @emits change Triggered when page changes
 * @emits showSizeChange Triggered when pageSize changes
 */

export default {
  name: 'OmcPagination',
  props: {
    current: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 15
    },
    total: {
      type: Number,
      default: 0
    },
    showSizeChanger: {
      type: Boolean,
      default: false
    },
    pageSizeOptions: {
      type: Array,
      default: () => {
        return ['15', '25', '35', '45', '55']
      }
    }
  },
  data() {
    return {
      currentPage: this.current,
      currentPageSize: this.pageSize
    }
  },
  watch: {
    current(newVal) {
      this.currentPage = newVal
    },
    pageSize(newVal) {
      this.currentPageSize = newVal
    }
  },
  methods: {
    itemRender(current, type, originalElement) {
      if (type === 'prev') {
        return <a>上一页</a>
      } else if (type === 'next') {
        return <a>下一页</a>
      }
      return originalElement
    },
    triggerChange(page, pageSize) {
      this.$emit('change', { page, pageSize })
    },
    onShowSizeChange(current, pageSize) {
      this.currentPageSize = pageSize
      this.$emit('showSizeChange', pageSize)
    }
  }
}
</script>
<style lang="less" scoped>
.pagination-wrapper {
  margin: 0;
  padding: 0;
  list-style: none;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}
</style>
