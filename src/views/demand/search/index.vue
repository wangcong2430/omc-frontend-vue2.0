<template>
  <div class="demand-search">
    <div class="subpage-content">
      <div class="omc-table-filter">
        <a-form layout="inline" :form="searchForm">
          <a-form-item label="需求类型">
            <a-select
              v-decorator="[
                'demandType',
                {
                  initialValue: currentDemandType,
                  rules: [{ required: true, message: '必须选择需求类型才能查询' }]
                }
              ]"
              style="width: 200px;"
              placeholder="请选择需求类型"
              :options="demandTypeOpts"
              @change="onDemandTypeChange"
            ></a-select>
          </a-form-item>
          <a-form-item label="产品">
            <common-select
              v-decorator="[
                'selectedProduct'
              ]"
              style="width: 400px;"
              :allow-clear="true"
              show-search
              :placeholder="'请选择产品'"
              :options="productOpts"
            ></common-select>
          </a-form-item>
          <a-form-item label="部门">
            <common-select
              v-decorator="[
                'department'
              ]"
              style="width: 350px;"
              :allow-clear="true"
              show-search
              :placeholder="'请选择相应的部门'"
              :options="departmentList"
              mode="multiple"
            ></common-select>
          </a-form-item>
          <a-form-item label="需求年份">
            <year-picker
              v-decorator="[
                'year',
                {
                  valuePropName: 'defaultValue',
                  initialValue: demandYear
                }
              ]"
              :allow-clear="false"
            ></year-picker>
          </a-form-item>
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
          <a-form-item label="提单人">
            <common-member-picker
              v-decorator="[
                'applicant',
                {
                  initialValue: ''
                }
              ]"
              style="width: 200px;"
              placeholder="请输入RTX选择人名"
            />
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
          <a-form-item v-if="demandTypeOpts.length > 0" label="推送状态">
            <a-select
              v-decorator="[
                'status'
              ]"
              style="width: 200px;"
              placeholder="请选择推送状态"
              allow-clear
              :options="statusOptions"
            ></a-select>
          </a-form-item>
          <a-form-item v-if="demandTypeOpts.length > 0" label="IOMC审批状态">
            <a-select
              v-decorator="[
                'iomc_status'
              ]"
              style="width: 200px;"
              placeholder="请选择IOMC审批状态"
              allow-clear
              :options="iomcStatusOptions"
            ></a-select>
          </a-form-item>
          <a-form-item label="需求种类">
            <a-select
              v-decorator="[
                'is_base'
              ]"
              style="width: 200px;"
              placeholder="请选择需求种类"
              allow-clear
              :options="isBaseOptions"
            ></a-select>
          </a-form-item>
          <a-form-item>
            <a-button :loading="loading" type="primary" @click="getDemands(true)">查询</a-button>
          </a-form-item>
          <a-form-item>
            <a-button @click="resetDemands(true)">重置</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="omc-table">
        <div class="omc-table-toolbar">
          <div class="col-left">
            <h2 class="table-title">{{ formatTableTitle() }}</h2>
            <a
              v-if="currentDemandType === 1"
              class="wbp-link"
              href="http://idea.waibao.oa.com/query/story"
              target="_blank"
            >wbp系统需求查询<i class="mdi-set mdi-arrow-top-right"></i></a>
            <a
              v-if="currentDemandType === 2 || currentDemandType === 3"
              class="epo-link"
              href="https://tp.woa.com/main/#/po/search"
              target="_blank"
            >订单查询<i class="mdi-set mdi-arrow-top-right"></i></a>
            <a
              v-if="currentDemandType === 2 || currentDemandType === 3"
              class="epo-link"
              href="https://tp.woa.com/main/#/receive/search"
              target="_blank"
            >验收查询<i class="mdi-set mdi-arrow-top-right"></i></a>
            <a
              v-if="currentDemandType === 2 || currentDemandType === 3"
              class="epo-link"
              href="https://tp.woa.com/main/#/project/search"
              target="_blank"
            >需求下订单<i class="mdi-set mdi-arrow-top-right"></i></a>
            <a
              v-if="currentDemandType === 2 || currentDemandType === 3"
              class="epo-link"
              href="https://tp.woa.com/main/#/receive/po-receive-search"
              target="_blank"
            >发起验收<i class="mdi-set mdi-arrow-top-right"></i></a>
            <div
              v-if="currentDemandType === 2 || currentDemandType === 3"
              class="tip"
            >
              EPO系统将于9月30日正式下线，IOMC内容制作自采及研发外包需求立项下的采购订单下发及验收将迁移至
              腾讯采购平台（TPP），请在需求审批生效后，点击左侧链接前往TPP系统进行订单下发及验收操作，操作指引请点击
              <a href="https://iwiki.woa.com/pages/viewpage.action?pageId=1061002248" target="_blank">此处</a>，
              如有疑问请咨询系统管理员Brucepsun
            </div>
          </div>
        </div>
        <div>
          <a-button
            v-if="total > 0 && currentDemandType === 1"
            class="expand-button"
            @click="controlAllRowExpand"
          >{{ expandedRows.length > 0 ? '收起所有' : '展开所有' }}</a-button>
          <a-button
            :loading="exportingConsume"
            :disabled="exportingConsume"
            @click="exportConsumeGlobal"
          >需求导出</a-button>
          <a-button v-if=" total > 0 && searchForm.getFieldValue('demandType') === 1" class="thing_btn" @click="exportConsumeThings">物件导出</a-button>
          <a-button v-if=" total > 0 && searchForm.getFieldValue('demandType') === 2" class="exp_btn" @click="exportConsumeThings">需求物件导出</a-button>
        </div>
        <div class="omc-table-content">
          <cp-list
            v-if="currentDemandType === 1"
            :table-data="tableData"
            :expanded-rows="expandedRows"
            :on-expand-change="onExpandChange"
            :show-consume-detail="showConsumeDetail"
            :format-approval-status="formatApprovalStatus"
            :format-epo-or-wbp-class="formatEpoOrWbpClass"
            :format-epo-or-wbp-status="formatEpoOrWbpStatus"
            :reset-sync-status="resetSyncStatus"
            :delete-consume="deleteConsume"
            :close-consume="closeConsume"
            :total="total"
            :page="page"
            :page-size="pageSize"
            :on-page-change="onPageChange"
            :on-page-size-change="onPageSizeChange"
            :loading="loadingData"
          />
          <template v-else-if="currentDemandType === 2">
            <rd-list
              :table-data="tableData"
              :show-consume-detail="showConsumeDetail"
              :format-approval-status="formatApprovalStatus"
              :format-epo-or-wbp-class="formatEpoOrWbpClass"
              :format-epo-or-wbp-status="formatEpoOrWbpStatus"
              :format-epo-close-status="formatEpoCloseStatus"
              :format-epo-close-status-class="formatEpoCloseStatusClass"
              :reset-sync-status="resetSyncStatus"
              :delete-consume="deleteConsume"
              :close-consume="closeConsume"
              :total="total"
              :page="page"
              :page-size="pageSize"
              :on-page-change="onPageChange"
              :on-page-size-change="onPageSizeChange"
              :loading="loadingData"
            />
          </template>
          <template v-else>
            <cp-self-list
              :table-data="tableData"
              :show-consume-detail="showConsumeDetail"
              :format-approval-status="formatApprovalStatus"
              :format-epo-or-wbp-class="formatEpoOrWbpClass"
              :format-epo-or-wbp-status="formatEpoOrWbpStatus"
              :delete-consume="deleteConsume"
              :close-consume="closeConsume"
              :total="total"
              :page="page"
              :page-size="pageSize"
              :on-page-change="onPageChange"
              :on-page-size-change="onPageSizeChange"
              :loading="loadingData"
              :reset-sync-status="resetSyncStatus"
            />
          </template>
        </div>
      </div>
    </div>
    <detail-modal
      :budget-expenses="budgetExpenses"
      :show="showDetail"
      :detail-data="detailData"
      :budget-type="currentDemandType"
      :step-lists="stepLists"
      :current-step="currentStep"
      :error-step="errorStep"
      :workflow-details="workflowDetails"
      :show-workflow-detail="showWorkloadDetail"
      @close="showDetail = false;"
    ></detail-modal>
  </div>
</template>
<script>
import CommonSelect from '@/components/Form/CommonSelect'
import CommonMemberPicker from '@/components/Form/CommonMemberPicker'
import YearPicker from '@/components/YearPicker'
import CpList from '../list/cp-list'
import RdList from '../list/rd-list'
import CpSelfList from '../list/cp-self-list'
import DetailModal from '../list/detail-modal'
import { getProductList } from '@/api/product'
import { getGlobalDemandLists, delConsumeItem, resetSyncStatus, exportConsumeItemGlobal, exportConsumeDetailGlobal } from '@/api/demand'
import { closeEpo } from '@/api/demand/research'
import { formatDemandStatus, formatWorkflowSteps } from '@/utils/approval'
import { checkPermission } from '@/utils/permission'
import { parseStringToJson } from '@/utils/index'
import { getFlowStep, getFlowHistory } from '@/api/workflow'
import { sumBy, round } from 'lodash/math'
import { getConsumeStat } from '@/api/demand/index'
import demandMixins from '../mixins/index'
export default {
  name: 'DemandSearch',
  components: {
    CommonSelect,
    CommonMemberPicker,
    YearPicker,
    CpList,
    RdList,
    CpSelfList,
    DetailModal
  },
  mixins: [demandMixins],
  data() {
    return {
      demandTypeOpts: [],
      productOpts: [],
      currentDemandType: undefined, // 1-内容制作费，2-研发费, 3-内容制作费（自行采购）
      demandYear: new Date().getFullYear(),
      page: 1,
      pageSize: 15,
      total: 0,
      tableData: [],
      isEmpty: true,
      loading: false,
      loadingData: false,
      expandedRows: [],
      isExpandAll: true,
      showDetail: false,
      detailData: {},
      stepLists: [],
      currentStep: 0,
      errorStep: {},
      workflowDetails: [],
      showWorkloadDetail: false,
      statusOptions: [
        { label: '同步成功', value: 1 },
        { label: '同步失败', value: 2 }
      ],
      iomcStatusOptions: [
        { label: '草稿', value: 1 },
        { label: '审批中', value: 2 },
        { label: '审批结束', value: 3 }
      ],
      exportingConsume: false,
      budgetExpenses: {},
      departmentList: []
    }
  },
  beforeCreate() {
    this.searchForm = this.$form.createForm(this, { name: 'demand-list-filter-form' })
  },
  created() {
    this.getConsumeTypes()
    this.getProducts(this.currentDemandType)
    this.getWorkflowStep(this.currentDemandType)
  },
  mounted() {
    this.getDemands()
  },
  methods: {
    // 物件导出
    exportConsumeThings() {
      this.searchForm.validateFields((error, values) => {
        if (error) {
          this.$message.info('请先选择需求类型再查询，没有需求类型请联系管理员开通权限！')
          return
        }
        exportConsumeDetailGlobal(
          [].concat({
            product_code: values.selectedProduct,
            type: values.demandType,
            bill_no: values.billNo,
            detail_bill_no: values.detailBillNo,
            applicant: values.applicant ? values.applicant.split(';') : undefined,
            name: values.demandName,
            detail_name: values.materialName,
            status: values.iomc_status,
            wbp_status: values.status,
            dept_ids: values.department // 下载新增部门id
          }),
          this.page,
          this.pageSize,
          values.year
        ).then(res => {
          this.$message.success('导出成功！')
        }).catch(err => {
          this.$message.error(`导出失败：${err}`)
        })
      })
    },
    getConsumeTypes() {
      const hasPermissionItems = []
      if (checkPermission(['menu/enter_search_cp'])) {
        hasPermissionItems.push({
          label: '内容制作费',
          value: 1
        })
      }
      if (checkPermission(['menu/enter_search_rd'])) {
        hasPermissionItems.push({
          label: '研发费',
          value: 2
        })
      }
      if (checkPermission(['menu/enter_search_epo_cp'])) {
        hasPermissionItems.push({
          label: '内容制作费（自行采购）',
          value: 3
        })
      }
      this.demandTypeOpts = hasPermissionItems
      if (hasPermissionItems.length > 0) {
        this.currentDemandType = hasPermissionItems[0].value
      }
    },
    getProducts(value) {
      if (!value) {
        return
      }
      getProductList(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        '',
        `consume:*:*:item_type/${value}`,
        '/iomc.ConsumeSrv/GetConsumeItemGlobalList'
      ).then(res => {
        const { data } = res
        const newData = []
        this.departmentList = []
        data.forEach(item => {
          if (!newData.includes(item.depart_id)) {
            newData.push(item.depart_id)
            this.departmentList.push({ label: item.depart_name, value: item.depart_id })
          }
        })

        this.productOpts = data.map(item => ({
          label: `${item.product_name}【${item.product_code}】`,
          value: item.product_code
        }))
      })
    },
    onPageChange({ page, pageSize }) {
      this.page = page
      this.getDemands()
    },
    onPageSizeChange(pageSize) {
      this.page = 1
      this.pageSize = pageSize
      this.getDemands()
    },
    formatTableTitle() {
      const demandYear = this.searchForm.getFieldValue('year')
      let typeName = ''
      switch (this.currentDemandType) {
        case 1:
          typeName = '内容制作费'
          break
        case 2:
          typeName = '研发费'
          break
        case 3:
          typeName = '内容制作费（自行采购）'
          break
      }
      return `${demandYear ? `${demandYear}年 - ` : ''}${typeName} - 需求列表`
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
    getConsumeDetail(item) {
      return new Promise((resolve, reject) => {
        const { detail_items } = item
        const data = []
        detail_items.forEach(item => {
          if (this.currentDemandType === 1) { // 内容制作费需求
            const breakdown = parseStringToJson(item.cnt.breakdown, [])
            data.push({
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
              attr: parseStringToJson(item.cnt.attr, []),
              breakdown,
              workload_unit: item.cnt.workload_unit,
              level: item.cnt.level,
              supplicant: item.cnt.supplicant
            })
          } else if (this.currentDemandType === 2) { // 研发费
            data.push({
              ...item.dev,
              year: item.year
            })
          } else { // 内容制作费（自行采购）
            data.push({
              ...item.epo_cnt
            })
          }
        })
        resolve(data)
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
        artist_name: item.artist_name // 画师
      }
      this.getConsumeDetail(item).then(res => {
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
    controlAllRowExpand() {
      this.isExpandAll = !this.isExpandAll
      if (this.expandedRows.length > 0) {
        this.expandedRows = []
      } else {
        this.expandedRows = this.tableData.map((item, index) => index)
      }
    },
    onExpandChange(expandedRows) {
      this.expandedRows = expandedRows
    },
    getDemands(isSearch = false, isReset = false) {
      if (isSearch) {
        this.page = 1
        this.loading = true
      }
      if (isReset) {
        this.page = 1
      }
      this.loadingData = true
      this.searchForm.validateFields((error, values) => {
        if (error) {
          this.loading = false
          this.loadingData = false
          this.$message.info('请先选择需求类型再查询，没有需求类型请联系管理员开通权限！')
          return
        }
        const {
          demandType,
          selectedProduct,
          billNo,
          detailBillNo,
          applicant,
          year,
          demandName,
          materialName,
          status,
          iomc_status,
          department,
          is_base
        } = values
        // demandType变化时重新获取流程节点
        if (demandType !== this.currentDemandType) {
          this.getWorkflowStep(demandType)
        }
        const statusObj = {}
        if (demandType === 1) { // 内容制作费
          statusObj.wbp_status = status
        } else if (demandType === 2) {
          statusObj.epo_status = status
        }

        getGlobalDemandLists(
          [{
            dept_ids: department,
            type: demandType,
            product_code: selectedProduct,
            bill_no: billNo,
            detail_bill_no: detailBillNo,
            applicant: applicant ? applicant.split(';') : undefined,
            name: demandName,
            detail_name: materialName,
            status: iomc_status || undefined,
            ...statusObj,
            is_base
          }],
          this.page,
          this.pageSize,
          year
        ).then(res => {
          this.isEmpty = true
          this.currentDemandType = demandType
          const { items, total } = res.content
          if (total > 0) {
            this.isEmpty = false
          }

          if (demandType === 1) {
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
          this.loading = false
          this.loadingData = false
        })
      })
    },
    deleteConsume(item) {
      this.$confirm({
        title: '删除需求申请单',
        content: `确定要删除需求申请单【${item.name}】吗？`,
        onOk: () => {
          delConsumeItem(
            this.currentDemandType,
            [].concat(item.id)
          ).then(() => {
            this.$message.success('删除成功')
            this.getDemands()
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
            this.getDemands()
          })
        }
      })
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
    resetDemands() {
      this.searchForm.resetFields()
      this.getDemands(undefined, true)
    },
    onDemandTypeChange(value) {
      this.searchForm.resetFields('selectedProduct')
      if (value) {
        this.getProducts(value)
      }
    },
    exportConsumeGlobal() {
      this.exportingConsume = true
      this.searchForm.validateFields((error, values) => {
        if (error) {
          this.exportingConsume = false
          this.$message.info('请先选择需求类型再导出，没有需求类型请联系管理员开通权限！')
          return
        }

        const {
          demandType,
          selectedProduct,
          billNo,
          detailBillNo,
          applicant,
          year,
          demandName,
          materialName,
          status,
          iomc_status,
          department
        } = values
        // demandType变化时重新获取流程节点
        if (demandType !== this.currentDemandType) {
          this.getWorkflowStep(demandType)
        }
        const statusObj = {}
        if (demandType === 1) { // 内容制作费
          statusObj.wbp_status = status
        } else if (demandType === 2) {
          statusObj.epo_status = status
        }

        exportConsumeItemGlobal(
          [{
            dept_ids: department,
            type: demandType,
            product_code: selectedProduct,
            bill_no: billNo,
            detail_bill_no: detailBillNo,
            applicant: applicant ? applicant.split(';') : undefined,
            name: demandName,
            detail_name: materialName,
            status: iomc_status || undefined,
            ...statusObj
          }],
          this.page,
          this.pageSize,
          year
        ).then(res => {
          this.$message.success('导出成功！')
        }).catch(err => {
          this.$message.error(`导出失败：${err}`)
        }).finally(() => {
          this.exportingConsume = false
        })
      })
    },
    closeConsume(item) {
      this.$confirm({
        title: '结项需求申请单',
        content: `确定要结项需求申请单【${item.name}】吗？`,
        onOk: () => {
          closeEpo(item.id).then(res => {
            this.$message.success('结项成功')
            this.getDemands()
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.demand-search {
  .subpage-content {
    .omc-table {
      margin-top: 15px;
      .omc-table-content {
        position: relative;
      }
    }
  }
}
.col-left {
  display: flex;
  align-items: center;
  margin-right: 10px;

  .wbp-link {
    text-decoration: underline;
  }
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
.expand-button {
  margin-right: 10px;
}
.thing_btn,.exp_btn{
  margin-left: 10px;
}
</style>
