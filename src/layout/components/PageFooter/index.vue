<template>
  <div class="page-footer">
    <div class="col-logo"><i class="omc-logo2"></i></div>
    <div class="col-copyright">© {{ currentYear }} IEG外采费用管理</div>
    <div class="col-text">
      <span>合作团队：研发效能部/IEG财务管理/互动娱乐服务采购部</span>
      <span>系统管理员：<a href="wxwork://message?username=brucepsun">Brucepsun(孙鹏)</a></span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PageFooter',
  data() {
    return {
      currentYear: new Date().getFullYear()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
