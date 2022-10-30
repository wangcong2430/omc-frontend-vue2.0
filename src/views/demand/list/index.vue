<template>
  <div>
    <div class="subpage">
      <div class="subpage-sidebar sidebar-lg">
        <div class="side-section">
          <div class="side-body">
            <div class="omc-project-masthead">
              <div class="masthead-head">
                <div class="col-left">
                  <h2>{{ selectedProject.product_name }}</h2>
                </div>
                <div class="col-right">
                  <a href="javascript:;" class="btn-light" @click="troggleProjectList(true)">
                    切换项目<i class="mdi-set mdi-chevron-right"></i>
                  </a>
                </div>
              </div>
              <div class="masthead-body">
                <ul class="infoset-default">
                  <li>
                    <div class="info-item">
                      <div class="item-label">COA产品代码：</div>
                      <div class="item-value">
                        {{ selectedProject.product_code }}
                      </div>
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
              </div>
            </div>
            <div class="omc-filter-roughly">
              <div class="ant-select ant-select-enabled" style="width: 150px;">
                <year-picker :default-value="demandYear" @change="onDemandYearChange"></year-picker>
              </div>
            </div>
            <ul class="omc-expense-roughly">
              <li v-for="item in consumeStat" :key="item.type" @click="onBudgetTypeChange(item)">
                <a href="javascript:;" class="expense-item" :class="{'active': item.type === currentBudgetType}">
                  <div class="item-head">
                    <div class="col-left">{{ item.type === 1 ? '内容制作费' : '研发费' }}</div>
                    <div class="col-right">
                      <i class="mdi-set mdi-chevron-double-right"></i>
                    </div>
                  </div>
                  <div class="item-body">
                    <ul class="expense-list">
                      <li><span>预算金额</span>{{ item.total_budget | formatNumber(false, 2) }}</li>
                      <li><span>{{ item.type === 1 ? '已使用' : '已立项金额' }}</span>{{ item.consumed_budget | formatNumber(false, 2) }}</li>
                      <li><span>可用余额</span>{{ item.left_budget | formatNumber(false, 2) }}</li>
                      <li v-if="item.type === 2"><span>已下单金额</span>{{ item.order_budget | formatNumber(false, 2) }}</li>
                    </ul>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="subpage-content">
        <div class="omc-table">
          <div class="omc-table-toolbar">
            <div class="col-left">
              <h2 class="table-title">{{ demandYear ? `${demandYear}年 - ` : '' }}{{ currentBudgetType === 1 ? '内容制作费' : '研发费' }} - 需求列表</h2>
              <a
                v-if="currentBudgetType === 1 && activedTabKey === '2' || currentBudgetType === 2"
                class="epo-link"
                href="https://tp.woa.com/main/#/po/search"
                target="_blank"
              >订单查询<i class="mdi-set mdi-arrow-top-right"></i></a>
              <a
                v-if="currentBudgetType === 1 && activedTabKey === '2' || currentBudgetType === 2"
                class="epo-link"
                href="https://tp.woa.com/main/#/receive/search"
                target="_blank"
              >验收查询<i class="mdi-set mdi-arrow-top-right"></i></a>
              <a
                v-if="currentBudgetType === 1 && activedTabKey === '2' || currentBudgetType === 2"
                class="epo-link"
                href="https://tp.woa.com/main/#/project/search"
                target="_blank"
              >需求下订单<i class="mdi-set mdi-arrow-top-right"></i></a>
              <a
                v-if="currentBudgetType === 1 && activedTabKey === '2' || currentBudgetType === 2"
                class="epo-link"
                href="https://tp.woa.com/main/#/receive/po-receive-search"
                target="_blank"
              >发起验收<i class="mdi-set mdi-arrow-top-right"></i></a>
              <div
                v-if="currentBudgetType === 1 && activedTabKey === '2' || currentBudgetType === 2"
                class="tip"
              >
                EPO系统将于9月30日正式下线，IOMC内容制作自采及研发外包需求立项下的采购订单下发及验收将迁移至
                腾讯采购平台（TPP），请在需求审批生效后，点击左侧链接前往TPP系统进行订单下发及验收操作，操作指引请点击
                <a href="https://iwiki.woa.com/pages/viewpage.action?pageId=1061002248" target="_blank">此处</a>，
                如有疑问请咨询系统管理员Brucepsun
              </div>
            </div>
            <div class="col-right">
              <ul class="table-actions">
                <li @click="searchDraftList">
                  <a href="javascript:;" class="btn-second" :class="{'selected': isSearchDraft}">
                    需求草稿
                    <span>{{ draftCount }}</span>
                  </a>
                </li>
                <li @click="searchRejectList">
                  <a href="javascript:;" class="btn-second" :class="{'selected': isSearchReject}">
                    被采购驳回
                    <span>{{ rejectCount }}</span>
                  </a>
                </li>
                <li @click="openFilter">
                  <a href="javascript:;" class="btn-second" :class="{'active': filterActived}">
                    过滤
                    <i class="omc-icon-filter ml-5"><em></em><em></em><em></em></i>
                  </a>
                </li>
                <li v-permission="['button/demand_apply_rd', 'button/demand_apply_cp']">
                  <a-button
                    type="primary"
                    :disabled="!consumeStat.length"
                    @click="applyDemand"
                  >需求申请</a-button>
                </li>
              </ul>
            </div>
          </div>
          <div v-if="filterActived" class="omc-table-filter" :class="{'active': filterActived}">
            <a-form layout="inline" :form="searchForm">
              <a-form-item label="需求单号">
                <a-input
                  v-decorator="[
                    'billNo'
                  ]"
                  placeholder="请输入需求单号"
                  allow-clear
                ></a-input>
              </a-form-item>
              <a-form-item label="物件单号">
                <a-input
                  v-decorator="[
                    'detailBillNo'
                  ]"
                  placeholder="请输入物件单号"
                  allow-clear
                ></a-input>
              </a-form-item>
              <a-form-item label="需求名称">
                <a-input
                  v-decorator="[
                    'demandName'
                  ]"
                  placeholder="请输入需求名称"
                  allow-clear
                ></a-input>
              </a-form-item>
              <a-form-item label="物件名称">
                <a-input
                  v-decorator="[
                    'materialName'
                  ]"
                  placeholder="请输入物件名称"
                  allow-clear
                ></a-input>
              </a-form-item>
              <a-form-item :label="currentBudgetType === 1 ? 'WBP推送状态' : currentBudgetType === 2 ? 'EPO推送状态' : '推送状态'">
                <a-select
                  v-decorator="[
                    'pushStatus'
                  ]"
                  placeholder="请选择推送状态"
                  allow-clear
                  :options="pushStatusOptions"
                  style="min-width: 190px;"
                ></a-select>
              </a-form-item>
              <a-form-item label="IOMC审批状态">
                <a-select
                  v-decorator="[
                    'iomcStatus'
                  ]"
                  style="min-width: 190px;"
                  placeholder="请选择IOMC审批状态"
                  allow-clear
                  :options="iomcStatusOptions"
                ></a-select>
              </a-form-item>
              <a-form-item label="需求种类">
                <a-select
                  v-decorator="[
                    `isBase`,
                  ]"
                  style="min-width: 190px;"
                  :options="isBaseOptions"
                  placeholder="请选择需求种类"
                  allow-clear
                ></a-select>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="search">查询</a-button>
              </a-form-item>
            </a-form>
          </div>
          <div>
            <a-button
              v-if="total > 0 && currentBudgetType === 1 && activedTabKey === '1'"
              class="expand-button"
              @click="controlAllRowExpand"
            >
              {{ expandedRows.length > 0 ? '收起所有' : '展开所有' }}
            </a-button>
            <a-button
              :loading="exportingConsume"
              :disabled="exportingConsume"
              @click="exportConsume"
            >需求导出</a-button>
            <a-button v-if="currentBudgetType === 1 && activedTabKey === '1'" class="thing_btn" @click="exportConsumeThing">物件导出</a-button>
            <a-button v-if="currentBudgetType === 2" class="exp_btn" @click="exportConsumeThing">需求物件导出</a-button>
          </div>
          <div class="omc-table-content">
            <a-tabs
              v-if="currentBudgetType === 1"
              :active-key="activedTabKey"
              @change="onTabChanged"
            >
              <a-tab-pane key="1" tab="采购经理采购（推送WBP)">
                <cp-list
                  v-if="activedTabKey === '1'"
                  :table-data="tableData"
                  :expanded-rows="expandedRows"
                  :on-expand-change="onExpandChange"
                  :show-consume-detail="showConsumeDetail"
                  :format-approval-status="formatApprovalStatus"
                  :format-epo-or-wbp-class="formatEpoOrWbpClass"
                  :format-epo-or-wbp-status="formatEpoOrWbpStatus"
                  :edit-consume="editConsume"
                  :delete-consume="deleteConsume"
                  :reset-sync-status="resetSyncStatus"
                  :can-select-inner-table="true"
                  :close-consume="closeConsume"
                  :total="total"
                  :page="page"
                  :page-size="pageSize"
                  :on-page-change="onPageChange"
                  :on-page-size-change="onPageSizeChange"
                  :loading="loadingData"
                  :on-add="applyDemand"
                />
              </a-tab-pane>
              <a-tab-pane key="2" tab="自行采购（推送EPO)">
                <cp-self-list
                  v-if="activedTabKey === '2'"
                  :table-data="tableData"
                  :show-consume-detail="showConsumeDetail"
                  :format-approval-status="formatApprovalStatus"
                  :format-epo-or-wbp-class="formatEpoOrWbpClass"
                  :format-epo-or-wbp-status="formatEpoOrWbpStatus"
                  :edit-consume="editConsume"
                  :delete-consume="deleteConsume"
                  :total="total"
                  :page="page"
                  :page-size="pageSize"
                  :on-page-change="onPageChange"
                  :on-page-size-change="onPageSizeChange"
                  :loading="loadingData"
                  :on-add="applyDemand"
                  :reset-sync-status="resetSyncStatus"
                />
              </a-tab-pane>
            </a-tabs>
            <template v-else>
              <rd-list
                :table-data="tableData"
                :show-consume-detail="showConsumeDetail"
                :format-approval-status="formatApprovalStatus"
                :format-epo-or-wbp-class="formatEpoOrWbpClass"
                :format-epo-or-wbp-status="formatEpoOrWbpStatus"
                :format-epo-close-status="formatEpoCloseStatus"
                :format-epo-close-status-class="formatEpoCloseStatusClass"
                :edit-consume="editConsume"
                :delete-consume="deleteConsume"
                :reset-sync-status="resetSyncStatus"
                :close-consume="closeConsume"
                :total="total"
                :page="page"
                :page-size="pageSize"
                :on-page-change="onPageChange"
                :on-page-size-change="onPageSizeChange"
                :loading="loadingData"
                :on-add="applyDemand"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
    <detail-modal
      :budget-expenses="budgetExpenses"
      :show="showDetail"
      :detail-data="detailData"
      :budget-type="getCurrentDemandType()"
      :step-lists="stepLists"
      :current-step="currentStep"
      :error-step="errorStep"
      :workflow-details="workflowDetails"
      :show-workflow-detail="showWorkloadDetail"
      @close="showDetail = false;"
    ></detail-modal>
    <project-list-modal
      :show="showProjectList"
      :project-lists="projectLists"
      :active-pro-index="activeProIndex"
      :select-project="selectProject"
      :on-search="onSearch"
      :troggle-project-list="troggleProjectList"
    ></project-list-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import YearPicker from '@/components/YearPicker/index'
import DetailModal from './detail-modal'
import ProjectListModal from './project-list-modal'
import CpList from './cp-list'
import RdList from './rd-list'
import CpSelfList from './cp-self-list'
import { getProductList } from '@/api/product/index'
import {
  getDemandLists,
  delConsumeItem,
  getConsumeDetail,
  getConsumeStat,
  resetSyncStatus,
  exportConsumeItem,
  exportConsumeDetail
} from '@/api/demand/index'
import { closeEpo } from '@/api/demand/research'
import moment from 'moment'
import { createUuid } from '@/utils/uuid'
import { formatDemandStatus, formatWorkflowSteps } from '@/utils/approval'
import { checkPermission } from '@/utils/permission'
import { parseStringToJson } from '@/utils/index'
import { getFlowStep, getFlowHistory } from '@/api/workflow'
import { LocalSelectedProductKey, getLocalData, setLocalData } from '@/utils/local-storage'
import { sumBy, round } from 'lodash/math'
import { checkApplicantRule } from '../../../api/workflow/index'
import demandMixins from '@/views/demand/mixins/index'
export default {
  name: 'DemandApply',
  components: {
    YearPicker,
    DetailModal,
    ProjectListModal,
    CpList,
    RdList,
    CpSelfList
  },
  mixins: [demandMixins],
  data() {
    return {
      projectListSourceData: [],
      projectLists: [],
      activeProIndex: 0,
      currentBudgetType: 1, // 1-内容制作费，2-研发费
      demandYear: new Date().getFullYear(),
      page: 1,
      pageSize: 15,
      total: 0,
      tableData: [],
      loadingData: false,
      showDetail: false,
      detailData: {},
      stepLists: [],
      currentStep: 0,
      errorStep: {},
      workflowDetails: [],
      showWorkloadDetail: false,
      showProjectList: false,
      expandedRows: [],
      isExpandAll: true,
      filterActived: false,
      billNo: undefined,
      detailBillNo: undefined,
      demandName: undefined,
      materialName: undefined,
      pushStatus: undefined,
      iomcStatus: undefined,
      isBase: undefined,
      pushStatusOptions: [
        { label: '同步成功', value: 1 },
        { label: '同步失败', value: 2 }
      ],
      iomcStatusOptions: [
        { label: '草稿', value: 1 },
        { label: '审批中', value: 2 },
        { label: '审批结束', value: 3 }
      ],
      isSearchDraft: false,
      draftCount: undefined,
      isSearchReject: false,
      rejectCount: undefined,
      totalDraftCount: 0,
      totalRejectCount: 0,
      exportingConsume: false,
      activedTabKey: '1', // '1'-内容制作费(常规)、'2'-内容制作费(自行采购)
      budgetExpenses: {}
    }
  },
  computed: {
    ...mapState({
      selectedProject: state => state.demand.selectedProject,
      consumeStat: state => state.demand.consumeStat,
      selectedConsumeStat: state => state.demand.selectedConsumeStat
    })
  },
  beforeCreate() {
    this.searchForm = this.$form.createForm(this, { name: 'demand-list-filter-form' })
  },
  async created() {
    await this.getProjectLists()
  },
  methods: {
    getProjectLists(keywords = '') {
      return new Promise((resolve, reject) => {
        getProductList(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          keywords,
          'consume:*:*:*',
          '/iomc.ConsumeSrv/GetConsumeItemList'
        )
          .then(res => {
            const { data } = res
            this.projectListSourceData = data
            this.projectLists = data
            // 默认选择提交需求后选中的项目
            if (Array.isArray(data) && data.length > 0) {
              const localSelectedProduct = getLocalData(LocalSelectedProductKey)
              let selectedProduct = data[0]
              this.activeProIndex = 0
              if (localSelectedProduct) {
                const targetProductIndex = data.findIndex(item => item.product_code === localSelectedProduct)
                if (targetProductIndex > -1) {
                  selectedProduct = data[targetProductIndex]
                  this.activeProIndex = targetProductIndex
                }
              }
              this.$store.dispatch('demand/setSelectedPro', selectedProduct).then(() => {
                this.getConsumeStat()
              })
            }
            resolve(data)
          })
          .catch(err => reject(err))
      })
    },
    getConsumeStat() {
      if (this.selectedProject.product_code) {
        getConsumeStat(this.demandYear, this.selectedProject.product_code, this.selectedProject.depart_id).then(res => {
          const { items } = res.content
          const hasPermissionItems = items.filter(item => {
            if (checkPermission(['menu/enter_cp']) && item.type === 1) { // 内容制作费
              return true
            } else if (checkPermission(['menu/enter_rd']) && item.type === 2) { // 研发费
              return true
            }
            return false
          })
          if (
            hasPermissionItems &&
            Array.isArray(hasPermissionItems) &&
            hasPermissionItems.length > 0
          ) {
            this.$store.dispatch('demand/setConsumeStat', hasPermissionItems)
            // 默认选择第一个需求类型
            this.$store.dispatch('demand/setSelectedConsumeStat', hasPermissionItems[0])
            this.currentBudgetType = hasPermissionItems[0].type
            this.getWorkflowStep(this.currentBudgetType)
            this.getDemandLists()

            // 获取草稿和驳回状态单数量
            this.getDraftCount()
            this.getRejectCount()
          }
        })
      }
    },
    onSearch(keywords) {
      // this.getProjectLists(keywords)
      this.projectLists = this.projectListSourceData.filter(item => (
        item.product_name.toLocaleLowerCase().includes(keywords.toLocaleLowerCase()) ||
        item.product_code.toLocaleLowerCase().includes(keywords.toLocaleLowerCase())
      ))
    },
    selectProject(project, index) {
      this.activeProIndex = index
      this.$store.dispatch('demand/setSelectedPro', project).then(() => {
        this.getConsumeStat()
      })
      this.troggleProjectList(false)
      setLocalData(LocalSelectedProductKey, project.product_code)
    },
    getDemandLists() {
      this.loadingData = true
      const currentDemandType = this.getCurrentDemandType()
      if (this.selectedProject.product_code && currentDemandType) {
        getDemandLists(
          [].concat({
            product_code: this.selectedProject.product_code,
            type: currentDemandType,
            bill_no: this.billNo,
            detail_bill_no: this.detailBillNo,
            name: this.demandName,
            detail_name: this.materialName,
            epo_status: this.currentBudgetType === 2 ? this.pushStatus : undefined,
            wbp_status: this.currentBudgetType === 1 ? this.pushStatus : undefined,
            status: this.iomcStatus,
            is_base: this.isBase,
            only_draft: this.isSearchDraft ? 1 : undefined,
            only_thirdparty_reject: this.isSearchReject ? 1 : undefined
          }),
          this.page,
          this.pageSize,
          this.demandYear
        ).then(res => {
          const { items, total } = res.content
          this.draftCount = this.isSearchDraft ? total : this.totalDraftCount
          this.rejectCount = this.isSearchReject ? total : this.totalRejectCount

          // 内容制作费费（常规）
          if (currentDemandType === 1) {
            const expandedRows = []
            this.tableData = items.map((item, i) => {
              if (this.isExpandAll) {
                expandedRows.push(i)
              }
              const splitName = item.name.split('--[')[1] || ''
              return {
                ...item,
                workload_count: round(
                  sumBy(item.detail_items, function(o) { return o.cnt.workload }),
                  1
                ),
                key: i,
                innerTableData: item.detail_items.map((detail, index) => {
                  return {
                    ...detail.cnt,
                    category_name: splitName.split(']')[0] || '',
                    key: index
                  }
                })
              }
            })

            if (this.isExpandAll) {
              this.expandedRows = expandedRows
            }
          } else {
            this.tableData = items.map((item, i) => ({
              ...item,
              key: i
            }))
          }
          this.total = total
        }).finally(() => {
          this.loadingData = false
        })
      }
    },
    async onBudgetTypeChange(item) {
      if (item.type === this.currentBudgetType) {
        return
      }

      this.currentBudgetType = item.type
      this.page = 1
      this.isSearchDraft = false
      this.isSearchReject = false
      this.$store.dispatch('demand/setSelectedConsumeStat', item)
      // 需求类型改变时重置过滤功能
      this.filterActived = false
      this.activedTabKey = '1'
      this.resetSearchParams()
      this.getWorkflowStep(this.currentBudgetType)
      await this.getDemandLists()

      // 获取草稿和驳回状态单数量
      this.getDraftCount()
      this.getRejectCount()
    },
    async onDemandYearChange(year) {
      this.page = 1
      this.demandYear = year
      await this.getDemandLists()
    },
    async applyDemand() {
      const work_type = this.getCurrentDemandType() === 1 ? 2 : this.getCurrentDemandType() === 2 ? 1 : this.getCurrentDemandType()
      if (work_type !== 2) {
        checkApplicantRule(this.selectedProject.product_code, work_type).then(res => {
          if (res.ret !== 0) {
            this.$message.info('您无需求申请权限，请联系管理员开通权限！')
            return
          }
        })
      }
      if (!checkPermission(['button/demand_apply_rd', 'button/demand_apply_cp', 'button/demand_apply_cp_epo'])) {
        return this.$message.info('您无需求申请权限，请联系管理员开通权限！')
      }
      const currentDemandType = this.getCurrentDemandType()
      const route = this.matchedRoute(currentDemandType)
      if (!route) {
        return this.$message.info('请先选择需求类型！')
      }

      await this.$store.dispatch('demand/resetDemandForm')
      this.$router.push(route)
    },
    onPageChange({ page, pageSize }) {
      this.page = page
      this.getDemandLists()
    },
    onPageSizeChange(pageSize) {
      this.page = 1
      this.pageSize = pageSize
      this.getDemandLists()
    },
    getConsumeDetail(item, operate, billNos = []) { // operate：1-编辑、2-查看明细, billNos: 物料编号
      return new Promise((resolve, reject) => {
        const currentDemandType = this.getCurrentDemandType()
        getConsumeDetail(
          [].concat({
            consume_id: item.id,
            type: currentDemandType,
            product_code: this.selectedProject.product_code,
            bill_no: billNos || []
          })
        ).then(res => {
          const { items } = res.content
          const formData = []
          items.forEach(item => {
            if (currentDemandType === 1) { // 内容制作费需求(常规)
              const breakdown = parseStringToJson(item.cnt.breakdown, [])
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
                breakdown: breakdown,
                workload_unit: item.cnt.workload_unit,
                level: item.cnt.level,
                supplicant: item.cnt.supplicant,
                count: item.cnt.workload, // 品类数量，编辑内容制作费时才有
                uid: createUuid(),
                open: true
              })
            } else if (currentDemandType === 2) { // 研发费
              formData.push({
                ...item.dev,
                type: item.dev.type.replace(/(,)/g, '/'),
                year: item.year,
                complete_date: operate === 1 ? moment(item.dev.complete_date) : item.dev.complete_date,
                uid: createUuid(),
                open: true
              })
            } else { // 内容制作费（自行采购）
              formData.push({
                ...item.epo_cnt
              })
            }
          })
          resolve(formData)
        })
      })
    },
    async editConsume(
      item,
      selectedBillnos = [],
      isReEdit = false, // 是否是驳回重新编辑
      isConsumeModify = false // 是否是需求修改，需求修改只支持需求预估金额，并只能调大
    ) {
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
        verify_reviewers: item.verify_reviewers, // 需求审批人
        expect_date: item.expect_date, // 预期交付日期
        memo: item.memo, // 备注
        dev_category: item.dev_category, // 研发费研发类别
        approve_ass_role: item.approve_ass_role, //  指定审批人
        special_reviewers: item.special_reviewers, // 业务审批人或者特殊审批
        relevant_reviewers: item.relevant_reviewers, //  相关审批人
        approve_ass_role_for_map: item.approve_ass_role_for_map, // 内容制作费
        special_reviewers_for_map: item.special_reviewers_for_map,
        verify_reviewers_for_map: item.verify_reviewers_for_map,
        product_dimension: item.product_dimension,
        artist_name: item.artist_name // 画师
      }
      await this.$store.dispatch('demand/setConsumeDetail', consumeDetail)
      await this.$store.dispatch('demand/setIsEdit', true)
      await this.$store.dispatch('demand/setIsReEdit', isReEdit)
      await this.$store.dispatch('demand/setReEditMaterialBillNos', selectedBillnos)
      await this.$store.dispatch('demand/setIsConsumeModify', isConsumeModify)
      this.getConsumeDetail(item, 1, selectedBillnos).then(res => {
        this.$store.dispatch('demand/setDetailForms', res).then(() => {
          const currentDemandType = this.getCurrentDemandType()
          const route = this.matchedRoute(currentDemandType)
          if (route) {
            this.$router.push(route)
          }
        })
      })
    },
    showConsumeDetail(item) {
      // 审批中或者审批结束显示审批流程
      this.showWorkloadDetail = false
      if (item.status && item.status > 0 && item.flow_instance_id) {
        const historyFlowInstanceIds =
          item.history_flow_instance_ids
            ? item.history_flow_instance_ids.split(',')
            : []

        getFlowHistory(
          historyFlowInstanceIds.includes(item.flow_instance_id)
            ? [...historyFlowInstanceIds]
            : [...historyFlowInstanceIds, item.flow_instance_id],
          1
        ).then(res => {
          const stepDetail = formatWorkflowSteps(
            this.stepLists,
            res.content
          )
          this.currentStep = stepDetail.currentStep
          this.errorStep = stepDetail.errorStep
          this.workflowDetails = res.content
          this.showWorkloadDetail = true
        })
      }
      const consumeDetail = {
        dept_name: item.dept_name,
        product_name: item.product_name,
        name: item.name,
        description: item.description,
        is_base: item.is_base,
        pm_name: item.pm_name,
        receiver_names: item.receiver_names,
        purchaser: item.purchaser,
        begin_date: item.begin_date,
        end_date: item.end_date,
        id: item.id,
        bill_no: item.bill_no,
        attachments: item.attachments,
        status: item.status,
        output: item.output,
        verify_standard: item.verify_standard,
        background_desc: item.background_desc,
        tech_desc: item.tech_desc,
        service_location: item.service_location,
        apply_for: item.apply_for, // 经办人
        verify_reviewers: item.verify_reviewers, // 指定审批人
        workload_count: item.workload_count, // 需求数量/预估工作量合计
        year: item.year,
        expect_date: item.expect_date, // 预期交付日期
        memo: item.memo, // 备注
        dev_category_name: item.category_name, // 研发费研发类别名称
        product_code: item.product_code,
        approve_ass_role: item.approve_ass_role, //  指定审批人
        special_reviewers: item.special_reviewers, // 业务审批人或者特殊审批
        relevant_reviewers: item.relevant_reviewers, //  相关审批人
        approve_ass_role_for_map: item.approve_ass_role_for_map, // 内容制作费
        special_reviewers_for_map: item.special_reviewers_for_map,
        verify_reviewers_for_map: item.verify_reviewers_for_map,
        product_dimension: item.product_dimension,
        artist_name: item.artist_name
      }
      this.getConsumeDetail(item, 2).then(res => {
        this.detailData = {
          message: consumeDetail,
          details: res
        }
        this.showDetail = true
      })
      // 获取预算
      getConsumeStat(item.year, item.product_code, item.dept_id).then(res => {
        if (item.type === 2) {
          this.budgetExpenses = res.content.items[1]
        } else {
          this.budgetExpenses = res.content.items[0]
        }
      })
    },
    troggleProjectList(status) {
      this.showProjectList = status
    },
    deleteConsume(item) {
      this.$confirm({
        title: '删除需求申请单',
        content: `确定要删除需求申请单【${item.name}】吗？`,
        onOk: () => {
          delConsumeItem(
            this.currentBudgetType,
            [].concat(item.id),
            this.selectedProject.product_code
          ).then(() => {
            this.$message.success('删除成功')
            this.getDemandLists()
          })
        }
      })
    },
    resetSyncStatus(item) {
      this.$confirm({
        title: '重置同步状态',
        content: `确定要重置需求单【${item.name}】的同步状态吗？`,
        onOk: () => {
          resetSyncStatus([item.id]).then(() => {
            this.$message.success('重置同步状态成功')
            this.getDemandLists()
          })
        }
      })
    },
    formatApprovalStatus(status) {
      return formatDemandStatus(status)
    },
    formatEpoOrWbpStatus(status) {
      switch (status) {
        case 0:
          return '待推送'
        case 1:
          return '已推送'
        case 2:
          return '推送失败'
        case 3:
          return '有驳回'
        default:
          return '-'
      }
    },
    formatEpoOrWbpClass(status) {
      switch (status) {
        case 0:
          return 'text-muted'
        case 1:
          return 'text-success'
        case 2:
        case 3:
          return 'text-danger'
        default:
          return ''
      }
    },
    formatEpoCloseStatus(status) {
      switch (status) {
        case 0:
          return '未结项'
        case 1:
          return '已结项'
        default:
          return ''
      }
    },
    formatEpoCloseStatusClass(status) {
      switch (status) {
        case 0:
          return 'text-muted'
        case 1:
          return 'text-success'
        default:
          return ''
      }
    },
    onExpandChange(expandedRows) {
      this.expandedRows = expandedRows
    },
    controlAllRowExpand() {
      this.isExpandAll = !this.isExpandAll
      if (this.expandedRows.length > 0) {
        this.expandedRows = []
      } else {
        this.expandedRows = this.tableData.map((item, index) => index)
      }
    },
    openFilter() {
      this.filterActived = !this.filterActived
      if (
        !this.filterActived &&
        (this.billNo !== undefined ||
        this.detailBillNo !== undefined ||
        this.demandName !== undefined ||
        this.materialName !== undefined ||
        this.pushStatus !== undefined ||
        this.iomcStatus !== undefined ||
        this.isBase !== undefined
        )
      ) {
        this.resetSearchParams()
        this.getDemandLists()
      }
    },
    search() {
      const values = this.searchForm.getFieldsValue()
      this.billNo = values['billNo']
      this.detailBillNo = values['detailBillNo']
      this.demandName = values['demandName']
      this.materialName = values['materialName']
      this.pushStatus = values['pushStatus']
      this.iomcStatus = values['iomcStatus']
      this.isBase = values['isBase']
      this.getDemandLists()
    },
    resetSearchParams() {
      this.billNo = undefined
      this.detailBillNo = undefined
      this.demandName = undefined
      this.materialName = undefined
      this.pushStatus = undefined
      this.iomcStatus = undefined
      this.isBase = undefined
    },
    getWorkflowStep(demandType) {
      if (!demandType) {
        return
      }
      const workType = demandType === 1 ? 2 : 1 // workType: 1-研发费、2-内容制作费
      getFlowStep(workType).then(res => {
        const { content } = res
        this.stepLists = content
      })
    },
    // 需求草稿和被采购驳回两者互斥
    searchDraftList() {
      this.isSearchDraft = !this.isSearchDraft
      if (this.isSearchDraft) {
        this.isSearchReject = false
      }
      this.getDemandLists()
    },
    searchRejectList() {
      this.isSearchReject = !this.isSearchReject
      if (this.isSearchReject) {
        this.isSearchDraft = false
      }
      this.getDemandLists()
    },
    getDraftCount() {
      const currentDemandType = this.getCurrentDemandType()
      if (this.selectedProject.product_code && currentDemandType) {
        getDemandLists(
          [].concat({
            product_code: this.selectedProject.product_code,
            type: currentDemandType,
            only_draft: 1
          }),
          this.page,
          this.pageSize,
          this.demandYear
        ).then(res => {
          const { total } = res.content
          this.draftCount = total
          this.totalDraftCount = total
        })
      }
    },
    getRejectCount() {
      const currentDemandType = this.getCurrentDemandType()
      if (this.selectedProject.product_code && currentDemandType) {
        getDemandLists(
          [].concat({
            product_code: this.selectedProject.product_code,
            type: currentDemandType,
            only_thirdparty_reject: 1
          }),
          this.page,
          this.pageSize,
          this.demandYear
        ).then(res => {
          const { total } = res.content
          this.rejectCount = total
          this.totalRejectCount = total
        })
      }
    },
    // 物件导出
    exportConsumeThing() {
      exportConsumeDetail(
        [].concat({
          product_code: this.selectedProject.product_code,
          type: this.getCurrentDemandType()
        }),
        this.page,
        this.pageSize,
        this.demandYear
      ).then(res => {
        this.$message.success('导出成功！')
      }).catch(err => {
        this.$message.error(`导出失败：${err}`)
      })
    },
    exportConsume() {
      this.exportingConsume = true
      exportConsumeItem(
        [].concat({
          product_code: this.selectedProject.product_code,
          type: this.getCurrentDemandType(),
          bill_no: this.billNo,
          detail_bill_no: this.detailBillNo,
          name: this.demandName,
          detail_name: this.materialName,
          epo_status: this.currentBudgetType === 2 ? this.pushStatus : undefined,
          wbp_status: this.currentBudgetType === 1 ? this.pushStatus : undefined,
          status: this.iomcStatus,
          is_base: this.isBase,
          only_draft: this.isSearchDraft ? 1 : undefined,
          only_thirdparty_reject: this.isSearchReject ? 1 : undefined
        }),
        this.page,
        this.pageSize,
        this.demandYear
      ).then(res => {
        this.$message.success('导出成功！')
      }).catch(err => {
        this.$message.error(`导出失败：${err}`)
      }).finally(() => {
        this.exportingConsume = false
      })
    },
    closeConsume(item) {
      this.$confirm({
        title: '结项需求申请单',
        content: `确定要结项需求申请单【${item.name}】吗？`,
        onOk: () => {
          closeEpo(item.id).then(res => {
            this.$message.success('结项成功')
            this.getDemandLists()
          })
        }
      })
    },
    getCurrentDemandType() { // 1-内容制作费（常规）、2-研发费、3-内容制作费（自采）
      if (this.currentBudgetType === 1) {
        return this.activedTabKey === '1' ? 1 : 3
      } else {
        return 2
      }
    },
    matchedRoute(currentDemandType) {
      switch (currentDemandType) {
        case 1:
          return '/demand/apply/cp'
        case 2:
          return '/demand/apply/rd'
        case 3:
          return '/demand/apply/cp-epo'
        default:
          return ''
      }
    },
    onTabChanged(key) {
      this.activedTabKey = key
      this.getDemandLists()

      // 获取草稿和驳回状态单数量
      this.getDraftCount()
      this.getRejectCount()
    }
  }
}
</script>
<style lang="less" scoped>
.subpage-content {
  overflow-x: hidden;
}
.omc-filter-roughly {
  margin: 0;
}
.omc-expense-roughly {
  .expense-item {
    &:hover {
      border-bottom-color: #4939c4;
    }
    &.active {
      border-bottom-color: #4939c4;
    }
  }
}
.omc-table-content {
  position: relative;
  .loading-modal {
    .loading-content {
      left: 60%;
    }
  }
}
.table-actions {
  .btn-second {
    &.selected {
      color: #fff;
      background-color: #6b5aed;
      &:hover {
        color: #fff;
      }
    }
  }
}
.expand-button {
  margin-right: 10px;
}
.col-left {
  width: calc(100% - 450px);
  display: flex;
  align-items: center;
  margin-right: 10px;

  .epo-link {
    text-decoration: underline;
    margin-left: 15px;
  }
  .tip {
    font-size: 12px;
    flex: 1;
    margin-left: 10px;
    color: orangered;
    background: #fff;
    padding: 5px;
    border-radius: 4px;

    a {
      text-decoration: underline;
      color: #6b5aed;
    }
  }
}
.thing_btn,.exp_btn{
  margin-left: 10px;
}
</style>
