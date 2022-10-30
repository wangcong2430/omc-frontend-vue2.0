<template>
  <div>
    <right-modal :visible="show" :width="1000" :title="'需求详细'" @close="onClose">
      <template #modalHead>
        <div v-if="detailData.message && detailData.message.status !== 1">
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
              <li>
                <div class="cost-item">
                  <div class="item-label">项目负责人</div>
                  <div class="item-value">{{ detailData.message.pm_name }}</div>
                </div>
              </li>
              <li>
                <div class="cost-item">
                  <div class="item-label">验收人</div>
                  <div class="item-value">{{ detailData.message.receiver_names }}</div>
                </div>
              </li>
              <li>
                <div class="cost-item">
                  <div class="item-label">预算使用年份</div>
                  <div class="item-value">{{ detailData.message.year || '-' }}</div>
                </div>
              </li>
              <li>
                <div class="cost-item">
                  <div class="item-label">期望交付日期</div>
                  <div class="item-value">{{ detailData.message.expect_date || '-' }}</div>
                </div>
              </li>
              <li>
                <div class="cost-item">
                  <div class="item-label">预期开始日期</div>
                  <div class="item-value">{{ detailData.message.begin_date }}</div>
                </div>
              </li>
              <li>
                <div class="cost-item">
                  <div class="item-label">预期结束日期</div>
                  <div class="item-value">{{ detailData.message.end_date }}</div>
                </div>
              </li>
              <li>
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
              <li>
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
              <li>
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
              <li>
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
              <li>
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
              <li>
                <div class="cost-item">
                  <div class="item-label">备注</div>
                  <div class="item-value">
                    <text-limit
                      :text="detailData.message.memo"
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
                预估总价(￥)： <span>{{ sumAmount() | formatNumber }}</span>
              </p>
            </div>
            <div class="budget-total">
              <p class="budgetList">
                预算金额：<span>{{ budgetExpenses.total_budget | formatNumber }}</span>
              </p>
              <p class="budgetList">
                已使用：<span>{{ budgetExpenses.consumed_budget | formatNumber }}</span>
              </p>
              <p class="budgetList">
                可用余额：<span>{{ budgetExpenses.left_budget | formatNumber }}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="iomc-table iomc-table-default iomc-table-bordered">
          <div class="iomc-table-content">
            <div class="iomc-table-body">
              <table>
                <thead class="iomc-table-thead">
                  <tr>
                    <th width="80">#</th>
                    <th>资源类型</th>
                    <th width="314">金额(RMB元)</th>
                  </tr>
                </thead>
                <tbody class="iomc-table-tbody">
                  <tr v-for="(item, index) in detailData.details" :key="item.value">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.type_name }}</td>
                    <td>
                      {{ item.workload_amount }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
      <template #modalFooter>
        <slot name="modalFoot"></slot>
      </template>
    </right-modal>
  </div>
</template>
<script>
import Steps from '@/components/Steps/index'
import TextLimit from '@/components/TextLimit'
import RightModal from '@/components/RightModal/index'
import { setClassWithFileType } from '@/utils/index'

export default {
  name: 'CpSelfDetailModal',
  components: {
    Steps,
    TextLimit,
    RightModal
  },
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
  watch: {
    budgetExpenses: function(newValue) {
      this.budgetExpenses = newValue
    }
  },
  methods: {
    onClose() {
      this.$emit('close-modal')
    },
    testFileType(name) {
      return setClassWithFileType(name)
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
    sumAmount() {
      const form = this.detailData.details
      if (Array.isArray(form) && form.length > 0) {
        return form.reduce((accumulator, currentValue) => {
          return accumulator + Number(currentValue.workload_amount)
        }, 0)
      } else {
        return 0
      }
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
