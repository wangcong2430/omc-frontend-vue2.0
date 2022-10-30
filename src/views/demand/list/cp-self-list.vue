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
        <span slot="epo_sync_status" slot-scope="text, record" :class="formatEpoOrWbpClass(text)">
          <a-tooltip v-if="text === 2">
            <template slot="title">{{ record.epo_sync_ret }}</template>
            <span class="epo-sync-status">{{ formatEpoOrWbpStatus(text) }}</span>
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
            v-permission="['button/g_reset_sync_status']"
            @click="resetSyncStatus(record)"
          >
            <a href="javascript:;" class="btn-icon">
              <i class="mdi-set mdi-refresh"></i>
              <span>重置同步状态</span>
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
    </template>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import LoadingModal from '@/components/LoadingModal'
import EmptyPage from '@/components/EmptyPage/index'
import Pagination from '@/components/Pagination/index'

export default {
  name: 'DemandCpSelfList',
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
    editConsume: {
      type: Function,
      default: undefined
    },
    deleteConsume: {
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
    },
    resetSyncStatus: {
      type: Function,
      default: undefined
    }
  },
  data() {
    return {
      rdDemandColumns: [
        { title: '需求单号', dataIndex: 'bill_no', scopedSlots: { customRender: 'bill_no' }},
        { title: '需求名称', dataIndex: 'name', key: 'name' },
        { title: '需求金额(元)', dataIndex: 'amount', scopedSlots: { customRender: 'amount' }},
        { title: '申请人', dataIndex: 'applicant', key: 'applicant' },
        { title: '提交时间', dataIndex: 'create_time', key: 'create_time' },
        { title: 'IOMC审批状态', dataIndex: 'status_name', scopedSlots: { customRender: 'status_name' }},
        { title: 'EPO状态', dataIndex: 'epo_sync_status', scopedSlots: { customRender: 'epo_sync_status' }},
        { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }}
      ]
    }
  },
  computed: {
    ...mapState({
      englishName: state => state.user.englishName
    })
  }
}
</script>
<style lang="less" scoped>
.list-wrapper {
  position: relative;
}
.epo-sync-status {
  cursor: pointer;
}
.bill-no {
  cursor: pointer;
  color: #4939c4;
  &:hover {
    text-decoration: underline;
  }
}
</style>
