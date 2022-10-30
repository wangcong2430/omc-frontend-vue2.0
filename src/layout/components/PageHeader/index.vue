<template>
  <div>
    <div class="page-header">
      <div class="page-head-row">
        <div class="col-left">
          <div class="page-brand"><i class="omc-logo"></i></div>
          <div class="page-title">{{ breadcrumbText }}</div>
        </div>
        <div class="col-right">
          <ul class="page-head-bar">
            <li>
              <a href="https://cos.ap-guangzhou.myqcloud.com/iomc-1258344700/public/78548b707a558f46609af55478f22fc0/%E5%86%85%E5%AE%B9%E5%88%B6%E4%BD%9C%E8%B4%B9%E6%9D%83%E9%99%90%E7%94%B3%E8%AF%B7.xlsx" class="head-link" target="_blank">
                内容制作费权限申请
              </a>
            </li>
            <li>
              <a href="https://iomc-1258344700.cos.ap-guangzhou.myqcloud.com/public/9d09c7a2eaeef5a87c46905b5d5e04bb" class="head-link" target="_blank">
                研发费权限申请
              </a>
            </li>
            <li>
              <a href="http://tapd.oa.com/iomc_feedback/markdown_wikis/show/#1220426999001822341" class="head-link" target="_blank">
                指引帮助
              </a>
            </li>
            <li>
              <div class="head-personal">
                <div class="personal-avatar">
                  <img :src="userAvatar.replace('.oa.', '.woa.')">
                </div>
                <div class="personal-name">{{ englishName }}<i class="mdi-set mdi-chevron-down ml-10"></i></div>
                <ul class="personal-dropdown">
                  <li @click="logOut"><a href="javascript:;">退出登录</a></li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'PageHeader',
  data() {
    return {
      breadcrumbText: this.$route.meta.title
    }
  },
  computed: {
    ...mapState({
      englishName: state => state.user.englishName,
      userAvatar: state => state.user.avatar
    })
  },
  watch: {
    $route(route) {
      if (route.meta && route.meta.title) {
        this.breadcrumbText = route.meta.title
      } else {
        this.breadcrumbText = ''
      }
    }
  },
  methods: {
    logOut() {
      const origin = process.env.NODE_ENV === 'development' ? 'http://test.iomc.oa.com' : window.location.origin
      const redirect = window.location.origin
      window.location.href = `${origin}/_logout/?url=${redirect}`
    }
  }
}
</script>
<style lang="less" scoped>
.page-wrapper .page-content .page-header .page-head-bar > li {
  border-left: none;
  &:last-child {
    border-left: 1px solid #e9eaf0;
  }
}
</style>
