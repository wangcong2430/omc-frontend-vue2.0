<template>
  <a-form :form="detailForm" layout="horizontal" class="body-row" self-update>
    <div class="body-col" style="width: 15px;">{{ formIndex + 1 }}</div>
    <div class="body-col" style="width: 18%;">
      <ul class="expend-from">
        <li>
          <div class="expend-from-item">
            <div class="item-label"><span class="text-danger mr-5">*</span>物件名称</div>
            <div class="item-control">
              <a-form-item :self-update="true">
                <common-input
                  v-decorator="[
                    `name`,
                    {
                      initialValue: '',
                      rules: [{ required: true, message: '必填项' }, { validator: validateName }]
                    }
                  ]"
                  :placeholder="'请输入物件名称'"
                  :disabled="isConsumeModify"
                ></common-input>
              </a-form-item>
            </div>
          </div>
        </li>
        <li>
          <div class="expend-from-item">
            <div class="item-label"><span class="text-danger mr-5">*</span>类别</div>
            <div class="item-control">
              <a-form-item :self-update="true">
                <a-select
                  v-decorator="[
                    `type`,
                    {
                      initialValue: selectedCategory.value,
                      rules: [{ required: true, message: '必选项' }]
                    }
                  ]"
                  :show-search="true"
                  :placeholder="'请选择需求类别'"
                  :default-active-first-option="false"
                  option-filter-prop="children"
                  :options="childCategoryDetails"
                  dropdown-class-name="common-select-dropdown"
                  :disabled="isConsumeModify"
                  @change="onCategoryChange"
                ></a-select>
              </a-form-item>
            </div>
          </div>
        </li>
        <li>
          <div class="expend-from-item">
            <div class="item-label"><span class="text-danger mr-5">*</span>工作量单位</div>
            <div class="item-control">
              <a-form-item :self-update="true">
                <common-select
                  v-decorator="[
                    `workload_unit`,
                    {
                      initialValue: '',
                      rules: [{ required: true, message: '必选项' }]
                    }
                  ]"
                  :show-search="true"
                  :placeholder="'工作量单位'"
                  :options="lacalWorkloadUnits"
                  dropdown-class-name="common-select-dropdown"
                  :disabled="isConsumeModify"
                  @change="onWorkUnitChange"
                ></common-select>
              </a-form-item>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 属性配置start -->
    <div v-if="hasAttributeSetting" class="body-col" style="width: 25%;">
      <ul class="expend-from">
        <li
          v-for="(option, i) in selectedCategory.attributeSetting"
          :key="`${i}-${option.id}-${selectOpt}`"
          class="attr"
        >
          <component
            :is="option.componentName"
            :form="detailForm"
            :option="option"
            :form-id="formId"
            :disabled="isConsumeModify"
            :index="i"
            @apply-to-same-type="onApplyToSameType"
            @selectHandler="selectHandler"
          ></component>
        </li>
      </ul>
    </div>
    <!-- 属性配置end -->

    <!-- 工作量明细配置start -->
    <div class="body-col" style="flex: 1;">
      <ul class="expend-from">
        <!--有预估工作量，并且有相关明细，需要填相关明细预估工作量start-->
        <template
          v-if="selectedCategory.hasBreakdown && selectedCategory.breakdownSetting.length > 0"
        >
          <li
            v-for="(option, i) in selectedCategory.breakdownSetting"
            :key="`${i}-${option.id}`"
            class="col-half"
          >
            <component
              :is="'DemandInputNumberField'"
              :form="detailForm"
              :option="option"
              :form-id="formId"
              :selected-workload-unit-value="selectedWorkloadUnitValue"
              :disabled="isConsumeModify"
              :get-workload-value="getWorkloadValue"
              @apply-to-same-type="onApplyToSameType"
            ></component>
          </li>
        </template>
        <!--填相关明细预估工作量end-->

        <!--没有预估工作量，但有相关明细，需要填数量和选填相关明细预估工作量start-->
        <template
          v-else-if="!selectedCategory.hasBreakdown && selectedCategory.breakdownSetting.length > 0"
        >
          <li
            class="col-half"
          >
            <div class="expend-from-item">
              <div class="item-control">
                <a-form-item :self-update="true">
                  <a-input-number
                    v-decorator="[
                      `count`,
                      {
                        rules: [{ required: true, message: '必填项' }, { validator: validateCount }]
                      }
                    ]"
                    :style="{'width': selectedWorkloadUnitValue ? '85%' : '100%'}"
                    size="small"
                    :min="0"
                    :step="0.1"
                    :disabled="isConsumeModify"
                    @change="onMountChange"
                  ></a-input-number>
                  <span class="item-unit2">{{ selectedWorkloadUnitValue }}</span>
                </a-form-item>
              </div>
            </div>
          </li>
          <li
            v-for="(option, i) in selectedCategory.breakdownSetting"
            v-show="false"
            :key="`${i}-${option.id}`"
            class="col-half"
          >
            <component
              :is="'DemandInputNumberField'"
              :form="detailForm"
              :option="option"
              :form-id="formId"
              :form-item-required="false"
              :disabled="isConsumeModify"
              @apply-to-same-type="onApplyToSameType"
            ></component>
          </li>
          <li v-if="!isConsumeModify" class="col-half">
            <a-button
              type="primary"
              size="small"
              class="small-btn"
              @click="openDetailModal"
            >编辑明细</a-button>
          </li>
        </template>
        <!--填数量和选填相关明细预估工作量end-->

        <!-- 没有预估工作量，并且没有相关明细，需要填数量start -->
        <li
          v-else
          class="col-half col-workload"
        >
          <a-form-item :self-update="true">
            <a-input-number
              v-decorator="[
                `count`,
                {
                  rules: [{ required: true, message: '必填项' }, { validator: validateCount }]
                }
              ]"
              style="width: 100%;"
              size="small"
              :min="0"
              :step="0.1"
              :disabled="isConsumeModify"
              @change="onMountChange"
            ></a-input-number>
            <span class="item-unit">{{ selectedWorkloadUnitValue }}</span>
          </a-form-item>
        </li>
        <!-- 数量end -->
      </ul>
    </div>
    <!-- 工作量明细配置end -->
    <div class="body-col" style="width: 15%;">
      <ul class="expend-from">
        <li>
          <div class="expend-from-item">
            <div class="item-label">完成日期</div>
            <div class="item-control">
              <a-form-item :self-update="true">
                <a-date-picker
                  v-decorator="[
                    `complete_date`,
                    {
                      rules: [{ required: true, message: '必选项' }]
                    }
                  ]"
                  format="YYYY-MM-DD"
                  placeholder="期望完成日期"
                  style="width: 100%;"
                  :disabled="isConsumeModify"
                ></a-date-picker>
              </a-form-item>
            </div>
          </div>
        </li>
        <li>
          <div class="expend-from-item">
            <div class="item-label">制作等级</div>
            <div class="item-control">
              <a-form-item :self-update="true">
                <common-select
                  v-decorator="[
                    `level`,
                    {
                      initialValue: '',
                      rules: [{ required: false }]
                    }
                  ]"
                  :placeholder="'请先选择制作等级'"
                  :options="selectedCategory.levelOpts"
                  :disabled="!selectedCategory.levelOpts.length || isConsumeModify || isDisabledGrade"
                  dropdown-class-name="common-select-dropdown"
                  @change="onLevelChange"
                ></common-select>
              </a-form-item>
            </div>
          </div>
        </li>
        <li>
          <div class="expend-from-item">
            <div class="item-label budget-cost">
              <p>预估预算花费</p>
              <p class="text-danger">(2d/3d下人日单位自动计算,其他需求方预估)</p>
            </div>
            <div class="item-control amount">
              <a-form-item :self-update="true">
                <a-input-number
                  v-decorator="[
                    `workload_amount`,
                    {
                      initialValue: 0,
                      rules: [{ required: true, message: '必填项' }, { validator: validateWorkloadAmount }]
                    }
                  ]"
                  :class="isDisabled ? 'trans' : 'default'"
                  :min="0"
                  :formatter="value => `￥${value}`"
                  style="width: 100%;"
                ></a-input-number>
              </a-form-item>
              <div v-if="isDisabled" class="disable-mask"></div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="body-col" style="width: 18%;">
      <ul class="expend-from">
        <li v-if="selectedCategory.hasTest">
          <div class="expend-from-item">
            <div class="item-label">是否测试单</div>
            <div class="item-control">
              <a-form-item :self-update="true">
                <a-radio-group
                  v-decorator="[
                    `test`,
                    {
                      initialValue: 2
                    }
                  ]"
                  :disabled="isConsumeModify"
                  @change="onTestChange"
                >
                  <a-radio :value="1" class="radio-item">是</a-radio>
                  <a-radio :value="2" class="radio-item">否</a-radio>
                </a-radio-group>
              </a-form-item>
            </div>
          </div>
        </li>
        <li>
          <div class="expend-from-item">
            <div class="item-label">意向供应商</div>
            <div class="item-control">
              <a-form-item :self-update="true">
                <common-select
                  v-decorator="[
                    `supplicant`,
                    {
                      initialValue: ''
                    }
                  ]"
                  :placeholder="'请选择意向供应商'"
                  :options="supplicantDataOpt"
                  :show-search="true"
                  :allow-clear="true"
                  dropdown-class-name="common-select-dropdown"
                  :disabled="isConsumeModify"
                ></common-select>
              </a-form-item>
            </div>
          </div>
        </li>
        <li>
          <div class="expend-from-item">
            <div class="item-label">备注</div>
            <div class="item-control">
              <a-form-item :self-update="true">
                <a-textarea
                  v-decorator="[
                    `remark`,
                    {
                      initialValue: ''
                    }
                  ]"
                  :max-length="200"
                  :disabled="isConsumeModify"
                  placeholder="限制200字以内，采购经理及审核人可见，供应商不可见"
                  style="height: 50px; max-height: 9.0072e+15px;"
                ></a-textarea>
              </a-form-item>
            </div>
          </div>
          <div v-if="verificaSelectData(isShowGrade)" class="expend-from-item">
            <div class="item-label">制作人员(手动填写)</div>
            <div class="item-control">
              <a-form-item :self-update="true">
                <a-select
                  v-decorator="[
                    `production_staff`,
                    {
                      rules: [{ required: true}]
                    }
                  ]"
                  dropdown-class-name="hide-option"
                  :default-open="false"
                  :filter-option="false"
                  mode="tags"
                  style="width: 100%"
                  placeholder="请输填写制作人员"
                ></a-select>
              </a-form-item>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="body-col" style="width: 80px;">
      <a-form-item :self-update="true">
        <common-upload-file
          v-decorator="[
            `images`,
            {
              initialValue: [],
              valuePropName: 'fileList',
              getValueFromEvent: normFile
            }
          ]"
          :disabled="isConsumeModify"
        ></common-upload-file>
      </a-form-item>
    </div>
    <div class="body-col" style="width: 80px;">
      <ul v-if="!isConsumeModify" class="omc-inline-actions">
        <li>
          <a href="javascript:;" class="btn-icon" @click.stop="copyDetail(selectedCategory, formIndex, formId)">
            <i class="mdi-set mdi-content-copy"></i><span>复制</span>
          </a>
        </li>
        <li>
          <a href="javascript:;" class="btn-icon" @click.stop="deleteDetail(formIndex, formId)">
            <i class="mdi-set mdi-trash-can-outline"></i><span>删除</span>
          </a>
        </li>
      </ul>
    </div>
    <breakdown-detail-modal
      v-if="!selectedCategory.hasBreakdown && selectedCategory.breakdownSetting.length > 0"
      ref="detailModalForm"
      :visible="detailModalStatus"
      :breakdown-setting="selectedCategory.breakdownSetting"
      @cancel="() => { detailModalStatus = false; }"
      @valuesChange="onDetailModalChange"
    ></breakdown-detail-modal>
  </a-form>
</template>
<script>
import { mapState } from 'vuex'
import CommonInput from '@/components/Form/CommonInput'
import CommonSelect from '@/components/Form/CommonSelect'
import CommonUploadFile from '@/components/Form/CommonUploadFile'
import DemandInputField from './input-field'
import DemandInputNumberField from './input-number-field'
import DemandSelectField from './select-field'
import DemandMutilInputField from './mutil-input-field'
import BreakdownDetailModal from './detail-modal'
import { createUuid } from '@/utils/uuid'
import { isEmpty, toNumber, toString, isNumber } from 'lodash/lang'
import { getCntSupplicants } from '@/api/demand/content'
import CommonMemberPicker from '@/components/Form/CommonMemberPicker'

export default {
  name: 'ContentApplyDetailForm',
  components: {
    CommonInput,
    CommonSelect,
    CommonUploadFile,
    DemandInputField,
    DemandInputNumberField,
    DemandSelectField,
    DemandMutilInputField,
    BreakdownDetailModal,
    CommonMemberPicker
  },
  props: {
    formId: {
      type: [Number],
      required: true
    },
    formIndex: {
      type: Number,
      required: true
    },
    formValue: {
      type: Object,
      required: true
    },
    importFormData: {
      type: Object,
      required: true
    },
    childCategoryDetails: {
      type: Array,
      required: true
    },
    selectedCategory: {
      type: Object,
      required: true
    },
    workloadUnits: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    supplicantOpt: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    hasAttributeSetting: {
      type: Boolean,
      required: true
    },
    handleAttributes: {
      type: Function,
      required: true
    },
    deleteDetail: {
      type: Function,
      required: true
    },
    copyDetail: {
      type: Function,
      required: true
    },
    setDetailKey: {
      type: Function,
      required: true
    },
    applyMutilAttribute: {
      type: Function,
      required: true
    },
    isShowGrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      detailModalStatus: false,
      supplicantDataOpt: [],
      selectedWorkloadUnitValue: '',
      lacalWorkloadUnits: this.workloadUnits,
      isDisabled: false,
      isDisabledGrade: false,
      selectOpt: 0
    }
  },
  computed: {
    ...mapState({
      selectedProject: state => state.demand.selectedProject,
      isEdit: state => state.demand.isEdit,
      isConsumeModify: state => state.demand.isConsumeModify
    })
  },
  watch: {
    supplicantOpt: {
      handler: function(newVal) {
        this.handleSupplicant(false, '', newVal)
      },
      deep: true
    },
    isShowGrade: {
      handler: function(newVal) {
        if (!newVal.isBase) {
          this.setDetailFormValues({ 'level': '' })
        }
      }
    }
  },
  beforeCreate() {
    this.detailForm = this.$form.createForm(this, {
      name: `detail_form_${createUuid()}`
    })
  },
  mounted() {
    this.setDetailForm()
    this.setImportFormValues()
    this.setWorkloadUnit()
  },
  methods: {
    selectHandler() {
      this.selectOpt += 1
    },
    validateName(rule, value, callback) {
      const validateArray = ['@', '#', '^']
      const hasDisablesString = validateArray.some(item => {
        return (value.includes(item))
      })
      if (hasDisablesString) {
        callback(new Error('订单名或物件名不能包含【{@%&#^字符'))
      } else {
        callback()
      }
    },
    setDetailForm() {
      if (this.isEdit && !isEmpty(this.formValue)) {
        const {
          hasTest,
          attributeSetting,
          hasBreakdown,
          breakdownSetting
        } = this.selectedCategory
        const values = {
          name: this.formValue.name,
          type: toNumber(this.formValue.type),
          workload_unit: this.formValue.workload_unit,
          complete_date: this.formValue.complete_date,
          level: this.formValue.level,
          workload_amount: this.formValue.workload_amount,
          supplicant: this.formValue.supplicant,
          remark: this.formValue.remark,
          images: this.formValue.images,
          production_staff: this.formValue.production_staff.split(';')
        }
        if (hasTest) {
          values['test'] = this.formValue.test
        }
        // 设置意向供应商下拉选项
        this.handleSupplicant(this.formValue.test === 1, this.formValue.level)
        // 设置属性明细
        if (this.hasAttributeSetting) {
          attributeSetting.forEach(attr => {
            if (attr.componentName === 'DemandInputField') { // 一个输入
              values[`attribute-${attr.id}`] = attr.value
            } else if (attr.componentName === 'DemandMutilInputField' && attr.value) { // 多个输入
              attr.value.split('|').forEach((val, i) => {
                values[`attribute-${attr.id}-${i}`] = val
              })
            } else if (attr.componentName === 'DemandSelectField') { // 下拉选项
              values[`attribute-${attr.id}`] = attr.value
                ? attr.multiple === '1' ? attr.value.split('|') : attr.value
                : undefined
            }
          })
        }

        if (breakdownSetting.length > 0) { // 有预估工作量相关明细
          breakdownSetting.forEach(breakdown => {
            values[`breakdown-${breakdown.id}`] = breakdown.value
          })
          if (!hasBreakdown) { // 没有预估工作量
            values['count'] = this.formValue.count || 0
          }
        } else { // 没有预估工作量相关明细，只设置数量
          values['count'] = this.formValue.count || 0
        }

        this.setDetailFormValues(values)
      } else {
        // 设置意向供应商, 制作等级默认是'', 是否测试单默认是false
        this.handleSupplicant(false, '')
        // 设置制作等级，没有制作等级时默认设置成NA
        if (!this.selectedCategory.levelOpts.length) {
          this.setDetailFormValues({ 'level': 'NA' })
        }
      }
    },
    setImportFormValues() {
      if (!isEmpty(this.importFormData)) {
        this.setDetailFormValues(this.importFormData)
        this.$nextTick(() => {
          const count = this.detailForm.getFieldValue('count')
          if (count !== undefined) {
            this.setDetailKey(this.formIndex, 'count', toNumber(count))
          }
        })
      }
    },
    // 有默认工作量单位时设置
    setWorkloadUnit() {
      // 编辑时不需要设置默认工作量单位
      if (this.isEdit && !isEmpty(this.formValue)) {
        return
      }
      const workloadUnit = this.selectedCategory.workloadUnit
      if (workloadUnit) {
        const selectedWorkloadUnit = this.lacalWorkloadUnits.find(item => item.id === workloadUnit)
        if (selectedWorkloadUnit) {
          this.setDetailFormValues({ 'workload_unit': selectedWorkloadUnit.value })
          this.selectedWorkloadUnitValue = selectedWorkloadUnit.value
        }
      }
      if (workloadUnit === 2 && this.isShowGrade.category) {
        this.isDisabled = true
      } else {
        this.isDisabled = false
      }
    },
    async onCategoryChange(val) {
      const filterOpt = this.childCategoryDetails.find(item => item.value === val)
      if (filterOpt && filterOpt.attributes) {
        const res = await getCntSupplicants(this.selectedProject.product_code, val)
        const supplicants = res.content.items
        const {
          grade_setting,
          has_breakdown, // 是否有工作量明细, 1-是、2-否
          breakdown_setting,
          has_attribute, // 是否有属性配置
          attribute_setting,
          has_test, // 是否支持测试单, 1-是、2-否
          workload_unit
        } = filterOpt.attributes

        const selectedCategory = {
          value: val,
          levelOpts: grade_setting.map(opt => ({
            label: opt.title,
            value: opt.title,
            id: opt.id
          })),
          levelData: grade_setting,
          supplicantData: supplicants,
          supplicantOpt: this.handleSupplicants(supplicants),
          breakdownSetting: breakdown_setting || [],
          attributeSetting: has_attribute === 1 ? this.handleAttributes(attribute_setting) : [],
          hasTest: has_test === 1,
          hasBreakdown: has_breakdown === 1,
          workloadUnit: toNumber(workload_unit)
        }
        this.setDetailKey(this.formIndex, 'selectedCategory', selectedCategory)
        // 重置特定的表单项
        this.detailForm.resetFields([
          'workload_unit',
          'level',
          'test',
          'supplicant'
        ])
        // 设置缩略图
        const images = this.detailForm.getFieldValue('images')
        if (images) {
          this.setDetailFormValues({ images })
        }

        this.setDetailKey(
          this.formIndex,
          'count',
          has_breakdown && breakdown_setting.length > 0 ? 1 : 0
        )
        // 设置制作等级，没有制作等级时默认设置成N/A
        if (!selectedCategory.levelOpts.length) {
          this.setDetailFormValues({ 'level': 'NA' })
        }
        // 设置默认工作量单位
        if (workload_unit) {
          const selectedWorkloadUnit = this.lacalWorkloadUnits.find(item => item.id === toNumber(workload_unit))
          if (selectedWorkloadUnit) {
            this.setDetailFormValues({ 'workload_unit': selectedWorkloadUnit.value })
            // 设置当前选择的工作量单位
            this.selectedWorkloadUnitValue = selectedWorkloadUnit.value
            // 判断时什么品类
            if (this.isShowGrade.category && selectedWorkloadUnit.value === '人日') {
              this.isDisabled = true
            }
          } else {
            this.selectedWorkloadUnitValue = ''
          }
        } else {
          this.selectedWorkloadUnitValue = ''
        }
        // 设置意向供应商
        this.handleSupplicant(false, '')
        // 处理直接缩略图导入
        if (Array.isArray(filterOpt.attributes.workload_unit_json) && filterOpt.attributes.workload_unit_json.length > 0) {
          const resultData = filterOpt.attributes.workload_unit_json
          this.lacalWorkloadUnits = resultData.map(item => ({ label: item.title, value: item.title, id: item.id }))
          this.setDetailFormValues({ 'workload_unit': this.lacalWorkloadUnits[0].value })
        }
      }
    },
    handleSupplicants(supplicants) {
      if (!Array.isArray(supplicants)) {
        return []
      }
      return supplicants.map(item => ({
        label: item.val,
        value: item.val,
        is_test: item.is_test,
        grade_id: item.grade_id
      }))
    },
    optionComponent(option) {
      if (option.attr_type === 1) { // 输入框
        if (option.form_num > 1) { // 多个输入
          return 'DemandMutilInputField'
        }
        return 'DemandInputField'
      } else if (option.attr_type === 2) { // 下拉框
        return 'DemandSelectField'
      }
    },
    normFile(e) {
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    setDetailFormValues(values) {
      this.$nextTick(() => {
        for (const item in values) {
          if (item.search(/attribute-[0-9]{1,}/) > -1 && Array.isArray(values[item])) {
            const attrId = item.match(/\d+/).join(',')
            const targetObj = this.selectedCategory.attributeSetting.filter(items => items.id === attrId)
            if (targetObj.length > 0) {
              const attrValue = values[item].filter(itemValue => targetObj[0].form_value.indexOf(itemValue) > -1)
              values[item] = attrValue
            }
          }
        }
        if (!this.isShowGrade.isBase || !this.isShowGrade.isDepart) {
          if (values.level) { values.level = '' }
        }
        this.detailForm.setFieldsValue(values)
        if (this.isShowGrade.category && values.workload_unit === '人日') {
          this.isDisabled = true
        }
      })
    },
    openDetailModal() {
      this.detailModalStatus = true
      this.$nextTick(() => {
        const form = this.$refs.detailModalForm.form
        const params = {}
        if (form) {
          this.selectedCategory.breakdownSetting.forEach(item => {
            const value = this.detailForm.getFieldValue(`breakdown-${item.id}`)
            if (value) {
              params[`breakdown-${item.id}`] = value
            }
          })
          form.setFieldsValue(params)
        }
      })
    },
    getWorkloadValue(val, id) {
      // 判断是不是2d和3D 品类
      if (this.isShowGrade.category) {
        const workloadObj = this.getWorkloadSum(id)
        this.setWorkloadAmount({ 'workload_amount': this.setProcessing((workloadObj.sum + val)) })
      }
    },
    onDetailModalChange(values) {
      this.detailForm.setFieldsValue(values)
      const workloadObj = this.getWorkloadSum()
      const count = workloadObj.detailFormData.count === undefined ? 0 : workloadObj.detailFormData.count
      this.setWorkloadAmount({ 'workload_amount': this.setProcessing((workloadObj.sum + count)) })
    },
    onMountChange(value) {
      this.setDetailKey(this.formIndex, 'count', value)
      const workloadObj = this.getWorkloadSum()
      this.setWorkloadAmount({ 'workload_amount': this.setProcessing((workloadObj.sum + parseFloat(value === '' ? 0 : value))) })
    },
    setProcessing(val) { // 处理小数
      const newVal = parseFloat(parseFloat(val).toFixed(2))
      return newVal * 1000
    },
    getWorkloadSum(parm) {
      const detailFormData = this.detailForm.getFieldsValue()
      let sum = 0
      // 是否传参
      if (parm) {
        this.selectedCategory.breakdownSetting.forEach(item => {
          if (item.id !== parm) {
            sum += detailFormData[`breakdown-${item.id}`] === undefined ? 0 : detailFormData[`breakdown-${item.id}`]
          }
        })
      } else {
        this.selectedCategory.breakdownSetting.forEach(item => {
          sum += detailFormData[`breakdown-${item.id}`] === undefined ? 0 : detailFormData[`breakdown-${item.id}`]
        })
      }
      return { sum, detailFormData }
    },
    setWorkloadAmount(val) {
      // 是否编辑页面  (编辑页面进来单位默认为空)
      const work_unit = this.isEdit === true ? this.detailForm.getFieldValue('workload_unit') : this.selectedWorkloadUnitValue

      if (work_unit === '人日' && this.isShowGrade.category) {
        this.setDetailFormValues(val)
        this.isDisabled = true
      } else {
        this.isDisabled = false
      }
    },
    handleSupplicant(isTest = false, level, newOptions) {
      let supplicantOpt = this.supplicantOpt
      if (newOptions) {
        supplicantOpt = newOptions
      }
      if (!supplicantOpt.length) {
        this.supplicantDataOpt = []
        return
      }

      // 重置意向供应商
      this.detailForm.resetFields(['supplicant'])

      const currentLevel = this.selectedCategory.levelData.find(opt => opt.title === level)
      if (currentLevel) {
        this.supplicantDataOpt = supplicantOpt.filter(item => {
          if (!Array.isArray(item.grade_id) || !item.grade_id.length) {
            if (item.is_test.includes(isTest)) {
              return true
            }
            return false
          }
          return item.is_test.includes(isTest) && item.grade_id.includes(toString(currentLevel.id))
        })
        return
      }
      this.supplicantDataOpt = supplicantOpt.filter(item => {
        return item.is_test.includes(isTest)
      })
    },
    onTestChange(e) {
      const value = e.target.value
      const level = this.detailForm.getFieldValue('level')

      this.handleSupplicant(value === 1, level)
    },
    onLevelChange(val) {
      const currentTest = this.detailForm.getFieldValue('test')

      this.handleSupplicant(currentTest === 1, val)
    },
    onWorkUnitChange(val) {
      this.selectedWorkloadUnitValue = val
      console.log(this.isShowGrade.category)
      if (val === '人日' && this.isShowGrade.category) {
        const workloadObj = this.getWorkloadSum()
        const count = workloadObj.detailFormData.count === undefined ? 0 : workloadObj.detailFormData.count
        this.setDetailFormValues({ 'workload_amount': this.setProcessing((workloadObj.sum + count)) })
        this.isDisabled = true
      } else {
        this.isDisabled = false
      }
    },
    validateCount(rule, value, callback) {
      if (value === '0' || value === 0) {
        callback('数量/预估工作量不能为0')
      }
      callback()
    },
    validateWorkloadAmount(rule, value, callback) {
      if (
        this.isConsumeModify &&
        !isEmpty(this.formValue) &&
        isNumber(value) &&
        isNumber(this.formValue.workload_amount) &&
        value < this.formValue.workload_amount
      ) {
        callback('预估预算花费只能调大，不能调小，调小需要通过结项来解决！')
      } else {
        callback()
      }
    },
    onApplyToSameType(key) {
      if (!this.applyMutilAttribute) {
        return
      }

      if (key) {
        let values = this.detailForm.getFieldValue(key)
        const type = this.detailForm.getFieldValue('type')
        if (!values) {
          values = []
        } else if (!Array.isArray(values)) {
          values = [values]
        }
        this.applyMutilAttribute(type, key, values, this.formId)
      }
    },
    verificaSelectData(data) {
      if (data.isDepart) { // 是天美的部门
        if (data.isBase === true && data.category === true) {
          this.isDisabledGrade = false
          return true
        }
        if (data.isBase === false && data.category === true) {
          this.isDisabledGrade = true
          return false
        }
        if (data.isBase === false && data.category === false) {
          this.isDisabledGrade = false
          return false
        }
        if (data.isBase === true && data.category === false) {
          this.isDisabledGrade = false
          return false
        }
      } else {
        if (data.category) {
          this.isDisabledGrade = true
        } else {
          this.isDisabledGrade = false
        }
        return false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.body-row > .body-col {
  padding: 10px 12px !important;
  .expend-from {
    .expend-from-item {
      min-height: unset;
      .item-control {
        padding-left: 5px;
      }
    }
  }
  &:first-child {
    padding-left: 5px !important;
  }
}
.small-btn {
  font-size: 12px;
}
.iomc-form-item {
  margin-bottom: 0;
}
.radio-item {
  font-size: 12px;
}
.item-unit {
  position: absolute;
  padding: 0 4px;
  white-space: nowrap;
  align-self: center;
  font-size: 12px;
  color: #8f93a1;
  font-weight: bold;
}
.item-unit2 {
  position: absolute;
  padding: 0 4px;
  white-space: nowrap;
  align-self: center;
  font-size: 12px;
  color: #8f93a1;
  font-weight: bold;
  height: 24px;
  line-height: 24px;
}
.budget-cost {
  p {
    margin: 0;
  }
  .text-danger {
    font-weight: lighter;
  }
}

.item-unit{
   padding: 2px 4px;
}

.col-workload{
  position: relative;
  top:-8px
}

.attr{
  .expend-from-item{
    .item-label{
      max-width: 20px;
    }
  }
}
.amount{
  position: relative;
  .disable-mask{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 4px;
    background-color: #f7f7f7;
    border-radius: 4px;
    border: 1px solid #cfcdcd;
    cursor: no-drop;
  }
}

</style>
