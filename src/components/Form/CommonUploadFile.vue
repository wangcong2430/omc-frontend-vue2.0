<template>
  <div>
    <a-upload
      :class="{'common-uploader': !isAttachment}"
      :headers="headers"
      :accept="accept"
      :list-type="listType"
      :multiple="multiple"
      :show-upload-list="showUploadList"
      :file-list="currentFileList"
      :remove="handleRemove"
      :before-upload="beforeUpload"
      :disabled="disabled"
      @preview="handleImagePreview"
      @reject="handleImageReject"
    >
      <div v-if="!isAttachment && currentFileList.length < limitCount">
        <div v-if="loading">
          <a-icon type="loading"></a-icon>
        </div>
        <template v-else>
          <div v-if="currentFileList.length < limitCount">
            <a-icon type="plus" />
          </div>
        </template>
      </div>
      <template v-else>
        <slot name="innerBox"></slot>
      </template>
    </a-upload>
    <a-modal
      v-if="!isAttachment"
      :visible="previewVisible"
      :footer="null"
      @cancel="previewVisible = false;"
    >
      <img alt="preview" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
/**
 * @emits change Triggered when upload file successfully or delete file
 */

import { uploadFile } from '@/utils/upload-file'
import { getBase64 } from '@/utils/index'

export default {
  name: 'CommonUploadFile',
  props: {
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    headers: {
      type: Object,
      default() {
        return {}
      }
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    rejectInfo: {
      type: String,
      default: '请上传图片类型的文件'
    },
    listType: {
      type: String,
      default: 'picture-card'
    },
    showUploadList: {
      type: Boolean,
      default: true
    },
    limitCount: {
      type: Number,
      default: 1
    },
    // 是否是上传附件
    isAttachment: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否显示上传提示
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
      currentFileList: this.fileList,
      previewVisible: false,
      previewImage: '',
      loading: false
    }
  },
  watch: {
    fileList(newFileList) {
      this.currentFileList = newFileList
    }
  },
  methods: {
    beforeUpload(file, fileList) {
      if (this.multiple && fileList && fileList.length > this.limitCount) {
        return this.$message.info(`请上传少于${this.limitCount}个文件!`)
      }

      let hide = null
      if (this.showTip) {
        hide = this.$message.loading('上传中...', 0)
      }
      this.loading = true
      uploadFile(file).then(res => {
        const successFile = {
          uid: file.uid,
          id: res.key,
          name: file.name,
          size: file.size,
          url: res.url || ''
        }
        this.currentFileList = [...this.currentFileList, successFile]
        this.$emit('change', {
          file: successFile,
          fileList: this.currentFileList
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
      }).finally(() => {
        this.loading = false
      })
      return false
    },
    handleRemove(file) {
      this.loading = true
      const index = this.currentFileList.indexOf(file)
      const newFileList = this.currentFileList.slice()
      newFileList.splice(index, 1)
      this.currentFileList = newFileList
      this.loading = false
      this.$emit('change', {
        fileList: this.currentFileList
      })
    },
    handleImageReject(fileList) {
      this.$message.info(this.rejectInfo)
    },
    async handleImagePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
</style>
