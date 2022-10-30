<template>
  <div>
    <a-date-picker
      :value="time"
      :open="isOpen"
      :placeholder="placeholder"
      :allow-clear="allowClear"
      :disabled="disabled"
      mode="year"
      format="YYYY"
      style="width: 100%;"
      @openChange="onOpenChange"
      @panelChange="onPanelChange"
      @change="onChange"
    ></a-date-picker>
  </div>
</template>
<script>
import moment from 'moment'
/**
 * @emits change Triggered when picked year changes
 */

export default {
  name: 'YearPicker',
  props: {
    placeholder: {
      type: String,
      default: '请选择年份'
    },
    defaultValue: {
      type: [String, Number],
      default: null
    },
    allowClear: {
      type: Boolean,
      default: true
    },
    returnNumber: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: false,
      time: this.defaultValue ? moment(this.defaultValue, 'YYYY') : null
    }
  },
  watch: {
    defaultValue(newVal) {
      this.time = newVal ? moment(newVal, 'YYYY') : null
    }
  },
  methods: {
    onOpenChange(status) {
      this.isOpen = status
    },
    onPanelChange(val) {
      this.time = val
      this.isOpen = false
      this.$emit('change', this.returnNumber ? new Date(val).getFullYear() : String(new Date(val).getFullYear()))
    },
    onChange() {
      this.time = null
      this.$emit('change', '')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
