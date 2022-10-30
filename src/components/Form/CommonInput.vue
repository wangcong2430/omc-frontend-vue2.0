<template>
  <div>
    <div v-if="label" class="item-label">
      {{ label }}
      <span v-if="required" class="text-danger ml-5">*</span>
    </div>
    <div v-if="!onlyInputNum" class="item-control">
      <a-input
        :value="currentValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        @change="triggerChange"
      ></a-input>
    </div>
    <div v-else class="item-control">
      <a-tooltip :trigger="['focus']" placement="topLeft">
        <span
          v-if="currentValue"
          slot="title"
          class="numeric-input-title"
        >{{ currentValue !== '-' ? formatNumber(currentValue) : '-' }}</span>
        <template v-else slot="title">{{ tipText }}</template>
        <a-input
          :value="currentValue"
          :type="type"
          :placeholder="placeholder"
          :disabled="disabled"
          @change="triggerChange"
          @blur="onBlur"
        />
      </a-tooltip>
    </div>
  </div>
</template>
<script>
/**
 * @emits change Triggered when input changes
 */
import { toNumber } from 'lodash/lang'

export default {
  name: 'CommonInput',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    onlyInputNum: {
      type: Boolean,
      default: false
    },
    onlyInputInt: {
      type: Boolean,
      default: false
    },
    tipText: {
      type: String,
      default: '请输入数字'
    }
  },
  data() {
    return {
      currentValue: this.value
    }
  },
  watch: {
    value(newValue) {
      this.currentValue = newValue
    }
  },
  methods: {
    formatNumber(value) {
      value += ''
      const list = value.split('.')
      const prefix = list[0].charAt(0) === '-' ? '-' : ''
      let num = prefix ? list[0].slice(1) : list[0]
      let result = ''
      while (num.length > 3) {
        result = `,${num.slice(-3)}${result}`
        num = num.slice(0, num.length - 3)
      }
      if (num) {
        result = num + result
      }
      return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`
    },
    triggerChange(e) {
      const changedValue = e.target.value

      if (this.onlyInputNum) {
        const reg = this.onlyInputInt ? /^(0|[1-9][0-9]*)([0-9]*)$/ : /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
        if (
          (!isNaN(changedValue) && reg.test(changedValue)) ||
          changedValue === '' ||
          (!this.onlyInputInt && changedValue === '-')
        ) {
          this.currentValue = changedValue
          this.$emit('change', (
            changedValue === '' ||
            (!this.onlyInputInt && changedValue === '-')
          ) ? changedValue : toNumber(changedValue))
        }
      } else {
        this.currentValue = changedValue
        this.$emit('change', changedValue)
      }
    },
    onBlur() {
      const { triggerChange } = this
      const currentValue = String(this.currentValue)
      if (currentValue.charAt(currentValue.length - 1) === '.' || currentValue === '-') {
        triggerChange({ target: { value: currentValue.slice(0, -1) }})
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
