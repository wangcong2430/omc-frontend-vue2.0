<template>
  <div>
    <no-task v-if="isNoTask"></no-task>
    <template v-else>
      <table class="table-secondary">
        <thead>
          <tr>
            <th v-if="workbenchType === 0" width="40">
              <a-checkbox
                :indeterminate="indeterminate"
                :checked="checkAll"
                @change="onCheckAllChange"
              ></a-checkbox>
            </th>
            <th>部门/成本中心</th>
            <th>项目</th>
            <th>类型</th>
            <th>调整金额</th>
            <th>申请人/申请时间</th>
            <th>IOMC审批状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody v-for="(list, i) in tableData" :key="`${list.id}-${i}`">
          <tr v-if="!list.child.length">
            <td v-todo>
              <a-checkbox :checked="list.checked" @change="onChange($event, list)"></a-checkbox>
            </td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>
              {{ list.create_user }}
              <span
                class="inline-block text-muted"
              >{{ list.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </td>
            <td>
              <span :class="formatCurrentStatus(list.current_status)">{{ list.current_status | concatStatusText(list.current_handler) }}</span>
            </td>
            <td data-actions="true">
              <ul class="omc-inline-actions">
                <li v-permission="['button/workbench_adjustment_audit']" v-todo @click="approvalAdjustment(list)">
                  <a href="javascript:;" class="btn-second">通过</a>
                </li>
                <li v-permission="['button/workbench_adjustment_reject']" v-todo @click="rejectAdjustment(list)">
                  <a href="javascript:;" class="btn-second">驳回</a>
                </li>
                <li @click="showAdjustmentDetail(list.backlog_id, list.instance_id, list.id, list.adjust_reason, list.adjust_cause)">
                  <a href="javascript:;" class="btn-icon">
                    <i class="mdi-set mdi-text-subject"></i>
                    <span>查看明细</span>
                  </a>
                </li>
              </ul>
            </td>
          </tr>
          <template v-else>
            <tr v-for="(child, index) in list.child" :key="index">
              <td v-if="index === 0" v-todo :rowspan="list.child.length">
                <a-checkbox :checked="list.checked" @change="onChange($event, list)"></a-checkbox>
              </td>
              <td>
                <span class="mr-10">{{ child.depart_name }}</span>
                <span class="inline-nowrap text-muted">{{ child.cost_center }}</span>
              </td>
              <td>{{ child.project_name }}</td>
              <td>{{ child.budget_type }}</td>
              <td>
                <span
                  :class="[child.adjust_price >= 0 ? 'text-danger' : 'text-success']"
                >{{ child.adjust_price | formatNumber(true) }}</span>
              </td>
              <td v-if="index === 0" :rowspan="list.child.length">
                {{ list.create_user }}
                <span
                  class="inline-block text-muted"
                >{{ list.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </td>
              <td v-if="index === 0" :rowspan="list.child.length">
                <span :class="formatCurrentStatus(list.current_status)">{{ list.current_status | concatStatusText(list.current_handler) }}</span>
              </td>
              <td v-if="index === 0" data-actions="true" :rowspan="list.child.length">
                <ul class="omc-inline-actions">
                  <li v-permission="['button/workbench_adjustment_audit']" v-todo @click="approvalAdjustment(list)">
                    <a href="javascript:;" class="btn-second">通过</a>
                  </li>
                  <li v-permission="['button/workbench_adjustment_reject']" v-todo @click="rejectAdjustment(list)">
                    <a href="javascript:;" class="btn-second">驳回</a>
                  </li>
                  <li @click="showAdjustmentDetail(list.backlog_id, list.instance_id, list.id, list.adjust_reason, list.adjust_cause)">
                    <a href="javascript:;" class="btn-icon">
                      <i class="mdi-set mdi-text-subject"></i>
                      <span>查看明细</span>
                    </a>
                  </li>
                </ul>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div class="omc-table-pagination">
        <pagination :total="total" :show-size-changer="true" @change="onPageChange" @showSizeChange="onPageSizeChange"></pagination>
      </div>
    </template>
    <worktable-checkbar
      v-if="workbenchType === 0"
      :checked-list="checkedList"
      @cancelCheck="cancelCheck"
      @rejectAll="rejectAll"
      @approvalAll="approvalAll"
    ></worktable-checkbar>
    <detail-modal
      :adjust-detail="adjustDetail"
      :status="showDetailModal"
      :adjust-reason="adjustReason"
      :adjust-cause="adjustCause"
      :step-lists="stepLists"
      :error-step="errorStep"
      :current-step="currentStep"
      @close="onClose"
    >
      <template #modalFoot>
        <div v-if="workbenchType === 0" class="modal-foot">
          <common-approval ref="commonApproval" :user-avatar="userAvatar" @submit="onSubmitApproval"></common-approval>
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
import DetailModal from '@/views/budget/adjustment/adjustment-list/adjustment-modal/detail-modal'
import workbenchMixins from './mixins/index'
import { getBacklogList, completeBacklog } from '@/api/workbench/index'
import { getAdjustDetail } from '@/api/budget/adjustment'
import { getAuditProgress } from '@/api/budget/index'
import { formatStatus, formatApprovalData } from '@/utils/approval'
import { checkPermission } from '@/utils/permission'
import todo from './directive/index'

export default {
  name: 'WorkbenchAdjustment',
  components: {
    NoTask,
    Pagination,
    CommonApproval,
    WorktableCheckbar,
    DetailModal
  },
  directives: todo,
  mixins: [workbenchMixins],
  data() {
    return {
      isNoTask: true,
      page: 1,
      pageSize: 15,
      total: 0,
      showDetailModal: false,
      adjustDetail: [],
      adjustReason: '',
      adjustCause: '',
      stepLists: [],
      errorStep: {},
      currentStep: 0,
      backlogId: ''
    }
  },
  computed: {
    ...mapState({
      userAvatar: state => state.user.avatar,
      workbenchType: state => state.workbench.workbenchType
    })
  },
  watch: {
    workbenchType(val) {
      this.page = 1
      this.tableData = []
      this.getAdjustmentList()
    }
  },
  created() {
    this.getAdjustmentList()
  },
  methods: {
    getAdjustmentList() {
      getBacklogList(this.page, this.pageSize, 3, this.workbenchType).then(res => {
        const { data } = res
        this.total = data.count
        if (data.count > 0) {
          this.isNoTask = false
        } else {
          this.isNoTask = true
        }
        this.indeterminate = false
        this.checkAll = false
        this.checkedList = []
        this.tableData = data.adjust_list.map(item => Object.assign({}, item.process, { backlog_id: item.backlog_id, checked: false }))
      })
    },
    onPageChange({ page, pageSize }) {
      this.page = page
      this.getAdjustmentList()
    },
    onPageSizeChange(pageSize) {
      this.page = 1
      this.pageSize = pageSize
      this.getAdjustmentList()
    },
    cancelCheck() {
      this.checkedList = []
      this.indeterminate = false
      this.checkAll = false
      this.tableData = this.tableData.map(item => Object.assign({}, item, { checked: false }))
    },
    async showAdjustmentDetail(backlogId, instanceId, uuid, reason, cause) {
      const res = await getAuditProgress(instanceId)
      const steps = formatApprovalData(res.data)
      this.stepLists = steps.stepLists
      this.errorStep = steps.errorStep
      this.currentStep = steps.currentStep
      getAdjustDetail(uuid).then(res => {
        const { data } = res
        this.adjustDetail = data
        this.adjustReason = reason
        this.adjustCause = cause
        this.backlogId = backlogId
        this.showDetailModal = true
      })
    },
    onClose() {
      this.backlogId = ''
      this.showDetailModal = false
      if (this.$refs['commonApproval'] && this.workbenchType === 0) {
        this.$refs['commonApproval'].reset()
      }
    },
    formatCurrentStatus(currentStatus) {
      return formatStatus(currentStatus)
    },
    rejectAll() {
      if (!checkPermission(['button/workbench_adjustment_reject'])) {
        return this.$message.info('您没有权限进行驳回所有，请联系管理员开通权限！')
      }
      const backlogIds = []
      this.checkedList.forEach(item => {
        backlogIds.push(item.backlog_id)
      })
      completeBacklog(backlogIds, 2, '').then(res => {
        this.$message.success('提交审批成功')
        this.$store.dispatch('workbench/getTodoCount')
        this.getAdjustmentList()
      })
    },
    approvalAll() {
      if (!checkPermission(['button/workbench_adjustment_audit'])) {
        return this.$message.info('您没有权限进行一键审批通过，请联系管理员开通权限！')
      }
      const backlogIds = []
      this.checkedList.forEach(item => {
        backlogIds.push(item.backlog_id)
      })
      completeBacklog(backlogIds, 1, '').then(res => {
        this.$message.success('提交审批成功')
        this.$store.dispatch('workbench/getTodoCount')
        this.getAdjustmentList()
      })
    },
    approvalAdjustment(list) {
      this.backlogId = list.backlog_id
      this.$confirm({
        title: '审批',
        content: '确定要通过审批吗？',
        onOk: () => {
          this.submitApproval(1, '')
        },
        onCancel: () => {
          this.backlogId = ''
        }
      })
    },
    rejectAdjustment(list) {
      this.backlogId = list.backlog_id
      this.$confirm({
        title: '审批',
        content: '确定要审批驳回吗？',
        onOk: () => {
          this.submitApproval(2, '')
        },
        onCancel: () => {
          this.backlogId = ''
        }
      })
    },
    async onSubmitApproval(values) {
      if (values.operate_status === 1 && !checkPermission(['button/workbench_adjustment_audit'])) {
        return this.$message.info('您没有权限进行审批通过，请联系管理员开通权限！')
      }
      if (values.operate_status === 2 && !checkPermission(['button/workbench_adjustment_reject'])) {
        return this.$message.info('您没有权限进行审批驳回，请联系管理员开通权限！')
      }
      await this.submitApproval(values.operate_status, values.comment)
      if (this.$refs['commonApproval'] && this.workbenchType === 0) {
        this.$refs['commonApproval'].reset()
      }
    },
    submitApproval(status, comment) {
      completeBacklog([this.backlogId], status, comment).then(res => {
        this.backlogId = ''
        this.showDetailModal = false
        this.getAdjustmentList()
        this.$store.dispatch('workbench/getTodoCount')
        if (this.workbenchType === 1) {
          this.$store.dispatch('workbench/getDoneCount')
        }
        this.$message.success('提交审批成功')
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
