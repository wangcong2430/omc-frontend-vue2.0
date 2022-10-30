<template>
  <div class="excel-upload-wrapper">
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
/**
 * @emits beforeUpload Triggered before upload file
 * @emits onSuccess Triggered when upload file successfully
 */
import XLSX from 'xlsx'
import { calculateFileSize } from '@/utils/index'

export default {
  name: 'UploadExcel',
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
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function // eslint-disable-line
  },
  data() {
    return {
      loading: false,
      excelData: {
        name: '',
        size: '',
        header: null,
        results: null,
        rawFile: null
      }
    }
  },
  methods: {
    generateData({ fileName, fileSize, header, results, rawFile }) {
      this.excelData.name = fileName
      this.excelData.size = fileSize
      this.excelData.header = header
      this.excelData.results = results
      this.excelData.rawFile = rawFile
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      const size = calculateFileSize(rawFile.size)
      if (!rawFile) return
      this.upload(rawFile, rawFile.name, size)
    },
    upload(rawFile, fileName, fileSize) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel

      if (!this.beforeUpload) {
        this.readerData(rawFile, fileName, fileSize)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile, fileName, fileSize)
      }
    },
    readerData(rawFile, fileName, fileSize) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          this.generateData({ header, results, fileName, fileSize, rawFile })
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style lang="less" scoped>
.excel-upload-wrapper {
  display: inline-block;
}
.excel-upload-input {
  display: none;
  z-index: -9999;
}
</style>
