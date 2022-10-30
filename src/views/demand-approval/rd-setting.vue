<template>
  <div>
    <demand-approval-list
      :title="'审批配置列表'"
      :work-type="1"
      :resource-rule="'consume:*:*:item_type/2'"
    />
  </div>
</template>
<script>
import DemandApprovalList from './list'

export default {
  name: 'DemandApprovalRd',
  components: {
    DemandApprovalList
  }
}
</script>
<style lang="less" scoped>
</style>
