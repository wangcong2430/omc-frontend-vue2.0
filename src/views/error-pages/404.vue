<template>
  <div class="empty-page">
    <a-empty>
      <span slot="description">无权限访问/该页面不存在</span>
      <a-button type="primary" @click="goToFirstPage">跳转回首页</a-button>
    </a-empty>
  </div>
</template>

<script>
export default {
  name: 'Page404',
  methods: {
    goToFirstPage() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="less" scoped>
.empty-page {
  padding-top: 100px;
  display: flex;
  justify-content: center;
  .ant-empty {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
}
</style>
