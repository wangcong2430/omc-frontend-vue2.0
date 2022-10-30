<template>
  <div>
    <a-upload-dragger
      :headers="headers"
      :show-upload-list="showUploadList"
      :multiple="multiple"
      :accept="accept"
      :disabled="disabled"
      :file-list="fileList"
      :remove="handleRemove"
      :before-upload="beforeUpload"
      @reject="handleImageReject"
    >
      <p class="ant-upload-hint">
        {{ placeholder }}
      </p>
    </a-upload-dragger>
  </div>
</template>
<script>
/**
 * @emits on-success Triggered when upload file successfully
 */

import { uploadFile } from '@/utils/upload-file'
import { calculateFileSize } from '@/utils/index'

export default {
  name: 'DragUploadFile',
  props: {
    placeholder: {
      type: String,
      default: '上传附件'
    },
    headers: {
      type: Object,
      default() {
        return {}
      }
    },
    showUploadList: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
    limitCount: {
      type: Number,
      default: 50
    },
    accept: {
      type: String,
      default: ''
    },
    rejectInfo: {
      type: String,
      default: '请上传限定类型的文件'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showTip: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    beforeUpload(file, fileList) {
      if (this.disabled) {
        return
      }
      if (this.multiple && fileList && fileList.length > this.limitCount) {
        return this.$message.info(`请上传少于${this.limitCount}个文件!`)
      }

      let hide = null
      if (this.showTip) {
        hide = this.$message.loading('上传中...', 0)
      }
      uploadFile(file).then(res => {
        this.fileList = [...this.fileList, file]
        this.$emit('on-success', {
          uid: file.uid,
          id: res.key,
          name: file.name,
          file_size: file.size,
          size: calculateFileSize(file.size),
          url: res.url || '',
          file_list: this.fileList
        })
        if (this.showTip && hide !== null) {
          setTimeout(hide, 0)
          this.$message.success(`${file.name}上传成功`)
        }
      }).catch(error => {
        if (this.showTip && hide !== null) {
          setTimeout(hide, 0)
          this.$message.error(`上传失败！\n${error}`)
        }
      })
      return false
    },
    handleImageReject(fileList) {
      this.$message.info(this.rejectInfo)
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    }
  }
}
</script>
<style lang="less" scoped>
</style>
