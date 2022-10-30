<template>
  <div class="col-right">
    <div class="omc-table">
      <div class="omc-table-toolbar">
        <div class="col-left-wrapper">
          <h2 class="table-title">预算审批配置</h2>
          <div class="toolbar-select">
            <span class="select-addon">部门：</span>
            <a-select
              v-model="selectedDepartId"
              :options="departmentOpt"
              :allow-clear="true"
              show-search
              placeholder="请选择部门"
              option-filter-prop="children"
              style="width: 300px;"
            ></a-select>
          </div>
          <div class="toolbar-select">
            <span class="select-addon">类型：</span>
            <a-select
              v-model="selectedBudgetType"
              :options="settingTypeOpt"
              :allow-clear="true"
              placeholder="请选择类型"
              style="width: 150px;"
            ></a-select>
          </div>
          <div class="toolbar-select">
            <a-button type="primary" @click="search">查询</a-button>
          </div>
        </div>
        <div class="col-right">
          <ul class="table-actions">
            <li @click="exportData">
              <a href="javascript:;" class="btn-second">
                <span>导出</span>
                <a-spin v-if="exporting">
                  <a-icon
                    slot="indicator"
                    type="loading"
                    style="font-size: 14px; color: #6b5aed;"
                    spin
                  />
                </a-spin>
              </a>
            </li>
            <li @click="openAddModal">
              <a href="javascript:;" class="btn-primary">新增</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="omc-table-content">
        <empty-page v-if="isEmpty" @add="openAddModal"></empty-page>
        <template v-else>
          <table id="approval-setting-table" class="table-secondary">
            <thead>
              <tr>
                <th width="5%">序号</th>
                <th width="15%">部门</th>
                <th width="10%">类型</th>
                <th width="15%">配置名称</th>
                <th>配置人</th>
                <th width="10%" data-actions="true">操作</th>
              </tr>
            </thead>
            <tbody v-for="(item, index) in tabelData" :key="item.id">
              <tr v-for="(list, i) in item.config" :key="i">
                <td v-if="i === 0" :rowspan="item.config.length">{{ index + 1 }}</td>
                <td v-if="i === 0" :rowspan="item.config.length">{{ item.depart_name }}</td>
                <td v-if="i === 0" :rowspan="item.config.length">{{ item.budget_name }}</td>
                <td>{{ list.title }}</td>
                <td>{{ list.handler }}</td>
                <td v-if="i === 0" data-actions="true" :rowspan="item.config.length">
                  <ul class="omc-inline-actions">
                    <li @click="editSettingItem(item)">
                      <a href="javascript:;" class="btn-second">编辑</a>
                    </li>
                    <li @click="delSettingItem(item)">
                      <a href="javascript:;" class="btn-icon">
                        <i class="mdi-set mdi-trash-can-outline"></i>
                        <span>删除</span>
                      </a>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="total > 0" class="omc-table-pagination">
            <pagination :total="total" :current="page" @change="pageChange"></pagination>
          </div>
        </template>
      </div>
    </div>
    <a-modal
      v-model="addModal"
      :title="`${isEdit ? '编辑' : '新增'}预算审批配置`"
      :width="900"
      :mask-closable="false"
      @ok="onModalOk"
      @cancel="addModal = false; isEdit = false;"
    >
      <div class="approval-add-modal">
        <a-form layout="vertical" :form="addForm">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="部门">
                <a-select
                  v-decorator="[
                    'depart_id',
                    {
                      rules: [{ required: true, message: '必选项' }]
                    }
                  ]"
                  show-search
                  option-filter-prop="children"
                  placeholder="请选择部门"
                  :default-active-first-option="false"
                  :options="departmentOpt"
                  :disabled="isEdit"
                ></a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="配置类型">
                <a-select
                  v-decorator="[
                    'workflow_type',
                    {
                      rules: [{ required: true, message: '必选项' }]
                    }
                  ]"
                  placeholder="请选择配置类型"
                  :options="settingTypeOpt"
                  :disabled="isEdit"
                  @change="settingTypeChange"
                ></a-select>
              </a-form-item>
            </a-col>
            <a-col v-for="item in nodesDataItem" :key="item.node_id" :span="12">
              <a-form-item :label="item.title">
                <common-member-picker
                  v-decorator="[
                    `${item.node_id}`,
                    {
                      initialValue: '',
                      rules: [{ required: true, message: '必填项' }]
                    }
                  ]"
                  placeholder="请输入英文名选择"
                  :disabled="item.node_type === 'in'"
                  :only-input-one="true"
                  :is-cache="false"
                  @change="onMemberPickerChange($event, item)"
                ></common-member-picker>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import EmptyPage from '@/components/EmptyPage/index'
import Pagination from '@/components/Pagination/index'
import CommonMemberPicker from '@/components/Form/CommonMemberPicker'
import { tHeader, parseConfigsData } from './export-data'
import { export_json_to_excel } from '@/utils/export-excel'
import { getDepart } from '@/api/budget/index'
import {
  getWorkflowNodes,
  saveApprovalConfig,
  getApprovalList,
  delApprovalList
} from '@/api/system/approval'
import { isObject, toNumber } from 'lodash/lang'
import { partition } from 'lodash/collection'

export default {
  name: 'ApprovalSetting',
  components: {
    EmptyPage,
    Pagination,
    CommonMemberPicker
  },
  data() {
    return {
      isEmpty: true,
      page: 1,
      pageSize: 15,
      selectedDepartId: undefined,
      selectedBudgetType: undefined,
      total: 0,
      tabelData: [],
      addModal: false,
      departmentOpt: [],
      settingTypeOpt: [
        {
          label: '研发费',
          value: 'rd'
        },
        {
          label: '内容制作费',
          value: 'cp'
        },
        {
          label: '预算调整',
          value: 'adjust'
        },
        {
          label: '人力外包',
          value: 'outsource'
        }
      ],
      currentSettingType: '',
      nodesDataItem: [],
      nodesData: [],
      editId: undefined,
      isEdit: false,
      allTotal: 0,
      exporting: false
    }
  },
  beforeCreate() {
    this.addForm = this.$form.createForm(this, { name: 'approval_add_form' })
  },
  created() {
    this.getLists().then(res => {
      this.allTotal = this.total
    })
    this.getDepartment()
    this.getNodesData()
  },
  methods: {
    async getLists() {
      return new Promise((resolve, reject) => {
        getApprovalList(this.page, this.pageSize, this.selectedDepartId, this.selectedBudgetType)
          .then(res => {
            const { data } = res
            if (data.count > 0) {
              this.isEmpty = false
            } else {
              this.isEmpty = true
            }
            this.total = data.count
            this.tabelData = data.list
            resolve(data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    pageChange({ page, pageSize }) {
      this.page = page
      this.getLists()
    },
    search() {
      this.page = 1
      this.getLists()
    },
    getDepartment() {
      getDepart().then(res => {
        const { data } = res
        this.departmentOpt = data.map(item => {
          return {
            label: item.depart_name,
            value: item.depart_id
          }
        })
      })
    },
    getNodesData() {
      getWorkflowNodes().then(res => {
        const { data } = res
        this.nodesData = data
      })
    },
    loadAllData() {
      return new Promise((resolve, reject) => {
        getApprovalList(1, this.allTotal)
          .then(res => {
            const { data } = res
            if (data.list && Array.isArray(data.list)) {
              resolve(data.list)
            } else {
              resolve([])
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    async exportData() {
      if (!this.allTotal) {
        return this.$message.error('当前配置表数据为空，请先新增后再导出！')
      }
      if (this.exporting) {
        return this.$message.info('导出中...')
      }
      this.exporting = true
      try {
        const data = await this.loadAllData()
        parseConfigsData(data)
          .then(res => {
            this.exporting = false
            export_json_to_excel({
              header: tHeader,
              data: res,
              filename: '预算审批配置表',
              autoWidth: true,
              bookType: 'xlsx'
            })
          })
          .catch(err => {
            this.exporting = false
            this.$message.error(`导出预算审批配置表失败！${err}`)
          })
      } catch (error) {
        this.exporting = false
        this.$message.error(`导出预算审批配置表失败！${error}`)
      }
    },
    openAddModal() {
      // 重置表单数据项
      this.addForm.resetFields()
      this.nodesDataItem = []
      this.editId = undefined
      this.addModal = true
    },
    settingTypeChange(val) {
      // 选择人力外包时需要处理，只能选择IEG办公室
      if (val === 'outsource') {
        this.addForm.resetFields(['depart_id'])
        this.departmentOpt = this.departmentOpt.map(item => Object.assign({}, item, { disabled: item.value !== 1153 }))
      } else {
        this.departmentOpt = this.departmentOpt.map(item => Object.assign({}, item, { disabled: false }))
      }
      this.currentSettingType = val
      const node = this.nodesData.find(node => node.workflow_type === val)
      if (node) {
        this.nodesDataItem = node.list || []
      }
    },
    onMemberPickerChange(member, nodeItem) {
      // 预算调整类型特殊处理，选择调出自动关联到调入
      if (this.currentSettingType === 'adjust') {
        const relatedItem = this.nodesDataItem.find(item => item.alias === nodeItem.alias && item.node_type === 'in')
        if (relatedItem) {
          this.addForm.setFieldsValue({ [relatedItem.node_id]: member })
        }
      }
    },
    onModalOk() {
      this.addForm.validateFieldsAndScroll(async(err, values) => {
        if (err) return

        const form = this.handleFormData(values)
        saveApprovalConfig(form).then(res => {
          this.$message.success('保存成功')
          if (!this.isEdit) {
            // 新增时重置
            this.page = 1
            this.selectedDepartId = undefined
            this.selectedBudgetType = undefined
          }
          this.getLists()
          this.isEdit = false
          this.addModal = false
        })
      })
    },
    handleFormData(values) {
      if (!isObject(values)) return
      const keys = Object.keys(values)
      const configs = []
      const result = {}
      keys.forEach(key => {
        if (key !== 'depart_id' && key !== 'workflow_type') {
          configs.push({
            node_id: toNumber(key),
            handler: values[key]
          })
        } else {
          result[key] = values[key]
        }
      })
      // 预算调整需要特殊处理
      if (this.currentSettingType === 'adjust') {
        const adjustConfigs = []
        const filterData = partition(this.nodesDataItem, o => {
          return o.alias === 'financial'
        })
        adjustConfigs.push(this.handleFilterData(filterData[0], configs), this.handleFilterData(filterData[1], configs))

        result['cfg'] = adjustConfigs
        result['id'] = this.editId
        return result
      }

      result['cfg'] = configs
      result['id'] = this.editId
      return result
    },
    handleFilterData(data, configs) {
      let nodeId = ''
      let inNodeId = ''
      data.forEach(item => {
        if (item.node_type === 'out') {
          nodeId = item.node_id
        }
        if (item.node_type === 'in') {
          inNodeId = item.node_id
        }
      })
      const filterHandler = configs.find(item => {
        const targetIndex = data.findIndex(i => i.node_id === item.node_id)
        if (targetIndex !== -1) {
          return true
        }
        return false
      })

      return {
        node_id: nodeId,
        in_node_id: inNodeId,
        handler: filterHandler ? filterHandler['handler'] : ''
      }
    },
    editSettingItem(item) {
      this.currentSettingType = item.workflow_type
      this.editId = item.id
      this.isEdit = true
      this.addModal = true
      const node = this.nodesData.find(node => node.workflow_type === item.workflow_type)
      if (node) {
        this.nodesDataItem = node.list || []
      }
      // 在视图更新后设置表单数据
      this.$nextTick(() => {
        this.addForm.setFieldsValue({
          depart_id: item.depart_id,
          workflow_type: item.workflow_type
        })
        item.config.forEach(m => {
          this.addForm.setFieldsValue({
            [m.node_id]: m.handler
          })
        })
      })
    },
    delSettingItem(item) {
      const deleteModal = this.$confirm({
        title: '删除配置项',
        content: `确定要删除该配置项吗？`,
        onOk: () => {
          deleteModal.update({ okButtonProps: { props: { loading: true }}})
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              delApprovalList(item.id).then(res => {
                deleteModal.update({ okButtonProps: { props: { loading: false }}})
                this.getLists()
                this.$message.success('删除成功')
                resolve()
              })
            }, 100)
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.approval-add-modal {
  width: 100%;
}
</style>
