<template>
  <div>
    <a-upload
      :headers="headers"
      :show-upload-list="showUploadList"
      :accept="accept"
      :multiple="multiple"
      :file-list="fileList"
      :remove="handleRemove"
      :before-upload="beforeUpload"
      :disabled="disabled"
      @reject="handleImageReject"
    >
      <slot name="innerBox"></slot>
    </a-upload>
  </div>
</template>
<script>
/**
 * @emits on-success Triggered when upload file successfully
 * @emits delete-file Triggered when delete file successfully
 */

import { uploadFile } from '@/utils/upload-file'
import { calculateFileSize } from '@/utils/index'

export default {
  name: 'UploadFile',
  props: {
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
    accept: {
      type: String,
      default: ''
    },
    rejectInfo: {
      type: String,
      default: '请上传限定类型的文件'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    limitCount: {
      type: Number,
      default: 50
    },
    showTip: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    beforeUpload(file, fileList) {
      if (this.multiple && this.limitCount && fileList && fileList.length > this.limitCount) {
        return this.$message.info(`请上传少于${this.limitCount}个文件!`)
      }

      console.log('beforeUpload!!!')
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
      this.$emit('delete-file', {
        file,
        fileIndex: index,
        fileList: newFileList
      })
    }
  }
}
</script>
<style lang="less" scoped>
.head-actions-upload {
  font-size: 14px;
  line-height: 24px;
  color: #6b5aed;
}
.head-actions-upload:hover {
  font-weight: bold;
}
</style>
