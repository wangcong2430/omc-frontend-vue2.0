<template>
  <div class="omc-expend-box">
    <div class="box-head">
      <div class="col-left">
        <div class="box-title">{{ detail.label }}</div>
        <div v-if="detail.applyByList.length > 0" ref="applyList" class="apply-by-list">
          <span v-if="checkIsOuter()" class="text-danger mr-5">*</span>经办人:
          <a-select
            v-model="selectedApplyByUser"
            style="width: 260px"
            :options="detail.applyByList"
            placeholder="请选择经办人"
            :disabled="isConsumeModify"
            show-search
            @select="getUserInfo"
          ></a-select>
          <span class="tip text-warning">(经办人为实际需求人，需要在供应商提交验收单后，对订单验收和评估)</span>
        </div>
      </div>
      <div class="col-right">
        <div class="head-upload margin-right-5">
          <drag-upload-file
            :placeholder="'新增数量相同的物件，自动添加上缩略图，物件名称为对应缩略图的文件名'"
            :accept="'image/*'"
            :reject-info="'请上传图片类型的文件!'"
            :limit-count="50"
            :disabled="isConsumeModify"
            @on-success="uploadThumbnail"
          />
        </div>
        <upload-file
          :accept="'image/*'"
          :multiple="true"
          :limit-count="50"
          :reject-info="'请上传图片类型的文件!'"
          style="display: inline;"
          @on-success="uploadThumbnail"
        >
          <a-button
            slot="innerBox"
            icon="upload"
            class="margin-right-5"
            :disabled="isConsumeModify"
          >缩略图导入</a-button>
        </upload-file>
        <div class="troggle-action">
          <a
            href="javascript:;"
            :class="['js-arrow', {'active': !detail.open}]"
            @click.stop="troggleCategory(detail)"
          >
            <i class="mdi-set mdi-chevron-down-circle"></i>
          </a>
        </div>
      </div>
    </div>
    <div class="examine">
      <div class="approve_box">
        <a-form :form="approveForm">
          <div v-if="verifyAllDone" class="leader">
            <p class="title"><i class="iomc-required">*</i><span class="serial">1</span>需求审核人</p>
            <p class="leader-name">{{ verifyAllRole }}</p>
          </div>
          <a-row :gutter="25">
            <a-col v-if="verifyReviewerList.length > 0 && !verifyAllDone" span="5">
              <a-form-item>
                <span slot="label"><span class="serial">1</span>需求审核人(下拉选择)</span>
                <a-select
                  v-decorator="[
                    `verify_reviewers`,
                    {
                      rules: [{ required: true ,message: '必选项'}]
                    }
                  ]"
                  placeholder="请选择需求审核人"
                  mode="multiple"
                  :options="verifyReviewerList"
                  :disabled="isConsumeModify"
                ></a-select>
              </a-form-item>
            </a-col>
            <div v-if="approveAssRoleList.length <=0" class="leader">
              <p class="title"><i class="iomc-required">*</i><span class="serial">2</span>直属leader</p>
              <p class="leader-name">{{ leaderName }}</p>
            </div>
            <a-col v-else span="5">
              <a-form-item>
                <span slot="label"><span class="serial">2</span>指定审批人(下拉选择)</span>
                <a-select
                  v-decorator="[
                    `approve_ass_role`,
                    {
                      rules: [{ required: true ,message: '必选项'}]
                    }
                  ]"
                  placeholder="请选择指定审批人"
                  mode="multiple"
                  :options="approveAssRoleList"
                ></a-select>
              </a-form-item>
            </a-col>
            <a-col span="8">
              <a-form-item>
                <span slot="label"><span class="serial">3</span>相关审批人(<span class="red">非必填，如需要，可填写1/2步审批人之外的其他人</span>，手写输入)</span>
                <common-member-picker
                  v-decorator="[
                    `relevant_reviewers`,
                    {
                      initialValue: '',
                      rules: [{ required: false}]
                    }
                  ]"
                  placeholder="请输入相关审批人"
                ></common-member-picker>
              </a-form-item>
            </a-col>
            <a-col v-if="specialReviewerslist.length>0" span="5">
              <a-form-item>
                <span slot="label"><span class="serial">4</span>特殊审批人(下拉选择)</span>
                <a-select
                  v-decorator="[
                    `special_reviewers`,
                    {
                      rules: [{ required: false}]
                    }
                  ]"
                  placeholder="请选择特殊审批人"
                  mode="multiple"
                  :options="specialReviewerslist"
                ></a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
    <div class="box-body" :class="{'detail-box-hidden': !detail.open}">
      <div v-if="formKeys.length > 0" class="expend-table">
        <div class="expend-table-head">
          <div class="head-row">
            <div class="head-col" style="width: 15px;"></div>
            <div class="head-col" style="width: 18%;">物件<span class="text-danger ml-5">*</span></div>
            <div v-if="hasAttributeSetting" class="head-col" style="width: 25%;">属性<span class="text-warning">(需求描述的重要字段,请如实填写)</span>
            </div>
            <div class="head-col" style="flex: 1;">数量/预估工作量<span class="text-danger ml-5">*</span></div>
            <div class="head-col" style="width: 15%;">相关必填<span class="text-danger ml-5">*</span></div>
            <div class="head-col" style="width: 18%;">可填选项</div>
            <div class="head-col" style="width: 80px;">缩略图</div>
            <div class="head-col" style="width: 80px;">操作</div>
          </div>
          <div class="expend-table-body">
            <div
              v-for="(item, index) in formKeys"
              :key="item.id"
              class="expend-form-item"
            >
              <apply-detail-form
                v-if="defer(index)"
                :ref="`detailForm-${detail.value}`"
                :form-id="item.id"
                :form-index="index"
                :form-value="item.formValue"
                :import-form-data="item.importFormData"
                :child-category-details="detail.childCategoryDetails"
                :selected-category="item.selectedCategory"
                :workload-units="workloadUnits"
                :supplicant-opt="item.selectedCategory.supplicantOpt"
                :has-attribute-setting="hasAttributeSetting"
                :handle-attributes="handleAttributes"
                :delete-detail="deleteDetail"
                :copy-detail="copyDetail"
                :set-detail-key="setDetailKey"
                :apply-mutil-attribute="applyMutilAttribute"
                :is-show-grade="detail.isShowGrade"
              ></apply-detail-form>
            </div>
          </div>
        </div>
      </div>
      <div class="expend-add">
        <a-select
          style="width: 300px;"
          placeholder="请选择类别"
          :options="detail.childCategoryDetails"
          :show-search="true"
          :default-active-first-option="false"
          option-filter-prop="children"
          :allow-clear="true"
          class="margin-right-10"
          :disabled="isConsumeModify"
          @change="onSelectChildCategory"
        ></a-select>
        <a-button
          icon="plus"
          :disabled="!selectedCategory.value || isConsumeModify"
          class="add-btn"
          @click="addDetail"
        >新增物件</a-button>
        <a-button
          class="margin-right-10"
          icon="download"
          :disabled="!selectedCategory.value || isConsumeModify"
          @click="downExcelTpl"
        >下载模板</a-button>
        <upload-file
          :accept="'.xlsx,.xls'"
          :reject-info="'请上传Excel类型的文件!'"
          :show-tip="false"
          style="display: inline;"
          @on-success="importExcelTpl"
        >
          <a-button
            slot="innerBox"
            type="primary"
            icon="upload"
            :disabled="!selectedCategory.value || importing || isConsumeModify"
            :loading="importing"
          >模板导入</a-button>
        </upload-file>
        <span class="is-base-tip text-warning">（请勿使用非本系统下载模版导入）</span>
      </div>
      <loading-modal
        v-if="openDisplayProority"
        :show-icon="true"
        :show-progress="true"
        :tip-text="'渲染加载中...'"
        :percent="calRenderProgress()"
      />
      <loading-modal
        v-if="importing"
        :show-icon="true"
        :show-progress="false"
        :tip-text="'导入模板中...'"
      />
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import DragUploadFile from '@/components/DragUploadFile'
import UploadFile from '@/components/UploadFile'
import LoadingModal from '@/components/LoadingModal'
import applyDetailForm from './field'
import { set } from 'lodash/object'
import { sumBy, round } from 'lodash/math'
import { toNumber } from 'lodash/lang'
import { sortBy } from 'lodash/collection'
import { getFileNameWithoutExt, toFixedNumber } from '@/utils/index'
import { getExcelTpl, parseExeclTpl } from '@/api/common'
import { formatTplParams, formatImportTplData } from './model'
import { getCntSupplicants } from '@/api/demand/content'
import { getAllReviewerSettingList } from '@/api/workflow/index'
import CommonMemberPicker from '@/components/Form/CommonMemberPicker'
import { getUserOrgInfo } from '@/api/user/info'

export default {
  name: 'ContentApplyForm',
  components: {
    DragUploadFile,
    UploadFile,
    LoadingModal,
    applyDetailForm,
    CommonMemberPicker
  },
  props: {
    detail: {
      type: Object,
      required: true
    },
    detailIndex: {
      type: Number,
      required: true
    },
    applyByUser: {
      type: String,
      default: ''
    },
    verifyReviewers: {
      type: String,
      default: ''
    },
    allUnitsList: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    setDetailCount: {
      type: Function,
      required: true
    },
    troggleCategory: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      id: 0,
      formKeys: [],
      selectedCategory: {
        value: '', // 选择的子类
        label: '',
        levelData: [],
        levelOpts: [], // 制作等级
        supplicantData: [], // 意向供应商
        supplicantOpt: [],
        breakdownSetting: [], // 工作量明细配置
        attributeSetting: [], // 属性配置
        hasTest: false, // 是否支持测试单
        hasBreakdown: false, // 是否有工作量配置, 没有工作量需要填数量
        workloadUnit: '' // 默认的工作量单位
      },
      hasAttributeSetting: false, // 是否有属性配置项
      importing: false, // 导入模板中
      selectedApplyByUser: undefined,
      displayPriority: 0, // 渲染次数
      openDisplayProority: false, // 是否开启延时渲染加载
      selectedVerifyReviewers: undefined, // 指定需求审核人
      approveAssRoleList: [],
      specialReviewerslist: [],
      workloadUnits: [],
      leaderName: '',
      verifyReviewerList: [], // 需求审核人
      verifyAllDone: false,
      verifyAllRole: ''
    }
  },
  computed: {
    ...mapGetters(['detailForms']),
    ...mapState({
      selectedProject: state => state.demand.selectedProject,
      isEdit: state => state.demand.isEdit,
      englishName: state => state.user.englishName,
      isConsumeModify: state => state.demand.isConsumeModify,
      consumeDetail: state => state.demand.consumeDetail
    })
  },
  beforeCreate() {
    this.approveForm = this.$form.createForm(this, { name: 'approve_form' })
  },
  created() {
    // 获取所有业务，需求，指定审批人
    this.getExamineApproveList()
  },
  mounted() {
    this.setDetailForm()
    this.setApproveFormValue()
  },
  methods: {
    getUserInfo(val) {
      if (this.approveAssRoleList.length <= 0) {
        getUserOrgInfo(val).then(res => { this.leaderName = res.data.leader_name })
      }
    },
    setApproveFormValue() {
      this.$nextTick(() => {
        this.approveForm.setFieldsValue({
          'relevant_reviewers': this.consumeDetail.relevant_reviewers ? this.consumeDetail.relevant_reviewers : undefined
        })
      })
    },
    getExamineApproveList() {
      getAllReviewerSettingList(
        1,
        5,
        2,
        this.selectedProject.depart_id,
        this.selectedProject.product_code,
        {
          module: 'consume',
          type: { level1: `${this.detail.value}`, level2: '0', level3: '0', level4: '0' }
        }
      ).then(res => {
        const targetData = res.content.list[0].reviewers
        for (const key in targetData) {
          if (targetData[key].setting.role_code === 'ConsumeCpApproveAssRole') {
            this.approveAssRoleList = targetData[key].user_names.length > 0 ? targetData[key].user_names.filter(item => (item !== this.englishName)).map(item => ({ label: item, value: item })) : []
          }
          if (targetData[key].setting.role_code === 'ConsumeCpApproveRole') {
            this.specialReviewerslist = targetData[key].user_names.length > 0 ? targetData[key].user_names.filter(item => (item !== this.englishName)).map(item => ({ label: item, value: item })) : []
          }
          if (targetData[key].setting.role_code === 'ConsumeCpVerifyRole') {
            this.verifyReviewerList = targetData[key].user_names.length > 0 ? targetData[key].user_names.filter(item => (item !== this.englishName)).map(item => ({ label: item, value: item })) : []
          }
          // 配置全审
          if (targetData[key].setting.role_code === 'ConsumeCpVerifyAllDone') {
            this.verifyAllDone = targetData[key].checked === 2
          }
        }
        if (!this.approveAssRoleList.length > 0) {
          const userName = this.selectedApplyByUser ? this.selectedApplyByUser : this.englishName
          getUserOrgInfo(userName).then(res => { this.leaderName = res.data.leader_name })
        }
        this.$nextTick(() => {
          this.approveForm.setFieldsValue({
            'approve_ass_role': this.consumeDetail.approve_ass_role ? this.consumeDetail.approve_ass_role.split(',') : undefined,
            'special_reviewers': this.consumeDetail.special_reviewers ? this.consumeDetail.special_reviewers.split(',') : undefined
          })
          if (!this.verifyAllDone) {
            this.approveForm.setFieldsValue({
              'verify_reviewers': this.consumeDetail.verify_reviewers ? this.consumeDetail.verify_reviewers.split(',') : undefined
            })
          } else {
            this.verifyAllRole = this.verifyReviewerList.map(item => item.value).join(' ')
          }
        })
      })
    },
    setDetailForm() {
      if (this.detailForms && this.detailForms.length > 0 && this.isEdit) {
        const nextKeys = []
        this.detailForms.forEach((item, index) => {
          const filterOpt = this.detail.childCategoryDetails.find(child => child.value === toNumber(item.type))
          if (filterOpt && filterOpt.attributes) {
            const {
              grade_setting,
              has_breakdown, // 是否有工作量明细, 1-是、2-否
              has_test, // 是否支持测试单, 1-是、2-否
              workload_unit
            } = filterOpt.attributes

            nextKeys.push({
              open: true,
              id: index,
              count: item.count,
              selectedCategory: {
                value: item.type,
                label: filterOpt.label,
                levelData: grade_setting,
                levelOpts: grade_setting.map(opt => ({
                  label: opt.title,
                  value: opt.title,
                  id: opt.id
                })),
                supplicantData: item.supplicant_options,
                supplicantOpt: this.handleSupplicants(item.supplicant_options),
                breakdownSetting: item.breakdown,
                attributeSetting: item.attr,
                hasTest: has_test === 1,
                hasBreakdown: has_breakdown === 1,
                workloadUnit: toNumber(workload_unit)
              },
              formValue: item, // 编辑时该字段有值
              importFormData: {} // 模板导入时该字段有值
            })
          }
          // 设置固定单位
          if (Array.isArray(filterOpt.attributes.workload_unit_json) && filterOpt.attributes.workload_unit_json.length > 0) {
            const resultData = filterOpt.attributes.workload_unit_json
            this.workloadUnits = resultData.map(item => ({ label: item.title, value: item.title, id: item.id }))
          } else {
            this.workloadUnits = this.allUnitsList
          }
        })
        // 大于30条数据时开启分批渲染
        if (nextKeys.length > 30) {
          this.runDisplayPriority(nextKeys.length)
        }
        this.formKeys = nextKeys
        this.checkAttributeSetting(nextKeys)
        this.setDetailCount(this.detailIndex, round(sumBy(nextKeys, 'count'), 3))
        this.id = this.detailForms.length
        // 外包人员时设置经办人
        if (this.applyByUser) {
          this.selectedApplyByUser = this.applyByUser
        }
        if (this.verifyReviewers && this.detail.verifyReviewers) {
          const items = this.verifyReviewers.split(',')
          const verifyReviewers = this.detail.verifyReviewers.map(item => item.value)
          this.selectedVerifyReviewers = items.filter(item => verifyReviewers.includes(item))
        }
      }
    },
    async onSelectChildCategory(val) {
      if (val === undefined) { // 清除选择时重置所选数据
        this.selectedCategory = {
          value: '',
          label: '',
          levelData: [],
          levelOpts: [],
          supplicantData: [],
          supplicantOpt: [],
          breakdownSetting: [],
          attributeSetting: [],
          hasTest: false,
          hasBreakdown: false,
          workloadUnit: ''
        }
        return
      }

      const filterOpt = this.detail.childCategoryDetails.find(item => item.value === val)

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

        this.selectedCategory = {
          value: val,
          label: filterOpt.label,
          levelData: grade_setting,
          levelOpts: grade_setting.map(opt => ({
            label: opt.title,
            value: opt.title,
            id: opt.id
          })),
          supplicantData: supplicants,
          supplicantOpt: this.handleSupplicants(supplicants),
          breakdownSetting: breakdown_setting || [],
          attributeSetting: has_attribute === 1 ? this.handleAttributes(attribute_setting) : [],
          hasTest: has_test === 1,
          hasBreakdown: has_breakdown === 1,
          workloadUnit: toNumber(workload_unit)
        }
      }
      // 设置固定单位
      if (Array.isArray(filterOpt.attributes.workload_unit_json) && filterOpt.attributes.workload_unit_json.length > 0) {
        const resultData = filterOpt.attributes.workload_unit_json
        this.workloadUnits = resultData.map(item => ({ label: item.title, value: item.title, id: item.id }))
      } else {
        this.workloadUnits = this.allUnitsList
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
    handleAttributes(settings) {
      return settings.map(setting => {
        if (setting.attr_type === 1) { // 输入框
          if (setting.form_num > 1) { // 多个输入
            return {
              ...setting,
              fields: setting.form_name.split('|').map(name => ({
                label: name,
                value: name
              })), // 多个输入框内容
              componentName: 'DemandMutilInputField' // 组件名称
            }
          }
          return {
            ...setting,
            componentName: 'DemandInputField'
          }
        } else if (setting.attr_type === 2) { // 下拉框
          return {
            ...setting,
            options: setting.form_value.split('|').map(val => ({
              label: val,
              value: val
            })), // 下拉框选项
            componentName: 'DemandSelectField'
          }
        }
        return setting
      })
    },
    addDetail() {
      const keys = this.formKeys
      const index = this.id
      this.id += 1

      const {
        value,
        levelData,
        levelOpts,
        supplicantData,
        supplicantOpt,
        breakdownSetting,
        attributeSetting,
        hasTest,
        hasBreakdown,
        workloadUnit
      } = this.selectedCategory
      const nextKeys = keys.concat({
        open: true,
        id: index,
        count: hasBreakdown && breakdownSetting.length > 0 ? 1 : 0,
        selectedCategory: {
          value,
          levelData,
          levelOpts,
          supplicantData,
          supplicantOpt,
          breakdownSetting,
          attributeSetting,
          hasTest,
          hasBreakdown,
          workloadUnit
        },
        formValue: {},
        importFormData: {}
      })
      this.formKeys = nextKeys
      this.checkAttributeSetting(nextKeys)
      this.setDetailCount(this.detailIndex, round(sumBy(nextKeys, 'count'), 3))
    },
    async deleteDetail(index, itemId) {
      const deleteModal = this.$confirm({
        title: '删除物件',
        content: `确定要删除物件${index + 1}吗？`,
        onOk: async() => {
          deleteModal.update({ okButtonProps: { props: { loading: true }}})
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              const keys = this.formKeys
              this.formKeys = keys.filter((key) => key.id !== itemId)
              this.checkAttributeSetting(this.formKeys)
              this.setDetailCount(this.detailIndex, round(sumBy(this.formKeys, 'count'), 3))
              deleteModal.update({ okButtonProps: { props: { loading: false }}})
              this.$message.success('删除成功！')
              resolve()
            }, 500)
          })
        }
      })
    },
    copyDetail(selectedCategory, currentIndex, originalFormId) {
      const nextKeys = this.formKeys
      const copyFormId = this.id
      this.id += 1
      nextKeys.splice(currentIndex + 1, 0, {
        open: true,
        id: copyFormId,
        count: nextKeys[currentIndex].count || 0,
        selectedCategory: {
          value: selectedCategory.value,
          levelData: selectedCategory.levelData,
          levelOpts: selectedCategory.levelOpts,
          supplicantData: selectedCategory.supplicantData,
          supplicantOpt: selectedCategory.supplicantOpt,
          breakdownSetting: selectedCategory.breakdownSetting,
          attributeSetting: selectedCategory.attributeSetting,
          hasTest: selectedCategory.hasTest,
          hasBreakdown: selectedCategory.hasBreakdown,
          workloadUnit: selectedCategory.workloadUnit
        },
        formValue: {},
        importFormData: {}
      })
      this.formKeys = nextKeys
      this.checkAttributeSetting(nextKeys)
      this.setDetailCount(this.detailIndex, round(sumBy(nextKeys, 'count'), 3))
      this.$nextTick(() => {
        const detailFormRefs = this.$refs[`detailForm-${this.detail.value}`]
        let originalDetailForm = null
        let copyDetailForm = null
        detailFormRefs.forEach(item => {
          if (item.formId === originalFormId) {
            originalDetailForm = item.detailForm
          }
          if (item.formId === copyFormId) {
            copyDetailForm = item.detailForm
          }
        })
        if (originalDetailForm && copyDetailForm) {
          const values = originalDetailForm.getFieldsValue()
          this.setDetailFormValues(copyDetailForm, values)
        }
      })
    },
    setDetailKey(id, key, val) {
      const newKeys = set(this.formKeys, [id, key], val)
      this.formKeys = newKeys
      if (key === 'selectedCategory') {
        this.checkAttributeSetting(newKeys)
      }
      if (key === 'count') {
        this.setDetailCount(this.detailIndex, round(sumBy(this.formKeys, 'count'), 3))
      }
    },
    troggleDetail(index, status) {
      const keys = this.formKeys
      this.formKeys = set(keys, [index, 'open'], !status)
    },
    setDetailFormValues(form, values) {
      try {
        if (form) {
          form.setFieldsValue(values)
          this.$message.success('复制成功！')
        }
      } catch (error) {
        this.$message.error(`复制数据失败：${error}`, 5)
      }
    },
    getDetailFormRef() {
      const detailFormRef = this.$refs[`detailForm-${this.detail.value}`]
      if (detailFormRef) {
        return sortBy(detailFormRef, 'formIndex')
      }
      return null
    },
    checkAttributeSetting(formKeys) {
      if (!formKeys.length) {
        this.hasAttributeSetting = false
      }
      const result = formKeys.some(form => {
        return form.selectedCategory.attributeSetting.length > 0
      })
      this.hasAttributeSetting = result
    },
    uploadThumbnail(file) {
      this.workloadUnits = this.allUnitsList
      const { name, uid, id, file_size, url } = file
      const nameWithoutExt = getFileNameWithoutExt(name)
      const detailFormRefs = this.getDetailFormRef()
      if (detailFormRefs && detailFormRefs.length > 0) {
        const matchedForm = detailFormRefs.find(ref => {
          if (ref.detailForm) {
            const name = ref.detailForm.getFieldValue('name')
            if (name === nameWithoutExt) {
              return true
            }
          }
          return false
        })

        if (matchedForm) { // 命中已经存在的物件名
          matchedForm.detailForm.setFieldsValue({
            'images': [{ uid, id, name, file_size, url }]
          })
        } else { // 没有命中物件名时新增一条
          this.addDetail()
          this.$nextTick(() => {
            const addDetailFormRef = this.$refs[`detailForm-${this.detail.value}`][this.formKeys.length - 1]
            if (addDetailFormRef) {
              addDetailFormRef.detailForm.setFieldsValue({
                'name': nameWithoutExt,
                'images': [{ uid, id, name, file_size, url }]
              })
            }
          })
        }
      } else { // 不存在物件时新增一条
        this.addDetail()
        this.$nextTick(() => {
          const addDetailFormRef = this.$refs[`detailForm-${this.detail.value}`][this.formKeys.length - 1]
          if (addDetailFormRef) {
            addDetailFormRef.detailForm.setFieldsValue({
              'name': nameWithoutExt,
              'images': [{ uid, id, name, file_size, url }]
            })
          }
        })
      }
    },
    downExcelTpl() {
      try {
        const params = formatTplParams(
          this.workloadUnits,
          this.selectedCategory,
          this.detail.isShowGrade
        )
        getExcelTpl(params).then(res => {
          this.$message.success('下载模板成功!')
        })
      } catch (error) {
        this.$message.error(`下载模板失败：${error}`)
      }
    },
    importExcelTpl(file) {
      this.importing = true
      if (!file.url) {
        this.importing = false
        return this.$message.error('导入模板失败！')
      }
      const fileUrl = `${file.url}`
      parseExeclTpl(fileUrl).then(res => {
        formatImportTplData(
          res.data,
          this.selectedCategory.levelOpts,
          this.selectedCategory.supplicantOpt,
          this.selectedCategory.attributeSetting
        ).then(formData => {
          try {
            const nextKeys = this.formKeys
            formData.forEach(data => {
              const index = this.id
              this.id += 1
              // 设置佣金
              if (parseFloat(data.count) > 0 && data.workload_unit === '人日' && this.detail.isShowGrade.category) {
                data.workload_amount = parseFloat(data.count) * 1000
              }

              nextKeys.push({
                open: true,
                id: index,
                count: this.selectedCategory.hasBreakdown ? 1 : 0,
                selectedCategory: {
                  value: this.selectedCategory.value,
                  levelData: this.selectedCategory.levelData,
                  levelOpts: this.selectedCategory.levelOpts,
                  supplicantData: this.selectedCategory.supplicantData,
                  supplicantOpt: this.selectedCategory.supplicantOpt,
                  breakdownSetting: this.selectedCategory.breakdownSetting,
                  attributeSetting: this.selectedCategory.attributeSetting,
                  hasTest: this.selectedCategory.hasTest,
                  hasBreakdown: this.selectedCategory.hasBreakdown,
                  workloadUnit: this.selectedCategory.workloadUnit
                },
                formValue: {},
                importFormData: data
              })
            })
            this.formKeys = nextKeys
            this.checkAttributeSetting(nextKeys)
            this.setDetailCount(this.detailIndex, round(sumBy(nextKeys, 'count'), 3))
            this.$message.success('导入模板成功！')
          } catch (error) {
            this.importing = false
            this.$message.error(`导入失败：${error}`)
          }
        }).catch(err => {
          this.$message.error(`导入模板失败：${err}`)
        }).finally(() => {
          this.importing = false
        })
      }).catch(() => {
        this.$message.error(`导入模板失败：请先下载模板填写再导入！`)
      }).finally(() => {
        this.importing = false
      })
    },
    checkIsOuter() {
      return this.englishName.startsWith('v_') // 是否是外包人员
    },
    // 延时分批渲染组件，优化大量组件渲染的性能
    runDisplayPriority(count) {
      this.openDisplayProority = true
      const step = () => {
        requestAnimationFrame(() => {
          this.displayPriority = this.displayPriority + 8 // 一次渲染8条最优
          if (this.displayPriority < count) {
            step()
          } else if (this.displayPriority >= count) { // 渲染到最后重置
            this.openDisplayProority = false
            this.displayPriority = 0
          }
        })
      }

      setTimeout(() => {
        step()
      }, 10)
    },
    defer(priority) {
      if (!this.openDisplayProority) {
        return true
      }
      return this.displayPriority >= priority
    },
    calRenderProgress() {
      const percent = (this.displayPriority / this.formKeys.length) * 100
      if (percent > 100) {
        return 100
      }
      return toNumber(toFixedNumber(percent))
    },
    applyMutilAttribute(type, key, values, formId) {
      const detailFormRefs = this.getDetailFormRef()
      if (!detailFormRefs || !Array.isArray(detailFormRefs)) {
        return
      }
      detailFormRefs.forEach(ref => {
        if (ref.detailForm) {
          const demandType = ref.detailForm.getFieldValue('type')
          if (demandType === type && ref.formId !== formId) {
            ref.detailForm.setFieldsValue({
              [key]: values
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.omc-expend-box {
  .box-head {
    .col-left {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      .apply-by-list {
        margin-left: 20px;
        .tip {
          margin-left: 5px;
          font-size: 12px;
        }
      }
    }
    .col-right {
      .margin-right-5 {
        margin-right: 5px;
      }
      .troggle-action {
        display: inline-block;
        margin-right: -10px;
        & > a {
          display: inline-block;
          vertical-align: top;
          font-size: 14px;
          line-height: 22px;
          color: #8f93a1;
          margin-left: 8px;
          &:hover {
            color: #6b5aed;
          }
          &.active {
            .mdi-chevron-down-circle{
              transform: rotate(180deg);
            }
          }
          & > i {
            font-size: 16px;
            vertical-align: top;
            transition: transform .2s ease;
          }
        }
      }
    }
  }
  .box-body {
    .expend-form-item:hover {
      background-color: #f7f7fb;
    }
    &.detail-box-hidden {
      display: none;
    }
    .expend-add {
      padding-left: 0;
      .add-btn {
        margin-right: 10px;
      }
    }
    .margin-right-10 {
      margin-right: 10px;
      font-size: 14px;
    }
  }
}
.iomc-form-item {
  margin-bottom: 0;
}
.box-title{
   width: 96px;
}
.examine{
     &::after{
       display: block;
       visibility: hidden;
       height: 0px;
       clear: both;
       content: '';
     }
    .approve_box{
      padding: 0 20px;
      float: left;
      width: 88%;
      margin-top: 3px;
      .iomc-row{
        .hide{
           display: none;
        }
     }
    }
    .verify{
      width: 330px;
      float: left;
      padding: 0 0px 0 20px;
      margin: 13px 6px 10px 0px;
      .mr-5{
        font-size: 14px;
        margin-bottom: 13px;
        padding:0px;
      }

    }
}
.leader{
  float: left;
  width: 20%;
  margin: 10px 12px 0 12px;
  P{
    color: rgba(0, 0, 0, 0.85);
  }
  .leader-name{
    font-size: 14px;
    line-height: 28px;
    margin: 0 auto;
    border: 1px solid #e8e8e8;
    background-color: #fafafa;
    text-align: left;
    padding-left: 10px;
    height: 28px;
    overflow: hidden;
  }
  .title{
    i{
      color: #f5222d;
      margin-right: 5px;
      font-size: 13px;
      transform: rotate(-15deg);
      display: inline-block;
      font-family: cursive;
    }
  }
}
.serial{
    color: #fff;
    background-color: #6b5aed;
    margin-right: 3px;
    border-radius: 16px;
    display: inline-table;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
}
.red{
  font-weight: 600;
  color: #f5222d;
  font-size: 12px;
}
</style>
