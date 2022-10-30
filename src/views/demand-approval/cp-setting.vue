<template>
  <div>
    <demand-approval-list
      :title="'审批配置列表'"
      :work-type="2"
      :resource-rule="'consume:*:*:item_type/1'"
    />
  </div>
</template>
<script>
import DemandApprovalList from './list'

export default {
  name: 'DemandApprovalCp',
  components: {
    DemandApprovalList
  }
}
</script>
<style lang="less" scoped>
</style>
