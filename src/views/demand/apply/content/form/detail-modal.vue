<template>
  <a-modal
    :visible="visible"
    title="物件明细"
    :destroy-on-close="true"
    :width="900"
    @cancel="() => { $emit('cancel') }"
  >
    <template slot="footer">
      <a-button key="submit" type="primary" @click="() => { this.$emit('cancel') }">
        确定
      </a-button>
    </template>
    <a-form :form="form">
      <div class="breakdown-detail-form">
        <table class="form-table">
          <thead>
            <tr>
              <th width="50%">明细名称</th>
              <th width="50%">预估工作量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="setting in breakdownSetting" :key="setting.id">
              <td>
                {{ setting.title }}
                <a-tooltip v-if="setting.description" placement="top">
                  <template slot="title">
                    <span>{{ setting.description }}</span>
                  </template>
                  <a-icon type="question-circle-o" />
                </a-tooltip>
              </td>
              <td>
                <a-form-item>
                  <a-input-number
                    v-decorator="[
                      `breakdown-${setting.id}`
                    ]"
                    size="small"
                    :min="0"
                    :step="0.1"
                  ></a-input-number>
                </a-form-item>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </a-form>
  </a-modal>
</template>
<script>
import { createUuid } from '@/utils/uuid'

export default {
  name: 'BreakdownDetailModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    breakdownSetting: {
      type: Array,
      required: true
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {
      name: `detail_modal_form_${createUuid()}`,
      onFieldsChange: (_, changeFiled) => {
        this.$emit('change', changeFiled)
      },
      onValuesChange: (_, values) => {
        this.$emit('valuesChange', values)
      }
    })
  }
}
</script>
<style lang="less" scoped>
.breakdown-detail-form {
  .form-table {
    width: 100%;
    tr {
      th {
        font-size: 12px;
        font-weight: bold;
        color: #6a6f85;
        background-color: #fafafa;
        padding: 10px 0;
        vertical-align: middle;
        padding-left: 10px;
      }
      td {
        font-size: 12px;
        border-top: 1px solid #e9eaf0;
        vertical-align: middle;
        padding-left: 10px;
      }
    }
  }
}
.iomc-form-item {
  margin-bottom: 0;
}
</style>
