<template>
  <div class="omc-budget-finish">
    <div class="budget-finish-icon">
      <svg
        viewBox="0 0 184 152"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <ellipse fill="#f5f5f7" fill-opacity="0.8" cx="91.8" cy="138.56" rx="67.8" ry="12.67" />
        <path
          fill="#aeb8c2"
          d="M146,101.34,122.11,71.9a6,6,0,0,0-4.59-2.22H66.08a6,6,0,0,0-4.59,2.22L37.56,101.34v15.38H146V101.34Z"
        />
        <path
          fill="none"
          d="M139.1,117.88,118.19,92.77a5.26,5.26,0,0,0-4-1.87H69.28a5.26,5.26,0,0,0-4,1.87L44.33,117.88v13.79H139.1Z"
        />
        <path
          fill="#ffffff"
          d="M57.83,31.67h67.93a4,4,0,0,1,4,4V129a4,4,0,0,1-4,4H57.83a4,4,0,0,1-4-4V35.67A4,4,0,0,1,57.83,31.67Z"
        />
        <path
          fill="#dce0e6"
          d="M66.68,41.62h50.24a2,2,0,0,1,2,2v25a2,2,0,0,1-2,2H66.68a2,2,0,0,1-2-2v-25A2,2,0,0,1,66.68,41.62Zm.26,39.81h49.71a2.26,2.26,0,0,1,0,4.52H66.94a2.26,2.26,0,1,1,0-4.52Zm0,11.76h49.71a2.26,2.26,0,0,1,0,4.53H66.94a2.26,2.26,0,1,1,0-4.53Zm78.87,43.5a7,7,0,0,1-6.74,5.36H44.51a7,7,0,0,1-6.73-5.36,7.31,7.31,0,0,1-.22-1.79V101.35H63.88a5.35,5.35,0,0,1,5.25,5.42v0a5.33,5.33,0,0,0,5.28,5.37h34.78a5.34,5.34,0,0,0,5.28-5.39h0a5.35,5.35,0,0,1,5.25-5.43H146v33.57A7.33,7.33,0,0,1,145.81,136.7Z"
        />
        <path
          fill="#54d575"
          d="M159.59,11.67A17.34,17.34,0,1,0,176.93,29a17.38,17.38,0,0,0-17.33-17.33m-3.47,26-7.74-7.74a1.32,1.32,0,0,1,0-1.86l.58-.58a1.32,1.32,0,0,1,1.86,0l5.29,5.28,12.22-12.22a1.32,1.32,0,0,1,1.87,0l.59.59a1.32,1.32,0,0,1,0,1.86Z"
        />
      </svg>
    </div>
    <div v-if="linkText && backText" class="budget-finish-text">
      {{ linkText }}，<a href="javascript:;" class="btn-primary" @click="goToFirstPage">{{ backText }}</a>
    </div>
    <div class="action-footer">
      <span class="action-text">{{ actionText }}</span>
      <slot name="actionFooter"></slot>
    </div>
  </div>
</template>
<script>
/**
 * @emits finish Triggered when click finish button
 */
export default {
  name: 'FinishPage',
  props: {
    linkText: {
      type: String,
      default: ''
    },
    backText: {
      type: String,
      default: ''
    },
    actionText: {
      type: String,
      default: ''
    }
  },
  methods: {
    goToFirstPage() {
      this.$emit('finish')
    }
  }
}
</script>
<style lang="less" scoped>
.btn-primary {
  color: #6b5aed !important;
  &:hover {
    text-decoration: underline;
  }
}
.action-footer {
  margin-top: 10px;
  .action-text {
    color: #9fa3b5;
    padding-right: 10px;
  }
  a:hover {
    text-decoration: underline;
  }
}
</style>
