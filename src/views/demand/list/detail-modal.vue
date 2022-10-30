<template>
  <div>
    <cp-self-detail-modal
      v-if="budgetType === 3"
      :budget-expenses="budgetExpenses"
      :show="show"
      :detail-data="detailData"
      :step-lists="stepLists"
      :current-step="currentStep"
      :error-step="errorStep"
      :show-workflow-detail="showWorkflowDetail"
      :workflow-details="workflowDetails"
      @close-modal="onClose"
    >
      <template v-slot:modalFoot>
        <slot name="modalFoot"></slot>
      </template>
    </cp-self-detail-modal>
    <template v-else>
      <right-modal :visible="show" :width="1000" :title="'需求详细'" @close="onClose">
        <template #modalHead>
          <div v-if="detailData.message && detailData.message.status !== 1">
            <!-- <div v-if="stepLists.length > 0 && currentStep >= stepLists.length" class="stamp-default stamp-success">
            <div class="stamp-top"><span></span></div>
            <div class="stamp-text">审批通过</div>
            <div class="stamp-bottom"><span></span></div>
          </div> -->
            <steps :step-lists="stepLists" :current-step="currentStep" :error-step="errorStep"></steps>
          </div>
        </template>
        <template #modalBody>
          <div v-if="showWorkflowDetail" class="approval-detail">
            <a-divider class="detail-title">
              <div>审批日志</div>
              <div>
                <a-icon type="down" />
              </div>
            </a-divider>
            <table class="detail-table">
              <thead>
                <tr>
                  <th width="10%">审批环节</th>
                  <th width="15%">IOMC审批状态</th>
                  <th width="10%">审批结果</th>
                  <th width="15%">审批时间</th>
                  <th width="20%">审批人</th>
                  <th width="30%">审批意见</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in workflowDetails" :key="index">
                  <td>{{ item.node_name }}</td>
                  <td
                    :class="item.status === 1 ? 'text-muted' : 'text-primary'"
                  >{{ item.status === 1 ? '待处理' : '已处理' }}</td>
                  <td :class="formatResultClass(item.result)">
                    {{ item.result || '--' }}
                  </td>
                  <td>
                    {{ item.status === 1 ? '--' : item.process_time }}
                  </td>
                  <td>{{ resultAutoPass(item.processor,item.node_code) }}</td>
                  <td>
                    <text-limit :text="item.reason" :limit-length="40"></text-limit>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="omc-cost-bar">
            <div class="col-left">
              <ul v-if="detailData.message" class="cost-list">
                <li>
                  <div class="cost-item">
                    <div class="item-label">需求单号</div>
                    <div class="item-value">{{ detailData.message.bill_no }}</div>
                  </div>
                </li>
                <li>
                  <div class="cost-item">
                    <div class="item-label">部门</div>
                    <div class="item-value">{{ detailData.message.dept_name }}</div>
                  </div>
                </li>
                <li>
                  <div class="cost-item">
                    <div class="item-label">COA产品</div>
                    <div class="item-value">{{ detailData.message.product_name }}</div>
                  </div>
                </li>
                <li>
                  <div class="cost-item">
                    <div class="item-label">COA产品代码</div>
                    <div class="item-value">{{ detailData.message.product_code }}</div>
                  </div>
                </li>
                <li>
                  <div class="cost-item">
                    <div class="item-label">需求名称</div>
                    <div class="item-value">{{ detailData.message.name }}</div>
                  </div>
                </li>
                <li v-if="budgetType === 2">
                  <div class="cost-item">
                    <div class="item-label">研发类别</div>
                    <div class="item-value">{{ detailData.message.dev_category_name }}</div>
                  </div>
                </li>
                <li v-if="budgetType === 2">
                  <div class="cost-item">
                    <div class="item-label">项目负责人</div>
                    <div class="item-value">{{ detailData.message.pm_name }}</div>
                  </div>
                </li>
                <li v-if="budgetType === 2">
                  <div class="cost-item">
                    <div class="item-label">验收人</div>
                    <div class="item-value">{{ detailData.message.receiver_names }}</div>
                  </div>
                </li>
                <li v-if="budgetType === 2">
                  <div class="cost-item">
                    <div class="item-label">采购经理</div>
                    <div class="item-value">{{ detailData.message.purchaser }}</div>
                  </div>
                </li>
                <li v-if="budgetType === 2">
                  <div class="cost-item">
                    <div class="item-label">预期开始日期</div>
                    <div class="item-value">{{ detailData.message.begin_date }}</div>
                  </div>
                </li>
                <li v-if="budgetType === 2">
                  <div class="cost-item">
                    <div class="item-label">预期结束日期</div>
                    <div class="item-value">{{ detailData.message.end_date }}</div>
                  </div>
                </li>
                <li v-if="budgetType === 2">
                  <div class="cost-item">
                    <div class="item-label">需求描述</div>
                    <div class="item-value">
                      <text-limit
                        :text="detailData.message.description"
                        :limit-length="50"
                      />
                    </div>
                  </div>
                </li>
                <li v-if="budgetType === 1">
                  <div class="cost-item">
                    <div class="item-label">需求说明</div>
                    <div class="item-value">
                      <text-limit
                        :text="detailData.message.description"
                        :limit-length="50"
                      />
                    </div>
                  </div>
                </li>
                <li v-if="budgetType === 1">
                  <div class="cost-item">
                    <div class="item-label">需求数量/预估工作量</div>
                    <div class="item-value">
                      {{ detailData.message.workload_count }}
                    </div>
                  </div>
                </li>
                <li v-if="budgetType === 1">
                  <div class="cost-item">
                    <div class="item-label">需求种类</div>
                    <div class="item-value">
                      {{ isBaseOptions.find(i => i.value === +detailData.message.is_base)?.label || text }}
                    </div>
                  </div>
                </li>
                <li v-if="budgetType">
                  <div class="cost-item">
                    <div class="item-label">画师姓名</div>
                    <div class="item-value">
                      {{ detailData.message.artist_name || '-' }}
                    </div>
                  </div>
                </li>
                <li v-if="budgetType === 1">
                  <div class="cost-item">
                    <div class="item-label">经办人</div>
                    <div class="item-value">
                      {{ detailData.message.apply_for || '-' }}
                    </div>
                  </div>
                </li>
                <li v-if="budgetType === 2">
                  <div class="cost-item">
                    <div class="item-label">交付物</div>
                    <div class="item-value">
                      <text-limit
                        :text="detailData.message.output"
                        :limit-length="50"
                      />
                    </div>
                  </div>
                </li>
                <li v-if="budgetType === 2">
                  <div class="cost-item">
                    <div class="item-label">验收标准</div>
                    <div class="item-value">
                      <text-limit
                        :text="detailData.message.verify_standard"
                        :limit-length="50"
                      />
                    </div>
                  </div>
                </li>
                <li v-if="budgetType === 2">
                  <div class="cost-item">
                    <div class="item-label">项目背景及目的</div>
                    <div class="item-value">
                      <text-limit
                        :text="detailData.message.background_desc"
                        :limit-length="50"
                      />
                    </div>
                  </div>
                </li>
                <li v-if="budgetType === 2">
                  <div class="cost-item">
                    <div class="item-label">使用技术说明</div>
                    <div class="item-value">
                      <text-limit
                        :text="detailData.message.tech_desc"
                        :limit-length="50"
                      />
                    </div>
                  </div>
                </li>
                <li v-if="budgetType === 2">
                  <div class="cost-item">
                    <div class="item-label">服务地点</div>
                    <div class="item-value">
                      <text-limit
                        :text="detailData.message.service_location"
                        :limit-length="50"
                      />
                    </div>
                  </div>
                </li>
                <li v-if="budgetType === 2">
                  <div class="cost-item">
                    <div class="item-label">是否关联项目</div>
                    <div class="item-value">
                      <text-limit
                        :text="resultRelationData(detailData.message.memo).is_related_project==='1'?'是':'否'"
                        :limit-length="50"
                      />
                    </div>
                  </div>
                </li>
                <li v-if="budgetType === 2 && resultRelationData(detailData.message.memo).is_related_project==='1'">
                  <div class="cost-item">
                    <div class="item-label">关联的项目名称</div>
                    <div class="item-value">
                      <text-limit
                        :text="resultRelationData(detailData.message.memo).related_project.name"
                        :limit-length="50"
                      />
                    </div>
                  </div>
                </li>
                <li>
                  <div class="cost-item">
                    <div class="item-label">需求附件</div>
                    <div class="item-value">
                      <div class="cost-attachment">
                        <div v-for="file in detailData.message.attachments" :key="file.file_id" class="cost-attachment-file">
                          <div class="file-icon">
                            <i class="mdi-set" :class="testFileType(file.file_name)"></i>
                          </div>
                          <div class="file-info">
                            <a :href="file.file_url" target="_blank">{{ file.file_name }}</a>
                            <span>{{ file.file_size | calculateFileSize }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="col-right">
              <div class="cost-total">
                <p>
                  {{ budgetType === 2 ? '预估总价(￥)：' : '预估预算花费合计(￥)：' }}
                  <span>
                    {{ sumAmount(detailData.details) | formatNumber }}
                  </span>
                </p>
              </div>
              <div class="budget-total">
                <p class="budgetList">
                  预算金额：<span>{{ budgetExpenses.total_budget | formatNumber }}</span>
                </p>
                <p class="budgetList">
                  {{ budgetType=== 2 ?"已使用金额：":"已使用：" }} <span>{{ budgetExpenses.consumed_budget | formatNumber }}</span>
                </p>
                <p class="budgetList">
                  可用余额：<span>{{ budgetExpenses.left_budget | formatNumber }}</span>
                </p>
                <p v-if="budgetType===2" class="budgetList">已下单金额：<span>{{ budgetExpenses.order_budget | formatNumber }}</span></p>
              </div>
            </div>
          </div>

          <div v-for="(item, index) in detailData.details" :key="index" class="omc-bill">
            <div class="omc-bill-head">
              <div class="col-left">
                <div class="omc-bill-title">
                  明细{{ index + 1 }}
                  （<span>物件单号：{{ item.bill_no }}</span>）
                </div>
              </div>
              <div v-if="budgetType === 2" class="col-right">
                <div class="omc-bill-total">{{ item.workload_amount | formatNumber }}</div>
              </div>
            </div>
            <div class="omc-bill-body">
              <div class="omc-bill-intro">
                <div class="col-item">
                  <ul class="intro-list">
                    <li>
                      <div class="intro-item">
                        <div class="intro-label">物料类别</div>
                        <div class="intro-value">{{ item.type_name }}</div>
                      </div>
                    </li>
                    <li v-if="budgetType === 1">
                      <div class="intro-item">
                        <div class="intro-label">物件名称</div>
                        <div class="intro-value">{{ item.name }}</div>
                      </div>
                    </li>
                    <li v-if="budgetType === 1">
                      <div class="intro-item">
                        <div class="intro-label">属性</div>
                        <div class="intro-value">
                          <text-limit
                            :text="handleAttributes(item.attr)"
                            :limit-length="60"
                          />
                        </div>
                      </div>
                    </li>
                    <li v-if="budgetType === 1">
                      <div class="intro-item">
                        <div class="intro-label">数量/预估工作量</div>
                        <div class="intro-value">
                          <text-limit
                            :text="handleBreakdown(item.breakdown, item.workload)"
                            :limit-length="60"
                          />
                        </div>
                      </div>
                    </li>
                    <li v-if="budgetType === 2">
                      <div class="intro-item">
                        <div class="intro-label">需求工作量数量</div>
                        <div class="intro-value">{{ item.workload | formatNumber }}</div>
                      </div>
                    </li>
                    <li>
                      <div class="intro-item">
                        <div class="intro-label">需求工作量单位</div>
                        <div class="intro-value">{{ item.workload_unit }}</div>
                      </div>
                    </li>
                    <li>
                      <div class="intro-item">
                        <div class="intro-label">{{ budgetType === 2 ? '需求预估总价' : '预估预算花费' }}（￥）</div>
                        <div class="intro-value">{{ item.workload_amount | formatNumber }}</div>
                      </div>
                    </li>
                    <li v-if="budgetType === 1">
                      <div class="intro-item">
                        <div class="intro-label">制作等级</div>
                        <div class="intro-value">{{ item.level }}</div>
                      </div>
                    </li>
                    <li v-if="budgetType === 1">
                      <div class="intro-item">
                        <div class="intro-label">制作人员</div>
                        <div class="intro-value">{{ item.production_staff || '-' }}</div>
                      </div>
                    </li>
                    <li>
                      <div class="intro-item">
                        <div class="intro-label">期望交付日期</div>
                        <div class="intro-value">{{ item.complete_date }}</div>
                      </div>
                    </li>
                    <li v-if="budgetType === 2">
                      <div class="intro-item">
                        <div class="intro-label">预算使用年份</div>
                        <div class="intro-value">{{ item.year || '-' }}</div>
                      </div>
                    </li>
                    <li>
                      <div class="intro-item">
                        <div class="intro-label">意向供应商</div>
                        <div class="intro-value">{{ budgetType === 1 ? item.supplicant : item.has_supplicant === 1 ? '是' : '否' }}</div>
                      </div>
                    </li>
                    <li v-if="budgetType === 1">
                      <div class="intro-item">
                        <div class="intro-label">是否测试单</div>
                        <div class="intro-value">{{ item.test === 1 ? '是' : '否' }}</div>
                      </div>
                    </li>
                    <li>
                      <div class="intro-item">
                        <div class="intro-label">备注</div>
                        <div class="intro-value">
                          <text-limit
                            :text="item.remark"
                            :limit-length="30"
                          />
                        </div>
                      </div>
                    </li>
                    <li v-if="budgetType === 1">
                      <div class="intro-item">
                        <div class="intro-label">缩略图</div>
                        <div class="intro-value intro-img-wrapper">
                          <div v-for="img in item.images" :key="img.id" class="intro-img-item">
                            <img :src="img.url" alt="" class="intro-img" />
                            <div class="intro-img-actions">
                              <a-icon class="actions-icon" type="eye" @click="previewImage(img)" />
                              <a-icon class="actions-icon" type="cloud-download" @click="downloadImage(img)" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li v-if="budgetType === 1">
                      <div class="intro-item">
                        <div class="intro-label">物件WBP状态</div>
                        <div class="intro-value">{{ formatWbpStatusName(item.wbp_status_name, item) }}</div>
                      </div>
                    </li>
                    <li v-if="budgetType === 1">
                      <div class="intro-item">
                        <div class="intro-label">WBP当前处理人</div>
                        <div class="intro-value">{{ item.wbp_current_reviewers }}</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #modalFooter>
          <slot name="modalFoot"></slot>
        </template>
      </right-modal>
      <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false;">
        <div class="preview-img-detail">
          <span>缩略图信息：{{ previewImageName }}（{{ previewImageSize }}）</span>
        </div>
        <img alt="preview" style="width: 100%" :src="previewImageUrl" />
      </a-modal>
    </template>
  </div>
</template>
<script>
import Steps from '@/components/Steps/index'
import TextLimit from '@/components/TextLimit'
import RightModal from '@/components/RightModal/index'
import CpSelfDetailModal from './cp-self-detail-modal'
import { setClassWithFileType, calculateFileSize, parseStringToJson } from '@/utils/index'
import demandMixins from '../mixins/index'

export default {
  name: 'DemandDetailModal',
  components: {
    Steps,
    TextLimit,
    RightModal,
    CpSelfDetailModal
  },
  mixins: [demandMixins],
  props: {
    show: {
      type: Boolean,
      required: true
    },
    detailData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    budgetType: { // 预览类型：1-内容制作费、2-研发费、3-内容制作费（自行采购）
      type: [Number, String],
      default: 1
    },
    stepLists: {
      type: Array,
      default() {
        return []
      }
    },
    currentStep: {
      type: Number,
      default: 0
    },
    errorStep: {
      type: Object,
      default() {
        return {}
      }
    },
    showWorkflowDetail: {
      type: Boolean,
      default: false
    },
    workflowDetails: {
      type: Array,
      default() {
        return []
      }
    },
    budgetExpenses: {
      type: Object,
      default() {
        return {}
      }
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
  watch: {
    budgetExpenses: function(newValue) {
      this.budgetExpenses = newValue
    }
  },
  methods: {
    resultRelationData(value) {
      const targetData = parseStringToJson(value, {})
      return targetData
    },
    onClose() {
      this.$emit('close')
    },
    testFileType(name) {
      return setClassWithFileType(name)
    },
    handleAttributes(attributes) {
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
    handleBreakdown(breakdown, workload) {
      let result = ''
      if (breakdown && Array.isArray(breakdown) && breakdown.length > 0) { // 有预估工作量相关明细
        result += `[预估工作量]: ${workload || 0}；[明细]: `
        breakdown.forEach(m => {
          result += `${m.title}: ${m.value}; `
        })
      } else { // 预估工作量
        result += `[预估工作量]: ${workload || 0}`
      }
      return result
    },
    previewImage(img) {
      if (!img.url) return this.$message.error('预览缩略图失败！')
      this.previewImageUrl = img.url
      this.previewImageName = img.name
      this.previewImageSize = calculateFileSize(img.size)
      this.previewVisible = true
    },
    downloadImage(img) {
      if (!img.url) return this.$message.error('下载缩略图失败！')
      window.open(img.url, '_blank')
    },
    formatResultClass(res) {
      switch (res) {
        case '同意':
          return 'text-success'
        case '驳回':
          return 'text-danger'
        default:
          return ''
      }
    },
    formatWbpStatusName(name, record) {
      if (record.allow_copy === 1) {
        return `被采购经理驳回，原因：${record.wbp_rejected_reason || '无'}`
      }
      return name
    },
    resultAutoPass(userName, userCode) {
      if (userName === '__auto_pass__') {
        return userCode === 'ConsumeCpApproveAssRole' ? '' : '系统自动跳过'
      } else {
        return userName
      }
    }
  }
}
</script>
<style lang="less" scoped>
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
.omc-cost-bar .cost-list .cost-item .item-label {
  width: 120px;
  max-width: 120px;
}
.approval-detail {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 15px 50px 0 rgba(28,15,125,0.05);
  .detail-title {
    font-size: 13px;
    font-weight: bold;
  }
  .detail-table {
    width: 100%;
    thead > tr > th {
      font-size: 13px;
      line-height: 20px;
      padding: 8px 12px;
      color: #8f93a1;
      font-weight: bold;
    }
    tbody > tr > td {
      color: #414660;
      font-size: 12px;
      line-height: 20px;
      padding: 17px 12px;
      vertical-align: top;
    }
  }
}
.cost-total{
  font-size: 16px;
  text-align: left;
  span{
      font-size: 22px;
      font-weight: 600;
  }
  p{
     padding: 0px 0px 8px 0px;
     margin: 0px;
     border-bottom: 1px dotted;
  }

}
.budgetList{
  font-size: 16px;
  padding: 10px 0px;
  margin: 0px;
  border-bottom: 1px dotted;
  span{
      font-size: 22px;
      font-weight: 600;
  }
}
</style>
