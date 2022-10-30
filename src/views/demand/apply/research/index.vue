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
                  <upload-file :disabled="isConsumeModify" @on-success="uploadAttament">
                    <a slot="innerBox" href="javascript:;" class="head-actions-upload">
                      <i class="mdi-set mdi-publish mr-5"></i>上传附件
                    </a>
                  </upload-file>
                </a>
              </div>
            </div>
            <div class="box-body">
              <div class="cost-attachment">
                <div v-for="(file, i) in consumeDetail.attachments" :key="file.id" class="cost-attachment-file">
                  <div class="file-icon">
                    <i class="mdi-set" :class="testFileType(file.name)"></i>
                  </div>
                  <div class="file-info">
                    <a href="javascript:;">{{ file.name }}</a>
                    <span>{{ file.size | calculateFileSize }}</span>
                  </div>
                  <div class="file-action" @click="deleteAttachment(i, file.id)">
                    <a href="javascript:;">
                      <i class="mdi-set mdi-close mr-5"></i>移除附件
                    </a>
                  </div>
                </div>
              </div>
              <a-form :form="messageForm">
                <a-row :gutter="24">
                  <a-col span="12">
                    <a-form-item label="需求名称">
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
                        :disabled="isConsumeModify"
                      ></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col span="12">
                    <a-form-item label="预期开始和结束日期">
                      <a-range-picker
                        v-decorator="[
                          `time_range`,
                          {
                            initialValue: [],
                            rules: [{ type: 'array', required: true, message: '必填项' }]
                          }
                        ]"
                        format="YYYY-MM-DD"
                        style="width: 100%;"
                        :disabled="isConsumeModify"
                      ></a-range-picker>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <a-col span="8">
                    <a-form-item label="项目负责人">
                      <common-member-picker
                        v-decorator="[
                          `pm_name`,
                          {
                            initialValue: '',
                            rules: [{ required: true, message: '必填项' }]
                          }
                        ]"
                        placeholder="请输入英文名选择项目负责人"
                        :only-input-one="true"
                        :disabled="isConsumeModify"
                      ></common-member-picker>
                    </a-form-item>
                  </a-col>
                  <a-col span="8">
                    <a-form-item label="验收人">
                      <common-member-picker
                        v-decorator="[
                          `receiver_names`,
                          {
                            initialValue: '',
                            rules: [{ required: true, message: '必填项' }]
                          }
                        ]"
                        placeholder="请输入英文名选择验收人"
                        :disabled="isConsumeModify"
                      ></common-member-picker>
                    </a-form-item>
                  </a-col>
                  <a-col span="8">
                    <a-form-item :colon="false">
                      <template #label>
                        <span>项目成员</span>
                        <a-tooltip
                          placement="top"
                          title="未配置默认采购员的类别，项目成员有采购下单的权限"
                        >
                          <a-icon
                            type="info-circle"
                            theme="filled"
                            style="vertical-align: middle;margin: 0 0 3px 3px;"
                          />
                        </a-tooltip>
                      </template>
                      <common-member-picker
                        v-decorator="[
                          `member_names`,
                          {
                            initialValue: '',
                          }
                        ]"
                        placeholder="请输入英文名选择项目成员"
                        :disabled="isConsumeModify"
                      ></common-member-picker>
                    </a-form-item>
                  </a-col>
                  <a-col v-if="messageForm.getFieldValue('dev_category') === 1" span="8">
                    <a-form-item label="采购经理">
                      <a-select
                        v-decorator="[
                          `purchaser`,
                          {rules: [{ required: true, message: '必选项' }]}
                        ]"
                        placeholder="请选择采购经理"
                        mode="multiple"
                        :options="purchasers"
                        :disabled="isConsumeModify"
                      ></a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <a-col span="8">
                    <a-form-item label="具体需求描述">
                      <a-textarea
                        v-decorator="[
                          `description`,
                          {
                            initialValue: '',
                            rules: [{ required: true, message: '必填项' }]
                          }
                        ]"
                        :max-length="500"
                        placeholder="请输入具体需求描述，字数少于500"
                        rows="4"
                        :disabled="isConsumeModify"
                      ></a-textarea>
                    </a-form-item>
                  </a-col>
                  <a-col span="8">
                    <a-form-item label="交付物">
                      <a-textarea
                        v-decorator="[
                          `output`,
                          {
                            initialValue: '',
                            rules: [{ required: true, message: '必填项' }]
                          }
                        ]"
                        :max-length="500"
                        placeholder="请输入交付资料验收清单/交付功能清单，字数少于500"
                        rows="4"
                        :disabled="isConsumeModify"
                      ></a-textarea>
                    </a-form-item>
                  </a-col>
                  <a-col span="8">
                    <a-form-item label="验收标准">
                      <a-textarea
                        v-decorator="[
                          `verify_standard`,
                          {
                            initialValue: '',
                            rules: [{ required: true, message: '必填项' }]
                          }
                        ]"
                        :max-length="500"
                        placeholder="请输入验收标准，字数少于500"
                        rows="4"
                        :disabled="isConsumeModify"
                      ></a-textarea>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <a-col span="8">
                    <a-form-item label="项目背景及目的">
                      <a-textarea
                        v-decorator="[
                          `background_desc`,
                          {
                            initialValue: '',
                            rules: [{ required: true, message: '必填项' }]
                          }
                        ]"
                        :max-length="500"
                        placeholder="请输入项目背景及目的，字数少于500"
                        rows="4"
                        :disabled="isConsumeModify"
                      ></a-textarea>
                    </a-form-item>
                  </a-col>
                  <a-col span="8">
                    <a-form-item label="使用技术说明">
                      <a-textarea
                        v-decorator="[
                          `tech_desc`,
                          {
                            initialValue: '',
                            rules: [{ required: true, message: '必填项' }]
                          }
                        ]"
                        :max-length="500"
                        placeholder="请输入使用技术说明，字数少于500"
                        rows="4"
                        :disabled="isConsumeModify"
                      ></a-textarea>
                    </a-form-item>
                  </a-col>
                  <a-col span="8">
                    <a-form-item label="服务地点">
                      <a-textarea
                        v-decorator="[
                          `service_location`,
                          {
                            initialValue: '',
                            rules: [{ required: true, message: '必填项' }]
                          }
                        ]"
                        :max-length="100"
                        placeholder="请输入服务地点，字数少于100"
                        rows="4"
                        :disabled="isConsumeModify"
                      ></a-textarea>
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 是否关联项目 -->
                <a-row :gutter="24">
                  <a-col span="8">
                    <a-form-item label="是否关联预算编制项目">
                      <a-select
                        v-decorator="[
                          `is_related_project`,
                          {rules: [{ required: true, message: '必选项' }]}
                        ]"
                        placeholder="选择是否关联预算编制项目"
                        @change="getRelationData"
                      >
                        <a-select-option value="0">否</a-select-option>
                        <a-select-option value="1">是</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col v-if="verifyRelationData" span="16">
                    <a-form-item label="关联预算编制项目">
                      <a-select
                        v-decorator="[
                          `related_project`,
                          {rules: [{ required: true, message: '必选项' }]}
                        ]"
                        placeholder="选择关联预算编制项目"
                        :options="selectProjectOption"
                        @change="selectRelationData"
                      >
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                <div v-if="verifyRelationData && verifyReationTable" class="relation-project-table">
                  <table>
                    <thead class="iomc-table-thead">
                      <tr>
                        <th>编制项目名称</th>
                        <th>COA</th>
                        <th>部门</th>
                        <th>编制项目简介</th>
                        <th>金额</th>
                      </tr>
                    </thead>
                    <tbody class="iomc-table-tbody">
                      <tr>
                        <td>{{ selectedRelationData.related_project.name }}</td>
                        <td>{{ selectedRelationData.related_project.code }}</td>
                        <td>{{ selectedRelationData.related_project.dept_name }}</td>
                        <td>{{ selectedRelationData.related_project.intro }}</td>
                        <td>{{ selectedRelationData.related_project.amount }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <a-form-item label="研发类别">
                  <a-radio-group
                    v-decorator="[
                      `dev_category`,
                      {
                        initialValue: [],
                        rules: [{ required: true, message: '必选项' }]
                      }
                    ]"
                    :options="rdTypes"
                    :disabled="isEdit || isConsumeModify"
                    @change="onRdTypeChange"
                  />
                </a-form-item>
                <div v-if="currentRdTypeTipImg" class="rd-types-tip">
                  <div class="des">
                    {{ currentRdTypeTipDes }}
                  </div>
                  <div class="img">
                    <span>使用指引：</span>
                    <image-preview :url="currentRdTypeTipImg" :show-download="false" />
                  </div>
                </div>
                <div v-if="checkIsOuter()" class="apply_list">
                  <a-form-item label="经办人">
                    <a-select
                      v-decorator="[
                        `apply_for`,
                        {
                          rules: [{ required: true, message: '必选项' }]
                        }
                      ]"
                      placeholder="经办人"
                      style="width: 386px"
                      :options="handleList"
                      :disabled="isConsumeModify"
                      show-search
                      @select="getUserInfo"
                    ></a-select>
                    <span class="tip text-warning">(经办人为实际需求人，需要在供应商提交验收单后，对订单验收和评估)</span>
                  </a-form-item>
                </div>
                <a-row :gutter="26" class="iomc-required_contain">
                  <div v-if="verifyAllDone" class="leader">
                    <p class="title"><i class="iomc-required">*</i><span class="serial">1</span>需求审核人</p>
                    <p class="leader-name">{{ verifyAllRole }}</p>
                  </div>
                  <a-col v-if="verifyReviewerList.length > 0 && !verifyAllDone" span="5">
                    <a-form-item>
                      <span slot="label" class="label-title"><span class="serial">1</span>需求审核人(下拉选择)</span>
                      <a-select
                        v-decorator="[
                          `verify_reviewers`,
                          {
                            rules: [{ required: true,message: '必选项'}]
                          }
                        ]"
                        placeholder="请选择需求审核人"
                        mode="multiple"
                        :options="verifyReviewerList"
                        :disabled="verifyAllDone"
                      ></a-select>
                    </a-form-item>
                  </a-col>
                  <div v-if="approveAssRoleList.length<=0" class="leader">
                    <p class="title"><i class="iomc-required">*</i><span class="serial">2</span>直属leader</p>
                    <p class="leader-name">{{ leaderName }}</p>
                  </div>
                  <a-col v-else span="5">
                    <a-form-item>
                      <span slot="label" class="label-title"><span class="serial">2</span>指定审批人(下拉选择)</span>
                      <a-select
                        v-decorator="[
                          `approve_ass_role`,
                          {
                            rules: [{ required: true,message: '必选项'}]
                          }
                        ]"
                        placeholder="请选择指定审批人"
                        mode="multiple"
                        :options="approveAssRoleList"
                      ></a-select>
                    </a-form-item>
                  </a-col>
                  <a-col span="8">
                    <a-form-item class="relevant">
                      <span slot="label" class="label-title label-tip"><span class="serial">3</span>相关审批人:<p class="red">非必填如需要,可填写1/2步审批人之外的其他人,手写输入</p></span>
                      <common-member-picker
                        v-decorator="[
                          `relevant_reviewers`,
                          {
                            initialValue: '',
                            rules: [{ required: false}]
                          }
                        ]"
                        placeholder="请输入相关审批人"
                        :disabled="isConsumeModify"
                      ></common-member-picker>
                    </a-form-item>
                  </a-col>
                  <a-col v-if="specialReviewerslist.length>0" span="5">
                    <a-form-item>
                      <span slot="label" class="label-title"><span class="serial">4</span>业务审批人(下拉选择)</span>
                      <a-select
                        v-decorator="[
                          `special_reviewers`,
                          {
                            rules: [{ required: false}]
                          }
                        ]"
                        placeholder="请选择业务审批人"
                        mode="multiple"
                        :options="specialReviewerslist"
                      ></a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
              <div class="tips">
                <a-tooltip placement="topLeft" trigger="click" title="需求审核人 —> 直属leader/指定审批人 —> 相关审批人(若填写) —> 特殊审批人(GM,且金额>=50万)">
                  <a-button>查看审批流程</a-button>
                </a-tooltip>
              </div>
            </div>
          </div>
          <a-form :form="detailForm">
            <div
              v-for="(item, index) in detailForms"
              :key="item.uid"
              class="omc-expense-box"
              :class="{'body-toggle': !item.open}"
            >
              <div class="box-head">
                <div class="head-title">申请明细&nbsp;{{ index + 1 }}</div>
                <div class="head-actions">
                  <a href="javascript:;" @click.stop="deleteDetail(index)">
                    <i class="mdi-set mdi-trash-can-outline mr-5"></i>移除
                  </a>
                  <a
                    href="javascript:;"
                    :class="['js-arrow', {'active': !item.open}]"
                    @click.stop="troggleDetail(index, item.open)"
                  >
                    <i class="mdi-set mdi-chevron-down-circle"></i>
                  </a>
                </div>
              </div>
              <div class="box-body">
                <apply-form
                  ref="detailForm"
                  :form="detailForm"
                  :form-item="item"
                  :form-index="index"
                  :category-types="categoryTypes"
                  :group-selected-category-type="groupSelectedCategoryType"
                  :is-consume-modify="isConsumeModify"
                ></apply-form>
              </div>
            </div>
          </a-form>
          <div class="omc-expense-add">
            <div class="budget-add-action-inner" @click="addDetail">
              <span class="add-icon">
                <i class="mdi-set mdi-plus"></i>
              </span>
              <span class="add-title">新增申请明细</span>
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
                  <div
                    class="item-value"
                  >{{ selectedProject.product_code }}</div>
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
            <!-- <ul class="applyinfo-list">
              <li>
                <div class="info-item">
                  <div class="item-label">研发费预算：</div>
                  <div class="item-value">{{ selectedConsumeStat.total_budget | formatNumber }}</div>
                </div>
              </li>
              <li>
                <div class="info-item">
                  <div class="item-label">可用预算：</div>
                  <div class="item-value">{{ selectedConsumeStat.left_budget | formatNumber }}</div>
                </div>
              </li>
            </ul> -->
          </div>
          <div class="budget-breakdown">
            <div class="breakdown-head">需求预估明细</div>
            <div class="breakdown-body">
              <ul class="breakdown-list">
                <li v-for="(list, index) in groupByDetailType(detailForms)" :key="index">
                  <div class="breakdown-item">
                    <div class="item-label">{{ list.quantity | formatNumber }} × {{ getSelectedCategoryType(list.type, list.typeName) }}</div>
                    <div class="item-value">{{ list.amount | formatNumber }}</div>
                  </div>
                </li>
              </ul>
              <div class="breakdown-summary">
                <span>预估总价（￥）</span>{{ sumAmount(detailForms) | formatNumber }}
              </div>
            </div>
            <div class="breakdown-foot">
              <a v-if="isConsumeModify" href="javascript:;" @click="submit(3)">
                <a-spin v-if="clickType === 3 && saving">
                  <a-icon slot="indicator" type="loading" style="font-size: 16px; color: #fff;" spin />
                </a-spin>
                提交需求修改
              </a>
              <a v-if="!isConsumeModify" href="javascript:;" @click="submit(2)">
                <a-spin v-if="clickType === 2 && saving">
                  <a-icon slot="indicator" type="loading" style="font-size: 16px; color: #fff;" spin />
                </a-spin>
                提交需求申请
              </a>
              <a v-if="!isConsumeModify" href="javascript:;" class="action-default" @click="submit(1)">
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
      <finish-page
        v-else
        :link-text="`${clickType === 1 ? '保存研发费需求单为草稿成功' : '提交研发费需求单成功'}`"
        :back-text="'返回需求管理首页'"
        :action-text="(clickType === 2 || clickType === 3) ? '需要撤销申请单请在工作台我的已办中操作' : ''"
        @finish="finish"
      >
        <router-link
          v-if="clickType === 2 || clickType === 3"
          slot="actionFooter"
          :to="{ path: '/workbench/list', query: { status: 2, workType: 1 }}"
        >跳转到工作台</router-link>
      </finish-page>
    </template>
  </div>
</template>
<script>
import moment from 'moment'
import { mapGetters, mapState } from 'vuex'
import Steps from '@/components/Steps/index'
import CommonMemberPicker from '@/components/Form/CommonMemberPicker'
import UploadFile from '@/components/UploadFile/index'
import FinishPage from '@/components/FinishPage/index'
import ImagePreview from '@/components/ImagePreview/index'
import ContactCard from '@/views/components/contact-card/index'
import ApplyForm from './form/field'
import { saveConsume, updateConsume } from '@/api/demand/index'
import { getConsumePurchasers, getDevCategoryParentList, getRdCategoryType, getDevBudgetProject } from '@/api/demand/research'
import { getAllReviewerSettingList } from '@/api/workflow/index'
import { setClassWithFileType } from '@/utils/index'
import { createUuid } from '@/utils/uuid'
import { handleFormValues } from '@/utils/form'
import { detailModel } from './form/model'
import demandMixins from '../../mixins/index'
import { omit } from 'lodash/object'
import { parseStringToJson } from '@/utils/index'
import { getUserOrgInfo } from '@/api/user/info'
export default {
  name: 'DemandApplyRd',
  components: {
    Steps,
    CommonMemberPicker,
    UploadFile,
    FinishPage,
    ImagePreview,
    ContactCard,
    ApplyForm
  },
  mixins: [demandMixins],
  data() {
    return {
      stepLists: ['研发费-需求申请', '完成申请'],
      currentStep: 0,
      categoryTypes: [],
      saving: false,
      clickType: 0, // 1-保存草稿、2-提交申请、3-提交修改
      selectedCategoryTypes: [],
      currentYear: new Date().getFullYear(),
      purchasers: [],
      rdTypes: [],
      currentRdTypeTipImg: '',
      currentRdTypeTipDes: '',
      relationTableData: [],
      selectedRelationData: {
        is_related_project: '0',
        related_project: {}
      },
      verifyRelationData: false,
      verifyReationTable: false,
      selectProjectOption: [],
      verifyReviewerList: [],
      approveAssRoleList: [],
      specialReviewerslist: [],
      handleList: [],
      leaderName: '',
      verifyAllDone: false,
      verifyAllRole: ''
    }
  },
  computed: {
    ...mapGetters(['detailForms']),
    ...mapState({
      selectedProject: state => state.demand.selectedProject,
      selectedConsumeStat: state => state.demand.selectedConsumeStat,
      consumeDetail: state => state.demand.consumeDetail,
      englishName: state => state.user.englishName,
      isEdit: state => state.demand.isEdit,
      isConsumeModify: state => state.demand.isConsumeModify
    })
  },
  beforeCreate() {
    this.messageForm = this.$form.createForm(this, { name: 'demand_form' })
    this.detailForm = this.$form.createForm(this, {
      name: 'detail_form',
      onFieldsChange: (_, changeFiled) => {
        this.$emit('change', changeFiled)
      },
      onValuesChange: (_, values) => {
        const results = handleFormValues(values)
        results.forEach(result => {
          this.$store.dispatch('demand/setDemandFormItem', {
            index: result.centerId,
            formName: result.formName,
            formValue: result.formValue
          })
        })
      }
    })
  },
  created() {
    // 没有选择产品时跳转回列表页
    if (!this.selectedProject.product_code) {
      this.$router.push('/demand/apply')
    }
    // 获取研发费大类
    this.getCategoryParentType()

    // 获取采购经理名单
    this.getPurchaser()
    if (this.consumeDetail.year) {
      this.currentYear = this.consumeDetail.year
    }
    // 获取关联项目
    this.getRelationSelectData()
    // 获取所有业务，需求，指定审批人，经办人
    this.getExamineApproveList()
  },
  mounted() {
    this.setConsumeMessage()
  },
  methods: {
    getUserInfo(val) {
      if (this.approveAssRoleList.length <= 0) {
        getUserOrgInfo(val).then(res => { this.leaderName = res.data.leader_name })
      }
    },
    // 获取关联项目的数据
    getRelationSelectData() {
      if (this.selectedProject.depart_id !== '' && this.selectedProject.depart_id !== undefined) {
        getDevBudgetProject(this.selectedProject.depart_id).then(res => {
          this.relationTableData = res.content
          this.selectProjectOption = res.content.map(item => ({
            label: item.name,
            value: item.id
          }))
        }).catch(err => {
          console.log(err)
        })
      }
    },
    getRelationData(val) {
      // 0 不关联项目 1关联项目
      this.selectedRelationData.is_related_project = val
      if (val === '0') {
        this.verifyRelationData = false
        this.verifyReationTable = false
      } else {
        this.verifyRelationData = true
      }
    },
    selectRelationData(val) {
      const targetData = this.relationTableData.find(item => item.id === val)
      if (targetData) {
        this.selectedRelationData.related_project = targetData
        this.selectedRelationData.is_related_project = '1'
        this.verifyReationTable = true
      }
    },
    getExamineApproveList() {
      getAllReviewerSettingList(
        1,
        5,
        1,
        this.selectedProject.depart_id,
        this.selectedProject.product_code,
        { module: 'consume' }
      ).then(res => {
        const targetData = res.content.list[0].reviewers
        for (const key in targetData) {
          if (targetData[key].setting.role_code === 'ConsumeRdDesignateRole') {
            this.approveAssRoleList = targetData[key].user_names.length > 0 ? targetData[key].user_names.filter(item => (item !== this.englishName)).map(item => ({ label: item, value: item })) : []
          }
          if (targetData[key].setting.role_code === 'ConsumeRdApproveRole') {
            this.specialReviewerslist = targetData[key].user_names.length > 0 ? targetData[key].user_names.filter(item => (item !== this.englishName)).map(item => ({ label: item, value: item })) : []
          }
          if (targetData[key].setting.role_code === 'ConsumeRdApplyRole') {
            this.handleList = targetData[key].user_names.length > 0 ? targetData[key].user_names.map(item => ({ label: item, value: item })) : []
          }
          if (targetData[key].setting.role_code === 'ConsumeRdVerifyRole') {
            this.verifyReviewerList = targetData[key].user_names.length > 0 ? targetData[key].user_names.filter(item => (item !== this.englishName)).map(item => ({ label: item, value: item })) : []
          }
          // 配置全审
          if (targetData[key].setting.role_code === 'ConsumeRdVerifyAllDone') {
            this.verifyAllDone = targetData[key].checked === 2
          }
        }
        if (!this.approveAssRoleList.length > 0 && this.englishName !== '') {
          const userName = this.messageForm.getFieldValue('apply_for') ? this.messageForm.getFieldValue('apply_for') : this.englishName
          getUserOrgInfo(userName).then(res => { this.leaderName = res.data.leader_name })
        }
        this.$nextTick(() => {
          this.messageForm.setFieldsValue({
            'approve_ass_role': this.consumeDetail.approve_ass_role ? this.consumeDetail.approve_ass_role.split(',') : undefined,
            'special_reviewers': this.consumeDetail.special_reviewers ? this.consumeDetail.special_reviewers.split(',') : undefined
          })
          if (!this.verifyAllDone) {
            this.messageForm.setFieldsValue({
              'verify_reviewers': this.consumeDetail.verify_reviewers ? this.consumeDetail.verify_reviewers.split(',') : undefined
            })
          } else {
            this.verifyAllRole = this.verifyReviewerList.map(item => item.value).join(' ')
          }
        })
      })
    },
    checkIsOuter() {
      return this.englishName.startsWith('v_') // 是否是外包人员
    },
    setConsumeMessage() {
      let relationData = {}
      if (this.consumeDetail.memo !== undefined && this.consumeDetail.memo !== '') {
        relationData = parseStringToJson(this.consumeDetail.memo, { 'is_related_project': '0', 'related_project': {}})
      }
      this.$nextTick(() => {
        this.messageForm.setFieldsValue({
          'name': this.consumeDetail.name,
          'description': this.consumeDetail.description,
          'pm_name': this.consumeDetail.pm_name,
          'receiver_names': this.consumeDetail.receiver_names,
          'member_names': this.consumeDetail.member_names,
          'time_range': this.handleDateValue(),
          'output': this.consumeDetail.output,
          'verify_standard': this.consumeDetail.verify_standard,
          'background_desc': this.consumeDetail.background_desc,
          'tech_desc': this.consumeDetail.tech_desc,
          'service_location': this.consumeDetail.service_location,
          'dev_category': this.consumeDetail.dev_category,
          'is_related_project': relationData.is_related_project,
          'relevant_reviewers': this.consumeDetail.relevant_reviewers ? this.consumeDetail.relevant_reviewers : undefined
        })

        // 确认关联才设置关联项目
        if (relationData.is_related_project === '1') {
          this.verifyRelationData = true
          this.verifyReationTable = true
          this.$nextTick(() => {
            this.messageForm.setFieldsValue({
              'related_project': relationData.related_project.id
            })
            this.selectedRelationData.related_project = relationData.related_project
          })
        }
        // 经办人
        if (this.checkIsOuter() && this.consumeDetail.apply_for !== '') {
          this.messageForm.setFieldsValue({
            'apply_for': Array.isArray(this.consumeDetail.apply_for) ? this.consumeDetail.apply_for.split(',') : this.consumeDetail.apply_for
          })
        }

        // 研发类别为外包开发及测试才需要设置采购经理字段
        if (this.consumeDetail.dev_category === 1) {
          this.$nextTick(() => {
            this.messageForm.setFieldsValue({
              'purchaser': this.consumeDetail.purchaser
            })
          })
        }
        // 编辑时获取研发费类别
        if (this.isEdit || this.isConsumeModify) {
          this.getCategoryType(this.consumeDetail.dev_category)
        }
      })
    },
    handleDateValue() {
      if (this.consumeDetail.begin_date && this.consumeDetail.end_date) {
        const startTime = moment(this.consumeDetail.begin_date)
        const endTime = moment(this.consumeDetail.end_date)
        return [startTime, endTime]
      }
      return []
    },
    getCategoryType(parentId) {
      getRdCategoryType(parentId).then(res => {
        const { items } = res.content
        this.categoryTypes = items
      })
    },
    getCategoryParentType() {
      getDevCategoryParentList().then(res => {
        if (res.content) {
          this.rdTypes = res.content.map(item => ({
            label: item.name,
            value: item.id,
            img: item.flow_img,
            des: item.description
          }))
          if (this.isEdit || this.isConsumeModify) {
            const targetVal = res.content.find(item => item.id === this.consumeDetail.dev_category)
            if (targetVal) {
              this.currentRdTypeTipImg = targetVal.flow_img
              this.currentRdTypeTipDes = targetVal.description
            }
          }
        }
      })
    },
    getPurchaser() {
      getConsumePurchasers().then(res => {
        if (res.content && Array.isArray(res.content)) {
          this.purchasers = res.content.map(item => ({
            label: item,
            value: item
          }))
        }
      })
    },
    uploadAttament(file) {
      const { id, name, file_size, url } = file
      this.$store.dispatch('demand/addAttachment', {
        data: { id: id, name: name, size: file_size, url: url }
      })
    },
    deleteAttachment(i, id) {
      if (id !== undefined) {
        this.$store.dispatch('demand/delAttachment', i).then(res => {
          this.$message.success('删除附件成功！')
        }).catch(err => {
          this.$message.error(`删除附件失败: ${err}`)
        })
      }
    },
    testFileType(name) {
      return setClassWithFileType(name)
    },
    addDetail() {
      this.$store.dispatch('demand/addDetail', Object.assign({}, detailModel, { uid: createUuid() }))
    },
    groupSelectedCategoryType(type, value) {
      const selectedCategory = this.selectedCategoryTypes.findIndex(category => category.type === type)
      if (selectedCategory < 0) {
        this.selectedCategoryTypes.push({
          type,
          value
        })
      }
    },
    getSelectedCategoryType(type, typeName) {
      if (!type) {
        return ''
      }
      const selectedCategory = this.selectedCategoryTypes.find(category => category.type === type)
      if (selectedCategory) {
        return selectedCategory.value
      }
      if (typeName) {
        return typeName
      }
      return ''
    },
    async deleteDetail(index) {
      const deleteModal = this.$confirm({
        title: '删除申请明细',
        content: `确定要删除申请明细${index + 1}吗？`,
        onOk: async() => {
          deleteModal.update({ okButtonProps: { props: { loading: true }}})
          return new Promise((resolve, reject) => {
            setTimeout(async() => {
              await this.$store.dispatch('demand/deleteDetail', index)
              await this.setApplyForms()
              deleteModal.update({ okButtonProps: { props: { loading: false }}})
              resolve()
            }, 500)
          })
        }
      })
    },
    async setApplyForms() {
      const applyForms = this.$refs.detailForm
      if (Array.isArray(applyForms) && applyForms.length > 0) {
        for (const item of applyForms) {
          await item.setDetailForm()
        }
      }
    },
    troggleDetail(index, status) {
      this.$store.dispatch('demand/setDemandFormItem', {
        index,
        formName: 'open',
        formValue: !status
      })
    },
    handleDetailForms(form) {
      return form.map(item => {
        const detail = omit(item, ['uid', 'open', 'year'])
        return {
          type: 2, // 2-研发费
          year: item.year,
          dev: Object.assign({}, detail, {
            type: detail.type.replace(/\//g, ','),
            complete_date: detail.complete_date.format('YYYY-MM-DD')
          })
        }
      })
    },
    onRdTypeChange(val) {
      const targetVal = this.rdTypes.find(item => item.value === val.target.value)
      if (targetVal) {
        this.currentRdTypeTipImg = targetVal.img
        this.currentRdTypeTipDes = targetVal.des
        this.getCategoryType(targetVal.value)
        this.$store.dispatch('demand/resetDetail')
      }
    },
    // 保存和提交需求，type-1保存为草稿，2-提交需求，3-提交修改
    submit(type) {
      const totalPrice = this.sumAmount(this.detailForms)
      // if (totalPrice > this.selectedConsumeStat.left_budget) {
      //   return this.$message.info('预估总价大于可用预算，不能提交或保存！')
      // }
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
        if (!this.detailForms.length) {
          this.saving = false
          this.clickType = 0
          this.$message.info('请先新增需求明细再提交需求申请！')
          return
        }
        this.detailForm.validateFieldsAndScroll((error, values) => {
          if (error) {
            this.saving = false
            this.clickType = 0
            return
          }
          if (totalPrice === 0) {
            this.saving = false
            this.clickType = 0
            return this.$message.info('预估总价为0，不能提交或者保存！')
          }
          const targetDevCategory = this.rdTypes.find(item => item.value === val.dev_category)
          try {
            const formData = {
              ...omit(val, ['time_range', 'is_related_project', 'related_project']),
              id: this.consumeDetail.id, // 需求Id
              bill_no: this.consumeDetail.bill_no, // 单号
              attachments: this.consumeDetail.attachments ? this.consumeDetail.attachments.map(item => {
                return {
                  file_id: item.id,
                  file_size: item.size,
                  file_name: item.name,
                  file_url: item.url
                }
              }) : [],
              detail_items: this.handleDetailForms(this.detailForms),
              product_code: this.selectedProject.product_code,
              product_name: this.selectedProject.product_name,
              type: 2, // 2-研发费
              receiver_names: val.receiver_names.replace(/(;)/g, ','),
              member_names: val.member_names?.replace(/(;)/g, ','),
              purchaser: val.purchaser ? val.purchaser.join(',') : undefined,
              begin_date: val.time_range[0] ? val.time_range[0].format('YYYY-MM-DD') : '',
              end_date: val.time_range[1] ? val.time_range[1].format('YYYY-MM-DD') : '',
              year: this.currentYear,
              category_name: targetDevCategory ? targetDevCategory.label : undefined,
              memo: JSON.stringify(this.selectedRelationData),
              verify_reviewers: val.verify_reviewers && Array.isArray(val.verify_reviewers) ? val.verify_reviewers.join(',') : undefined,
              approve_ass_role: val.approve_ass_role && Array.isArray(val.approve_ass_role) ? val.approve_ass_role.join(',') : undefined,
              relevant_reviewers: val.relevant_reviewers ? val.relevant_reviewers.replace(/;/g, ',') : undefined,
              special_reviewers: val.special_reviewers && Array.isArray(val.special_reviewers) ? val.special_reviewers.join(',') : undefined,
              apply_for: val.apply_for ? val.apply_for : undefined
            }
            if (!this.testingApplyForMap(formData)) {
              this.saving = false
              this.clickType = 0
              return
            }

            if (this.isEdit) {
              updateConsume(formData, type).then(res => {
                this.saving = false
                this.$message.success(type === 1 ? '保存成功' : '提交成功')
                this.resetDemandForm()
                this.currentStep = 1
              }).catch(() => {
                this.saving = false
                this.clickType = 0
              })
            } else {
              saveConsume(formData, type).then(res => {
                this.saving = false
                this.$message.success(type === 1 ? '保存成功' : '提交成功')
                this.resetDemandForm()
                this.currentStep = 1
              }).catch(() => {
                this.saving = false
                this.clickType = 0
              })
            }
          } catch (error) {
            this.saving = false
            this.$message.error(`提交失败：${error}`)
          }
        })
      })
    },
    resetDemandForm() {
      this.$store.dispatch('demand/resetDemandForm')
      this.messageForm.resetFields()
      this.detailForm.resetFields()
    },
    finish() {
      this.clickType = 0
      this.$router.push('/demand/apply')
    },
    testingApplyForMap(data) {
      if (!data.apply_for) return true
      const testStr = data.apply_for
      data.approve_ass_role = data.approve_ass_role === undefined ? '' : data.approve_ass_role
      data.verify_reviewers = data.verify_reviewers === undefined ? '' : data.verify_reviewers
      if (data.approve_ass_role !== '') {
        if (data.approve_ass_role.includes(testStr) || data.verify_reviewers.includes(testStr)) {
          this.saving = false
          this.$message.info('需求经办人与需求审核人/审批人不可为同一人，请修改')
          return false
        }
      } else {
        if (data.verify_reviewers.includes(testStr) || this.leaderName.includes(testStr)) {
          this.saving = false
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
.budget-add-action-inner {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
  cursor: pointer;
}
.iomc-row{
  .hide{
        display: none;
  }
}
.rd-types-tip {
  margin-bottom: 10px;
  margin-top: -10px;
  .des {
    margin-bottom: 8px;
  }
  .des, .img {
    font-size: 12px;
    color: #8f93a1;
  }
  img {
    height: 60%;
    width: 60%;
  }

}
.relation-project-table{
  table{
    width: 100%;
  }
   margin-bottom: 16px;
   position: relative;
   .iomc-table-thead,.iomc-table-tbody{
     tr{
        border-top:1px solid #e8e8e8;
        border-left:1px solid #e8e8e8;
        border-right: 1px solid #e8e8e8;
        td{
          padding: 12px 16px;
        }
     }
   }
}
.relation_select{
    display: inline-block;
    width: 60px;
    position: absolute;
    top: 54px;
    left: 20px;
   .iomc-radio-wrapper{
     display: block;
     line-height: 46px;
   }
}
.apply-by-list{
  margin-bottom: 12px;
}
.text-warning{
  margin-left: 10px;
}
.tip-txt{
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-top: 8px;
}
.apply-by-list{
  margin-bottom: 12px;
}
.text-warning{
  margin-left: 10px;
}
.leader{
  float: left;
  width: 20%;
  margin: 10px 12px 0 12px;
  P{
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 15px;
    line-height: 32px;
  }
  .leader-name{
    font-size: 14px;
    line-height: 28px;
    margin: 0 auto;
    border: 1px solid #e8e8e8;
    background-color: #fafafa;
    text-align: left;
    padding-left: 10px;
    line-height: 28px;
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
.label-title{
  line-height: 52px;
  p{
    position: absolute;
    left: 0px;
    top: 18px;
    line-height: 20px;
  }
}
.label-tip{
    display: inline-block;
    width: 330px;
    text-align: left;
}
</style>
