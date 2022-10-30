<template>
  <div class="worktable-checkbar" :class="{'show': checkedList.length > 0}">
    <div class="col-close">
      <ul class="omc-inline-actions">
        <li>
          <a href="javascript:;" class="btn-icon" @click.stop="cancelCheck">
            <i class="mdi-set mdi-close"></i>
            <span>取消选中项</span>
          </a>
        </li>
      </ul>
    </div>
    <div class="col-text">已选中了{{ checkedList.length }}个审批单</div>
    <div class="col-action">
      <a href="javascript:;" class="btn-default" @click="rejectAll">驳回所有</a>
      <a href="javascript:;" class="btn-primary" @click="approvalAll">一键审批通过</a>
    </div>
    <a-modal
      :visible="visible && handleType !== 0"
      :title="handleType === 1 ? '审批驳回' : '审批通过'"
      :ok-text="handleType === 1 ? '驳回' : '通过'"
      :mask-closable="false"
      @cancel="onCancel"
      @ok="onOk"
    >
      <div class="approval-title">
        <span class="title-icon">
          <a-icon type="question-circle"></a-icon>
        </span>
        确定要{{ handleType === 1 ? '驳回' : '通过' }}所选的{{ checkedList.length }}个审批单吗？
      </div>
      <div class="reason-label">审批原因：</div>
      <a-textarea
        v-model="reason"
        :placeholder="`请输入${handleType === 1 ? '驳回' : '通过' }原因（可选）`"
        :auto-size="{minRows: 4}"
      />
    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'WorktableCheckbar',
  props: {
    checkedList: {
      type: Array,
      required: true,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      visible: false,
      handleType: 0, // 1-驳回所有，2-通过所有
      reason: ''
    }
  },
  methods: {
    cancelCheck() {
      this.$emit('cancelCheck')
    },
    rejectAll() {
      this.visible = true
      this.handleType = 1
    },
    approvalAll() {
      this.visible = true
      this.handleType = 2
    },
    onCancel() {
      this.visible = false
      this.reason = ''
    },
    onOk() {
      if (this.handleType === 1) {
        this.$emit('rejectAll', this.reason)
      } else if (this.handleType === 2) {
        this.$emit('approvalAll', this.reason)
      }
      this.visible = false
      this.reason = ''
    }
  }
}
</script>
<style lang="less" scoped>
.worktable-checkbar {
  z-index: 999;
}
.approval-title {
  margin-bottom: 20px;
  font-weight: bold;
  .title-icon {
    font-size: 22px;
    color:#faad14;
    margin-right: 10px;
    vertical-align: middle;
  }
}
.reason-label {
  margin-bottom: 5px;
}
</style>
