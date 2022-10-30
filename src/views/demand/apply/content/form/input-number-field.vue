<template>
  <div class="expend-from-item">
    <div class="item-label">
      {{ option.title }}
      <a-tooltip v-if="option.description" placement="top">
        <template slot="title">
          <span>{{ option.description }}</span>
        </template>
        <a-icon type="question-circle-o" />
      </a-tooltip>
    </div>
    <div class="item-control">
      <a-form-item :self-update="true">
        <a-input-number
          v-decorator="[
            `breakdown-${option.id}`,
            {
              rules: [{ required: formItemRequired, message: '必填项' }]
            }
          ]"
          style="width: 100%;"
          size="small"
          :min="0"
          :step="0.1"
          :disabled="disabled"
          @change="val => getWorkloadValue(val,option.id)"
        ></a-input-number>
      </a-form-item>
    </div>
    <div v-if="selectedWorkloadUnitValue" class="item-unit">{{ selectedWorkloadUnitValue }}</div>
  </div>
</template>
<script>
export default {
  name: 'DemandInputNumberField',
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
    formItemRequired: {
      type: Boolean,
      default: true
    },
    selectedWorkloadUnitValue: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    getWorkloadValue: {
      type: Function,
      default: () => {}
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
  .item-label {
    min-width: 30px;
  }
  .item-control {
    min-width: 60px;
  }
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
.iomc-input-number-sm {
  width: 80px;
}
</style>
