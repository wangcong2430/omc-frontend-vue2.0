<template>
  <div class="page-wrapper">
    <div class="page-content-outside">
      <app-main class="page-container" />
    </div>
  </div>
</template>

<script>
import { AppMain } from './components'

export default {
  name: 'LayoutOutside',
  components: {
    AppMain
  },
  computed: {
  },
  created() {
    this.$store.dispatch('user/getInfo')
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.page-content-outside {
  position: relative;
  flex: 1
}
</style>
