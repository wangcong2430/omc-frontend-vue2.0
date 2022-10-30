<template>
  <div>
    <no-task v-if="isNoTask"></no-task>
    <template v-else>
      <table class="table-default">
        <thead>
          <tr>
            <th v-if="workbenchType === 1" width="40">
              <a-checkbox
                :indeterminate="indeterminate"
                :checked="checkAll"
                @change="onCheckAllChange"
              ></a-checkbox>
            </th>
            <th>需求单号</th>
            <th>需求名称</th>
            <th>明细</th>
            <th v-if="currentWorkType === 1">需求金额(元)</th>
            <th>申请人</th>
            <th>提交时间</th>
            <th>IOMC审批状态</th>
            <th v-if="workbenchType === 2">审批人</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(list, i) in tableData" :key="`${list.id}-${i}`">
            <td v-todo="workbenchType" :rowspan="1">
              <a-checkbox
                v-if="filterActionOpt(list.opList)"
                :checked="list.checked"
                @change="onChange($event, list)"
              ></a-checkbox>
            </td>
            <td
              class="bill-no"
              @click="showBudgetDetail(list)"
            >{{ list.detail.bill_no }}</td>
            <td>{{ list.detail.name }}</td>
            <td>{{ list.detail.detail_count }}项</td>
            <td v-if="currentWorkType === 1">{{ list.detail.estimate | formatNumber }}</td>
            <td>{{ list.detail.applicant }}</td>
            <td>{{ list.created_at }}</td>
            <td>
              <span
                :class="formatCurrentStatus(list.status)"
              >{{ concatWorkflowStatusText(list.status, list.node_name) }}</span>
            </td>
            <td v-if="workbenchType === 2">{{ list.reviewers ? list.reviewers.join(';') : '-' }}</td>
            <td>
              <ul class="omc-inline-actions">
                <li v-for="opt in list.opList" :key="opt.name" @click="approvalBudget(list, opt)">
                  <a href="javascript:;" class="btn-second">{{ opt.name }}</a>
                </li>
                <li @click="showBudgetDetail(list)">
                  <a href="javascript:;" class="btn-icon">
                    <i class="mdi-set mdi-text-subject"></i>
                    <span>查看明细</span>
                  </a>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="omc-table-pagination">
        <pagination
          :current="page"
          :page-size="pageSize"
          :total="total"
          :show-size-changer="true"
          @change="onPageChange"
          @showSizeChange="onPageSizeChange"
        ></pagination>
      </div>
    </template>
    <worktable-checkbar
      v-if="workbenchType === 1"
      :checked-list="checkedList"
      @cancelCheck="cancelCheck"
      @rejectAll="rejectAll"
      @approvalAll="approvalAll"
    ></worktable-checkbar>
    <detail-modal
      :budget-expenses="budgetExpenses"
      :detail-data="detailData"
      :show="showDetailModal"
      :step-lists="stepLists"
      :current-step="currentStep"
      :error-step="errorStep"
      :budget-type="getCurrentBudgetType()"
      :show-workflow-detail="true"
      :workflow-details="workflowDetails"
      @close="onClose"
    >
      <template #modalFoot>
        <div v-if="workbenchType === 1 && !hideDetailAction" class="modal-foot">
          <common-approval
            ref="commonApproval"
            :user-avatar="userAvatar"
            @submit="onSubmitApproval"
          ></common-approval>
        </div>
      </template>
    </detail-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import NoTask from '@/components/NoTask/index'
import Pagination from '@/components/Pagination/index'
import CommonApproval from '@/components/Form/CommonApproval'
import WorktableCheckbar from './components/worktable-checkbar/index'
import DetailModal from '@/views/demand/list/detail-modal'
import workbenchMixins from './mixins/index'
import { getDoneFlows, getTodoFlows, handleFlows, getFlowStep, getFlowHistory } from '@/api/workflow'
import { formatWorkflowStatus, concatWorkflowStatusText } from '@/utils/approval'
import { checkPermission } from '@/utils/permission'
import { parseStringToJson } from '@/utils/index'
import todo from './directive/index'
import moment from 'moment'
import { findLastIndex } from 'lodash/array'
import { getConsumeStat } from '@/api/demand/index'

export default {
  name: 'WorkbenchDemand',
  components: {
    NoTask,
    Pagination,
    CommonApproval,
    WorktableCheckbar,
    DetailModal
  },
  directives: todo,
  mixins: [workbenchMixins],
  props: {
    workbenchType: { // 1-我的待办、2-我的已办
      type: Number,
      required: true
    },
    currentWorkType: { // 1-需求研发费、2-需求内容制作费、3-需求内容制作费（自行采购）
      type: Number,
      required: true
    },
    updateSummary: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      isNoTask: true,
      page: 1,
      pageSize: 15,
      total: 0,
      showDetailModal: false,
      detailData: {},
      stepLists: [],
      currentStep: 0,
      errorStep: {},
      backlogId: '',
      hideDetailAction: true,
      handleReason: '',
      workflowDetails: [],
      budgetExpenses: {}
    }
  },
  computed: {
    ...mapState({
      userAvatar: state => state.user.avatar
    })
  },
  watch: {
    workbenchType(newVal) {
      this.page = 1
      this.pageSize = 15
      this.tableData = []
      this.getDemandList()
    },
    currentWorkType(newVal) {
      this.page = 1
      this.pageSize = 15
      this.tableData = []
      this.getDemandList()
      this.getWorkflowStep()
    }
  },
  created() {
    this.getDemandList()
    this.getWorkflowStep()
  },
  methods: {
    getDemandList() {
      let handleFun = null
      if (this.workbenchType === 1) {
        handleFun = getTodoFlows
      } else if (this.workbenchType === 2) {
        handleFun = getDoneFlows
      }

      if (!handleFun) {
        return
      }

      handleFun(this.page, this.pageSize, this.currentWorkType).then(res => {
        const { list, count } = res.content
        this.total = count
        if (count > 0) {
          this.isNoTask = false
        } else {
          this.isNoTask = true
        }
        this.checkedList = []
        this.indeterminate = false
        this.checkAll = false
        this.tableData = list.map(item =>
          Object.assign({}, item, {
            checked: false,
            detail: parseStringToJson(item.detail, {})
          })
        )
        // 最后一页的数量小于1向前获取前一页数据
        if (this.page < 1) {
          return
        }
        const prevPage = this.page - 1
        if (list < 1 && prevPage > 0) {
          this.page = prevPage
          this.getDemandList()
        }
      })
    },
    getWorkflowStep() {
      getFlowStep(this.currentWorkType).then(res => {
        const { content } = res
        this.stepLists = content
      })
    },
    onPageChange({ page, pageSize }) {
      this.page = page
      this.getDemandList()
    },
    onPageSizeChange(pageSize) {
      this.page = 1 // 默认切换回第一页
      this.pageSize = pageSize
      this.getDemandList()
    },
    cancelCheck() {
      this.checkedList = []
      this.indeterminate = false
      this.checkAll = false
      this.tableData = this.tableData.map(item => Object.assign({}, item, { checked: false }))
    },
    // 过滤掉可以撤销的数据
    filterActionOpt(opts) {
      if (!opts || !Array.isArray(opts)) {
        return false
      }
      return opts.findIndex(opt => opt.action === 3) === -1
    },
    rejectAll(reason = '') {
      if (!checkPermission(['button/workbench_demand_reject'])) {
        return this.$message.info('您没有权限进行驳回所有，请联系管理员开通权限！')
      }
      const checkedFlows = []
      this.checkedList.forEach(item => {
        checkedFlows.push({
          record_id: item.record_id,
          action: 2,
          reason
        })
      })
      handleFlows(checkedFlows).then(res => {
        this.$message.success('提交审批成功')
        this.$store.dispatch('workbench/getTodoCount')
        // this.$store.dispatch('workbench/getDoneCount')
        this.getDemandList()
        this.updateSummary()
      })
    },
    approvalAll(reason = '') {
      if (!checkPermission(['button/workbench_demand_audit'])) {
        return this.$message.info('您没有权限进行一键审批通过，请联系管理员开通权限！')
      }
      const checkedFlows = []
      this.checkedList.forEach(item => {
        checkedFlows.push({
          record_id: item.record_id,
          action: 1,
          reason
        })
      })
      handleFlows(checkedFlows).then(res => {
        this.$message.success('提交审批成功')
        this.$store.dispatch('workbench/getTodoCount')
        // this.$store.dispatch('workbench/getDoneCount')
        this.getDemandList()
        this.updateSummary()
      })
    },
    approvalBudget(list, actionOpt) { // actionOpt: {name: 操作名称, action: 1-通过/撤销、2-驳回}
      this.backlogId = list.record_id
      this.handleReason = ''
      this.$confirm({
        title: '审批',
        content: (h) => {
          return h('div', [
            h('div', {
              style: {
                marginBottom: '10px'
              }
            }, `确定要${actionOpt.name}审批单吗？`),
            h('a-textarea', {
              props: {
                autoSize: { minRows: 4 },
                placeholder: '请输入审批原因（可选）'
              },
              model: {
                value: this.handleReason,
                callback: (value) => {
                  this.handleReason = value
                }
              }
            })
          ])
        },
        onOk: () => {
          this.submitApproval(actionOpt.action, this.handleReason)
        },
        onCancel: () => {
          this.backlogId = ''
        }
      })
    },
    getConsumeDetail(item) {
      return new Promise((resolve, reject) => {
        const formData = []
        if (!item.detail || !Array.isArray(item.detail.detail_items)) {
          return resolve(formData)
        }
        if (this.currentWorkType === 1) { // 需求研发费
          item.detail.detail_items.forEach(detail => {
            formData.push({
              bill_no: detail.bill_no,
              workload_amount: detail.dev_work_amount,
              type: detail.dev_type,
              type_name: detail.dev_type_name,
              workload: detail.dev_workload,
              workload_unit: detail.dev_work_unit,
              complete_date: moment(detail.dev_complete_date).format('YYYY-MM-DD'),
              year: detail.year,
              has_supplicant: detail.dev_has_supplicant,
              remark: detail.dev_remark
            })
          })
        } else if (this.currentWorkType === 2) { // 需求内容制作费
          item.detail.detail_items.forEach(detail => {
            const images = parseStringToJson(detail.cnt_pic, [])
            formData.push({
              bill_no: detail.bill_no,
              workload_amount: detail.cnt_work_amount,
              type: detail.cnt_type,
              type_name: detail.cnt_type_name,
              name: detail.cnt_name,
              attr: parseStringToJson(detail.cnt_attr, []),
              breakdown: parseStringToJson(detail.cnt_breakdown, []),
              workload: detail.cnt_workload,
              workload_unit: detail.cnt_work_unit,
              level: detail.cnt_level,
              complete_date: moment(detail.cnt_complete_date).format('YYYY-MM-DD'),
              supplicant: detail.cnt_intent_supplicant,
              test: detail.cnt_has_test,
              remark: detail.cnt_remark,
              images: images ? images.map((img, i) => {
                return {
                  uid: `-${i + 1}`,
                  status: 'done',
                  id: img.file_id,
                  size: img.file_size,
                  name: img.file_name,
                  url: img.file_url
                }
              }) : []
            })
          })
        } else if (this.currentWorkType === 3) { // 需求内容制作费（自行采购）
          item.detail.detail_items.forEach(detail => {
            formData.push({
              type_name: detail.cnt_type_name,
              workload_amount: detail.cnt_work_amount || 0
            })
          })
        }
        resolve(formData)
      })
    },
    async showBudgetDetail(item) {
      // 过滤掉撤销操作的数据
      if (item.opList && Array.isArray(item.opList)) {
        this.hideDetailAction = item.opList.findIndex(opt => opt.action === 3) !== -1
      }

      if (!item.detail) {
        return
      }
      const consumeDetail = {
        product_name: item.detail.product_name,
        dept_name: item.detail.dept_name,
        name: item.detail.name,
        pm_name: item.detail.pm_name,
        receiver_names: item.detail.receiver_names,
        purchaser: item.detail.purchaser,
        begin_date: moment(item.detail.begin_date).format('YYYY-MM-DD'),
        end_date: moment(item.detail.end_date).format('YYYY-MM-DD'),
        description: item.detail.description,
        output: this.currentWorkType === 1 ? item.detail.output : undefined,
        verify_standard: this.currentWorkType === 1 ? item.detail.verify_standard : undefined,
        background_desc: this.currentWorkType === 1 ? item.detail.background_desc : undefined,
        tech_desc: this.currentWorkType === 1 ? item.detail.tech_desc : undefined,
        service_location: this.currentWorkType === 1 ? item.detail.service_location : undefined,
        bill_no: item.detail.bill_no,
        attachments: parseStringToJson(item.detail.attachments, []),
        status: item.detail.status,
        is_base: item.detail.is_base,
        year: item.detail.year,
        expect_date: item.detail.expect_date,
        memo: item.detail.memo,
        dev_category_name: item.detail.category_name, // 研发费研发类别名称
        product_code: item.detail.product_code,
        workload_count: item.detail.detail_count,
        artist_name: item.artist_name // 画师
      }

      const historyFlowInstanceIds =
        item.detail.history_flow_instance_ids
          ? item.detail.history_flow_instance_ids.split(',')
          : []
      Promise.all([
        getFlowHistory(
          historyFlowInstanceIds.includes(item.flow_instance_id)
            ? [...historyFlowInstanceIds]
            : [...historyFlowInstanceIds, item.flow_instance_id],
          1
        ),
        this.getConsumeDetail(item)
      ]).then(res => {
        const steps = res[0].content
        if (!steps) {
          return
        }

        let currentStepNode = null
        const currentStepIndex = findLastIndex(this.stepLists, list => {
          const step = steps.find(s => s.node_name === list)
          if (step) {
            currentStepNode = step
            return true
          }
          return false
        })
        this.currentStep = 0
        this.errorStep = {}
        if (currentStepIndex > -1) {
          if (item.status && item.status === 8) { // 驳回
            this.currentStep = currentStepIndex
            this.errorStep = { [currentStepIndex]: item.reject_reason ? item.reject_reason : '没有驳回原因' }
          } else {
            if (currentStepNode && currentStepNode.status === 1) { // 待处理
              this.currentStep = currentStepIndex
            } else { // 已处理
              this.currentStep = currentStepIndex + 1
            }
          }
        }

        // 如果到流程最后一步，则走到已完成
        if (
          currentStepNode &&
          currentStepNode.status === 2 &&
          currentStepIndex === this.stepLists.length - 2
        ) {
          this.currentStep = currentStepIndex + 2
        }

        this.workflowDetails = steps
        this.detailData = {
          message: consumeDetail,
          details: res[1]
        }
        this.backlogId = item.record_id
        this.showDetailModal = true
        // eslint-disable-next-line no-unused-vars
        const targetData = res[1]
        let result = 0
        for (let n = 0; n < targetData.length; n++) {
          if (targetData[n].breakdown && Array.isArray(targetData[n].breakdown) && targetData[n].breakdown.length > 0) {
            targetData[n].breakdown.forEach(m => {
              result += m.value
            })
          } else {
            result += targetData[n].workload
          }
        }
        this.detailData.message.workload_count = result
        // 获取预算
        getConsumeStat(item.detail.year, item.detail.product_code, item.detail.dept_id).then(res => {
          if (item.work_type === 1) {
            this.budgetExpenses = res.content.items[1]
          } else {
            this.budgetExpenses = res.content.items[0]
          }
        })
      })
    },
    onClose() {
      this.showDetailModal = false
      this.backlogId = ''
      if (this.$refs['commonApproval'] && this.workbenchType === 1) {
        this.$refs['commonApproval'].reset()
      }
    },
    formatCurrentStatus(currentStatus) {
      return formatWorkflowStatus(currentStatus)
    },
    concatWorkflowStatusText(status, text) {
      return concatWorkflowStatusText(status, text)
    },
    async onSubmitApproval(values) {
      if (values.operate_status === 1 && !checkPermission(['button/workbench_demand_audit'])) {
        return this.$message.info('您没有权限进行审批通过，请联系管理员开通权限！')
      }
      if (values.operate_status === 2 && !checkPermission(['button/workbench_demand_reject'])) {
        return this.$message.info('您没有权限进行审批驳回，请联系管理员开通权限！')
      }
      await this.submitApproval(values.operate_status, values.comment)
      if (this.$refs['commonApproval'] && this.workbenchType === 1) {
        this.$refs['commonApproval'].reset()
      }
    },
    submitApproval(status, comment) {
      if (this.backlogId === '') {
        return this.$message.info('请先选择审批单！')
      }
      const checkedFlow = [{
        record_id: this.backlogId,
        action: status,
        reason: comment
      }]
      handleFlows(checkedFlow)
        .then(res => {
          this.backlogId = ''
          this.handleReason = ''
          this.showDetailModal = false
          this.getDemandList()
          this.$store.dispatch('workbench/getTodoCount')
          // this.$store.dispatch('workbench/getDoneCount')
          this.updateSummary()
          this.$message.success('提交审批成功')
        })
    },
    getCurrentBudgetType() { // 1-需求研发费、2-需求内容制作费、3-需求内容制作费（自行采购）
      switch (this.currentWorkType) {
        case 1:
          return 2
        case 2:
          return 1
        case 3:
          return 3
        default:
          return -1
      }
    }
  }
}
</script>
<style lang="less" scoped>
.bill-no {
  color: #4939c4;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>
