<template>
  <div class="col-right">
    <div class="omc-table">
      <div class="omc-table-toolbar">
        <div class="col-left-wrapper">
          <h2 class="table-title">权限接口配置</h2>
          <div class="toolbar-select">
            <span class="select-addon">接口名：</span>
            <a-input
              v-model="interfaceAction"
              :allow-clear="true"
              placeholder="请输入接口名查询"
              style="width: 300px;"
              @pressEnter="onSearch"
            />
          </div>
          <div class="toolbar-select">
            <a-button type="primary" @click="onSearch">查询</a-button>
            <a-button style="margin-left: 15px;" @click="onResetting">重置</a-button>
          </div>
        </div>
        <div class="col-right">
          <ul class="table-actions">
            <li @click="openAddModal">
              <a href="javascript:;" class="btn-primary">新增</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="omc-table-content">
        <empty-page v-if="isEmpty"></empty-page>
        <template v-else>
          <table id="role-config-table" class="table-secondary">
            <thead>
              <tr>
                <th width="10%">接口名称</th>
                <th width="15%">鉴权模式</th>
                <th width="20%">鉴权资源规则</th>
                <th width="40%">接口描述</th>
                <th data-actions="true" width="15%">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in tableData" :key="index">
                <td>{{ item.action }}</td>
                <td>{{ item.mode === 1 ? '仅校验登陆' : '校验登陆和鉴权' }}</td>
                <td>{{ item.resource }}</td>
                <td>{{ item.description }}</td>
                <td data-actions="true" class="interface-action">
                  <ul class="omc-inline-actions">
                    <li @click="editInterface(item)">
                      <a href="javascript:;" class="btn-second">编辑</a>
                    </li>
                    <li @click="delInterface(item)">
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
            <pagination
              :total="total"
              :current="page"
              :show-size-changer="true"
              @change="pageChange"
              @showSizeChange="pageSizeChange"
            ></pagination>
          </div>
        </template>
      </div>
    </div>
    <a-modal
      v-model="addModal"
      :title="modalTitle"
      :mask-closable="false"
      :width="800"
      @ok="onModalOk"
      @cancel="addModal = false;"
    >
      <a-form layout="vertical" :form="form">
        <a-form-item label="接口名">
          <a-input
            v-decorator="[
              'action',
              { initialValue: '', rules: [{ required: true, message: '必填项' }] }
            ]"
            placeholder="请输入接口名称"
            :disabled="isEdit"
          ></a-input>
        </a-form-item>
        <a-form-item label="鉴权模式">
          <a-select
            v-decorator="[
              'mode',
              {
                rules: [{ required: true, message: '必选项' }]
              }
            ]"
            placeholder="请选择鉴权模式"
            :default-active-first-option="false"
            :options="modeOpt"
          ></a-select>
        </a-form-item>
        <a-form-item>
          <span slot="label">
            鉴权资源规则&nbsp;
            <a-tooltip>
              <span slot="title">(该规则可从req入参对象中，拼凑资源表达式：普通变量{.VAR}，数组嵌套{.KEY.$.KEY})</span>
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-input
            v-decorator="[
              'resource',
              { initialValue: '', rules: [{ validator: validateResource }] }
            ]"
            placeholder="请输入鉴权资源规则"
          ></a-input>
        </a-form-item>
        <a-form-item label="接口描述">
          <a-textarea
            v-decorator="[
              'description',
              { initialValue: '', rules: [{ required: true, message: '必填项' }] }
            ]"
            placeholder="请输入接口描述"
            :rows="3"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import EmptyPage from '@/components/EmptyPage/index'
import Pagination from '@/components/Pagination/index'
import {
  getPerms,
  addPerms,
  updatePerms,
  delPerms
} from '@/api/system/permission'

export default {
  name: 'InterfaceSetting',
  components: {
    EmptyPage,
    Pagination
  },
  data() {
    return {
      isEmpty: true,
      page: 1,
      pageSize: 15,
      total: 0,
      tableData: [],
      addModal: false,
      isEdit: false,
      modeOpt: [
        { label: '仅校验登陆', value: 1 },
        { label: '校验登陆和鉴权', value: 2 }
      ],
      modalTitle: '新增',
      interfaceAction: undefined
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'interface_config_form' })
  },
  created() {
    this.getSettingList()
  },
  methods: {
    getSettingList() {
      getPerms(
        this.page,
        this.pageSize,
        this.interfaceAction
      ).then(res => {
        const { list, count } = res.content
        if (count <= 0) {
          this.isEmpty = true
        } else {
          this.isEmpty = false
        }
        this.total = count
        this.tableData = list
      })
    },
    pageChange({ page, pageSize }) {
      this.page = page
      this.getSettingList()
    },
    pageSizeChange(pageSize) {
      this.page = 1
      this.pageSize = pageSize
      this.getSettingList()
    },
    onSearch() {
      this.page = 1
      this.getSettingList()
    },
    onResetting() {
      this.interfaceAction = undefined
      this.page = 1
      this.getSettingList()
    },
    openAddModal() {
      this.addModal = true
      this.modalTitle = '新增权限接口配置'
      this.isEdit = false
      this.$nextTick(() => {
        this.form.resetFields()
      })
    },
    editInterface(item) {
      this.modalTitle = `编辑权限接口配置【${item.action}】`
      this.isEdit = true
      this.addModal = true
      this.$nextTick(() => {
        this.form.setFieldsValue({
          'action': item.action,
          'mode': item.mode,
          'resource': item.resource,
          'description': item.description
        })
      })
    },
    delInterface(item) {
      const deleteModal = this.$confirm({
        title: `删除权限接口配置`,
        content: `确定要删除接口【${item.action}】吗？`,
        onOk: () => {
          deleteModal.update({ okButtonProps: { props: { loading: true }}})
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              delPerms([item.action]).then(res => {
                deleteModal.update({ okButtonProps: { props: { loading: false }}})
                this.getSettingList()
                this.$message.success('删除成功')
                resolve()
              })
            }, 100)
          })
        }
      })
    },
    validateResource(rule, value, callback) {
      if (value === '') {
        callback()
      }
      if (
        /((\S)+(\:)){3}(\S)+/g.test(value) &&
        value.match(/\:/g).length === 3
      ) {
        callback()
      } else {
        callback('必须输入4段式格式，例如：*:*:*:*')
      }
    },
    onModalOk() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (err) return

        const handleFun = this.isEdit ? updatePerms : addPerms
        const successMsg = this.isEdit ? '编辑权限接口配置成功！' : '新增权限接口配置成功！'

        handleFun([
          values
        ]).then(res => {
          this.getSettingList()
          this.addModal = false
          this.$message.success(`${successMsg}`)
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.table-secondary {
  .interface-action {
    white-space: nowrap;
  }
  tbody tr {
    background-color: #fff;
    td {
      background-color: unset;
    }
    &:hover {
      background-color: #f4f0ff;
    }
  }
}
</style>
