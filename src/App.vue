<template>
  <a-config-provider :locale="locale" :prefix-cls="'iomc'">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

export default {
  name: 'App',
  data() {
    return {
      locale: zhCN
    }
  }
}
</script>
