<template>
  <a-modal
    :width="1000"
    :visible="visible"
    @cancel="onClose"
  >
    <div class="approval-step">
      <div class="title">审批进度</div>
      <steps :step-lists="stepLists" :current-step="currentStep" :error-step="errorStep"></steps>
    </div>
    <div class="approval-log">
      <a-divider class="title">
        <div>审批日志</div>
        <div>
          <a-icon type="down" />
        </div>
      </a-divider>
    </div>
    <div class="approval-detail">
      <table class="detail-table">
        <thead>
          <tr>
            <th>审批环节</th>
            <th>IOMC审批状态</th>
            <th>审批结果</th>
            <th>审批时间</th>
            <th>审批人</th>
            <th width="30%">审批意见</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in workflowDetailSteps" :key="index">
            <td>{{ item.node_name }}</td>
            <td
              :class="item.status === 1 ? 'text-muted' : 'text-primary'"
            >{{ item.status === 1 ? '待处理' : '已处理' }}</td>
            <td :class="formatResultClass(item.result)">
              {{ item.result || '--' }}
            </td>
            <td>
              {{ item.status === 1 ? '--' : item.process_time }}
            </td>
            <td>{{ item.processor }}</td>
            <td>
              <text-limit :text="item.reason" :limit-length="40"></text-limit>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <template slot="footer">
      <a-button @click="onClose">关闭</a-button>
    </template>
  </a-modal>
</template>
<script>
import Steps from '@/components/Steps/index'
import TextLimit from '@/components/TextLimit'

export default {
  name: 'WorkflowDetail',
  components: {
    Steps,
    TextLimit
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    stepLists: {
      type: Array,
      default() {
        return []
      }
    },
    currentStep: {
      type: Number,
      default: 0
    },
    errorStep: {
      type: Object,
      default() {
        return {}
      }
    },
    workflowDetailSteps: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    onClose() {
      this.$emit('close')
    },
    formatResultClass(res) {
      switch (res) {
        case '同意':
          return 'text-success'
        case '驳回':
          return 'text-danger'
        default:
          return ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
.approval-step {
  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 18px;
  }
}
.approval-log {
  margin-top: 30px;
  .title {
    font-size: 16px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.65);
  }
}
.approval-detail {
  background-color: #f5f6fa;
  .detail-table {
    width: 100%;
    thead > tr > th {
      font-size: 14px;
      line-height: 20px;
      padding: 8px 12px;
      color: rgba(0, 0, 0, 0.65);
      font-weight: bold;
    }
    tbody > tr > td {
      font-size: 13px;
      line-height: 20px;
      padding: 17px 12px;
      vertical-align: top;
    }
  }
}
</style>
