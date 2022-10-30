<template>
  <div class="omc-expend">
    <div class="omc-expend-steps">
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
              <div class="col-right">
              </div>
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
                <li>
                  <div class="info-item">
                    <div class="item-label"></div>
                    <div class="item-value" style="color: #f5222d;">（按照风控要求，需求提交人和审核/审批人不能为同一人；提交后，经审核人/审批人审批生效，审核人与审批人可为同一人）</div>
                  </div>
                </li>
                <li>
                  <div class="tips">
                    <a-tooltip placement="topRight" trigger="click" title="需求审核人 —> 直属leader/指定审批人 —> 相关审批人(若填写) —> 特殊审批人(GM,且金额>=50万)">
                      <a-button>查看审批流程</a-button>
                    </a-tooltip>
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
                      labelCol: {xs: {span: 24}, sm: {span: 4}},
                      wrapperCol: {xs: {span: 24}, sm: {span: 12}}
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
                            },
                            { validator: validateName }
                          ]
                        }
                      ]"
                      placeholder="请输入需求名称"
                      :disabled="isConsumeModify"
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
                      :max-length="500"
                      placeholder="仅做需求说明之用，不要涉及任何价格，供应商等信息，不超过500字"
                      rows="3"
                      :disabled="isConsumeModify"
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
                      :options="isBaseOptions.slice(0, wholePackage.includes(+selectedProject.depart_id) ? 4 : 3)"
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
                      <a-button
                        slot="innerBox"
                        :disabled="isConsumeModify"
                      ><a-icon type="upload" /> 上传附件 </a-button>
                    </common-upload-file>
                  </a-form-item>
                  <a-form-item label="服务品类" v-bind="formItemLayout">
                    <a-checkbox-group
                      v-decorator="[
                        `service_category`,
                        {
                          initialValue: [],
                          rules: [{ required: true, message: '必选项' }]
                        }
                      ]"
                      :disabled="isEdit || isConsumeModify"
                      :options="serviceCategoryOpts"
                      @change="onSelectServiceCategory"
                    />
                  </a-form-item>
                  <a-row class="product-box" :gutter="28">
                    <a-col span="4">
                      <a-form-item>
                        <span>产品品类: </span>
                        <a-select
                          v-decorator="[
                            `product_type`,
                            {
                              rules: [{ required: false}]
                            }
                          ]"
                          placeholder="请选择产品品类"
                          :options="productDimension.product_type"
                        ></a-select>
                      </a-form-item>
                    </a-col>
                    <a-col span="4">
                      <a-form-item>
                        <span>产品引擎: </span>
                        <a-select
                          v-decorator="[
                            `design_engine`,
                            {
                              rules: [{ required: false}]
                            }
                          ]"
                          placeholder="请选择产品引擎"
                          :options="productDimension.design_engine"
                        ></a-select>
                      </a-form-item>
                    </a-col>
                    <a-col span="4">
                      <a-form-item>
                        <span>美术风格: </span>
                        <a-select
                          v-decorator="[
                            `art_style`,
                            {
                              rules: [{ required: false}]
                            }
                          ]"
                          placeholder="请选择美术风格"
                          :options="productDimension.art_style"
                        ></a-select>
                      </a-form-item>
                    </a-col>
                    <a-col span="4">
                      <a-form-item>
                        <span>地域风格: </span>
                        <a-select
                          v-decorator="[
                            `area_style`,
                            {
                              rules: [{ required: false}]
                            }
                          ]"
                          placeholder="请选择地域风格"
                          :options="productDimension.area_style"
                        ></a-select>
                      </a-form-item>
                    </a-col>
                    <a-col span="4">
                      <a-form-item>
                        <span>题材元素: </span>
                        <a-select
                          v-decorator="[
                            `theme_element`,
                            {
                              rules: [{ required: false}]
                            }
                          ]"
                          mode="multiple"
                          placeholder="请选择题材元素"
                          :options="productDimension.theme_element"
                        ></a-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
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
            <router-link to="/demand/apply" class="go-back">
              <a-icon type="left" />返回
            </router-link>
            <a v-if="!isConsumeModify" href="javascript:;" @click="submit(1)">
              <a-spin v-if="clickType === 1 && saving">
                <a-icon slot="indicator" type="loading" style="font-size: 16px; color: #6a6f85;" spin />
              </a-spin>
              保存草稿
            </a>
            <a v-if="!isConsumeModify" href="javascript:;" class="action-primary" @click="submit(2)">
              <a-spin v-if="clickType === 2 && saving">
                <a-icon slot="indicator" type="loading" style="font-size: 16px; color: #fff;" spin />
              </a-spin>
              提交需求申请
            </a>
            <a v-if="isConsumeModify" href="javascript:;" class="action-primary" @click="submit(3)">
              <a-spin v-if="clickType === 3 && saving">
                <a-icon slot="indicator" type="loading" style="font-size: 16px; color: #fff;" spin />
              </a-spin>
              提交需求修改
            </a>
          </div>
        </div>
      </div>
      <finish-page
        v-else
        :link-text="`${clickType === 1 ? '保存内容制作费需求单为草稿成功' : '提交内容制作费需求单成功'}`"
        :back-text="'返回需求管理首页'"
        :action-text="(clickType === 2 || clickType === 3) ? '需要撤销申请单请在工作台我的已办中操作' : ''"
        @finish="finish"
      >
        <router-link
          v-if="clickType === 2 || clickType === 3"
          slot="actionFooter"
          :to="{ path: '/workbench/list', query: { status: 2, workType: 2 }}"
        >跳转到工作台</router-link>
      </finish-page>
    </template>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Steps from '@/components/Steps/index'
import CommonUploadFile from '@/components/Form/CommonUploadFile'
import FinishPage from '@/components/FinishPage/index'
import ApplyForm from './form'
import { updateConsumeDetailStatus, saveConsume, updateConsume, getProductDimension } from '@/api/demand/index'
import {
  getCntCategoryList,
  getCntWorkloadUnit,
  getCntCategoryDetailList,
  getApplyByList
} from '@/api/demand/content'
import { sumBy, round, sum } from 'lodash/math'
import { set } from 'lodash/object'
import { LocalSelectedProductKey, setLocalData } from '@/utils/local-storage'
import { parseStringToJson, formatArrayValue } from '@/utils/index'
import { getUserOrgInfo } from '@/api/user/info'
import demandMixins from '../../mixins/index'
export default {
  name: 'DemandApplyCp',
  components: {
    Steps,
    CommonUploadFile,
    FinishPage,
    ApplyForm
  },
  mixins: [demandMixins],
  data() {
    return {
      stepLists: ['内容制作费-需求申请', '完成申请'],
      currentStep: 0,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 }, sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 }, sm: { span: 16 }
        }
      },
      serviceCategoryOpts: [],
      categoryDetails: [],
      childCategories: [],
      allUnitsList: [],
      workloadUnitsOpt: [], // 工作量单位数据
      saving: false,
      clickType: 0, // 1-保存草稿、2-提交申请、3-提交修改
      currentYear: new Date().getFullYear(),
      workload: 0, // 工作量
      wholePackage: [56231, 56232, 56233], // 所属部门为天美Y1工作室，天美Y2工作室，天美Y3工作室的需求种类才可选整包需求
      departArray: ['267', '977', '842', '241', '242', '243', '297', '706', '246', '843', '245', '844', '897', '735', '898', '769', '899'], // 指定的部门,由产品给出 (当产品所属部门为天美SG的部门+需求种类为“基地需求”时，2D&平面和3D&动效的制作等级才可选，其他的业务不可选)
      serviceArray: [17309, 17316], // 服务品类 (2D&平面和3D&动效与 departArray 指定部门数据,都是制作等级是否编辑的判断数据)
      productDimension: {
        area_style: [],
        product_type: [],
        design_engine: [],
        art_style: [],
        theme_element: []
      },
      isShowPainter: false
    }
  },
  computed: {
    ...mapState({
      selectedProject: state => state.demand.selectedProject,
      selectedConsumeStat: state => state.demand.selectedConsumeStat,
      consumeDetail: state => state.demand.consumeDetail,
      isEdit: state => state.demand.isEdit,
      isReEdit: state => state.demand.isReEdit,
      englishName: state => state.user.englishName,
      reEditMaterialBillNos: state => state.demand.reEditMaterialBillNos,
      isConsumeModify: state => state.demand.isConsumeModify
    })
  },
  beforeCreate() {
    this.messageForm = this.$form.createForm(this, { name: 'demand_form' })
  },
  async created() {
    // 没有选择产品时跳转回列表页
    if (!this.selectedProject.product_code) {
      this.$router.push('/demand/apply')
    }
    // 可用预算小于0时跳转回列表页
    // if (!this.selectedConsumeStat || this.selectedConsumeStat.left_budget <= 0) {
    //   this.$message.info('没有可用预算，不能提交需求申请，请联系管理员！', 8)
    //   this.$router.push('/demand/apply')
    // }
    await this.getCategoryType()
    this.getWorkloadUnits()
    this.setCategoryDetails()
    this.getDimensionData()
  },
  mounted() {
    this.setEnvData()
    this.setConsumeMessage()
  },
  methods: {
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
    setEnvData() {
      if (process.env.NODE_ENV === 'development') {
        this.serviceArray = [651, 658]
      } else {
        this.serviceArray = [17309, 17316]
        this.departArray = ['267', '977', '842', '241', '242', '243', '297', '706', '246', '843', '245', '844', '897', '735', '898', '769', '899', '13Q', '13R', '13P', '13S']
      }
    },
    selectDemand(val) {
      if (val === 3) {
        this.isShowPainter = true
      } else {
        this.isShowPainter = false
      }
      // 如果没有数据跳过
      if (this.categoryDetails.length <= 0) {
        return
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
    getDimensionData() {
      getProductDimension().then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const dimension = parseStringToJson(this.consumeDetail.product_dimension, [])
          const setProductObj = {
            area_style: '',
            product_type: '',
            design_engine: '',
            art_style: '',
            theme_element: ''
          }
          Object.keys(this.productDimension).forEach(key => {
            const targetData = res.data.find(item => item.dimension_name_en === key)
            if (targetData && Array.isArray(targetData.child_list) && targetData.child_list.length > 0) {
              this.productDimension[key] = targetData.child_list.map(items => ({ label: items.dimension_name, value: items.dimension_name, id: items.id }))
              // 不是编辑页面,设置默认值
              if (!this.isEdit) {
                Object.keys(setProductObj).forEach(list => {
                  const targetVal = this.productDimension[key].find(items => items.id === this.selectedProject[list])
                  // 判断是否设置默认值
                  if (targetVal) {
                    setProductObj[list] = targetVal.value
                  }
                })
              } else {
                // 没有返回数据不需要处理
                if (Array.isArray(dimension) && dimension.length > 0) {
                  dimension.forEach(item => {
                    // 如果返回值是数字,匹配到之后设置值
                    if (item.dimension_name_en === key) {
                      const targetVal = this.productDimension[key].find(items => items.id === item.dimension_name)
                      if (targetVal) {
                        setProductObj[key] = targetVal.value
                      } else {
                        // 如果匹配的值不是数字,就用返回值展示
                        setProductObj[item.dimension_name_en] = item.dimension_name
                      }
                    }
                  })
                }
              }
            }
          })
          this.$nextTick(() => {
            this.messageForm.setFieldsValue({
              'area_style': setProductObj.area_style === '' ? undefined : setProductObj.area_style,
              'art_style': setProductObj.art_style === '' ? undefined : setProductObj.art_style,
              'design_engine': setProductObj.design_engine === '' ? undefined : setProductObj.design_engine,
              'product_type': setProductObj.product_type === '' ? undefined : setProductObj.product_type,
              'theme_element': setProductObj.theme_element === '' ? undefined : setProductObj.theme_element.split(';')
            })
          })
        }
      })
    },
    setConsumeMessage() {
      this.$nextTick(() => {
        this.messageForm.setFieldsValue({
          'name': this.consumeDetail.name,
          'description': this.consumeDetail.description,
          'is_base': this.consumeDetail.is_base,
          'service_category': this.consumeDetail.cnt_category ? [this.consumeDetail.cnt_category] : [],
          'attachments': this.consumeDetail.attachments || []
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
          Promise.all([
            getCntCategoryDetailList(val),
            getApplyByList(this.selectedProject.product_code, val)
          ]).then(values => {
            const categoryDetailList = values[0].content
            const applyByList = values[1].content
            newCategoryDetails.push({
              value: val,
              label: checkedOpt.label,
              childCategoryDetails: this.formatCategories(categoryDetailList), // 子类
              applyByList: applyByList.map(list => ({
                label: list,
                value: list
              })), // 经办人
              count: 0,
              open: true, // 是否打开卡片
              isShowGrade: this.judgment(val)
            })
          })
        }
        this.categoryDetails = newCategoryDetails
      }
    },
    onSelectServiceCategory(checkedValues) {
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

      if (checkedService && newCategory) { // 新选中的服务品类需要获取子类并新增
        Promise.all([
          getCntCategoryDetailList(newCategory),
          getApplyByList(this.selectedProject.product_code, newCategory)
        ]).then(values => {
          const categoryDetailList = values[0].content
          const applyByList = values[1].content
          const applyUserList = []
          applyByList.forEach(item => {
            if (!item.includes('v_')) {
              applyUserList.push(item)
            }
          })
          selectedCategoryDetails.push({
            value: newCategory,
            label: checkedService.label,
            childCategoryDetails: this.formatCategories(categoryDetailList), // 子类
            applyByList: applyUserList.map(list => ({
              label: list,
              value: list
            })), // 经办人
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
          this.handleDetailFun(
            child,
            title === '' ? `${item.title}` : `${title}/${item.title}`
          )
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
      return round(
        sumBy(this.categoryDetails, 'count'),
        3
      )
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
        ).then(res => {
          const { content } = res
          this.serviceCategoryOpts = content.map(item => ({
            label: item.title,
            value: item.id
          }))
          resolve(content)
        }).catch(err => {
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
        if (attr.attr_type === 1) { // 输入框
          if (attr.form_num > 1) { // 多个输入
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
        } else if (attr.attr_type === 2) { // 下拉框
          let attrVal = values[`attribute-${attr.id}`]
          // 多选
          if (attr.multiple === '1' && Array.isArray(attrVal)) {
            attrVal = attrVal.join('|')
          }
          formDatas.push({
            ...attr,
            value: attrVal !== undefined ? attrVal : ''
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
          const breakdownValues = selectedCategory.breakdownSetting.map(item => Number(values[`breakdown-${item.id}`]) || 0)
          this.workload = sum(breakdownValues)
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
      const {
        type,
        name,
        workload_unit,
        level,
        complete_date,
        workload_amount,
        supplicant,
        test,
        images,
        remark,
        production_staff
      } = values

      return {
        type: 1,
        cnt: {
          root_type: String(categoryDetail.value),
          type: String(type),
          name,
          attr: JSON.stringify(
            this.handleAttribute(formKey.selectedCategory.attributeSetting, values)
          ),
          breakdown: JSON.stringify(
            this.handleBreakdown(
              formKey.selectedCategory,
              values
            )
          ),
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
          images: images ? images.map(img => ({
            file_id: img.id,
            file_size: img.size,
            file_name: img.name,
            file_url: img.url
          })) : [],
          remark,
          production_staff: formatArrayValue(production_staff)
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
      return new Promise(async(resolve, reject) => {
        const detailItems = [] // 子类的表单数据
        const applyForMap = [] // 经办人数据
        const verifyReviewersForMap = [] // 指定审批人数据

        const approveAssRoleForMap = []
        let relevantReviewers = ''
        const specialReviewersForMap = []

        // 验证所有的品类表单
        for (const item of this.categoryDetails) {
          const formRef = this.$refs[`applyForm-${item.value}`] // 大类ref
          const selectedApplyByUser = formRef[0].selectedApplyByUser
          const isHasApply = formRef[0].$refs.applyList

          // 审批人员数据
          formRef[0].approveForm.validateFieldsAndScroll((err, val) => {
            if (err) {
              this.saving = false
              reject(`请选择相关审批人员！`)
              return
            } else {
              approveAssRoleForMap.push({ cnt_category: item.value, users: val.approve_ass_role ? val.approve_ass_role.join(',') : '' })
              relevantReviewers = val.relevant_reviewers ? val.relevant_reviewers.replace(/;/g, ',') : ''
              specialReviewersForMap.push({ cnt_category: item.value, users: val.special_reviewers ? val.special_reviewers.join(',') : '' })
              verifyReviewersForMap.push({ cnt_category: item.value, users: val.verify_reviewers ? val.verify_reviewers.join(',') : '' })
            }
          })

          if (this.englishName.startsWith('v_')) {
            if (isHasApply) {
              if (!selectedApplyByUser) {
                this.saving = false
                this.clickType = 0
                reject(`请在服务品类【${item.label}】下选择经办人！`)
                return
              }
            } else {
              this.saving = false
              this.clickType = 0
              reject(`请配置服务品类【${item.label}】下选择经办人！`)
              return
            }
          }

          if (selectedApplyByUser) {
            applyForMap.push({
              cnt_category: item.value,
              user: selectedApplyByUser
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
                const res = await this.validateFormData(
                  item,
                  childItem.detailForm,
                  keys[formKeyIndex]
                )
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
        // 主题风格多选框处理
        if (messageFormVal.theme_element && Array.isArray(messageFormVal.theme_element)) {
          messageFormVal.theme_element = messageFormVal.theme_element.join(';')
        }
        // 新增的五个产品维度
        const product_dimension = [{ 'id': 1, 'dimension_name': messageFormVal.area_style ? messageFormVal.area_style : '', 'product_label_type': 'area_style' }, { 'id': 2, 'dimension_name': messageFormVal.product_type ? messageFormVal.product_type : '', 'product_label_type': 'product_type' }, { 'id': 3, 'dimension_name': messageFormVal.design_engine ? messageFormVal.design_engine : '', 'product_label_type': 'design_engine' }, { 'id': 4, 'dimension_name': messageFormVal.art_style ? messageFormVal.art_style : '', 'product_label_type': 'art_style' }, { 'id': 5, 'dimension_name': messageFormVal.theme_element ? messageFormVal.theme_element : '', 'product_label_type': 'theme_element' }]
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
          // 相关审批人，指定审批人，业务审批人
          approve_ass_role_for_map: approveAssRoleForMap,
          relevant_reviewers: relevantReviewers,
          special_reviewers_for_map: specialReviewersForMap,
          product_dimension: JSON.stringify(product_dimension),
          artist_name: Array.isArray(messageFormVal.artist_name) ? messageFormVal.artist_name.join(';') : undefined
        })
      })
    },
    // 保存和提交需求，type-1保存为草稿，2-提交需求，3-修改价格
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
        this.validateDetailForms(val).then(formData => {
          if (!this.testingApplyForMap(formData)) {
            this.saving = false
            this.clickType = 0
            return
          }
          if (this.isEdit && !this.isReEdit) { // 更新
            updateConsume(formData, type).then(res => {
              this.saving = false

              this.$message.success(type === 1 ? '保存成功' : '提交成功')
              this.resetDemandForm()
              this.currentStep = 1
            }).catch(() => {
              this.saving = false
              this.clickType = 0
            })
          } else { // 新增
            saveConsume(formData, type).then(res => {
              // 驳回重新编辑提交时更新物件状态
              if (type === 2 && this.isReEdit && this.reEditMaterialBillNos.length > 0) {
                updateConsumeDetailStatus(
                  this.reEditMaterialBillNos,
                  '-13000'
                )
              }

              this.saving = false
              this.$message.success(type === 1 ? '保存成功' : '提交成功')
              this.resetDemandForm()
              this.currentStep = 1
            }).catch(() => {
              this.saving = false
              this.clickType = 0
            })
          }
        }).catch(err => {
          this.$message.info(err, 5)
        })
      })
    },
    resetDemandForm() {
      setLocalData(LocalSelectedProductKey, this.selectedProject.product_code)
      this.$store.dispatch('demand/resetDemandForm')
      this.messageForm.resetFields()
      this.categoryDetails = []
    },
    finish() {
      this.clickType = 0
      this.$router.push('/demand/apply')
    },
    testingApplyForMap(data) {
      if (data.apply_for_map.length <= 0) return true // 没有经办人,不需要判断
      const testStr = data.apply_for_map[0].user
      if (data.approve_ass_role_for_map.length <= 0) {
        data.approve_ass_role_for_map[0] = { users: '' }
      }
      if (data.verify_reviewers_for_map.length <= 0) {
        data.verify_reviewers_for_map[0] = { users: '' }
      }
      if (data.approve_ass_role_for_map[0].users !== '') {
        if (data.approve_ass_role_for_map[0].users.includes(testStr) || data.verify_reviewers_for_map[0].users.includes(testStr)) {
          this.$message.info('需求经办人与需求审核人/审批人不可为同一人，请修改')
          return false
        }
      } else {
        let leaderName = ''
        getUserOrgInfo(this.englishName).then(res => { leaderName = res.data.leader_name })
        if (data.verify_reviewers_for_map[0].users.includes(testStr) || leaderName.includes(testStr)) {
          this.$message.info('需求经办人与需求审核人/审批人不可为同一人，请修改')
          return false
        }
      }
      return true
    }
  }
}
</script>
<style lang="less" scoped>
.is-base-tip {
  margin-left: 5px;
  font-size: 12px;
}
.omc-expend {
  min-width: 1600px;
  .omc-expend-action {
    box-shadow: 0 5px 15px rgba(0,0,0,.15);
    .go-back {
      margin-right: 10px;
      i {
        margin-right: 5px;
      }
    }
  }
}
.iomc-form-item {
  margin-bottom: 0;
}
.is-base-tip {
  margin-left: 5px;
  font-size: 12px;
}
.tip-txt{
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-top: 8px;
 }
.product-box{
  margin-left:  11.6% !important;
  .iomc-col{
    padding: 0 10px!important;
  }
}
@media screen and (min-width:3800px){
  .product-box{
     margin-left:  14.2% !important;
  }
}
@media (min-width: 1980px) and (max-width: 3800px){
  .product-box{
     margin-left:  12.6% !important;
  }
}
#demand_form_product_type,#demand_form_design_engine,#demand_form_art_style,#demand_form_area_style,#demand_form_theme_element{
  width: 70%;
}

</style>
