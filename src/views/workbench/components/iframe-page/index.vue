<template>
  <div v-if="url" id="iframe-wrapper">
    <iframe
      id="page-detail"
      frameborder="0"
      :src="url"
    />
  </div>
</template>
<script>
export default {
  name: 'WorkbenchIframePage',
  data() {
    return {
      url: ''
    }
  },
  created() {
    if (this.$route.meta.url) {
      let tmpUrl = this.$route.meta.url
      if (window.location.hostname.endsWith('.woa.com')) {
        tmpUrl = tmpUrl.replace('.oa.com', '.woa.com')
        tmpUrl = tmpUrl.replace('idea.waibao', 'wbp')
      }
      this.url = tmpUrl
    }
  },
  mounted() {
    if (window.location.hostname === 'iomc.oa.com' && window.location.protocol === 'https:') {
      window.location.href = window.location.href.replace('iomc.oa.com', 'iomc.woa.com')
    }
  }
}
</script>
<style lang="less" scoped>
#iframe-wrapper {
  width: 100%;
  height: 100%;

  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
