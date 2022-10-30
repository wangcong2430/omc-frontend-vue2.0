<template>
  <div>
    <div class="modal-body">
      <a-form :form="form" layout="horizontal" :label-col="{span: 6}" :wrapper-col="{span: 12}">
        <a-form-item label="项目名称">
          <common-input
            v-decorator="[
              `name`,
              {
                initialValue: '',
                rules: [
                  {
                    required: isCpProject ? false : true,
                    message: '必选项'
                  }
                ]
              }
            ]"
            :placeholder="'请输入项目名称'"
          ></common-input>
        </a-form-item>
        <a-form-item label="关联COA产品代码" :wrapper-col="{span: 17}">
          <a-select
            v-decorator="[
              `product_code`,
              {
                rules: [
                  {
                    required: true,
                    message: '必填项'
                  }
                ]
              }
            ]"
            show-search
            option-filter-prop="children"
            placeholder="请输入产品代码/名称搜索选择"
            :filter-option="false"
            :default-active-first-option="false"
            :not-found-content="searching ? undefined : null"
            @search="searchProductCode"
            @focus="filterProductCodesOpt = []"
          >
            <a-spin v-if="searching" slot="notFoundContent" size="small" />
            <a-select-option
              v-for="item in filterProductCodesOpt"
              :key="item.value"
            >{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="所属部门" :wrapper-col="{span: 17}">
          <a-select
            v-decorator="[
              `department`,
              {
                initialValue: departId,
                rules: [
                  {
                    required: true,
                    message: '必选项'
                  }
                ]
              }
            ]"
            show-search
            placeholder="请选择所属部门"
            option-filter-prop="children"
            :disabled="isBudgetWrite"
            :default-active-first-option="false"
            :options="departments"
            @change="selectDepartment"
          ></a-select>
        </a-form-item>
        <a-form-item label="所属成本中心" :wrapper-col="{span: 17}">
          <a-select
            v-decorator="[
              `costcenter_code`,
              {
                initialValue: cosCenterCode,
                rules: [
                  {
                    required: true,
                    message: '必选项'
                  }
                ]
              }
            ]"
            show-search
            placeholder="请选择所属成本中心"
            option-filter-prop="children"
            :disabled="isBudgetWrite"
            :default-active-first-option="false"
            :options="costCenterOpt"
          ></a-select>
        </a-form-item>
        <a-form-item :wrapper-col="{span: 17}" label="项目负责人">
          <common-member-picker
            v-decorator="[
              `principal`,
              {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '必填项'
                  }
                ]
              }
            ]"
            :placeholder="'项目负责人'"
            :only-input-one="true"
          ></common-member-picker>
        </a-form-item>
        <a-form-item :wrapper-col="{span: 17}" label="项目组成员">
          <common-member-picker
            v-decorator="[
              `members`,
              {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '必填项'
                  }
                ]
              }
            ]"
            :placeholder="'项目组成员'"
          ></common-member-picker>
        </a-form-item>
        <a-form-item label="预算年度项目所处阶段">
          <common-select
            v-decorator="[
              `stage_id`,
              {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '必填项'
                  }
                ]
              }
            ]"
            :placeholder="'请选择项目所处阶段'"
            :options="stagesOpt"
          ></common-select>
        </a-form-item>
        <a-form-item label="项目阶段起始年月">
          <a-month-picker
            v-decorator="[
              `start_date`,
              {
                rules: [
                  {
                    required: true,
                    message: '必选项'
                  }
                ]
              }
            ]"
            :disabled-date="disabledDate"
          />
        </a-form-item>
        <a-form-item label="项目阶段终止年月">
          <a-month-picker
            v-decorator="[
              `end_date`,
              {
                rules: [
                  {
                    required: true,
                    message: '必选项'
                  }
                ]
              }
            ]"
            :disabled-date="disabledDate"
          />
        </a-form-item>
        <a-form-item :wrapper-col="{span: 17}" label="项目背景及收益">
          <a-textarea
            v-decorator="[
              `description`,
              {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '必填项'
                  }
                ]
              }
            ]"
            rows="4"
            placeholder="请输入项目背景及收益"
          ></a-textarea>
        </a-form-item>
        <a-form-item :wrapper-col="{offset: 6}">
          <a-button type="primary" @click="submit">提交</a-button>
          <a-button style="margin-left: 10px;" @click="onClose">取消</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import CommonInput from '@/components/Form/CommonInput'
import CommonSelect from '@/components/Form/CommonSelect'
import CommonMemberPicker from '@/components/Form/CommonMemberPicker'
import { getCoscenter } from '@/api/budget/index'
import { addProject } from '@/api/project/index'
import { searchProductCode } from '@/utils/form'
import { omit } from 'lodash/object'
import moment from 'moment'

export default {
  name: 'AddProjectForm',
  components: {
    CommonInput,
    CommonSelect,
    CommonMemberPicker
  },
  props: {
    departId: {
      type: [String, Number],
      default: undefined
    },
    cosCenterCode: {
      type: [String, Number],
      default: undefined
    },
    costCenters: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否是预算填报页打开新增项目
    isBudgetWrite: {
      type: Boolean,
      default: false
    },
    // 是否是内容制作费新增项目
    isCpProject: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filterProductCodesOpt: [],
      searching: false,
      costCenterOpt: this.costCenters
    }
  },
  computed: {
    ...mapState({
      departments: state => state.budget.departments,
      stagesOpt: state => state.project.stages
    }),
    ...mapGetters(['productCodesOpt', 'productNames'])
  },
  watch: {
    costCenters(newVal) {
      this.costCenterOpt = newVal
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'add-project-form' })
  },
  methods: {
    searchProductCode(val) {
      // 避免输入为空时返回全部数据
      if (val === '') return

      this.searching = true
      searchProductCode(val, this.productCodesOpt).then(res => {
        this.filterProductCodesOpt = res
        if (res.length > 0) {
          this.searching = false
        }
      })
    },
    selectDepartment(val) {
      this.$nextTick(() => {
        this.form.setFieldsValue({ cost_center: undefined })
      })
      if (!val) {
        this.costCenterOpt = []
        return
      }
      getCoscenter(val).then(res => {
        const { data } = res
        this.costCenterOpt = data.map(item => ({ label: item.cost_center_name, value: item.cost_center_code }))
      })
    },
    resetForm() {
      this.form.resetFields()
    },
    onClose() {
      this.$emit('close')
    },
    disabledDate(current) {
      // 当前两年内可选
      return current &&
        (current < moment().startOf('year') ||
        current > moment().add(1, 'y').endOf('year'))
    },
    submit() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (err) {
          return
        }
        // 检查终止时间是否大于起始时间
        const checkDate = moment(values['end_date']).isBefore(moment(values['start_date']))
        if (checkDate) {
          return this.$message.info('项目阶段终止年月不能小于项目阶段起始年月！')
        }
        values = omit(values, 'department')
        const formData = {
          ...values,
          start_date: values['start_date'] ? values['start_date'].format('YYYY-MM') : '',
          end_date: values['end_date'] ? values['end_date'].format('YYYY-MM') : '',
          members: values['members'].split(';')
        }
        addProject([].concat(formData)).then(res => {
          this.$emit('close')
          this.$emit('submit')
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
