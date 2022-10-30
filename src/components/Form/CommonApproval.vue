<template>
  <a-form :form="form" class="omc-approve-from">
    <a-form-item class="col-avatar margin-bottom-zero">
      <div class="p-avatar">
        <img :src="userAvatar" />
      </div>
    </a-form-item>
    <a-form-item class="col-control margin-bottom-zero">
      <a-radio-group
        v-decorator="[
          'operate_status',
          {
            initialValue: defaultOperateStatus,
            rules: [
              {
                required: true,
                message: '必选项'
              }
            ]
          }
        ]"
      >
        <a-radio :value="1">审批通过</a-radio>
        <a-radio :value="2">审批驳回</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item class="col-textarea margin-bottom-zero">
      <a-textarea
        v-decorator="[
          'comment',
          {
            initialValue: ''
          }
        ]"
        placeholder="备注"
        rows="1"
      ></a-textarea>
    </a-form-item>
    <a-form-item class="col-btn margin-bottom-zero">
      <a-button type="primary" @click="submit">提交</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
/**
 * @emits submit 提交审核，参数为operate_status、comment
 */
export default {
  name: 'CommonApproval',
  props: {
    userAvatar: {
      type: String,
      required: true,
      default: ''
    },
    defaultOperateStatus: {
      type: Number,
      default: undefined
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {
      name: 'approval_form'
    })
  },
  methods: {
    submit() {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.$emit('submit', values)
      })
    },
    reset() {
      this.form.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.margin-bottom-zero {
  margin-bottom: 0;
}
</style>
