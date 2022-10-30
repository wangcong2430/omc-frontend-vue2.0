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
        :columns="rdDemandColumns"
        :data-source="tableData"
        :pagination="false"
        class="table-demand-list"
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
        <span v-if="record.dev_category < 4" slot="epo_sync_status" slot-scope="text, record" :class="formatEpoOrWbpClass(text)">
          <a-tooltip v-if="text === 2">
            <template slot="title">{{ record.epo_sync_ret }}</template>
            <span class="epo-sync-status">{{ formatEpoOrWbpStatus(text) }}</span>
          </a-tooltip>
          <span v-else>{{ formatEpoOrWbpStatus(text) }}</span>
        </span>
        <span v-else>-</span>
        <span v-if="record.dev_category >= 4" slot="rdb_sync_status" slot-scope="text, record" :class="formatRdbClass(text)">
          <a-tooltip v-if="text === 2">
            <template slot="title">{{ record.rdb_sync_ret }}</template>
            <span class="rdb-sync-status">{{ formatRdbStatus(text) }}</span>
          </a-tooltip>
          <span v-else>{{ formatRdbStatus(text) }}</span>
        </span>
        <span v-else>-</span>
        <span slot="close_epo_close_status" slot-scope="text, record" :class="formatEpoCloseStatusClass(record.epo_close)">
          <span>{{ formatEpoCloseStatus(record.epo_close) }}</span>
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
            v-if="deleteConsume !== undefined && record.status <= 1"
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
          <!-- 只有需求申请人才有权限操作结项，并且已结束，或者改价结束，且EPO推送(已推送)，时-->
          <li v-if="record.epo_sync_status === 1" @click="showOrderData(record)">
            <a href="javascript:;" class="btn-icon">
              <i class="mdi-set mdi-book-search-outline"></i>
              <span>订单查询</span>
            </a>
          </li>
          <!-- 只有需求申请人才有权限操作结项，并且已结束，或者改价结束，且EPO推送(已推送)，时，才允许改价  -->
          <li
            v-if="checkCloseConsumeStatus(record)"
            @click="closeConsume(record)"
          >
            <a href="javascript:;" class="btn-icon">
              <i class="mdi-set mdi-close"></i>
              <span>结项</span>
            </a>
          </li>
          <!-- 只有需求申请人才有权限操作需求修改, 并且已结束，或者改价结束，且EPO推送(已推送)，时，才允许改价 -->
          <li
            v-if="checkEditConsumeStatus(record)"
            @click="editConsume(record, undefined, undefined, true)"
          >
            <a href="javascript:;" class="btn-icon">
              <i class="mdi-set mdi-square-edit-outline"></i>
              <span>需求修改</span>
            </a>
          </li>
        </ul>
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
      <div>
        <a-modal
          v-model="popupShow"
          title="订单数据"
          :mask-closable="false"
          @ok="closeModal"
          @cancel="popupShow = false"
        >
          <table v-if="!proupDataJude">
            <thead class="iomc-table-thead">
              <tr>
                <th>已下订单</th>
                <th>已下订单金额</th>
                <th>已验收金额</th>
              </tr>
            </thead>
            <tbody class="iomc-table-tbody">
              <tr v-for="(item,index) in proupData" :key="index">
                <td>{{ item.posp_number }}</td>
                <td>{{ item.total_amount | formatNumber }}</td>
                <td>{{ item.acceptance_amount | formatNumber }}</td>
              </tr>
            </tbody>
          </table>
          <div v-else class="no_data">
            暂时没有数据
          </div>
        </a-modal>
      </div>
    </template>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import LoadingModal from '@/components/LoadingModal'
import EmptyPage from '@/components/EmptyPage/index'
import Pagination from '@/components/Pagination/index'
import { getEpoPoList } from '@/api/demand/research'
export default {
  name: 'DemandRdList',
  components: {
    LoadingModal,
    EmptyPage,
    Pagination
  },
  props: {
    tableData: {
      type: Array,
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
    formatEpoCloseStatusClass: {
      type: Function,
      required: true
    },
    formatEpoCloseStatus: {
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
      rdDemandColumns: [
        { title: '需求单号', dataIndex: 'bill_no', scopedSlots: { customRender: 'bill_no' }},
        { title: '需求名称', dataIndex: 'name', key: 'name' },
        { title: '明细', dataIndex: 'detail_count', key: 'detail_count' },
        { title: '需求金额(元)', dataIndex: 'amount', scopedSlots: { customRender: 'amount' }},
        { title: '申请人', dataIndex: 'applicant', key: 'applicant' },
        { title: '提交时间', dataIndex: 'create_time', key: 'create_time' },
        { title: 'IOMC审批状态', dataIndex: 'status_name', scopedSlots: { customRender: 'status_name' }},
        { title: 'EPO状态', dataIndex: 'epo_sync_status', scopedSlots: { customRender: 'epo_sync_status' }},
        { title: 'RDB状态', dataIndex: 'rdb_sync_status', scopedSlots: { customRender: 'rdb_sync_status' }},
        { title: '结项状态', dataIndex: 'close_epo_close_status', scopedSlots: { customRender: 'close_epo_close_status' }},
        { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }}
      ],
      popupShow: false,
      proupData: [],
      proupDataJude: false
    }
  },
  computed: {
    ...mapState({
      englishName: state => state.user.englishName
    })
  },
  methods: {
    closeModal() {
      this.popupShow = !this.popupShow
    },
    showOrderData(data) {
      this.popupShow = true
      getEpoPoList(data.bill_no).then(res => {
        if (res.content.length > 0) {
          this.proupDataJude = false
          this.proupData = res.content
        } else {
          this.proupDataJude = true
        }
      })
    },
    formatRdbClass(status) {
      switch (status) {
        case 0:
          return 'text-muted'
        case 1:
          return 'text-success'
        case 2:
          return 'text-danger'
        default:
          return ''
      }
    },
    formatRdbStatus(status) {
      switch (status) {
        case 0:
          return '待同步'
        case 1:
          return '已同步'
        case 2:
          return '同步失败'
        default:
          return '-'
      }
    },
    checkCloseConsumeStatus(record) {
      if (
        this.closeConsume !== undefined &&
        record.applicant === this.englishName &&
        record.epo_sync_status === 1 &&
        (record.status === 3 || record.status === 5) &&
        (record.dev_category === 1 || record.dev_category === 3) // 外包开发及测试、其他研发费
      ) {
        return true
      }
      return false
    },
    checkEditConsumeStatus(record) {
      if (
        this.editConsume !== undefined &&
        record.applicant === this.englishName &&
        record.epo_sync_status === 1 &&
        (record.status === 3 || record.status === 5) &&
        (record.dev_category === 1 || record.dev_category === 3) // 外包开发及测试、其他研发费
      ) {
        return true
      }
      return false
    }
  }
}
</script>
<style lang="less" scoped>
.epo-sync-status, .rdb-sync-status {
  cursor: pointer;
}
.bill-no {
  cursor: pointer;
  color: #4939c4;
  &:hover {
    text-decoration: underline;
  }
}
.list-wrapper {
  position: relative;
}
.iomc-modal-body{

    position: fixed;
    width: 440px;
    min-height: 200px;
    right: 30%;
    top:28%;
    padding:10px 0 0 20px;
    h5{
      font-size: 16px;
      font-weight: 600;
      margin: 0px;
    }
    .order_details{
      list-style: none;
      margin: 0px;
      padding: 10px 0 0 0px;
      li{
         line-height: 22px;
        .order_title{
          display: inline-block;
          width: 68px;
          margin-right: 10px;
        }
      }
    }
    .no_data{
      background-color: #fff;
      text-align: center;
      padding: 20px 0px;
      border: 1px solid #d5d2d2;
    }
    table{
      width: 472px;
      background-color: #fff;
        .iomc-table-thead{
           tr{

             border: 1px solid #d9d5d5;
              th{
                padding: 10px;
                text-align: center;
                border-right: 1px solid #d7d7d7;
              }
            }
        }
        .iomc-table-tbody{
           tr{
             text-align: center;
             border: 1px solid #d9d5d5;
             td{
               padding: 10px;
               border-right: 1px solid #d7d7d7;
             }
           }
        }
    }
}
</style>
