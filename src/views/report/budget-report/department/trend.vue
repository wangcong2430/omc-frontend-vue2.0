<template>
  <div class="col-7">
    <div class="omc-box">
      <div class="box-head">
        <h2 class="box-title">预算趋势</h2>
        <div class="box-actions"></div>
      </div>
      <div class="box-body">
        <highcharts :options="options" class="omc-report-chart1"></highcharts>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DepartBudgetTrend',
  props: {
    options: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
