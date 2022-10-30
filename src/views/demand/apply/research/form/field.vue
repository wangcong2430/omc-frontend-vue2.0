<template>
  <div>
    <a-row :gutter="24">
      <a-col span="12">
        <a-form-item label="需求类别">
          <common-cascader
            v-decorator="[
              `type-${formIndex}`,
              {
                initialValue: '',
                rules: [{ required: true, message: '必选项' }]
              }
            ]"
            :placeholder="'请选择需求类别'"
            :allow-clear="true"
            :options="categoryTypes"
            :disabled="isConsumeModify && !!formItem.bill_no"
            @change="onSelectCategoryType"
          ></common-cascader>
        </a-form-item>
      </a-col>
      <a-col span="12">
        <a-form-item label="需求工作量单位">
          <common-input
            v-decorator="[
              `workload_unit-${formIndex}`,
              {
                initialValue: ''
              }
            ]"
            :placeholder="'选择需求类别自动关联工作量单位'"
            :disabled="true"
          ></common-input>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col span="12">
        <a-form-item label="需求工作量数量">
          <common-input
            v-decorator="[
              `workload-${formIndex}`,
              {
                initialValue: '',
                rules: [{ required: true, message: '必填项' }]
              }
            ]"
            :placeholder="'请输入需求工作量数量'"
            :only-input-num="true"
            :only-input-int="true"
            :disabled="isConsumeModify && !!formItem.bill_no"
          ></common-input>
        </a-form-item>
      </a-col>
      <a-col span="12">
        <a-form-item label="需求预估总价（￥）">
          <common-input
            v-decorator="[
              `workload_amount-${formIndex}`,
              {
                initialValue: '',
                rules: [{ validator: validateWorkloadAmount }]
              }
            ]"
            :placeholder="'请输入需求预估总价'"
            :only-input-num="true"
            :only-input-int="true"
          ></common-input>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col span="6">
        <a-form-item label="期望交付日期">
          <a-date-picker
            v-decorator="[
              `complete_date-${formIndex}`,
              {
                rules: [{ required: true, message: '必选项' }]
              }
            ]"
            format="YYYY-MM-DD"
            placeholder="请选择日期"
            style="width: 100%;"
            :disabled="isConsumeModify && !!formItem.bill_no"
          ></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col span="6">
        <a-form-item label="预算使用年份">
          <year-picker
            v-decorator="[
              `year-${formIndex}`,
              {
                valuePropName: 'defaultValue',
                initialValue: '',
                rules: [{ required: true, message: '必选项' }]
              }
            ]"
            :return-number="true"
            :disabled="isConsumeModify && !!formItem.bill_no"
          ></year-picker>
        </a-form-item>
      </a-col>
      <a-col span="3">
        <a-form-item label="是否意向供应商">
          <a-radio-group
            v-decorator="[
              `has_supplicant-${formIndex}`,
              {
                rules: [{ required: true, message: '必选项' }]
              }
            ]"
            :disabled="isConsumeModify && !!formItem.bill_no"
          >
            <a-radio :value="1">是</a-radio>
            <a-radio :value="2">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col span="9">
        <a-form-item label="备注">
          <a-textarea
            v-decorator="[
              `remark-${formIndex}`,
              {
                rules: [{ required: true, message: '必填项' }]
              }
            ]"
            :max-length="500"
            placeholder="1.请输入需求预估总价推导过程
2.如有意向供应商，请填写供应商名称
3.对意向供应商的能力要求
4.字数少于500
            "
            rows="4"
            :disabled="isConsumeModify && !!formItem.bill_no"
          ></a-textarea>
        </a-form-item>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import CommonInput from '@/components/Form/CommonInput'
import CommonCascader from '@/components/Form/CommonCascader'
import YearPicker from '@/components/YearPicker'
import { hideModel, showModel } from './model'
import { toNumber, isNumber } from 'lodash/lang'
import { getDevWorkloadUnit } from '@/api/demand/research'

export default {
  name: 'ResearchApplyForm',
  components: {
    CommonInput,
    CommonCascader,
    YearPicker
  },
  props: {
    form: {
      type: Object,
      required: true
    },
    formItem: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    formIndex: {
      type: [String, Number],
      required: true,
      default: 0
    },
    categoryTypes: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    groupSelectedCategoryType: {
      type: Function,
      required: true
    },
    isConsumeModify: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      workloadAmount: toNumber(this.formItem.workload_amount)
    }
  },
  mounted() {
    this.setFormValues()
  },
  methods: {
    // 设置需求明细表单数据
    async setDetailForm() {
      await this.setFormValues()
    },
    setFormValues() {
      this.$nextTick(() => {
        if (this.formItem) {
          for (const item in this.formItem) {
            if (!hideModel.includes(item) && showModel.includes(item)) {
              this.form.setFieldsValue({ [`${item}-${this.formIndex}`]: this.formItem[item] })
            }
          }
        } else {
          this.form.resetFields()
        }
      })
    },
    async onSelectCategoryType(val, options) {
      const workloadUnitKey = `workload_unit-${this.formIndex}`
      if (val && options) {
        const { unit } = await getDevWorkloadUnit(val.replace(/\//g, ','))
        this.form.setFieldsValue({ [workloadUnitKey]: unit })
        const joinLabel = options.reduce((accumulator, current, currentIndex) => {
          if (currentIndex === 0) {
            return accumulator + current.label
          }
          return accumulator + '/' + current.label
        }, '')
        this.groupSelectedCategoryType(val, joinLabel)
      } else {
        this.form.setFieldsValue({ [workloadUnitKey]: '' })
      }
    },
    onWorkloadPriceChange(val) {
      // 输入不是数字不处理
      if (Number.isNaN(val * 1)) return
      const workloadVal = this.form.getFieldValue(`workload-${this.formIndex}`)
      const workloadAmountKey = `workload_amount-${this.formIndex}`
      this.form.setFieldsValue({ [workloadAmountKey]: toNumber(val) * toNumber(workloadVal) })
    },
    validateWorkloadAmount(rule, value, callback) {
      if (value === '') {
        callback('必填项')
        return
      }

      if (
        this.isConsumeModify &&
        !!this.formItem.bill_no &&
        isNumber(value) &&
        isNumber(this.workloadAmount) &&
        value < this.workloadAmount
      ) {
        callback('预估预算花费只能调大，不能调小，调小需要通过结项来解决！')
      } else {
        callback()
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
