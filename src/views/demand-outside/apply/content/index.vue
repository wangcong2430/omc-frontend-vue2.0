<template>
  <div class="omc-expend">
    <div class="omc-expend-steps none">
      <steps :step-lists="stepLists" :current-step="currentStep"></steps>
    </div>
    <template>
      <div v-if="currentStep === 0">
        <div class="omc-expend-content">
          <div class="omc-expend-box">
            <div class="box-head">
              <div class="col-left">
                <h2 class="box-title">{{ selectedProject.product_name }}</h2>
              </div>
              <div class="col-right"></div>
            </div>
            <div class="box-body">
              <ul class="infoset-default">
                <li v-if="consumeDetail.bill_no && !isReEdit">
                  <div class="info-item">
                    <div class="item-label">需求单号：</div>
                    <div class="item-value">{{ consumeDetail.bill_no }}</div>
                  </div>
                </li>
                <li>
                  <div class="info-item">
                    <div class="item-label">COA产品代码：</div>
                    <div class="item-value">{{ selectedProject.product_code }}</div>
                  </div>
                </li>
                <li>
                  <div class="info-item">
                    <div class="item-label">所属部门名称：</div>
                    <div class="item-value">{{ selectedProject.depart_name }}</div>
                  </div>
                </li>
                <li>
                  <div class="info-item">
                    <div class="item-label">所属成本中心：</div>
                    <div class="item-value">{{ selectedProject.cost_center_name }}</div>
                  </div>
                </li>
                <li>
                  <div class="info-item">
                    <div class="item-label">申请人：</div>
                    <div class="item-value">{{ englishName }}</div>
                  </div>
                </li>
                <!-- <li>
                  <div class="info-item">
                    <div class="item-label">内容制作费预算：</div>
                    <div class="item-value">{{ selectedConsumeStat.total_budget | formatNumber }}</div>
                  </div>
                </li>
                <li>
                  <div class="info-item">
                    <div class="item-label">可用预算：</div>
                    <div class="item-value">{{ selectedConsumeStat.left_budget | formatNumber }}</div>
                  </div>
                </li> -->
              </ul>
              <div class="expend-apply-form">
                <a-form :form="messageForm" layout="horizontal">
                  <a-form-item
                    label="需求名称"
                    v-bind="{
                      labelCol: { xs: { span: 24 }, sm: { span: 4 } },
                      wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
                    }"
                  >
                    <a-input
                      v-decorator="[
                        `name`,
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
                      placeholder="请输入需求名称"
                    ></a-input>
                  </a-form-item>
                  <a-form-item label="需求说明" v-bind="formItemLayout">
                    <a-textarea
                      v-decorator="[
                        `description`,
                        {
                          initialValue: '',
                          rules: [{ required: true, message: '必填项' }]
                        }
                      ]"
                      placeholder="仅做需求说明之用，不要涉及任何价格，供应商等信息，不超过500字"
                      rows="3"
                    ></a-textarea>
                  </a-form-item>
                  <a-form-item label="需求种类" v-bind="formItemLayout">
                    <a-select
                      v-decorator="[
                        `is_base`,
                        {
                          rules: [
                            {
                              required: true,
                              message: '必选项'
                            }
                          ]
                        }
                      ]"
                      style="width: 60%"
                      :options="isBaseOptions"
                      placeholder="请选择需求种类"
                      dropdown-class-name="common-select-dropdown"
                      :disabled="isConsumeModify"
                      @select="selectDemand"
                    ></a-select>
                    <span class="text-warning is-base-tip">(基地需求仅指由派驻在各自研工作室群研发基地中的供应商承接制作的需求)</span>
                  </a-form-item>
                  <a-form-item v-if="isShowPainter" label="画师姓名" v-bind="formItemLayout">
                    <a-select
                      v-decorator="[
                        `artist_name`,
                        {
                          rules: [{ required: true}]
                        }
                      ]"
                      dropdown-class-name="hide-option"
                      :default-open="false"
                      :filter-option="false"
                      mode="tags"
                      style="width: 100%"
                      placeholder="请输入画师姓名"
                    ></a-select>
                  </a-form-item>
                  <a-form-item label="需求附件" v-bind="formItemLayout">
                    <common-upload-file
                      v-decorator="[
                        'attachments',
                        {
                          initialValue: [],
                          valuePropName: 'fileList',
                          getValueFromEvent: normFile
                        }
                      ]"
                      :accept="'*'"
                      :list-type="'text'"
                      :show-upload-list="true"
                      :is-attachment="true"
                      :multiple="true"
                      :limit-count="50"
                    >
                      <a-button slot="innerBox"><a-icon type="upload" /> 上传附件 </a-button>
                    </common-upload-file>
                  </a-form-item>
                  <a-form-item v-bind="formItemLayout">
                    <span slot="label">
                      服务品类&nbsp;
                      <a-tooltip title="只能选择一个服务品类填报">
                        <a-icon type="question-circle-o" />
                      </a-tooltip>
                    </span>
                    <a-checkbox-group
                      v-decorator="[
                        `service_category`,
                        {
                          initialValue: [],
                          rules: [{ required: true, message: '必选项' }]
                        }
                      ]"
                      :disabled="isEdit"
                      :options="serviceCategoryOpts"
                      @change="onSelectServiceCategory"
                    />
                  </a-form-item>
                </a-form>
              </div>
            </div>
          </div>
          <div v-for="(item, index) in categoryDetails" :key="item.value">
            <apply-form
              :ref="`applyForm-${item.value}`"
              :detail="item"
              :detail-index="index"
              :apply-by-user="consumeDetail.apply_for"
              :verify-reviewers="consumeDetail.verify_reviewers"
              :all-units-list="allUnitsList"
              :set-detail-count="setDetailCount"
              :troggle-category="troggleCategory"
            ></apply-form>
          </div>
        </div>
        <div class="omc-expend-action">
          <div class="col-left">
            <span v-for="item in categoryDetails" :key="item.value">
              {{ item.label }}：<span class="text-danger">{{ item.count }}</span>；
            </span>
            <span>
              合计：<span class="text-danger">{{ sumByDetailCount() }}</span>；
            </span>
          </div>
          <div class="col-right">
            <a v-if="isEdit" href="javascript:;" class="m-r" @click="onUntie(3)">
              <a-spin v-if="clickType === 3 && saving">
                <a-icon slot="indicator" type="loading" style="font-size: 16px; color: #6a6f85;" spin />
              </a-spin>
              解绑
            </a>
            <a href="javascript:;" @click="submit(1)">
              <a-spin v-if="clickType === 1 && saving">
                <a-icon slot="indicator" type="loading" style="font-size: 16px; color: #6a6f85;" spin />
              </a-spin>
              保存草稿
            </a>
            <a href="javascript:;" class="action-primary" @click="submit(2)">
              <a-spin v-if="clickType === 2 && saving">
                <a-icon slot="indicator" type="loading" style="font-size: 16px; color: #fff;" spin />
              </a-spin>
              提交需求申请
            </a>
          </div>
        </div>
      </div>
      <finish-page
        v-else
        :action-text="`${clickType === 1 ? '保存内容制作费需求单为草稿成功' : '提交内容制作费需求单成功'}`"
      >
      </finish-page>
    </template>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Steps from '@/components/Steps/index'
import CommonUploadFile from '@/components/Form/CommonUploadFile'
import FinishPage from '@/components/FinishPage/index'
import ApplyForm from '../../../demand/apply/content/form'
import { saveConsume, updateConsume } from '@/api/demand/index'
import { getCntCategoryList, getCntWorkloadUnit, getCntCategoryDetailList, getApplyByList } from '@/api/demand/content'
import { sumBy, round } from 'lodash/math'
import { set } from 'lodash/object'
import { getProductInfo } from '@/api/product/index'
import { getDemandLists, unbindULink } from '@/api/demand/index'
import moment from 'moment'
import { createUuid } from '@/utils/uuid'
import { parseStringToJson } from '@/utils/index'
import { getVerifyReviewerList } from '@/api/workflow'

export default {
  name: 'DemandOutsideApplyCp',
  components: {
    Steps,
    CommonUploadFile,
    FinishPage,
    ApplyForm
  },
  data() {
    return {
      stepLists: ['内容制作费-需求申请', '完成申请'],
      currentStep: 0,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      serviceCategoryOpts: [],
      categoryDetails: [],
      childCategories: [],
      allUnitsList: [],
      workloadUnitsOpt: [], // 工作量单位数据
      saving: false,
      clickType: 0, // 1-保存草稿、2-提交申请
      currentYear: new Date().getFullYear(),
      workload: 0, // 工作量
      isBaseOptions: [
        { label: '基地需求', value: 1 },
        { label: '非基地需求', value: 2 }
      ],

      // 一下是全局store依赖状态
      selectedConsumeStat: {}, // 不需要
      isEdit: this.$route.query.action === 'edit',
      ulinkID: this.$route.query.uid,
      departArray: ['267', '977', '842', '241', '242', '243', '297', '706', '246', '843', '245', '844', '897', '735', '898', '769', '899'], // 指定的部门,由产品给出 (当产品所属部门为天美SG的部门+需求种类为“基地需求”时，2D&平面和3D&动效的制作等级才可选，其他的业务不可选)
      serviceArray: [17309, 17316], // 服务品类 (2D&平面和3D&动效与 departArray 指定部门数据,都是制作等级是否编辑的判断数据)
      isShowPainter: false
    }
  },
  computed: {
    ...mapState({
      selectedProject: state => state.demand.selectedProject,
      consumeDetail: state => state.demand.consumeDetail,
      englishName: state => state.user.englishName,
      isReEdit: state => state.demand.isReEdit
    })
  },
  beforeCreate() {
    this.messageForm = this.$form.createForm(this, { name: 'demand_form' })
  },
  async created() {
    if (!this.$route.query.uid) {
      return this.$message.error('请绑定unlik关联的id')
    }
    if (!this.$route.query.product_code) {
      return this.$message.error('请绑定COA产品代码')
    }
    await this.$store.dispatch('demand/setIsEdit', this.isEdit)
    await this.getProductInfo([this.$route.query.product_code])
    await this.getCategoryType()
    if (this.isEdit) {
      await this.getDemandListByULinkID()
    }
    this.getWorkloadUnits()
  },
  async mounted() {},
  methods: {
    setEnvData() {
      if (process.env.NODE_ENV === 'development') {
        this.serviceArray = [651, 658]
      } else {
        this.serviceArray = [17309, 17316]
        this.departArray = ['267', '977', '842', '241', '242', '243', '297', '706', '246', '843', '245', '844', '897', '735', '898', '769', '899', '13Q', '13R', '13P', '13S']
      }
    },
    selectDemand(val) {
      // 如果没有数据跳过
      if (this.categoryDetails.length <= 0) {
        return
      }
      if (val === 3) {
        this.isShowPainter = true
      } else {
        this.isShowPainter = false
      }
      const isShowGrade = {}
      isShowGrade.isBase = val === 1 // 是不是基本需求
      isShowGrade.isDepart = !!this.departArray.includes(this.selectedProject.depart_code) // 是不是天美工作室
      this.categoryDetails.forEach(item => {
        if (this.serviceArray.includes(item.value)) {
          isShowGrade.category = true
          item.isShowGrade = isShowGrade
        } else {
          isShowGrade.category = false
          item.isShowGrade = isShowGrade
        }
      })
    },
    judgment(parm) { // 数据处理
      const is_base_type = this.messageForm.getFieldValue('is_base') // 是否基础类型
      return {
        isBase: is_base_type === 1,
        isDepart: !!this.departArray.includes(this.selectedProject.depart_code),
        category: !!this.serviceArray.includes(parm)
      }
    },
    setConsumeMessage() {
      this.$nextTick(() => {
        this.messageForm.setFieldsValue({
          name: this.consumeDetail.name,
          description: this.consumeDetail.description,
          is_base: this.consumeDetail.is_base,
          service_category: this.consumeDetail.cnt_category ? [this.consumeDetail.cnt_category] : [],
          attachments: this.consumeDetail.attachments || []
        })
      })
      if (this.consumeDetail.is_base === 3) {
        this.isShowPainter = true
        this.$nextTick(() => {
          this.messageForm.setFieldsValue({
            'artist_name': this.consumeDetail.artist_name.split(';')
          })
        })
      }
    },
    // 编辑时设置大类下的子类
    setCategoryDetails() {
      const newCategoryDetails = []
      const val = this.consumeDetail.cnt_category
      if (val && this.isEdit) {
        const checkedOpt = this.serviceCategoryOpts.find(opt => opt.value === val)
        if (checkedOpt) {
          Promise.all(
            [getCntCategoryDetailList(val),
              getApplyByList(this.selectedProject.product_code, val),
              getApplyByList(this.selectedProject.product_code, val),
              // 获取指定审批人名单
              getVerifyReviewerList(
                2,
                this.selectedProject.product_code,
                {
                  module: 'consume',
                  type: { level1: `${val}`, level2: '0', level3: '0', level4: '0' }
                }
              )
            ]).then(
            values => {
              const categoryDetailList = values[0].content
              const applyByList = values[1].content
              const verifyReviewerList = values[2].content
              newCategoryDetails.push({
                value: val,
                label: checkedOpt.label,
                childCategoryDetails: this.formatCategories(categoryDetailList), // 子类
                applyByList: applyByList.map(list => ({
                  label: list,
                  value: list
                })), // 经办人
                verifyReviewers: verifyReviewerList.map(item => ({
                  label: item,
                  value: item
                })), // 指定需求审核人
                count: 0,
                open: true, // 是否打开卡片
                isShowGrade: this.judgment(val)
              })
            }
          )
        }
        this.categoryDetails = newCategoryDetails
        console.log(newCategoryDetails)
      }
    },
    handleServiceCategory(checkedValues) {
      if (checkedValues.length === 1) {
        this.serviceCategoryOpts = this.serviceCategoryOpts.map(item => {
          if (item.value === checkedValues[0]) {
            return item
          }
          return {
            ...item,
            disabled: true
          }
        })
      } else {
        this.serviceCategoryOpts = this.serviceCategoryOpts.map(item => ({
          ...item,
          disabled: false
        }))
      }
    },
    onSelectServiceCategory(checkedValues) {
      if (checkedValues.length > 1) {
        return this.$message.info('只能选择一个服务品类！')
      }
      this.handleServiceCategory(checkedValues)
      if (!this.selectedProject.product_code) {
        this.$message.info('请先返回需求管理首页选择项目后再选择服务品类！')
        return
      }
      const selectedCategoryDetails = this.categoryDetails.filter(item => checkedValues.includes(item.value))
      const selectedCategoryValues = this.categoryDetails.map(item => item.value)
      const newCategory = checkedValues.find(val => {
        if (selectedCategoryValues.includes(val)) {
          return false
        } else {
          return true
        }
      })

      let checkedService = null
      if (newCategory) {
        checkedService = this.serviceCategoryOpts.find(item => item.value === newCategory)
      }

      if (checkedService && newCategory) {
        // 新选中的服务品类需要获取子类并新增
        Promise.all([
          getCntCategoryDetailList(newCategory),
          getApplyByList(this.selectedProject.product_code, newCategory),
          // 获取指定审批人名单
          getVerifyReviewerList(
            2,
            this.selectedProject.product_code,
            {
              module: 'consume',
              type: { level1: `${newCategory}`, level2: '0', level3: '0', level4: '0' }
            }
          )
        ]).then(values => {
          const categoryDetailList = values[0].content
          const applyByList = values[1].content
          const verifyReviewerList = values[2].content
          selectedCategoryDetails.push({
            value: newCategory,
            label: checkedService.label,
            childCategoryDetails: this.formatCategories(categoryDetailList), // 子类
            applyByList: applyByList.map(list => ({
              label: list,
              value: list
            })), // 经办人
            verifyReviewers: verifyReviewerList.map(item => ({
              label: item,
              value: item
            })), // 指定需求审核人
            count: 0,
            open: true, // 是否打开卡片
            isShowGrade: this.judgment(newCategory)
          })
          this.categoryDetails = selectedCategoryDetails
        })
      } else {
        this.categoryDetails = selectedCategoryDetails
      }
    },
    formatCategories(details) {
      this.childCategories = []
      details.forEach(item => {
        this.handleDetailFun(item)
      })
      return this.childCategories
    },
    handleDetailFun(item, title = '') {
      if (item.children && item.children.length > 0) {
        item.children.forEach(child => {
          this.handleDetailFun(child, title === '' ? `${item.title}` : `${title}/${item.title}`)
        })
      } else {
        this.childCategories.push({
          label: title === '' ? `${item.title}` : `${title}/${item.title}`,
          value: item.id,
          attributes: {
            ...item
          }
        })
      }
    },
    sumByDetailCount() {
      return round(sumBy(this.categoryDetails, 'count'), 3)
    },
    setDetailCount(detailIndex, count) {
      this.categoryDetails = set(this.categoryDetails, [detailIndex, 'count'], count)
    },
    troggleCategory(item) {
      if (!item) {
        return
      }
      const targetIndex = this.categoryDetails.findIndex(d => d.value === item.value)
      if (targetIndex > -1) {
        this.categoryDetails = set(this.categoryDetails, [targetIndex, 'open'], !item.open)
      }
    },
    getCategoryType() {
      return new Promise((resolve, reject) => {
        getCntCategoryList(
          `consume:${this.selectedProject.product_code}:*:item_type/1`,
          '/iomc.ConsumeSrv/AddConsumeItem'
        )
          .then(res => {
            const { content } = res
            this.serviceCategoryOpts = content.map(item => ({
              label: item.title,
              value: item.id,
              disabled: false
            }))
            resolve(content)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getWorkloadUnits() {
      getCntWorkloadUnit().then(res => {
        const { content } = res
        this.workloadUnitsOpt = content
        this.allUnitsList = content.map(item => ({ label: item.title, value: item.title, id: item.id }))
      })
    },
    normFile(e) {
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    // 处理属性表单
    handleAttribute(attributes, values) {
      if (!attributes.length) {
        return []
      }
      const formDatas = []
      function formatFields(attr) {
        const result = []
        attr.fields.forEach((field, index) => {
          if (values[`attribute-${attr.id}-${index}`] !== undefined) {
            result.push(values[`attribute-${attr.id}-${index}`])
          }
        })
        return result.join('|')
      }

      attributes.forEach(attr => {
        if (attr.attr_type === 1) {
          // 输入框
          if (attr.form_num > 1) {
            // 多个输入
            formDatas.push({
              ...attr,
              value: formatFields(attr)
            })
          } else if (attr.form_num === 1) {
            formDatas.push({
              ...attr,
              value: values[`attribute-${attr.id}`] !== undefined ? values[`attribute-${attr.id}`] : ''
            })
          }
        } else if (attr.attr_type === 2) {
          // 下拉框
          formDatas.push({
            ...attr,
            value: values[`attribute-${attr.id}`] !== undefined ? values[`attribute-${attr.id}`] : ''
          })
        }
      })

      return formDatas
    },
    // 处理工作量明细表单
    handleBreakdown(selectedCategory, values) {
      this.workload = 0 // 如果有预估工作量，并且有相关配置默认为1，没有就取工作量数量

      if (!selectedCategory.breakdownSetting) {
        return []
      }

      // 有预估工作量相关明细
      if (selectedCategory.breakdownSetting.length > 0) {
        if (selectedCategory.hasBreakdown) {
          this.workload = 1
        } else {
          this.workload = values['count'] || 1
        }

        return selectedCategory.breakdownSetting.map(breakdown => {
          return {
            ...breakdown,
            value: values[`breakdown-${breakdown.id}`] || 0
          }
        })
      }

      // 没有预估工作量相关明细
      this.workload = values['count']
      return []
    },
    // 提交需求单前处理表单字段, workload_unit、level、supplicant三个字段统一转化成string Object
    handleDetailForms(categoryDetail, values, formKey) {
      const { type, name, workload_unit, level, workload_amount, complete_date, supplicant, test, images, remark } = values

      return {
        type: 1,
        cnt: {
          root_type: String(categoryDetail.value),
          type: String(type),
          name,
          attr: JSON.stringify(this.handleAttribute(formKey.selectedCategory.attributeSetting, values)),
          breakdown: JSON.stringify(this.handleBreakdown(formKey.selectedCategory, values)),
          workload: this.workload,
          workload_unit,
          workload_unit_options: this.workloadUnitsOpt,
          workload_amount: round(workload_amount),
          level,
          level_options: formKey.selectedCategory.levelData,
          complete_date: complete_date ? complete_date.format('YYYY-MM-DD') : '',
          supplicant,
          supplicant_options: formKey.selectedCategory.supplicantData,
          test: test !== undefined ? test : 2, // 没有测试单字段传2
          images: images
            ? images.map(img => ({
              file_id: img.id,
              file_size: img.size,
              file_name: img.name,
              file_url: img.url
            }))
            : [],
          remark
        }
      }
    },
    validateFormData(categoryDetail, form, formKey) {
      return new Promise((resolve, reject) => {
        form.validateFieldsAndScroll((error, values) => {
          if (error) {
            this.saving = false
            this.clickType = 0
            resolve({ result: false, data: [] })
            return
          }
          try {
            const detailItems = this.handleDetailForms(categoryDetail, values, formKey)
            resolve({ result: true, data: detailItems })
          } catch (error) {
            reject(error)
          }
        })
      })
    },
    validateDetailForms(messageFormVal) {
      // eslint-disable-next-line
      return new Promise(async (resolve, reject) => {
        const detailItems = [] // 子类的表单数据
        const applyForMap = [] // 经办人数据
        const verifyReviewersForMap = [] // 指定审批人数据

        // 验证所有的品类表单
        for (const item of this.categoryDetails) {
          const formRef = this.$refs[`applyForm-${item.value}`] // 大类ref
          const selectedApplyByUser = formRef[0].selectedApplyByUser
          const selectedVerifyReviewers = formRef[0].selectedVerifyReviewers

          // 外包人员需要校验经办人字段
          if (this.englishName.startsWith('v_') && !selectedApplyByUser) {
            this.saving = false
            this.clickType = 0
            reject(`请在服务品类【${item.label}】下选择经办人！`)
            return
          }

          if (this.englishName.startsWith('v_') && selectedApplyByUser) {
            applyForMap.push({
              cnt_category: item.value,
              user: selectedApplyByUser
            })
          }
          if (selectedVerifyReviewers && selectedVerifyReviewers.length > 0) {
            verifyReviewersForMap.push({
              cnt_category: item.value,
              users: selectedVerifyReviewers.join(',')
            })
          }

          if (formRef) {
            const detailFormRefs = formRef[0].getDetailFormRef() // 子类表单ref
            let validateRes = false

            if (detailFormRefs) {
              const keys = formRef[0].formKeys
              if (!keys.length) {
                this.saving = false
                this.clickType = 0
                validateRes = true
                reject(`请在服务品类${item.label}下新增需求明细再提交需求申请！`)
                return
              }

              // 校验子类
              for (const [formKeyIndex, childItem] of detailFormRefs.entries()) {
                const res = await this.validateFormData(item, childItem.detailForm, keys[formKeyIndex])
                if (res.result) {
                  validateRes = false
                  detailItems.push(res.data)
                } else {
                  validateRes = true
                }

                // 校验表单，不通过一个就返回
                if (validateRes) {
                  break
                }
              }
            } else {
              this.saving = false
              this.clickType = 0
              validateRes = true
              reject(`请在服务品类【${item.label}】下新增需求明细再提交需求申请！`)
              return
            }
            // 校验表单，不通过一个就返回
            if (validateRes) {
              reject('表单验证失败，请检查后再保存或提交！')
              this.saving = false
              this.clickType = 0
              break
            }
          }
        }
        resolve({
          name: messageFormVal.name,
          description: messageFormVal.description,
          is_base: messageFormVal.is_base, // 是否是基地需求
          id: this.isReEdit ? undefined : this.consumeDetail.id, // 需求Id, 驳回重新编辑时不传
          bill_no: this.isReEdit ? undefined : this.consumeDetail.bill_no, // 单号, 驳回重新编辑时不传
          attachments: messageFormVal.attachments.map(att => ({
            file_id: att.id,
            file_size: att.size,
            file_name: att.name,
            file_url: att.url
          })),
          product_code: this.selectedProject.product_code,
          product_name: this.selectedProject.product_name,
          dept_id: this.selectedProject.depart_id,
          dept_name: this.selectedProject.depart_name,
          apply_for_map: applyForMap, // 经办人，外包人员提交必传
          verify_reviewers_for_map: verifyReviewersForMap, // 指定审批人
          type: 1, // 1-内容制作费
          year: this.currentYear,
          detail_items: detailItems,
          artist_name: Array.isArray(messageFormVal.artist_name) ? messageFormVal.artist_name.join(';') : undefined
        })
      })
    },
    // 保存和提交需求，type-1保存为草稿，2-提交需求
    submit(type) {
      if (this.saving) return
      this.clickType = type
      this.saving = true

      if (!this.selectedProject.product_code) {
        this.saving = false
        this.clickType = 0
        this.$message.info('请先返回需求管理首页选择项目再提交需求申请！')
        return
      }
      this.messageForm.validateFieldsAndScroll((err, val) => {
        if (err) {
          this.saving = false
          this.clickType = 0
          return
        }

        this.validateDetailForms(val)
          .then(formData => {
            if (this.isEdit && !this.isReEdit) {
              // 更新
              updateConsume(formData, type)
                .then(res => {
                  this.saving = false
                  this.$message.success(type === 1 ? '保存成功' : '提交成功')
                  if (type === 2) {
                    this.currentStep = 1
                    this.$store.dispatch('demand/setIsEdit', false)
                    this.isEdit = false
                    this.resetDemandForm()
                    this.reloadParentPage()
                  }
                })
                .catch(() => {
                  this.saving = false
                  this.clickType = 0
                })
            } else {
              // 新增
              saveConsume(formData, type, this.ulinkID)
                .then(res => {
                  this.saving = false
                  this.$message.success(type === 1 ? '保存成功' : '提交成功')
                  if (type === 1) {
                    this.isEdit = true
                    this.$store.dispatch('demand/setIsEdit', true)
                    // 重新获取已保存的数据
                    this.getDemandListByULinkID()
                  }
                  if (type === 2) {
                    this.currentStep = 1
                    this.$store.dispatch('demand/setIsEdit', false)
                    this.isEdit = false
                    this.resetDemandForm()
                    this.reloadParentPage()
                  }
                })
                .catch(() => {
                  this.saving = false
                  this.clickType = 0
                })
            }
          })
          .catch(err => {
            this.$message.info(err, 5)
          })
      })
    },
    resetDemandForm() {
      this.$store.dispatch('demand/resetDemandForm')
      this.messageForm.resetFields()
      this.categoryDetails = []
    },
    reloadParentPage() {
      setTimeout(() => {
        console.log('iomc-postmessage')
        window.parent.postMessage('IOMC_RELOAD', '*')
      }, 2000)
    },

    // 内嵌ulink
    getProductInfo(code) {
      return new Promise((resolve, reject) => {
        getProductInfo(code)
          .then(res => {
            const { data } = res
            if (!data.length) {
              this.$message.error('获取COA产品信息失败！')
              reject('获取COA产品信息失败！')
            } else {
              this.$store.dispatch('demand/setSelectedPro', data[0])
              resolve(data[0])
            }
          })
          .catch(err => reject(err))
      })
    },

    getDemandListByULinkID() {
      getDemandLists([
        {
          ulink_id: this.ulinkID
        }
      ]).then(res => {
        const { items } = res.content
        if (Array.isArray(items) && items.length > 0) {
          this.setEditDemandData(items[0])
        }
      })
    },

    async setEditDemandData(item, selectedBillnos = []) {
      const consumeDetail = {
        name: item.name,
        description: item.description,
        is_base: item.is_base || undefined,
        pm_name: item.pm_name,
        receiver_names: item.receiver_names.replace(/(,)/g, ';'),
        purchaser: item.purchaser ? item.purchaser.split(',') : [],
        begin_date: item.begin_date,
        end_date: item.end_date,
        id: item.id,
        bill_no: item.bill_no,
        p_bill_no: item.p_bill_no,
        attachments: item.attachments.map((att, i) => {
          return {
            uid: `-${i + 1}`,
            status: 'done',
            id: att.file_id,
            size: att.file_size,
            name: att.file_name,
            url: att.file_url
          }
        }),
        year: item.year,
        output: item.output,
        verify_standard: item.verify_standard,
        background_desc: item.background_desc,
        tech_desc: item.tech_desc,
        service_location: item.service_location,
        cnt_category: item.cnt_category, // 内容制作费大分类
        apply_for: item.apply_for, // 经办人，外包人员显示该字段
        verify_reviewers: item.verify_reviewers // 指定审批人
      }

      const data = this.getConsumeDetail(item.detail_items, 1, selectedBillnos)
      await this.$store.dispatch('demand/setConsumeDetail', consumeDetail)
      await this.$store.dispatch('demand/setDetailForms', data)
      this.setCategoryDetails()
      this.setConsumeMessage()
    },

    getConsumeDetail(items, operate, billNos = []) {
      const formData = []
      items.forEach(item => {
        formData.push({
          ...item.cnt,
          images: item.cnt.images.map((img, i) => {
            return {
              uid: `-${i + 1}`,
              status: 'done',
              id: img.file_id,
              size: img.file_size,
              name: img.file_name,
              url: img.file_url
            }
          }),
          complete_date: operate === 1 ? moment(item.cnt.complete_date) : item.cnt.complete_date,
          attr: parseStringToJson(item.cnt.attr, []),
          breakdown: parseStringToJson(item.cnt.breakdown, []),
          workload_unit: item.cnt.workload_unit,
          level: item.cnt.level,
          supplicant: item.cnt.supplicant,
          count: item.cnt.workload, // 品类数量，编辑内容制作费时才有
          uid: createUuid(),
          open: true
        })
      })
      return formData
    },
    async onUntie(type) {
      if (this.saving) return
      this.clickType = type
      this.saving = true

      try {
        await unbindULink(this.ulinkID)
        this.$message.success('解绑成功')
        this.reloadParentPage()
      } catch (err) {
        console.error(err)
      }

      this.saving = false
      this.clickType = 0
    }
  }
}
</script>
<style lang="less" scoped>
.omc-expend {
  min-width: 1600px;
  .omc-expend-action {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    .go-back {
      margin-right: 10px;
      i {
        margin-right: 5px;
      }
    }
  }
}
.ant-form-item {
  margin-bottom: 0;
}
.is-base-tip {
  margin-left: 5px;
  font-size: 12px;
}
</style>
