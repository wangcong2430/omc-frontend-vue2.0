<template>
  <div>
    <div v-if="label" class="item-label">
      {{ label }}
      <span v-if="required" class="text-danger ml-5">*</span>
    </div>
    <div class="item-control">
      <member-picker
        ref="memberPicker"
        :value="value"
        :placeholder="placeholder"
        :disabled="disabled"
        :max-member-count="maxMemberCount"
        :only-input-one="onlyInputOne"
        :is-cache="isCache"
        :empty-enter-select="emptyEnterSelect"
        :is-tips="isTips"
        @member-picker="triggerChange"
      ></member-picker>
    </div>
  </div>
</template>
<script>
/**
 * @emits change Triggered when the member changes
 */
import MemberPicker from '@/components/MemberPicker/index'

export default {
  name: 'CommonMemberPicker',
  components: {
    MemberPicker
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxMemberCount: {
      type: Number,
      default: 8
    },
    onlyInputOne: {
      type: Boolean,
      default: false
    },
    isCache: {
      type: Boolean,
      default: true
    },
    emptyEnterSelect: {
      type: Boolean,
      default: true
    },
    isTips: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    triggerChange(value) {
      this.$emit('change', value)
    },
    focus() {
      this.$refs['memberPicker'].focus()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
