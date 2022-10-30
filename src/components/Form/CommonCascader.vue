<template>
  <div>
    <a-cascader
      :value="currentValue"
      :options="options"
      :placeholder="placeholder"
      :disabled="disabled"
      :field-names="fieldNames"
      :show-search="showSearch"
      :allow-clear="allowClear"
      popup-class-name="common-cascader"
      @change="triggerChange"
    ></a-cascader>
  </div>
</template>
<script>
/**
 * antd-vue官方提示只有在绑定的值为undefined的时候placeholder才生效
 * @emits change Triggered when select changes
 */

export default {
  name: 'CommonCascader',
  props: {
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default() {
        return []
      }
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fieldNames: {
      type: Object,
      default() {
        return {
          label: 'label',
          value: 'value',
          children: 'children'
        }
      }
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    allowClear: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentValue: this.value === '' ? undefined : this.value.split('/')
    }
  },
  watch: {
    value(newVal) {
      this.currentValue = newVal === '' ? undefined : newVal.split('/')
    }
  },
  methods: {
    triggerChange(value, options) {
      this.currentValue = value === '' ? undefined : value
      this.$emit('change', value.join('/'), options)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
