<template>
  <div>
    <no-task v-if="isNoTask"></no-task>
    <template v-else>
      <table class="table-default">
        <thead>
          <tr>
            <th v-if="workbenchType === 0" width="40">
              <a-checkbox
                :indeterminate="indeterminate"
                :checked="checkAll"
                @change="onCheckAllChange"
              ></a-checkbox>
            </th>
            <th>部门</th>
            <th>成本中心</th>
            <th>类型</th>
            <th>项目</th>
            <th>金额(元)</th>
            <th>追加申请人</th>
            <th>追加时间</th>
            <th>IOMC审批状态</th>
            <th data-actions="true">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(list, i) in tableData" :key="`${list.id}-${i}`">
            <td v-todo :rowspan="1">
              <a-checkbox :checked="list.checked" @change="onChange($event, list)"></a-checkbox>
            </td>
            <td>{{ list.depart_name }}</td>
            <td>{{ list.cost_center_name }}</td>
            <td>{{ list.budget_name }}</td>
            <td>{{ list.budget_item_total }}项</td>
            <td>{{ list.budget_total | formatNumber }}</td>
            <td>{{ list.create_user }}</td>
            <td>{{ list.last_update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
            <td>
              <span
                :class="formatCurrentStatus(list.current_status)"
              >{{ list.current_status | concatStatusText(list.current_handler) }}</span>
            </td>
            <td data-actions="true">
              <ul class="omc-inline-actions">
                <li v-permission="['button/workbench_increase_audit']" v-todo @click="approvalIncrease(list)">
                  <a href="javascript:;" class="btn-second">通过</a>
                </li>
                <li v-permission="['button/workbench_increase_reject']" v-todo>
                  <a href="javascript:;" class="btn-second">驳回</a>
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
    <increase-modal
      :show-detail-list="showDetailList"
      :modal-status="showDetailModal"
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
    </increase-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import NoTask from '@/components/NoTask/index'
import Pagination from '@/components/Pagination/index'
import CommonApproval from '@/components/Form/CommonApproval'
import WorktableCheckbar from './components/worktable-checkbar/index'
import IncreaseModal from '@/views/budget/increase/increase-list/increase-modal/index'
import workbenchMixins from './mixins/index'
import { getBacklogList, completeBacklog } from '@/api/workbench/index'
import { getAppendInfo } from '@/api/budget/increase'
import { getAuditProgress } from '@/api/budget/index'
import { formatStatus, formatApprovalData } from '@/utils/approval'
import { checkPermission } from '@/utils/permission'
import todo from './directive/index'

export default {
  name: 'WorkbenchIncrease',
  components: {
    NoTask,
    Pagination,
    CommonApproval,
    WorktableCheckbar,
    IncreaseModal
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
      showDetailList: {
        department: '',
        cost_center: '',
        budget_name: '',
        budget_type: '',
        budget_total: '',
        list: []
      },
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
      this.getIncreaseList()
    }
  },
  created() {
    this.getIncreaseList()
  },
  methods: {
    getIncreaseList() {
      getBacklogList(this.page, this.pageSize, 2, this.workbenchType).then(res => {
        const { data } = res
        this.total = data.count
        if (data.count > 0) {
          this.isNoTask = false
        } else {
          this.isNoTask = true
        }
        this.checkedList = []
        this.indeterminate = false
        this.checkAll = false
        this.tableData = data.list.map(item => Object.assign({}, item.process, { backlog_id: item.backlog_id, checked: false }))
      })
    },
    onPageChange({ page, pageSize }) {
      this.page = page
      this.getIncreaseList()
    },
    onPageSizeChange(pageSize) {
      this.page = 1
      this.pageSize = pageSize
      this.getIncreaseList()
    },
    cancelCheck() {
      this.checkedList = []
      this.indeterminate = false
      this.checkAll = false
      this.tableData = this.tableData.map(item => Object.assign({}, item, { checked: false }))
    },
    async showBudgetDetail(list) {
      const res = await getAuditProgress(list.instance_id)
      const steps = formatApprovalData(res.data)
      this.stepLists = steps.stepLists
      this.errorStep = steps.errorStep
      this.currentStep = steps.currentStep
      const promise = new Promise((resolve, reject) => {
        if (list.budget_type === 'cp') {
          getAppendInfo(list.id).then(res => {
            const { data } = res
            resolve(data)
          }).catch(err => reject(err))
        }
        getAppendInfo(list.id).then(res => {
          const { data } = res
          resolve(data)
        }).catch(err => reject(err))
      })
      promise.then(res => {
        this.showDetailList = {
          department: list.depart_name,
          cost_center: list.cost_center_name,
          budget_name: list.budget_name,
          budget_type: list.budget_type,
          budget_total: list.budget_total,
          list: res.form[0].lists
        }
        this.backlogId = list.backlog_id
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
    rejectAll() {
      if (!checkPermission(['button/workbench_increase_reject'])) {
        return this.$message.info('您没有权限进行驳回所有，请联系管理员开通权限！')
      }
      const backlogIds = []
      this.checkedList.forEach(item => {
        backlogIds.push(item.backlog_id)
      })
      completeBacklog(backlogIds, 2, '').then(res => {
        this.$message.success('提交审批成功')
        this.$store.dispatch('workbench/getTodoCount')
        this.getIncreaseList()
      })
    },
    approvalAll() {
      if (!checkPermission(['button/workbench_increase_audit'])) {
        return this.$message.info('您没有权限进行一键审批通过，请联系管理员开通权限！')
      }
      const backlogIds = []
      this.checkedList.forEach(item => {
        backlogIds.push(item.backlog_id)
      })
      completeBacklog(backlogIds, 1, '').then(res => {
        this.$message.success('提交审批成功')
        this.$store.dispatch('workbench/getTodoCount')
        this.getIncreaseList()
      })
    },
    approvalIncrease(list) {
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
    rejectIncrease(list) {
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
    formatCurrentStatus(currentStatus) {
      return formatStatus(currentStatus)
    },
    async onSubmitApproval(values) {
      if (values.operate_status === 1 && !checkPermission(['button/workbench_increase_audit'])) {
        return this.$message.info('您没有权限进行审批通过，请联系管理员开通权限！')
      }
      if (values.operate_status === 2 && !checkPermission(['button/workbench_increase_reject'])) {
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
        this.getIncreaseList()
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
