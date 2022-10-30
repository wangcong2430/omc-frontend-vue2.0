<template>
  <div class="toolbar-dropdown">
    <a href="javascript:;">
      <i v-if="selectOpt.icon" class="mdi-set" :class="[selectOpt.icon]"></i>
      <span>{{ selectOpt.label }}</span>
      <i class="mdi-set mdi-chevron-down"></i>
    </a>
    <div class="dropdown-inner">
      <ul class="dropdown-menu">
        <li v-for="item in options" :key="item.value" @click="onSelectChange(item)">
          <a href="javascript:;">
            <i v-if="item.icon" class="mdi-set mr-10" :class="[item.icon]"></i>{{ item.label }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
/**
 * @param {Array} options 下拉选择项，包括icon、label、value等字段
 * @param { String, Number } defaultValue 默认选择项，需要和options中的value对应
 * @emits change Triggered when select change
 */

export default {
  name: 'DropdownMenu',
  props: {
    options: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    defaultValue: {
      type: [String, Number],
      default: undefined
    },
    value: {
      type: [String, Number],
      default: undefined
    }
  },
  data() {
    return {
      selectOpt: {
        icon: '',
        label: '',
        value: ''
      }
    }
  },
  watch: {
    value(newVal) {
      const opt = this.options.find(item => item.value === newVal)
      if (opt) {
        this.selectOpt = opt
      }
    }
  },
  created() {
    this.setDefaultValue()
  },
  methods: {
    setDefaultValue() {
      let value = ''
      if (this.defaultValue !== undefined) {
        value = this.defaultValue
      } else if (this.value !== undefined) {
        value = this.value
      }
      if (value !== '') {
        const opt = this.options.find(item => item.value === value)
        if (opt) {
          this.selectOpt = opt
        }
      }
    },
    onSelectChange(item) {
      if (item.value === this.selectOpt.value) return
      this.selectOpt = this.options.find(opt => opt.value === item.value)
      this.$emit('change', item.value, item)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
