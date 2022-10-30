<template>
  <div>
    <demand-approval-list
      :title="'审批配置列表'"
      :work-type="3"
      :resource-rule="'consume:*:*:item_type/3'"
    />
  </div>
</template>
<script>
import DemandApprovalList from './list'

export default {
  name: 'DemandApprovalEpoCp',
  components: {
    DemandApprovalList
  }
}
</script>
<style lang="less" scoped>
</style>
