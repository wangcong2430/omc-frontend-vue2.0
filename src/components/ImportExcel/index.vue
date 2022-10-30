<template>
  <div class="import-excel-wrapper">
    <input
      ref="excel-upload-input"
      class="excel-upload-input"
      type="file"
      accept=".xlsx, .xls"
      @change="handleClick"
    />
    <div>
      <a-button
        :loading="loading"
        :disabled="disabled"
        :type="type"
        @click="handleUpload"
      >{{ label }}</a-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ImportExcel',
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    label: {
      type: String,
      default: '上传'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    //  must input a promise function
    onSuccess: Function // eslint-disable-line
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },
    async upload(rawFile) {
      this.loading = true
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel
      if (this.onSuccess) {
        try {
          await this.onSuccess(rawFile)
          this.loading = false
        } catch (error) {
          this.loading = false
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.import-excel-wrapper {
  display: inline-block;
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
}
</style>
