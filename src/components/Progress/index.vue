<template>
  <div class="progress-item" :style="{backgroundColor: strokeColor}">
    <div class="progress-bar" :style="{width: `${percent}%`}"></div>
  </div>
</template>
<script>
export default {
  name: 'OmcProgress',
  props: {
    percent: {
      type: [Number, String],
      default: 0
    },
    strokeColor: {
      type: String,
      default: '#6b5aed'
    }
  }
}
</script>
<style lang="less" scoped>
</style>
