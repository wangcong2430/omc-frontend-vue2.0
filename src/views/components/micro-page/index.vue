<template>
  <div id="micro-container" ref="subappContainer"></div>
</template>
<script>
import { startApp } from '@tencent/wujie'
import { wujiFetch } from '@/utils/micro-config'

export default {
  name: 'MicroPage',
  props: {
    url: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  mounted() {
    const meta = this.$route.meta
    const relativeUrl = this.url || (meta && meta.url)
    const name = this.name || (meta && meta.name) || relativeUrl
    let microHost = 'mytable.oa.com'
    if (window.location.hostname.endsWith('.woa.com')) {
      microHost = microHost.replace('.oa.com', '.woa.com')
    }
    if (this.$refs['subappContainer'] && !!relativeUrl) {
      this.$nextTick(() => {
        startApp({
          name: name,
          url: `//${microHost}/${relativeUrl}`,
          sync: true,
          el: this.$refs['subappContainer'],
          fetch: wujiFetch,
          props: {
            authId: 'iomc',
            authKey: 'f475ccdf40e241b388153d2f3410e31a',
            hideGetImportTemp: true, // 是否隐藏默认的下载导入模板按钮
            hideImportBtn: true, // 是否隐藏默认的导入按钮
            hideActionCol: true, // 是否隐藏操作列
            hideResetBtn: true // 是否隐藏重置按钮
          }
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
