<template>
  <div class="detail-box">
    <loading-modal v-if="loadingData" :tip-text="'需求详情加载中...'" />
    <template>
      <div v-if="detailData.message && detailData.message.status !== 1 && ulinkID" class="modal-head">
        <div class="col-left">
          <div class="modal-title">需求详细</div><a data-v-0a1b0538="" href="javascript:;" class="modal-close"><i data-v-0a1b0538=""></i></a>
        </div>
        <div class="col-right">
          <steps :step-lists="stepLists" :current-step="currentStep" :error-step="errorStep"></steps>
        </div>
      </div>

      <div v-if="ulinkID" class="modal-body">
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
                <th width="10%">IOMC审批状态</th>
                <th width="10%">审批结果</th>
                <th width="20%">审批时间</th>
                <th width="20%">审批人</th>
                <th width="30%">审批意见</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in workflowDetails" :key="index">
                <td>{{ item.node_name }}</td>
                <td :class="item.status === 1 ? 'text-muted' : 'text-primary'">
                  {{ item.status === 1 ? '待处理' : '已处理' }}
                </td>
                <td :class="formatResultClass(item.result)">
                  {{ item.result || '--' }}
                </td>
                <td>
                  {{ item.status === 1 ? '--' : item.process_time }}
                </td>
                <td>{{ item.processor }}</td>
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
                  <div class="item-label">需求名称</div>
                  <div class="item-value">{{ detailData.message.name }}</div>
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
                    <text-limit :text="detailData.message.description" :limit-length="50" />
                  </div>
                </div>
              </li>
              <li v-if="budgetType === 1">
                <div class="cost-item">
                  <div class="item-label">需求说明</div>
                  <div class="item-value">
                    <text-limit :text="detailData.message.description" :limit-length="50" />
                  </div>
                </div>
              </li>
              <li v-if="budgetType === 1">
                <div class="cost-item">
                  <div class="item-label">需求种类</div>
                  <div class="item-value">
                    {{
                      detailData.message.is_base === 1
                        ? '基地需求'
                        : detailData.message.is_base === 2
                          ? '非基地需求'
                          : '-'
                    }}
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
                    <text-limit :text="detailData.message.output" :limit-length="50" />
                  </div>
                </div>
              </li>
              <li v-if="budgetType === 2">
                <div class="cost-item">
                  <div class="item-label">验收标准</div>
                  <div class="item-value">
                    <text-limit :text="detailData.message.verify_standard" :limit-length="50" />
                  </div>
                </div>
              </li>
              <li v-if="budgetType === 2">
                <div class="cost-item">
                  <div class="item-label">项目背景及目的</div>
                  <div class="item-value">
                    <text-limit :text="detailData.message.background_desc" :limit-length="50" />
                  </div>
                </div>
              </li>
              <li v-if="budgetType === 2">
                <div class="cost-item">
                  <div class="item-label">使用技术说明</div>
                  <div class="item-value">
                    <text-limit :text="detailData.message.tech_desc" :limit-length="50" />
                  </div>
                </div>
              </li>
              <li v-if="budgetType === 2">
                <div class="cost-item">
                  <div class="item-label">服务地点</div>
                  <div class="item-value">
                    <text-limit :text="detailData.message.service_location" :limit-length="50" />
                  </div>
                </div>
              </li>
              <li>
                <div class="cost-item">
                  <div class="item-label">需求附件</div>
                  <div class="item-value">
                    <div class="cost-attachment">
                      <div
                        v-for="file in detailData.message.attachments"
                        :key="file.file_id"
                        class="cost-attachment-file"
                      >
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
            <div v-if="budgetType === 2" class="cost-total">
              <span>预估总价（￥）</span>{{ sumAmount(detailData.details) | formatNumber }}
            </div>
          </div>
        </div>

        <div v-for="(item, index) in detailData.details" :key="index" class="omc-bill">
          <div class="omc-bill-head">
            <div class="col-left">
              <div class="omc-bill-title">
                明细{{ index + 1 }} （<span>物件单号：{{ item.bill_no }}</span>）
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
                        <text-limit :text="handleAttributes(item.attr)" :limit-length="60" />
                      </div>
                    </div>
                  </li>
                  <li v-if="budgetType === 1">
                    <div class="intro-item">
                      <div class="intro-label">数量/预估工作量</div>
                      <div class="intro-value">
                        <text-limit :text="handleBreakdown(item.breakdown, item.workload)" :limit-length="60" />
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
                  <li v-if="budgetType === 2">
                    <div class="intro-item">
                      <div class="intro-label">需求预估总价（￥）</div>
                      <div class="intro-value">{{ item.workload_amount | formatNumber }}</div>
                    </div>
                  </li>
                  <li v-if="budgetType === 1">
                    <div class="intro-item">
                      <div class="intro-label">制作等级</div>
                      <div class="intro-value">{{ item.level }}</div>
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
                      <div class="intro-value">
                        {{ budgetType === 1 ? item.supplicant : item.has_supplicant === 1 ? '是' : '否' }}
                      </div>
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
                        <text-limit :text="item.remark" :limit-length="30" />
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
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template v-else>
        <a-result class="modal-body" title="请绑定传入ulink关联id"></a-result>
      </template>
    </template>

    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <div class="preview-img-detail">
        <span>缩略图信息：{{ previewImageName }}（{{ previewImageSize }}）</span>
      </div>
      <img alt="preview" style="width: 100%" :src="previewImageUrl" />
    </a-modal>
  </div>
</template>
<script>
import Steps from '@/components/Steps/index'
import TextLimit from '@/components/TextLimit'
import LoadingModal from '@/components/LoadingModal'
import { setClassWithFileType, calculateFileSize } from '@/utils/index'
import demandMixins from '../../demand/mixins/index'
import { getDemandLists } from '@/api/demand'
import { getFlowHistory, getFlowStep } from '@/api/workflow'
import { formatWorkflowSteps } from '@/utils/approval'
import moment from 'moment'
import { createUuid } from '@/utils/uuid'
import { parseStringToJson } from '@/utils/index'

export default {
  name: 'DemandDetail',
  components: {
    Steps,
    TextLimit,
    LoadingModal
  },
  mixins: [demandMixins],
  props: {},
  data() {
    return {
      budgetType: 1, // 1-内容制作费、2-研发费
      loadingData: false,
      productCode: this.$route.query.product_code,
      mainMessage: {},
      details: [],
      currentStep: 0,
      errorStep: {},
      workflowDetails: [],
      stepLists: [],
      showWorkflowDetail: false,
      previewVisible: false,
      previewImageUrl: '',
      previewImageName: '',
      previewImageSize: '',
      detailData: {
        message: {}, // 详情基本信息
        details: [] // 服务品类列表
      },
      ulinkID: this.$route.query.uid
    }
  },
  async created() {
    await this.getWorkflowStep()
    this.getDetail()
  },
  methods: {
    getWorkflowStep() {
      if (!this.ulinkID) {
        return
      }
      return new Promise((resolve, reject) => {
        if (!this.budgetType) {
          resolve()
        }
        const workType = this.budgetType === 1 ? 2 : 1 // workType: 1-研发费、2-内容制作费
        getFlowStep(workType)
          .then(res => {
            const { content } = res
            this.stepLists = content
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    testFileType(name) {
      return setClassWithFileType(name)
    },
    handleAttributes(attributes) {
      let result = ''
      if (Array.isArray(attributes)) {
        attributes.forEach((item, index) => {
          if (item.attr_type === 1) {
            // 输入框
            if (item.form_num > 1) {
              // 多个输入
              result += `${item.title}(${item.form_name}): ${item.value}${
                item.form_unit ? `(${item.form_unit})` : ''
              }; `
            } else if (item.form_num === 1) {
              // 一个输入
              result += `${item.title}: ${item.value}${item.form_unit ? `(${item.form_unit})` : ''}; `
            }
          } else if (item.attr_type === 2) {
            // 下拉框
            result += `${item.title}: ${item.value}; `
          }
        })
      }
      return result
    },
    handleBreakdown(breakdown, workload) {
      let result = ''
      if (breakdown && Array.isArray(breakdown) && breakdown.length > 0) {
        // 有预估工作量相关明细
        result += `[数量]: ${workload || 0}；[预估工作量]: `
        breakdown.forEach(m => {
          result += `${m.title}: ${m.value}; `
        })
      } else {
        // 数量
        result += `[数量]: ${workload || 0}`
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

    showLoading() {
      this.loadingData = true
    },

    hideLoading() {
      this.loadingData = false
    },

    // 获取详情
    // 获取工作流
    async getDetail() {
      if (!this.ulinkID) {
        return this.$message.error('请绑定传入ulink关联id')
      }
      try {
        this.showLoading()
        const res = await getDemandLists([
          {
            ulink_id: this.ulinkID
          }
        ])
        const { items } = res.content
        if (Array.isArray(items) && items.length > 0) {
          const data = items[0]
          this.setBasicDetailData(data)
          this.setServiceCategoryItems(data.detail_items)
          this.getFlowDetail(data)
        }
      } catch (err) {
        console.error(err)
      }
      this.hideLoading()
    },

    // 审批中或者审批结束显示审批流程
    getFlowDetail(item) {
      if (item.status && item.status > 1 && item.flow_instance_id) {
        const historyFlowInstanceIds =
          item.history_flow_instance_ids
            ? item.history_flow_instance_ids.split(',')
            : []

        getFlowHistory(
          historyFlowInstanceIds.includes(item.flow_instance_id)
            ? [...historyFlowInstanceIds]
            : [...historyFlowInstanceIds, item.flow_instance_id],
          1
        ).then(res => {
          const stepDetail = formatWorkflowSteps(this.stepLists, res.content)
          this.currentStep = stepDetail.currentStep
          this.errorStep = stepDetail.errorStep
          this.workflowDetails = res.content
          this.showWorkflowDetail = true
        })
      }
    },

    setBasicDetailData(item) {
      const data = {
        dept_name: item.dept_name,
        product_name: item.product_name,
        name: item.name,
        description: item.description,
        is_base: item.is_base,
        pm_name: item.pm_name,
        receiver_names: item.receiver_names,
        purchaser: item.purchaser,
        begin_date: item.begin_date,
        end_date: item.end_date,
        id: item.id,
        bill_no: item.bill_no,
        attachments: item.attachments,
        status: item.status,
        output: item.output,
        verify_standard: item.verify_standard,
        background_desc: item.background_desc,
        tech_desc: item.tech_desc,
        service_location: item.service_location,
        apply_for: item.apply_for // 经办人
      }
      this.detailData.message = data
    },

    setServiceCategoryItems(items) {
      const data = this.formatServiceCategoryItems(items, 1, [])
      this.detailData.details = data
    },

    formatServiceCategoryItems(items, operate, billNos = []) {
      const formData = []
      items.forEach(item => {
        formData.push({
          ...item.cnt,
          images: item.cnt.images.map((img, i) => {
            return {
              uid: `-${i + 1}`,
              status: 'done',
              id: img.file_id,
              size: img.file_size,
              name: img.file_name,
              url: img.file_url
            }
          }),
          complete_date: operate === 1 ? moment(item.cnt.complete_date) : item.cnt.complete_date,
          attr: parseStringToJson(item.cnt.attr, []),
          breakdown: parseStringToJson(item.cnt.breakdown, []),
          workload_unit: item.cnt.workload_unit,
          level: item.cnt.level,
          supplicant: item.cnt.supplicant,
          count: item.cnt.workload, // 品类数量，编辑内容制作费时才有
          uid: createUuid(),
          open: true
        })
      })
      return formData
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
      transform: translate(-50%, -50%);
      z-index: 10;
      .actions-icon {
        color: hsla(0, 0%, 100%, 0.85);
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
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: all 0.3s;
      content: ' ';
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
  width: 80px;
  max-width: 80px;
}
.approval-detail {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 15px 50px 0 rgba(28, 15, 125, 0.05);
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

.detail-box {
  background-color: #fff;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  .header-box {
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid #e9eaf0;
    border-top: 1px solid #fff;
  }
}

.detail-box .modal-head{position: relative; display: flex; flex-wrap: nowrap; align-items: center; padding: 0 20px; border-bottom: 1px solid #e9eaf0; border-top: 1px solid #fff;}
.detail-box .modal-head .col-right{margin-left: auto;}
.detail-box .modal-head .steps-horizontal{padding-top: 10px;}
.detail-box .modal-head .modal-title{font-size: 18px; font-weight: normal; line-height: 30px; padding: 16px 0;}
.detail-box .modal-head .modal-close{position: absolute; display: block; border: 2px solid #fff; padding: 9px; left: -80px; top: 80px; border-radius: 50%;}
.detail-box .modal-head .modal-close>i{display: block; width: 18px; height: 18px; position: relative;}
.detail-box .modal-head .modal-close>i::before, .omc-modal .modal-head .modal-close>i::after{position: absolute; left: 50%; top: 50%; margin-left: -9px; margin-top: -1px; width: 18px; height: 2px; border-radius: 2px; content: ""; background-color: #fff;}
.detail-box .modal-head .modal-close>i::after{transform: rotate(45deg);}
.detail-box .modal-head .modal-close>i::before{transform: rotate(-45deg);}
.detail-box .modal-head .modal-close:hover{border-color: #f84f4f; background-color: #f84f4f;}
.detail-box .modal-head .stamp-default{position: absolute; top: -16px; right: 15px;}
.detail-box .modal-body{flex: 1 1 100%; background-color: #f5f6fa; overflow-y: auto; padding: 20px;}

.detail-box .modal-body::-webkit-scrollbar{height: 8px; width: 8px;}
.detail-box .modal-body::-webkit-scrollbar-corner {display: none;}
.detail-box .modal-body::-webkit-scrollbar-thumb {background-color: rgba(0, 0, 0, 0);}
.detail-box .modal-body:hover::-webkit-scrollbar-thumb {background-color: #b8bccc; border-radius: 0;}
.detail-box .modal-body::-webkit-scrollbar-thumb:hover {background-color: #6a6f85;}
</style>
