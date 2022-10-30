<template>
  <div>
    <div v-if="label" class="item-label">
      {{ label }}
      <span v-if="required" class="text-danger ml-5">*</span>
    </div>
    <div class="item-control">
      <a-radio-group
        :value="value"
        :disabled="disabled"
        @change="triggerChange"
      >
        <a-radio v-for="radio in radios" :key="radio.value" :value="radio.value" class="item-list">
          {{ radio.value }}
        </a-radio>
      </a-radio-group>
    </div>
  </div>
</template>
<script>
/**
 * @emits change Triggered when radio changes
 */
export default {
  name: 'CommonRadioGroup',
  props: {
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    radios: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    triggerChange(e) {
      this.$emit('change', e.target.value)
    }
  }
}
</script>
<style lang="less" scoped>
.item-label {
  margin-bottom: 20px !important;
}
.item-list {
  color: #414660;
  font-family: "Microsoft YaHei","微软雅黑";
  padding: 6px 0;
}
</style>
