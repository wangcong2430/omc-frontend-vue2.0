<template>
  <div class="omc-modal" :class="{'modal-show': status}">
    <div
      :class="['omc-modal-dialog', formatSize()]"
      :style="formatWidth()"
    >
      <div class="modal-head">
        <div class="col-left">
          <div class="modal-title">{{ title }}</div>
          <a class="modal-close" href="javascript:;" @click="onClose()">
            <i></i>
          </a>
        </div>
        <div class="col-right">
          <slot name="modalHead"></slot>
        </div>
      </div>
      <div class="modal-body">
        <slot name="modalBody"></slot>
      </div>
      <slot name="modalFooter"></slot>
    </div>
    <div class="omc-modal-backdrop" @click="onClose()"></div>
  </div>
</template>
<script>
/**
 * 右侧弹框
 * @param width 弹框宽度
 * @param visible 对话框是否可见
 * @param title 弹窗标题
 * @param size 弹窗大小，small(小)、large(大)
 * @event close 弹窗关闭事件
 */
export default {
  name: 'RightModal',
  props: {
    width: {
      type: Number || String,
      default: 840
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '弹窗'
    },
    size: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      status: this.visible
    }
  },
  watch: {
    visible(newVal) {
      this.status = newVal
    }
  },
  methods: {
    onClose() {
      this.status = false
      this.$emit('close')
    },
    formatWidth() {
      if (!this.width) {
        return {}
      }
      if (typeof this.width === 'number') {
        return { 'width': `${this.width}px` }
      }
      return { 'width': this.width }
    },
    formatSize() {
      if (!this.size) {
        return ''
      }

      switch (this.size) {
        case 'large':
          return 'dialog-lg'
        case 'small':
          return 'dialog-sm'
        default:
          return ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
.omc-modal-backdrop {
  cursor: pointer;
}
</style>
