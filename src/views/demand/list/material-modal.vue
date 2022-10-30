<template>
  <div>
    <a-modal
      :visible="visible"
      title="物件信息"
      :width="900"
      :footer="null"
      @cancel="onClose"
    >
      <div class="omc-bill">
        <div class="omc-bill-head">
          <div class="col-left">
            <div class="omc-bill-title">
              <span>物件单号：{{ detail.bill_no }}</span>
            </div>
          </div>
        </div>
        <div class="omc-bill-body">
          <div class="omc-bill-intro">
            <div class="col-item">
              <ul class="intro-list">
                <li>
                  <div class="intro-item">
                    <div class="intro-label">物件WBP状态</div>
                    <div
                      class="intro-value"
                      :class="{
                        'text-danger': (detail.wbp_status_name && detail.wbp_status_name.includes('驳回')) || detail.allow_copy === 1
                      }"
                    >{{ formatWbpStatusName(detail.wbp_status_name, detail) }}</div>
                  </div>
                </li>
                <li>
                  <div class="intro-item">
                    <div class="intro-label">WBP停留天数</div>
                    <div class="intro-value">{{ detail.wbp_retention_time }}</div>
                  </div>
                </li>
                <li>
                  <div class="intro-item">
                    <div class="intro-label">当前处理人</div>
                    <div class="intro-value">{{ detail.wbp_current_reviewers }}</div>
                  </div>
                </li>
                <li>
                  <div class="intro-item">
                    <div class="intro-label">WBP同步状态</div>
                    <div class="intro-value">
                      <span :class="formatMaterailWbpClass(detail.wbp_sync_status)">
                        <a-tooltip v-if="detail.wbp_sync_status === 3">
                          <template slot="title">{{ detail.wbp_sync_ret }}</template>
                          <span class="wbp-sync-status">{{ formatMaterailWbpStatus(detail.wbp_sync_status) }}</span>
                        </a-tooltip>
                        <span v-else>{{ formatMaterailWbpStatus(detail.wbp_sync_status) }}</span>
                      </span>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="intro-item">
                    <div class="intro-label">物料类别</div>
                    <div class="intro-value">{{ detail.type_name }}</div>
                  </div>
                </li>
                <li>
                  <div class="intro-item">
                    <div class="intro-label">物件名称</div>
                    <div class="intro-value">{{ detail.name }}</div>
                  </div>
                </li>
                <li>
                  <div class="intro-item">
                    <div class="intro-label">属性</div>
                    <div class="intro-value">
                      <text-limit :text="handleAttributes(detail.attr)" :limit-length="60" />
                    </div>
                  </div>
                </li>
                <li>
                  <div class="intro-item">
                    <div class="intro-label">数量/预估工作量</div>
                    <div class="intro-value">
                      <text-limit :text="handleBreakdown(detail.breakdown, detail.workload)" :limit-length="60" />
                    </div>
                  </div>
                </li>
                <li>
                  <div class="intro-item">
                    <div class="intro-label">需求工作量单位</div>
                    <div class="intro-value">{{ detail.workload_unit }}</div>
                  </div>
                </li>
                <li>
                  <div class="intro-item">
                    <div class="intro-label">制作等级</div>
                    <div class="intro-value">{{ detail.level }}</div>
                  </div>
                </li>
                <li>
                  <div class="intro-item">
                    <div class="intro-label">期望交付日期</div>
                    <div class="intro-value">{{ detail.complete_date }}</div>
                  </div>
                </li>
                <li>
                  <div class="intro-item">
                    <div class="intro-label">意向供应商</div>
                    <div
                      class="intro-value"
                    >{{ detail.supplicant }}</div>
                  </div>
                </li>
                <li>
                  <div class="intro-item">
                    <div class="intro-label">是否测试单</div>
                    <div class="intro-value">{{ detail.test === 1 ? '是' : '否' }}</div>
                  </div>
                </li>
                <li>
                  <div class="intro-item">
                    <div class="intro-label">备注</div>
                    <div class="intro-value">
                      <text-limit :text="detail.remark" :limit-length="30" />
                    </div>
                  </div>
                </li>
                <li>
                  <div class="intro-item">
                    <div class="intro-label">是否非全在线订单</div>
                    <div class="intro-value">
                      <text-limit :text="detail.is_reduce_process_text || '-'" :limit-length="30" />
                    </div>
                  </div>
                </li>
                <li>
                  <div class="intro-item">
                    <div class="intro-label">缩略图</div>
                    <div class="intro-value intro-img-wrapper">
                      <div v-for="img in detail.images" :key="img.file_id" class="intro-img-item">
                        <img :src="img.file_url" alt class="intro-img" />
                        <div class="intro-img-actions">
                          <a-icon class="actions-icon" type="eye" @click="previewImage(img)" />
                          <a-icon
                            class="actions-icon"
                            type="cloud-download"
                            @click="downloadImage(img)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false;">
      <div class="preview-img-detail">
        <span>缩略图信息：{{ previewImageName }}（{{ previewImageSize }}）</span>
      </div>
      <img alt="preview" style="width: 100%" :src="previewImageUrl" />
    </a-modal>
  </div>
</template>
<script>
import TextLimit from '@/components/TextLimit'
import { calculateFileSize, parseStringToJson } from '@/utils/index'

export default {
  name: 'DemandMaterialModal',
  components: {
    TextLimit
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    detail: {
      type: Object,
      required: true
    },
    formatMaterailWbpClass: {
      type: Function,
      required: true
    },
    formatMaterailWbpStatus: {
      type: Function,
      required: true
    },
    formatWbpStatusName: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      previewVisible: false,
      previewImageUrl: '',
      previewImageName: '',
      previewImageSize: ''
    }
  },
  methods: {
    onClose() {
      this.$emit('close')
    },
    handleAttributes(data) {
      const attributes = parseStringToJson(data, [])
      let result = ''
      if (Array.isArray(attributes)) {
        attributes.forEach((item, index) => {
          if (item.attr_type === 1) { // 输入框
            if (item.form_num > 1) { // 多个输入
              result += `${item.title}(${item.form_name}): ${item.value}${item.form_unit ? `(${item.form_unit})` : ''}; `
            } else if (item.form_num === 1) { // 一个输入
              result += `${item.title}: ${item.value}${item.form_unit ? `(${item.form_unit})` : ''}; `
            }
          } else if (item.attr_type === 2) { // 下拉框
            result += `${item.title}: ${item.value}; `
          }
        })
      }
      return result
    },
    handleBreakdown(data, workload) {
      const breakdown = parseStringToJson(data, [])
      let result = ''
      if (breakdown && Array.isArray(breakdown) && breakdown.length > 0) { // 有预估工作量相关明细
        result += `[预估工作量]: ${workload || 0}；[明细]: `
        breakdown.forEach(m => {
          result += `${m.title}: ${m.value}; `
        })
      } else { // 预估工作量
        result += `预估工作量: ${workload || 0}`
      }
      return result
    },
    previewImage(img) {
      if (!img.file_url) return this.$message.error('预览缩略图失败！')
      this.previewImageUrl = img.file_url
      this.previewImageName = img.file_name
      this.previewImageSize = calculateFileSize(img.file_size)
      this.previewVisible = true
    },
    downloadImage(img) {
      if (!img.file_url) return this.$message.error('下载缩略图失败！')
      window.open(img.file_url, '_blank')
    }
  }
}
</script>
<style lang="less" scoped>
.text-muted {
  color: rgba(0, 0, 0, 0.65) !important;
}
.intro-img-wrapper {
  display: flex;
  flex-wrap: wrap;
  .intro-img-item {
    height: 80px;
    width: 80px;
    margin: 2px 2px;
    position: relative;
    .intro-img {
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
    .intro-img-actions {
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
          margin-right: 6px;
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
      .intro-img-actions {
        opacity: 1;
      }
    }
  }
}
.preview-img-detail {
  margin-bottom: 5px;
}
</style>
