<template>
  <div class="col-right">
    <div class="omc-table">
      <div class="omc-table-toolbar">
        <div class="col-left-wrapper">
          <h2 class="table-title">需求审批配置</h2>
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
                <td v-if="i === 0" :rowspan="item.config.length">{{ item.dept_name }}</td>
                <td v-if="i === 0" :rowspan="item.config.length">{{ item.type === 1 ? '内容制作费' : '研发费' }}</td>
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
                    'dept_id',
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
                    'type',
                    {
                      rules: [{ required: true, message: '必选项' }]
                    }
                  ]"
                  placeholder="请选择配置类型"
                  :options="settingTypeOpt"
                  :disabled="isEdit"
                ></a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="财管人员">
                <common-member-picker
                  v-decorator="[
                    'finmgr',
                    {
                      initialValue: '',
                      rules: [{ required: true, message: '必填项' }]
                    }
                  ]"
                  placeholder="请输入英文名选择"
                  :is-cache="false"
                ></common-member-picker>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="GM人员">
                <common-member-picker
                  v-decorator="[
                    'gm',
                    {
                      initialValue: '',
                      rules: [{ required: true, message: '必填项' }]
                    }
                  ]"
                  placeholder="请输入英文名选择"
                  :is-cache="false"
                ></common-member-picker>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="VP人员">
                <common-member-picker
                  v-decorator="[
                    'vp',
                    {
                      initialValue: '',
                      rules: [{ required: true, message: '必填项' }]
                    }
                  ]"
                  placeholder="请输入英文名选择"
                  :is-cache="false"
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
  addDemandConfig,
  getDemandConfigs,
  delDemandConfig,
  updateDemandConfig
} from '@/api/system/demand'

export default {
  name: 'DemandSetting',
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
          label: '内容制作费',
          value: 1
        },
        {
          label: '研发费',
          value: 2
        }
      ],
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
  },
  methods: {
    async getLists() {
      return new Promise((resolve, reject) => {
        getDemandConfigs(this.page, this.pageSize, this.selectedDepartId, this.selectedBudgetType)
          .then(res => {
            const { items, total } = res.content
            if (total > 0) {
              this.isEmpty = false
            } else {
              this.isEmpty = true
            }
            this.total = total
            this.tabelData = items.map(item => {
              return {
                ...item,
                config: [
                  {
                    title: '财管人员',
                    handler: item.finmgr ? item.finmgr.join('；') : ''
                  },
                  {
                    title: 'GM人员',
                    handler: item.gm ? item.gm.join('；') : ''
                  },
                  {
                    title: 'VP人员',
                    handler: item.vp ? item.vp.join('；') : ''
                  }
                ]
              }
            })
            resolve(items)
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
    loadAllData() {
      return new Promise((resolve, reject) => {
        getDemandConfigs(1, this.allTotal)
          .then(res => {
            const { items } = res.content
            if (Array.isArray(items)) {
              const data = items.map(item => {
                return {
                  ...item,
                  type: item === 1 ? '内容制作费' : '研发费',
                  finmgr: item.finmgr ? item.finmgr.join(';') : '',
                  gm: item.gm ? item.gm.join(';') : '',
                  vp: item.vp ? item.vp.join(';') : ''
                }
              })
              resolve(data)
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
              filename: '需求审批配置表',
              autoWidth: true,
              bookType: 'xlsx'
            })
          })
          .catch(err => {
            this.exporting = false
            this.$message.error(`导出需求审批配置表失败！${err}`)
          })
      } catch (error) {
        this.exporting = false
        this.$message.error(`导出需求审批配置表失败！${error}`)
      }
    },
    openAddModal() {
      // 重置表单数据项
      this.addForm.resetFields()
      this.editId = undefined
      this.addModal = true
    },
    onModalOk() {
      this.addForm.validateFieldsAndScroll(async(err, values) => {
        if (err) return

        const form = {
          ...values,
          id: this.editId,
          finmgr: values.finmgr.split(';'),
          gm: values.gm.split(';'),
          vp: values.vp.split(';')
        }
        let submitFun = addDemandConfig
        if (this.isEdit) {
          submitFun = updateDemandConfig
        }
        submitFun([].concat(form)).then(res => {
          this.$message.success('保存成功')
          if (!this.isEdit) {
            // 新增时需要重置
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
    editSettingItem(item) {
      this.editId = item.id
      this.isEdit = true
      this.addModal = true
      // 在视图更新后设置表单数据
      this.$nextTick(() => {
        this.addForm.setFieldsValue({
          dept_id: item.dept_id,
          type: item.type,
          finmgr: item.finmgr ? item.finmgr.join(';') : '',
          gm: item.gm ? item.gm.join(';') : '',
          vp: item.vp ? item.vp.join(';') : ''
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
              delDemandConfig([].concat(item.id)).then(res => {
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
