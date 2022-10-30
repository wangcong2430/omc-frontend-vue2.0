<template>
  <div>
    <div class="omc-table">
      <div class="omc-table-toolbar">
        <div class="col-left">
        </div>
        <div class="col-right">
          <ul class="table-actions">
            <li v-permission="['button/budget_planning_entry']">
              <router-link to="/budget/entry" class="btn-primary">新增预算</router-link>
            </li>
          </ul>
        </div>
      </div>
      <micro-page />
    </div>
  </div>
</template>
<script>
import MicroPage from '@/views/components/micro-page'

export default {
  name: 'BudgetPlannigList',
  components: {
    MicroPage
  }
}
</script>
<style lang="less" scoped>
</style>
