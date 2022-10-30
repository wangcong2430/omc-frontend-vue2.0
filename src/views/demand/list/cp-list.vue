<template>
  <div class="list-wrapper">
    <loading-modal
      v-if="loading"
      :tip-text="'需求列表数据加载中...'"
    />
    <empty-page
      v-else-if="total <= 0"
      :add-text="'申请需求'"
      :show-blank-text="onAdd !== undefined"
      @add="onAdd ? onAdd() : () => {}"
    ></empty-page>
    <template v-else>
      <a-table
        :columns="cpDemandColumns"
        :data-source="tableData"
        :pagination="false"
        :expand-icon="props => customExpandIcon(props)"
        :expanded-row-keys="expandedRows"
        class="table-demand-list"
        @expandedRowsChange="onExpandChange"
      >
        <span
          slot="bill_no"
          slot-scope="text, record"
          class="bill-no"
          @click="showConsumeDetail(record)"
        >{{ (record.flow_instance_id && record.status === 1) ? `${text}（被驳回）` : text }}</span>
        <span slot="amount" slot-scope="text">{{ text | formatNumber }}</span>
        <span
          slot="status_name"
          slot-scope="text, record"
          :class="formatApprovalStatus(record.status)"
        >{{ text }}</span>
        <span slot="wbp_sync_status" slot-scope="text, record" :class="formatEpoOrWbpClass(text)">
          <a-tooltip v-if="text === 2">
            <template slot="title">{{ record.wbp_sync_ret }}</template>
            <span class="wbp-sync-status ellipsis">{{ formatEpoOrWbpStatus(text) }}: {{ record.wbp_sync_ret }}</span>
          </a-tooltip>
          <span v-else>{{ formatEpoOrWbpStatus(text) }}</span>
        </span>
        <ul slot="operation" slot-scope="record" class="omc-inline-actions">
          <li
            v-if="editConsume !== undefined && record.status <= 1"
            v-permission="['button/demand_modify']"
            @click="editConsume(record)"
          >
            <a href="javascript:;" class="btn-icon">
              <i class="mdi-set mdi-pencil"></i>
              <span>编辑</span>
            </a>
          </li>
          <li @click="showConsumeDetail(record)">
            <a href="javascript:;" class="btn-icon">
              <i class="mdi-set mdi-text-subject"></i>
              <span>查看明细</span>
            </a>
          </li>
          <li
            v-if="deleteConsume !== undefined &&
              (record.status <= 1 || record.wbp_sync_status === 2 || !record.innerTableData.length)
            "
            v-permission="['button/demand_delete']"
            @click="deleteConsume(record)"
          >
            <a href="javascript:;" class="btn-icon">
              <i class="mdi-set mdi-trash-can-outline"></i>
              <span>删除</span>
            </a>
          </li>
          <li
            v-permission="['button/g_reset_sync_status']"
            @click="resetSyncStatus(record)"
          >
            <a href="javascript:;" class="btn-icon">
              <i class="mdi-set mdi-refresh"></i>
              <span>重置同步状态</span>
            </a>
          </li>
        <!-- 只有需求申请人才有权限操作结项 -->
        <!-- <li
          v-if="
            closeConsume !== undefined &&
              record.applicant === englishName &&
              record.status > 1
          "
          @click="closeConsume(record)"
        >
          <a href="javascript:;" class="btn-icon">
            <i class="mdi-set mdi-close"></i>
            <span>结项</span>
          </a>
        </li> -->
        <!-- 只有需求申请人才有权限操作需求修改 -->
        <!-- <li
          v-if="
            editConsume !== undefined &&
              record.applicant === englishName &&
              record.status > 1
          "
          @click="editConsume(record, undefined, undefined, true)"
        >
          <a href="javascript:;" class="btn-icon">
            <i class="mdi-set mdi-square-edit-outline"></i>
            <span>需求修改</span>
          </a>
        </li> -->
        </ul>
        <span
          slot="is_base"
          slot-scope="text"
        >
          {{ isBaseOptions.find(i => i.value === +text)?.label || text }}
        </span>
        <a-table
          slot="expandedRowRender"
          slot-scope="parentRecord"
          :columns="innerColumns"
          :data-source="parentRecord.innerTableData"
          :pagination="{size: 'small'}"
          :row-selection="innerRowSelection(parentRecord)"
          class="table-material-list"
        >
          <span
            slot="bill_no"
            slot-scope="text, record"
            class="material-bill-no"
            @click="showMaterialModal(record)"
          >{{ text }}</span>
          <span slot="wbp_sync_status" slot-scope="text, record" :class="formatMaterailWbpClass(text)">
            <a-tooltip v-if="text === 3">
              <template slot="title">{{ record.wbp_sync_ret }}</template>
              <span class="wbp-sync-status">{{ formatMaterailWbpStatus(text) }}</span>
            </a-tooltip>
            <span v-else>{{ formatMaterailWbpStatus(text) }}</span>
          </span>
          <span
            slot="wbp_status_name"
            slot-scope="text, record"
            :class="{
              'text-primary': text && text.includes('已重新提单'),
              'text-danger': (text && text.includes('驳回')) || record.allow_copy === 1
            }"
          >
            {{ formatWbpStatusName(text, record) }}
            <span
              v-if="[1, 2].includes(record.wbp_sync_status)"
              class="wbp-process"
              title="查看wbp"
              @click="checkWbpProcess(record)"
            >
              <a href="javascript:;" class="btn-icon">
                <i class="mdi-set mdi-table-search"></i>
              </a>
            </span>
          </span>
          <span
            slot="type_name"
            slot-scope="text"
          >
            {{ text }}
          </span>
          <span
            slot="images"
            slot-scope="text"
            class="intro-img-wrapper"
          >
            <span v-if="text.length > 0" class="intro-img-item">
              <img :src="text[0].file_url" class="intro-img">
              <span class="intro-img-actions">
                <a-icon class="actions-icon" type="eye" @click="previewImage(text[0])" />
                <a-icon
                  class="actions-icon"
                  type="cloud-download"
                  @click="downloadImage(text[0])"
                />
              </span>
            </span>
          </span>
          <span
            slot="quote_workload"
            slot-scope="text"
          >
            {{ text }}
          </span>
          <span
            slot="workload"
            slot-scope="text, record"
          >
            {{ text }} ({{ record.workload_unit }})
          </span>
          <ul slot="operation" slot-scope="record" class="omc-inline-actions">
            <li
              v-if="record.allow_copy === 1 || record.wbp_status_name.includes('已重新提单')"
              @click="deleteConsumeDetail(parentRecord, record)"
            >
              <a href="javascript:;" class="btn-icon">
                <i class="mdi-set mdi-trash-can-outline"></i>
                <span>删除</span>
              </a>
            </li>
            <li>
              <a v-if="[1, 2].includes(record.wbp_sync_status)" :href="wbpLink+record.bill_no" target="_bank" class="btn-icon">
                <i class="mdi-set  mdi-comment-search"></i>
                <span>查看wbp交付页</span>
              </a>
            </li>
          </ul>
          <a-button
            v-if="showInnerTableFooter(parentRecord.innerTableData)"
            slot="footer"
            :disabled="disabledInnerTableFooter(parentRecord.bill_no)"
            @click="editConsume(
              parentRecord,
              selectedMaterialBillnos[parentRecord.bill_no],
              true
            )"
          >重新编辑填报</a-button>
          <a-button
            v-if="showInnerTableFooter(parentRecord.innerTableData)"
            slot="footer"
            :disabled="disabledInnerTableFooter(parentRecord.bill_no)"
            class="del-all-btn"
            @click="delAllConsumeDetail(parentRecord)"
          >批量删除</a-button>
        </a-table>
      </a-table>
      <div v-if="total > 0" class="omc-table-pagination">
        <pagination
          :total="total"
          :current="page"
          :page-size="pageSize"
          :show-size-changer="true"
          @change="onPageChange"
          @showSizeChange="onPageSizeChange"
        ></pagination>
      </div>
      <material-modal
        :visible="materialModalStatus"
        :detail="materialData"
        :format-materail-wbp-class="formatMaterailWbpClass"
        :format-materail-wbp-status="formatMaterailWbpStatus"
        :format-wbp-status-name="formatWbpStatusName"
        @close="materialModalStatus = false;"
      ></material-modal>
      <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false;">
        <div class="preview-img-detail">
          <span>缩略图信息：{{ previewImageName }}（{{ previewImageSize }}）</span>
        </div>
        <img alt="preview" style="width: 100%" :src="previewImageUrl" />
      </a-modal>
      <a-modal
        v-model="popupShow"
        title="WBP订单信息"
        class="wbp-popup"
        :mask-closable="false"
        @ok="closeModal"
        @cancel="popupShow = false"
      >
        <table>
          <thead class="iomc-table-thead">
            <tr>
              <th>处理环节</th>
              <th>状态</th>
              <th>处理结果</th>
              <th>处理时间</th>
              <th>操作人信息</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody class="iomc-tables-tbody">
            <tr v-for="item in popupWbpData" :key="item.create_time">
              <td>{{ screenAttr(item.flow_step_name) }}</td>
              <td>{{ screenAttr(item.status) }}</td>
              <td>{{ screenAttr(item.operation_type_name) }}</td>
              <td class="time">{{ screenAttr(item.create_time) }}</td>
              <td class="name">{{ screenAttr(item.creator_name) }}</td>
              <td class="mark">{{ screenAttr(item.remark) }}</td>
            </tr>
          </tbody>
        </table>
      </a-modal>
    </template>
  </div>
</template>
<script>
import LoadingModal from '@/components/LoadingModal'
import EmptyPage from '@/components/EmptyPage/index'
import Pagination from '@/components/Pagination/index'
import MaterialModal from './material-modal'
import { calculateFileSize } from '@/utils/index'
import { delConsumeDetail, getWbpHistoryList } from '@/api/demand'
import { mapState } from 'vuex'
import demandMixins from '../mixins/index'

export default {
  name: 'DemandCpList',
  components: {
    LoadingModal,
    EmptyPage,
    Pagination,
    MaterialModal
  },
  mixins: [demandMixins],
  props: {
    tableData: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    expandedRows: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    onExpandChange: {
      type: Function,
      required: true
    },
    showConsumeDetail: {
      type: Function,
      required: true
    },
    formatApprovalStatus: {
      type: Function,
      required: true
    },
    formatEpoOrWbpClass: {
      type: Function,
      required: true
    },
    formatEpoOrWbpStatus: {
      type: Function,
      required: true
    },
    editConsume: {
      type: Function,
      default: undefined
    },
    deleteConsume: {
      type: Function,
      default: undefined
    },
    resetSyncStatus: {
      type: Function,
      default: undefined
    },
    canSelectInnerTable: {
      type: Boolean,
      default: false
    },
    closeConsume: {
      type: Function,
      default: undefined
    },
    total: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 15
    },
    onPageChange: {
      type: Function,
      default: () => {}
    },
    onPageSizeChange: {
      type: Function,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    onAdd: {
      type: Function,
      default: undefined
    }
  },
  data() {
    return {
      cpDemandColumns: [
        { title: '需求单号', dataIndex: 'bill_no', scopedSlots: { customRender: 'bill_no' }},
        { title: '需求名称', dataIndex: 'name', key: 'name' },
        { title: '需求种类', dataIndex: 'is_base', key: 'is_base', scopedSlots: { customRender: 'is_base' }},
        { title: '数量/预估工作量', dataIndex: 'workload_count', key: 'workload_count' },
        { title: '明细', dataIndex: 'detail_count', key: 'detail_count' },
        { title: '申请人', dataIndex: 'applicant', key: 'applicant' },
        { title: '提交时间', dataIndex: 'create_time', key: 'create_time' },
        { title: 'IOMC审批状态', dataIndex: 'status_name', scopedSlots: { customRender: 'status_name' }},
        { title: 'WBP状态', dataIndex: 'wbp_sync_status', scopedSlots: { customRender: 'wbp_sync_status' }},
        { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }}
      ],
      innerColumns: [
        { title: '缩略图', dataIndex: 'images', scopedSlots: { customRender: 'images' }, width: '10%' },
        { title: '物件单号', dataIndex: 'bill_no', scopedSlots: { customRender: 'bill_no' }, width: '10%' },
        { title: '物件名称', dataIndex: 'name', key: 'name', width: '10%' },
        { title: '所属品类', dataIndex: 'category_name', key: 'category_name', width: '5%' },
        { title: '所属类别', dataIndex: 'type_name', scopedSlots: { customRender: 'type_name' }, width: '10%' },
        { title: '数量/预估工作量', dataIndex: 'workload', scopedSlots: { customRender: 'workload' }, width: '10%' },
        { title: '数量/实际工作量', dataIndex: 'quote_workload', scopedSlots: { customRender: 'quote_workload' }, width: '8%' },
        { title: '物件WBP状态', dataIndex: 'wbp_status_name', scopedSlots: { customRender: 'wbp_status_name' }, width: '10%' },
        { title: 'WBP同步状态', dataIndex: 'wbp_sync_status', scopedSlots: { customRender: 'wbp_sync_status' }, width: '10%' },
        { title: 'WBP停留天数', dataIndex: 'wbp_retention_time', key: 'wbp_retention_time', width: '10%' },
        { title: 'WBP当前处理人', dataIndex: 'wbp_current_reviewers', key: 'wbp_current_reviewers', width: '10%' },
        { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, width: '5%' }
      ],
      materialModalStatus: false,
      materialData: {},
      selectedInnerRowKeys: {},
      selectedMaterialBillnos: {},
      previewVisible: false,
      previewImageUrl: '',
      previewImageName: '',
      previewImageSize: '',
      popupShow: false,
      popupWbpData: [],
      wbpLink: 'https://test.wbp.woa.com/iomc/custom/attachment-interaction?thing_code='
    }
  },
  computed: {
    ...mapState({
      englishName: state => state.user.englishName
    })
  },
  mounted() {
    this.setEnvWbpLink()
  },
  methods: {
    closeModal() {
      this.popupShow = !this.popupShow
    },
    setEnvWbpLink() {
      if (process.env.NODE_ENV === 'development') {
        this.wbpLink = 'https://test.wbp.woa.com/iomc/custom/attachment-interaction?thing_code='
      } else {
        this.wbpLink = 'https://wbp.woa.com/iomc/custom/attachment-interaction?thing_code='
      }
    },
    customExpandIcon(props) {
      const { expandable, expanded, onExpand } = props

      if (expandable) {
        if (expanded) {
          return (
            <span class='expand-tool' onClick={onExpand}>
              <a-icon type='down' />
              <span class='expand-text'>收起</span>
            </span>
          )
        } else {
          return (
            <span class='expand-tool' onClick={onExpand}>
              <a-icon type='right' />
              <span class='expand-text'>展开</span>
            </span>
          )
        }
      } else {
        return
      }
    },
    showMaterialModal(item) {
      this.materialData = item
      this.materialModalStatus = true
    },
    formatMaterailWbpStatus(status) {
      switch (status) {
        case 0:
          return '待同步'
        case 1:
          return '同步中'
        case 2:
          return '同步结束'
        case 3:
          return '同步失败'
        default:
          return '-'
      }
    },
    formatMaterailWbpClass(status) {
      switch (status) {
        case 0:
          return 'text-muted'
        case 1:
          return 'text-primary'
        case 2:
          return 'text-success'
        case 3:
          return 'text-danger'
        default:
          return ''
      }
    },
    formatWbpStatusName(name, record) {
      if (record.allow_copy === 1) {
        return `被采购经理驳回，原因：${record.wbp_rejected_reason || '无'}`
      }
      if (name && name.includes('已重新提单')) {
        return '被采购驳回，已重新提单'
      }
      return name
    },
    innerRowSelection(tableData) {
      if (!tableData.innerTableData) {
        return null
      }
      const targetIndex = tableData.innerTableData.findIndex(t => t.allow_copy === 1)
      if (!this.canSelectInnerTable || targetIndex <= -1) {
        return null
      }
      return {
        selectedRowKeys: this.selectedInnerRowKeys[tableData.bill_no] || [],
        onChange: (selectedRowKeys, selectedRows) => {
          if (!tableData.bill_no) {
            return
          }
          this.selectedInnerRowKeys = {
            ...this.selectedInnerRowKeys,
            [tableData.bill_no]: selectedRowKeys
          }
          this.selectedMaterialBillnos = {
            ...this.selectedMaterialBillnos,
            [tableData.bill_no]: selectedRows.map(row => row.bill_no)
          }
        },
        onSelectAll: (selected) => {
          if (!tableData.bill_no) {
            return
          }

          if (selected) {
            const canSelectTableData = tableData.innerTableData.filter(item => item.allow_copy === 1)
            this.selectedInnerRowKeys = {
              ...this.selectedInnerRowKeys,
              [tableData.bill_no]: canSelectTableData.map(item => item.key)
            }
            this.selectedMaterialBillnos = {
              ...this.selectedMaterialBillnos,
              [tableData.bill_no]: canSelectTableData.map(item => item.bill_no)
            }
          } else {
            this.selectedInnerRowKeys = {
              ...this.selectedInnerRowKeys,
              [tableData.bill_no]: []
            }
            this.selectedMaterialBillnos = {
              ...this.selectedMaterialBillnos,
              [tableData.bill_no]: []
            }
          }
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.allow_copy !== 1
          }
        })
      }
    },
    showInnerTableFooter(tableData) {
      const targetIndex = tableData.findIndex(t => t.allow_copy === 1)
      if (
        !this.canSelectInnerTable ||
        targetIndex <= -1 ||
        this.editConsume === undefined
      ) {
        return false
      }
      return true
    },
    disabledInnerTableFooter(key) {
      if (
        !this.selectedInnerRowKeys[key] ||
        (Array.isArray(this.selectedInnerRowKeys[key]) && !this.selectedInnerRowKeys[key].length)
      ) {
        return true
      }
      return false
    },
    formatTypeName(name) {
      if (!name || typeof name !== 'string') {
        return '-'
      }
      return name.replace(/(.)\//, '')
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
    },
    deleteConsumeDetail(parent, item) {
      console.log(item)
      this.$confirm({
        title: '删除物件',
        content: `确定要删除物件【${item.name}】吗？`,
        onOk: () => {
          delConsumeDetail(
            [item.bill_no]
          ).then(() => {
            const targetIndex = parent.innerTableData.findIndex(p => p.bill_no === item.bill_no)
            if (targetIndex > -1) {
              parent.innerTableData.splice(targetIndex, 1)
              this.$message.success('删除成功')
            }
          })
        }
      })
    },
    delAllConsumeDetail(parentRecord) {
      const selectKey = parentRecord.bill_no // 选中的订单
      if (this.selectedMaterialBillnos && this.selectedMaterialBillnos[selectKey]) {
        const selectThingArray = this.selectedMaterialBillnos[selectKey] // 选中的物件
        delConsumeDetail(selectThingArray).then(() => {
          selectThingArray.forEach(item => {
            const delIndex = parentRecord.innerTableData.findIndex(items => items.bill_no === item)
            if (delIndex > -1) {
              parentRecord.innerTableData.splice(delIndex, 1)
            }
            this.$message.success('删除成功')
          })
        })
      }
    },
    checkWbpProcess(thing) {
      this.popupShow = true
      getWbpHistoryList(thing.bill_no).then(res => {
        if (res && res.wbpHistoryList.length > 0) {
          this.popupWbpData = res.wbpHistoryList
        }
      })
    },
    screenAttr(attr) {
      if (attr === '') {
        return '--'
      } else {
        return attr
      }
    }
  }
}
</script>
<style lang="less" scoped>
.ellipsis{
  max-width:125px;
  overflow:hidden;
  text-overflow:ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-wrap:break-word;
  word-break:break-all;
}
.wbp-sync-status {
  cursor: pointer;
}
.bill-no {
  cursor: pointer;
  &:hover {
    color: #4939c4;
    text-decoration: underline;
  }
}
.material-bill-no {
  cursor: pointer;
  color: #4939c4;
  &:hover {
    text-decoration: underline;
  }
}
.expand-tool {
  color: #4939c4;
  cursor: pointer;
  .expand-text {
    margin-left: 2px;
    vertical-align: middle;
    font-size: 12px;
  }
}
.intro-img-wrapper {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  .intro-img-item {
    width: 60px;
    height: 60px;
    margin: 2px 2px;
    position: relative;
    .intro-img {
      height: 100%;
      width: 100%;
      position: relative;
      overflow: hidden;
    }
    &::before {
      position: absolute;
      z-index: 1;
      width: 60px;
      height: 60px;
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
    .intro-img-actions {
      opacity: 0;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-40%,-50%);
      z-index: 10;
      .actions-icon {
        color: hsla(0,0%,100%,.85);
        font-size: 12px;
        cursor: pointer;
        &:first-child {
          margin-right: 6px;
        }
      }
    }
  }
}
.preview-img-detail {
  margin-bottom: 5px;
}
.list-wrapper {
  position: relative;
}
.del-all-btn{
  margin-left: 18px;
}
.iomc-table-thead{
  tr{
    th{
      padding: 12px;
      text-align: center;
    }
  }
}
.iomc-tables-tbody{

  tr{
    td{
      padding: 10px 4px;
      text-align: center;
    }
    .name{
      display: block;
      width: 196px;
    }
    .mark{
      width: 132px;
    }
    .time{
      width: 120px;
    }
    border-bottom:1px solid #f1ecec ;
  }
}
.wbp-process{
  i{font-size: 18px;}
}
</style>
