<template>
  <div class="expend-mutil-from-item">
    <div class="item-label">
      <span v-if="option.is_required === 1" class="text-danger mr-5">*</span>{{ option.title }}
    </div>
    <div class="item-control">
      <div class="item-control-inline">
        <div v-for="(field, i) in option.fields" :key="`${option.id}${i}`" class="form-control-inner-inline">
          <div class="control-input">
            <a-form-item :self-update="true">
              <a-input
                v-decorator="[
                  `attribute-${option.id}-${i}`,
                  {
                    rules: [{ required: option.is_required === 1, message: '必填项' }]
                  }
                ]"
                :placeholder="field.label"
                :disabled="disabled"
              ></a-input>
            </a-form-item>
          </div>
          <div class="control-text">{{ i === option.fields.length - 1 ? option.form_unit : option.form_separator }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DemandMutilInputField',
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
  }
}
</script>
<style lang="less" scoped>
.expend-mutil-from-item {
  .item-label {
    font-size: 12px;
    line-height: 18px;
    min-width: 44px;
    font-weight: bold;
    color: #8f93a1;
  }
  .item-control {
    .item-control-inline {
      display: flex;
      flex-wrap: nowrap;
      .form-control-inner-inline {
        display: flex;
        flex-wrap: nowrap;
        .control-input {
          flex: 1;
          padding: 0 4px;
        }
        .control-text {
          white-space: nowrap;
          align-self: center;
          font-size: 12px;
          color: #8f93a1;
          font-weight: bold;
        }
      }
    }
  }
}
.iomc-form-item {
  margin-bottom: 0;
}
</style>
