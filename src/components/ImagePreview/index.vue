<template>
  <div v-if="url" class="image-preview-swagger">
    <img :src="url" alt="img" class="img" />
    <div class="img-actions">
      <a-icon v-if="showPreview" class="actions-icon" type="eye" @click="previewImage()" />
      <a-icon v-if="showDownload" class="actions-icon" type="cloud-download" @click="downloadImage()" />
    </div>
    <a-modal
      centered
      :width="800"
      :visible="previewVisible"
      :footer="null"
      @cancel="previewVisible = false;"
    >
      <img alt="preview" height="auto" width="auto" style="max-width: 100%;" :src="url" />
    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'ImagePreview',
  props: {
    url: {
      type: String,
      default: ''
    },
    showPreview: {
      type: Boolean,
      default: true
    },
    showDownload: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      previewVisible: false
    }
  },
  methods: {
    previewImage() {
      this.previewVisible = true
    },
    downloadImage() {
      if (!this.url) return this.$message.error('下载图片失败！')
      window.open(this.url, '_blank')
    }
  }
}
</script>
<style lang="less" scoped>
.image-preview-swagger {
  position: relative;
  display: inline-block;
  width: 80%;
  .img {
    overflow: hidden;
    position: relative;
    width: auto;
    height: auto;
    max-width: 50%;
  }
  .img-actions {
      opacity: 0;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      z-index: 10;
      .actions-icon {
        color: hsla(0,0%,100%,.85);
        font-size: 16px;
        cursor: pointer;
        &:first-child {
          margin-right: 10px;
        }
      }
    }
  &::before {
      position: absolute;
      z-index: 1;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,.5);
      opacity: 0;
      transition: all .3s;
      content: " ";
    }
    &:hover {
      background: transparent;
      &::before {
        opacity: 1;
      }
      .img-actions {
        opacity: 1;
      }
    }
}
</style>
