<template>
  <div class="omc-budget">
    <steps :step-lists="stepLists" :current-step="currentStep"></steps>
    <template>
      <div v-if="currentStep === 0" class="omc-budget-content">
        <div class="col-left">
          <div class="omc-expense-box">
            <div class="box-head">
              <div class="head-title">
                需求信息
                <span v-if="consumeDetail.bill_no">需求单号：{{ consumeDetail.bill_no }}</span>
              </div>
              <div class="head-actions">
                <a href="javascript:;">
                  <upload-file @on-success="uploadAttament">
                    <a slot="innerBox" href="javascript:;" class="head-actions-upload">
                      <i class="mdi-set mdi-publish mr-5"></i>上传附件
                    </a>
                  </upload-file>
                </a>
              </div>
            </div>
            <div class="box-body">
              <div class="cost-attachment">
                <div v-for="(file, i) in attachments" :key="file.file_id" class="cost-attachment-file">
                  <div class="file-icon">
                    <i class="mdi-set" :class="testFileType(file.file_name)"></i>
                  </div>
                  <div class="file-info">
                    <a href="javascript:;">{{ file.file_name }}</a>
                    <span>{{ file.file_size | calculateFileSize }}</span>
                  </div>
                  <div class="file-action" @click="deleteAttachment(i, file.file_id)">
                    <a href="javascript:;">
                      <i class="mdi-set mdi-close mr-5"></i>移除附件
                    </a>
                  </div>
                </div>
              </div>
              <a-form :form="detailForm">
                <a-row :gutter="24">
                  <a-col span="8">
                    <a-form-item label="需求名称">
                      <a-input v-decorator="[
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
                      ]" placeholder="请输入需求名称"></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col span="8">
                    <a-form-item label="预期起止日期">
                      <a-range-picker v-decorator="[
                        `time_range`,
                        {
                          initialValue: [],
                          rules: [{ type: 'array', required: true, message: '必填项' }]
                        }
                      ]" format="YYYY-MM-DD" style="width: 100%;"></a-range-picker>
                    </a-form-item>
                  </a-col>
                  <a-col span="8">
                    <a-form-item label="项目负责人">
                      <common-member-picker v-decorator="[
                        `pm_name`,
                        {
                          initialValue: '',
                          rules: [{ required: true, message: '必填项' }]
                        }
                      ]" placeholder="请输入英文名选择项目负责人" :only-input-one="true"></common-member-picker>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <a-col span="8">
                    <a-form-item label="验收人">
                      <common-member-picker v-decorator="[
                        `receiver_names`,
                        {
                          initialValue: '',
                          rules: [{ required: true, message: '必填项' }]
                        }
                      ]" placeholder="请输入英文名选择验收人"></common-member-picker>
                    </a-form-item>
                  </a-col>
                  <a-col span="8">
                    <a-form-item :colon="false">
                      <template #label>
                        <span>项目成员</span>
                        <a-tooltip placement="top" title="未配置默认采购员的类别，项目成员有采购下单的权限">
                          <a-icon type="info-circle" theme="filled"
                            style="vertical-align: middle;margin: 0 0 3px 3px;" />
                        </a-tooltip>
                      </template>
                      <common-member-picker v-decorator="[
                        `member_names`,
                        {
                          initialValue: ''
                        }
                      ]" placeholder="请输入英文名选择项目成员"></common-member-picker>
                    </a-form-item>
                  </a-col>
                  <a-col span="8">
                    <a-form-item label="预算使用年份">
                      <year-picker v-decorator="[
                        `year`,
                        {
                          valuePropName: 'defaultValue',
                          initialValue: '',
                          rules: [{ required: true, message: '必选项' }]
                        }
                      ]" :return-number="true"></year-picker>
                    </a-form-item>
                  </a-col>
                  <a-col span="8">
                    <a-form-item label="期望交付日期">
                      <a-date-picker v-decorator="[
                        `expect_date`,
                        {
                          rules: [{ required: true, message: '必选项' }]
                        }
                      ]" format="YYYY-MM-DD" placeholder="请选择日期" style="width: 100%;"></a-date-picker>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <a-col span="8">
                    <a-form-item label="具体需求描述">
                      <a-textarea v-decorator="[
                        `description`,
                        {
                          initialValue: '',
                          rules: [{ required: true, message: '必填项' }]
                        }
                      ]" :max-length="500" placeholder="请输入具体需求描述，字数少于500" rows="4"></a-textarea>
                    </a-form-item>
                  </a-col>
                  <a-col span="8">
                    <a-form-item label="交付物">
                      <a-textarea v-decorator="[
                        `output`,
                        {
                          initialValue: '',
                          rules: [{ required: true, message: '必填项' }]
                        }
                      ]" :max-length="500" placeholder="请输入交付资料验收清单/交付功能清单，字数少于500" rows="4"></a-textarea>
                    </a-form-item>
                  </a-col>
                  <a-col span="8">
                    <a-form-item label="验收标准">
                      <a-textarea v-decorator="[
                        `verify_standard`,
                        {
                          initialValue: '',
                          rules: [{ required: true, message: '必填项' }]
                        }
                      ]" :max-length="500" placeholder="请输入验收标准，字数少于500" rows="4"></a-textarea>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <a-col span="8">
                    <a-form-item label="项目背景及目的">
                      <a-textarea v-decorator="[
                        `background_desc`,
                        {
                          initialValue: '',
                          rules: [{ required: true, message: '必填项' }]
                        }
                      ]" :max-length="500" placeholder="请输入项目背景及目的，字数少于500" rows="4"></a-textarea>
                    </a-form-item>
                  </a-col>
                  <a-col span="8">
                    <a-form-item label="服务地点">
                      <a-textarea v-decorator="[
                        `service_location`,
                        {
                          initialValue: '',
                          rules: [{ required: true, message: '必填项' }]
                        }
                      ]" :max-length="500" placeholder="请输入服务地点，字数少于500" rows="4"></a-textarea>
                    </a-form-item>
                  </a-col>
                  <a-col span="8">
                    <a-form-item label="备注">
                      <a-textarea v-decorator="[
                        `memo`,
                        {
                          initialValue: '',
                          rules: [{ required: true, message: '必填项' }]
                        }
                      ]" :max-length="500" placeholder="1.请输入需求金额推导说明
2.其他备注信息
3.字数少于500
            " rows="4"></a-textarea>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="26">
                  <div v-if="verifyAllDone" class="leader">
                    <p class="title"><i class="iomc-required">*</i><span class="serial">1</span>需求审核人</p>
                    <p class="leader-name">{{ verifyAllRole }}</p>
                  </div>
                  <a-col v-if="verifyReviewerList.length > 0 && !verifyAllDone" span="5">
                    <a-form-item>
                      <span slot="label" class="label-title"><span class="serial">1</span>需求审核人(下拉选择)</span>
                      <a-select v-decorator="[
                        `verify_reviewers`,
                        {
                          rules: [{ required: true,message: '必选项'}]
                        }
                      ]" placeholder="请选择需求审核人" mode="multiple" :options="verifyReviewerList"
                        :disabled="verifyAllDone"></a-select>
                    </a-form-item>
                  </a-col>
                  <div v-if="approveAssRoleList.length<=0" class="leader">
                    <p class="title"><i class="iomc-required">*</i><span class="serial">2</span>直属leader</p>
                    <p class="leader-name">{{ leaderName }}</p>
                  </div>
                  <a-col v-else span="5">
                    <a-form-item>
                      <span slot="label" class="label-title"><span class="serial">2</span>指定审批人(下拉选择)</span>
                      <a-select v-decorator="[
                        `approve_ass_role`,
                        {
                          rules: [{ required: true,message: '必选项'}]
                        }
                      ]" placeholder="请选择指定审批人" mode="multiple" :options="approveAssRoleList"></a-select>
                    </a-form-item>
                  </a-col>
                  <a-col span="8">
                    <a-form-item class="relevant">
                      <span slot="label" class="label-title label-tip"><span class="serial">3</span>相关审批人:<p
                          class="red">非必填如需要,可填写1/2步审批人之外的其他人,手写输入</p></span>
                      <common-member-picker v-decorator="[
                        `relevant_reviewers`,
                        {
                          initialValue: '',
                          rules: [{ required: false}]
                        }
                      ]" placeholder="请输入相关审批人"></common-member-picker>
                    </a-form-item>
                  </a-col>
                  <a-col v-if="specialReviewerslist.length>0" span="5">
                    <a-form-item>
                      <span slot="label" class="label-title"><span class="serial">4</span>业务审批人(下拉选择)</span>
                      <a-select v-decorator="[
                        `special_reviewers`,
                        {
                          rules: [{ required: false}]
                        }
                      ]" placeholder="请选择业务审批人" mode="multiple" :options="specialReviewerslist"></a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                <div class="tips">
                  <a-tooltip placement="topLeft" trigger="click"
                    title="需求审核人 —> 直属leader/指定审批人 —> 相关审批人(若填写) —> 特殊审批人(GM,且金额>=50万)">
                    <a-button>查看审批流程</a-button>
                  </a-tooltip>
                </div>
                <div class="iomc-table iomc-table-default iomc-table-bordered">
                  <div class="iomc-table-content">
                    <div class="iomc-table-body">
                      <table>
                        <thead class="iomc-table-thead">
                          <tr>
                            <th width="80">#</th>
                            <th>资源类型</th>
                            <th width="314">金额(RMB元)</th>
                            <th>填写指引</th>
                          </tr>
                        </thead>
                        <tbody class="iomc-table-tbody">
                          <tr v-for="(item, index) in categoryTypes" :key="item.value">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.label }}</td>
                            <td>
                              <a-form-item class="form-item">
                                <a-input-number v-decorator="[
                                  `${item.value}`,
                                  {
                                    initialValue: 0,
                                    rules: [{ required: true, message: '必填项' }]
                                  }
                                ]" style="width: 100%;" :min="0"></a-input-number>
                              </a-form-item>
                            </td>
                            <td class="category-desc">{{ item.description }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </a-form>
            </div>
          </div>
        </div>
        <div class="col-right">
          <div class="omc-expense-applyinfo">
            <h4>{{ selectedProject.product_name }}</h4>
            <ul class="applyinfo-list">
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
                  <div class="item-label">所属成本中心代码：</div>
                  <div class="item-value">{{ selectedProject.cost_center_code }}</div>
                </div>
              </li>
            </ul>
            <ul class="applyinfo-list">
              <li>
                <div class="info-item">
                  <div class="item-label">申请人：</div>
                  <div class="item-value">{{ englishName }}</div>
                </div>
              </li>
              <li>
                <div class="info-item">
                  <div class="item-label">申请年份：</div>
                  <div class="item-value">{{ currentYear }}</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="budget-breakdown">
            <div class="breakdown-head">需求预估明细</div>
            <div class="breakdown-body">
              <ul class="breakdown-list">
                <li v-for="item in categoryTypes" :key="item.value">
                  <div class="breakdown-item">
                    <div class="item-label">{{ item.label }}</div>
                    <div class="item-value">{{ detailForm.getFieldValue(item.value) || 0 | formatNumber }}</div>
                  </div>
                </li>
              </ul>
              <div class="breakdown-summary">
                <span>预估总价（￥）</span>{{ sumAmount() | formatNumber }}
              </div>
            </div>
            <div class="breakdown-foot">
              <a href="javascript:;" @click="submit(2)">
                <a-spin v-if="clickType === 2 && saving">
                  <a-icon slot="indicator" type="loading" style="font-size: 16px; color: #fff;" spin />
                </a-spin>
                提交需求申请
              </a>
              <a href="javascript:;" class="action-default" @click="submit(1)">
                <a-spin v-if="clickType === 1 && saving">
                  <a-icon slot="indicator" type="loading" style="font-size: 16px; color: #fff;" spin />
                </a-spin>
                保存草稿
              </a>
            </div>
          </div>
          <contact-card></contact-card>
        </div>
      </div>
      <finish-page v-else :link-text="`${clickType === 1 ? '保存内容制作费(自行采购)需求单为草稿成功' : '提交内容制作费(自行采购)需求单成功'}`"
        :back-text="'返回需求管理首页'" :action-text="(clickType === 2) ? '需要撤销申请单请在工作台我的已办中操作' : ''" @finish="finish">
        <router-link v-if="clickType === 2" slot="actionFooter"
          :to="{ path: '/workbench/list', query: { status: 2, workType: 3 }}">跳转到工作台</router-link>
      </finish-page>
    </template>
  </div>
</template>
<script>
import moment from 'moment'
import { mapGetters, mapState } from 'vuex'
import Steps from '@/components/Steps/index'
import CommonMemberPicker from '@/components/Form/CommonMemberPicker'
import YearPicker from '@/components/YearPicker'
import UploadFile from '@/components/UploadFile/index'
import FinishPage from '@/components/FinishPage/index'
import ContactCard from '@/views/components/contact-card/index'
import { saveConsume, updateConsume } from '@/api/demand/index'
import { getEpoCntCategoryList } from '@/api/demand/content-epo'
import demandMixins from '../../mixins/index'
import { setClassWithFileType } from '@/utils/index'
import { getAllReviewerSettingList } from '@/api/workflow/index'
import { getUserOrgInfo } from '@/api/user/info'
export default {
  name: 'DemandApplyEpoCp',
  components: {
    Steps,
    CommonMemberPicker,
    UploadFile,
    YearPicker,
    FinishPage,
    ContactCard,
  },
  mixins: [demandMixins],
  data() {
    return {
      stepLists: ['内容制作费(自行采购)-需求申请', '完成申请'],
      currentStep: 0,
      categoryTypes: [],
      saving: false,
      clickType: 0, // 1-保存草稿、2-提交申请
      currentYear: new Date().getFullYear(),
      attachments: [],
      verifyReviewerList: [],
      approveAssRoleList: [],
      specialReviewerslist: [],
      leaderName: '',
      verifyAllDone: false,
      verifyAllRole: '',
    }
  },
  computed: {
    ...mapGetters(['detailForms']),
    ...mapState({
      selectedProject: (state) => state.demand.selectedProject,
      consumeDetail: (state) => state.demand.consumeDetail,
      englishName: (state) => state.user.englishName,
      isEdit: (state) => state.demand.isEdit,
    }),
  },
  beforeCreate() {
    this.detailForm = this.$form.createForm(this, { name: 'demand_cp_epo_form' })
  },
  created() {
    // 没有选择产品时跳转回列表页
    if (!this.selectedProject.product_code) {
      this.$router.push('/demand/apply')
      return
    }

    this.getCategoryType()
    if (this.consumeDetail.year) {
      this.currentYear = this.consumeDetail.year
    }
    this.getExamineApproveList()
  },
  mounted() {
    this.setFormData()
  },
  methods: {
    getExamineApproveList() {
      getAllReviewerSettingList(
        // 当前页码，页面条数，类型(研发1，内容制作费2，自采3)
        1,
        5,
        3,
        this.selectedProject.depart_id,
        this.selectedProject.product_code,
        { module: 'consume' }
      ).then((res) => {
        const targetData = res.content.list[0].reviewers
        for (const key in targetData) {
          if (targetData[key].setting.role_code === 'ConsumeCpEpoDesignateRole') {
            this.approveAssRoleList =
              targetData[key].user_names.length > 0
                ? targetData[key].user_names
                  .filter((item) => item !== this.englishName)
                  .map((item) => ({ label: item, value: item }))
                : []
          }
          if (targetData[key].setting.role_code === 'ConsumeCpEpoApproveRole') {
            this.specialReviewerslist =
              targetData[key].user_names.length > 0
                ? targetData[key].user_names
                  .filter((item) => item !== this.englishName)
                  .map((item) => ({ label: item, value: item }))
                : []
          }
          if (targetData[key].setting.role_code === 'ConsumeCpEpoVerifyRole') {
            this.verifyReviewerList =
              targetData[key].user_names.length > 0
                ? targetData[key].user_names
                  .filter((item) => item !== this.englishName)
                  .map((item) => ({ label: item, value: item }))
                : []
          }
          // 配置全审
          if (targetData[key].setting.role_code === 'ConsumeCpEpoVerifyAllDone') {
            this.verifyAllDone = targetData[key].checked === 2
          }
        }
        if (!this.approveAssRoleList.length > 0) {
          getUserOrgInfo(this.englishName).then((res) => {
            this.leaderName = res.data.leader_name
          })
        }
        this.$nextTick(() => {
          this.detailForm.setFieldsValue({
            approve_ass_role: this.consumeDetail.approve_ass_role
              ? this.consumeDetail.approve_ass_role.split(',')
              : undefined,
            special_reviewers: this.consumeDetail.special_reviewers
              ? this.consumeDetail.special_reviewers.split(',')
              : undefined,
          })
          if (!this.verifyAllDone) {
            this.detailForm.setFieldsValue({
              verify_reviewers: this.consumeDetail.verify_reviewers
                ? this.consumeDetail.verify_reviewers.split(',')
                : undefined,
            })
          } else {
            this.verifyAllRole = this.verifyReviewerList.map((item) => item.value).join(' ')
          }
        })
      })
    },
    setFormData() {
      if (this.isEdit) {
        this.$nextTick(() => {
          this.detailForm.setFieldsValue({
            name: this.consumeDetail.name,
            time_range: this.handleDateValue(),
            pm_name: this.consumeDetail.pm_name,
            receiver_names: this.consumeDetail.receiver_names,
            member_names: this.consumeDetail.member_names,
            year: this.consumeDetail.year,
            expect_date: this.consumeDetail.expect_date ? moment(this.consumeDetail.expect_date) : undefined,
            description: this.consumeDetail.description,
            output: this.consumeDetail.output,
            verify_standard: this.consumeDetail.verify_standard,
            background_desc: this.consumeDetail.background_desc,
            service_location: this.consumeDetail.service_location,
            memo: this.consumeDetail.memo,
            relevant_reviewers: this.consumeDetail.relevant_reviewers
              ? this.consumeDetail.relevant_reviewers
              : undefined,
          })

          // 设置文件列表
          this.attachments = this.consumeDetail.attachments.map((item) => ({
            file_id: item.id,
            file_size: item.size,
            file_name: item.name,
            file_url: item.url,
          }))
        })
      }
    },
    handleDateValue() {
      if (this.consumeDetail.begin_date && this.consumeDetail.end_date) {
        const startTime = moment(this.consumeDetail.begin_date)
        const endTime = moment(this.consumeDetail.end_date)
        return [startTime, endTime]
      }
      return []
    },
    getCategoryType() {
      getEpoCntCategoryList().then((res) => {
        if (res.content) {
          this.categoryTypes = res.content

          // 设置需求明细
          if (this.detailForms && this.detailForms.length > 0) {
            this.$nextTick(() => {
              const values = {}
              this.detailForms.forEach((item) => {
                values[item.type] = item.workload_amount || 0
              })
              this.detailForm.setFieldsValue(values)
            })
          }
        }
      })
    },
    uploadAttament(file) {
      const { id, name, file_size, url } = file
      this.attachments = [
        ...this.attachments,
        {
          file_id: id,
          file_name: name,
          file_size: file_size,
          file_url: url,
        },
      ]
    },
    deleteAttachment(index, id) {
      if (id !== undefined) {
        this.attachments.splice(index, 1)
        this.$message.success('删除附件成功！')
      } else {
        this.$message.error(`删除附件失败`)
      }
    },
    testFileType(name) {
      return setClassWithFileType(name)
    },
    sumAmount() {
      let count = 0
      this.categoryTypes.forEach((item) => {
        const val = this.detailForm.getFieldValue(item.value)
        if (val > 0) {
          count += val
        }
      })
      return count
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
      this.detailForm.validateFieldsAndScroll((error, val) => {
        if (error) {
          this.saving = false
          this.clickType = 0
          return
        }
        try {
          const formData = {
            id: this.consumeDetail.id, // 需求Id
            bill_no: this.consumeDetail.bill_no, // 单号
            product_code: this.selectedProject.product_code,
            product_name: this.selectedProject.product_name,
            type: 3, // 3-内容制作费自行采购
            attachments: this.attachments,
            name: val.name,
            pm_name: val.pm_name,
            receiver_names: val.receiver_names,
            member_names: val.member_names?.replace(/(;)/g, ','),
            begin_date: val.time_range[0] ? val.time_range[0].format('YYYY-MM-DD') : '',
            end_date: val.time_range[1] ? val.time_range[1].format('YYYY-MM-DD') : '',
            expect_date: val.expect_date ? val.expect_date.format('YYYY-MM-DD') : '',
            year: val.year,
            description: val.description,
            output: val.output,
            verify_standard: val.verify_standard,
            background_desc: val.background_desc,
            service_location: val.service_location,
            memo: val.memo,
            verify_reviewers:
              val.verify_reviewers && Array.isArray(val.verify_reviewers) ? val.verify_reviewers.join(',') : undefined,
            approve_ass_role:
              val.approve_ass_role && Array.isArray(val.approve_ass_role) ? val.approve_ass_role.join(',') : undefined,
            relevant_reviewers: val.relevant_reviewers ? val.relevant_reviewers.replace(/;/g, ',') : undefined,
            special_reviewers:
              val.special_reviewers && Array.isArray(val.special_reviewers)
                ? val.special_reviewers.join(',')
                : undefined,
            detail_items: this.categoryTypes
              .map((item) => ({
                type: 3, // 3-内容制作费自行采购
                year: val.year,
                epo_cnt: {
                  type: item.value,
                  type_name: item.label,
                  workload_amount: Number(val[item.value]),
                },
              }))
              .filter((type) => type.epo_cnt.workload_amount !== 0),
          }

          if (this.isEdit) {
            updateConsume(formData, type)
              .then((res) => {
                this.saving = false
                this.$message.success(type === 1 ? '保存成功' : '提交成功')
                this.resetDemandForm()
                this.currentStep = 1
              })
              .catch(() => {
                this.saving = false
                this.clickType = 0
              })
          } else {
            saveConsume(formData, type)
              .then((res) => {
                this.saving = false
                this.$message.success(type === 1 ? '保存成功' : '提交成功')
                this.resetDemandForm()
                this.currentStep = 1
              })
              .catch(() => {
                this.saving = false
                this.clickType = 0
              })
          }
        } catch (error) {
          this.saving = false
          this.$message.error(`提交失败: ${error}`)
        }
      })
    },
    resetDemandForm() {
      this.$store.dispatch('demand/resetDemandForm')
      this.attachments = []
      this.detailForm.resetFields()
    },
    finish() {
      this.clickType = 0
      this.$router.push('/demand/apply')
    },
  },
}
</script>
<style lang="less" scoped>
.iomc-table {
  background-color: #fff;

  th,
  td {
    padding: 10px 12px;
    font-size: 14px;
    line-height: 20px;

    &:first-child {
      text-align: center;
    }
  }

  th {
    color: #58666e;
    background-color: #f0f0f0;
    font-weight: bold;
  }

  td {
    color: #58666e;

    &:last-child {
      color: #000;
    }
  }

  .category-desc {
    text-align: center;
  }

  .form-item {
    margin-bottom: 0;
  }
}

.iomc-row {
  .hide {
    display: none;
  }
}

.tip-box {
  margin-bottom: 10px;
}

.tip-txt {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-top: 8px;
}

.iomc-btn {
  margin-bottom: 20px;
}

.leader {
  float: left;
  width: 20%;
  margin: 10px 12px 0 12px;

  P {
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 15px;
    line-height: 32px;
  }

  .leader-name {
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

  .title {
    i {
      color: #f5222d;
      margin-right: 5px;
      font-size: 13px;
      transform: rotate(-15deg);
      display: inline-block;
      font-family: cursive;
    }
  }
}

.serial {
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

.red {
  font-weight: 600;
  color: #f5222d;
  font-size: 12px;
}

.label-title {
  line-height: 52px;

  p {
    position: absolute;
    left: 0px;
    top: 18px;
    line-height: 20px;
  }
}

.label-tip {
  display: inline-block;
  width: 330px;
  text-align: left;
}
</style>
