<template>
  <div class="omc-table-empty">
    <div class="empty-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
        <path
          fill="#d5d8e3"
          d="M30.4,1.5H9.6C4.3,1.5,0,5.8,0,11.2v17.7c0,5.3,4.3,9.6,9.6,9.6h26.2v-4.2H9.6c-3,0-5.4-2.4-5.4-5.4V11.2 c0-3,2.4-5.4,5.4-5.4h20.8c3,0,5.4,2.4,5.4,5.4v9.8c0,0.8-0.6,1.4-1.4,1.4l0,0c-0.5,0-1-0.3-1.3-0.8l-2.9-5.8 c-0.7-1.4-2.1-2.2-3.6-2.2l0,0c-1.5,0-2.9,0.9-3.6,2.2L21,19.5L19,15.7c-0.7-1.4-2.1-2.2-3.6-2.2l0,0c-1.5,0-2.9,0.9-3.6,2.2l-5,9.9 h5l3.7-7.2l1.9,3.8c0.7,1.4,2.1,2.2,3.6,2.2l0,0c1.5,0,2.9-0.9,3.6-2.2l1.9-3.8l2.6,5.2c1,1.9,3,3.2,5.1,3.2l0,0 c3.2,0,5.7-2.6,5.7-5.7v-9.8C40,5.8,35.7,1.5,30.4,1.5z"
        />
      </svg>
    </div>
    <div v-if="showBlankText" class="empty-text">
      <span>数据列表为空，立即</span>
      <a href="javascript:;" class="btn-primary" @click="add">{{ addText }}</a>
    </div>
    <template v-else>
      <div class="empty-text">
        <span>数据列表为空</span>
      </div>
    </template>
  </div>
</template>
<script>
/**
 * @emits add Triggered when click add button
 */
export default {
  name: 'EmptyPage',
  props: {
    addText: {
      type: String,
      default: '新增'
    },
    showBlankText: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    add() {
      this.$emit('add')
    }
  }
}
</script>
<style lang="less" scoped>
.btn-primary {
  color: #6b5aed !important;
}
</style>
