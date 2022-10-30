<template>
  <div class="loading-modal">
    <div class="loading-content">
      <div v-if="showIcon" class="loading-icon">
        <a-icon type="loading"></a-icon>
        <div class="loading-text">{{ tipText }}</div>
      </div>
      <a-progress
        v-if="showProgress"
        :percent="percent"
        :stroke-color="'#6b5aed'"
        status="active"
        class="loading-progress"
      />
    </div>
    <div class="loading-blur"></div>
  </div>
</template>
<script>
export default {
  name: 'LoadingModal',
  props: {
    showIcon: {
      type: Boolean,
      default: true
    },
    tipText: {
      type: String,
      default: '加载中...'
    },
    showProgress: {
      type: Boolean,
      default: false
    },
    percent: {
      type: Number,
      default: 0
    }
  }
}
</script>
<style lang="less" scoped>
.loading-modal {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  display: block;
  width: 100%;
  height: 100%;
  opacity: 1;
  cursor: not-allowed;
  .loading-content {
    position: fixed;
    top: 50%;
    left: 50%;
    text-align: center;
    opacity: 1;
    width: 300px;
    z-index: 1001;
    .loading-icon {
      font-size: 35px;
      color: #6b5aed;
    }
    .loading-text {
      font-size: 14px;
    }
    .loading-progress {
      width: 300px;
    }
  }
  .loading-blur {
    height: 100%;
    width: 100%;
    clear: both;
    overflow: hidden;
    opacity: .6;
    background-color: #eaecf2;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    pointer-events: none;
  }
}
</style>
