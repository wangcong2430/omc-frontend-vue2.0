<template>
  <div class="expend-from-item">
    <div class="item-label">
      <span v-if="option.is_required === 1" class="text-danger mr-5">*</span>{{ option.title }}
    </div>
    <div class="item-control">
      <a-form-item :self-update="true">
        <a-input
          v-decorator="[
            `attribute-${option.id}`,
            {
              rules: [{ required: option.is_required === 1, message: '必填项' }]
            }
          ]"
          :placeholder="`请输入${option.title}`"
          :disabled="disabled"
        ></a-input>
      </a-form-item>
    </div>
    <div v-if="option.form_unit" class="item-unit">{{ option.form_unit }}</div>
  </div>
</template>
<script>
export default {
  name: 'DemandInputField',
  props: {
    form: {
      type: Object,
      required: true
    },
    option: {
      type: Object,
      required: true
    },
    formId: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.expend-from-item {
  .item-unit {
    padding: 0 4px;
    white-space: nowrap;
    align-self: center;
    font-size: 12px;
    color: #8f93a1;
    font-weight: bold;
  }
}
.iomc-form-item {
  margin-bottom: 0;
}
</style>
