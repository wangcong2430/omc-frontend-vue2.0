<template>
  <div class="col-right">
    <div class="omc-table">
      <div class="omc-table-toolbar">
        <div class="col-left">
          <h2 class="table-title">系统角色配置</h2>
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
        <empty-page v-if="isEmpty"></empty-page>
        <template v-else>
          <table id="role-config-table" class="table-secondary">
            <thead>
              <tr>
                <th width="20%">角色代码</th>
                <th width="20%">角色名称</th>
                <th width="30%">角色描述</th>
                <th data-actions="true" width="30%">操作</th>
              </tr>
            </thead>
            <tbody v-for="(item, index) in tableData" :key="index">
              <tr v-if="!item.users.length">
                <td>{{ item.code }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.description }}</td>
                <td data-actions="true" class="role-action">
                  <ul class="omc-inline-actions">
                    <li @click="showUserAndRes(item)">
                      <a href="javascript:;" class="btn-second">人员与资源</a>
                    </li>
                    <li @click="editPerms(item)">
                      <a href="javascript:;" class="btn-second">编辑角色</a>
                    </li>
                    <li @click="addUsers(item)">
                      <a href="javascript:;" class="btn-second">添加人员</a>
                    </li>
                    <li @click="delRole(item)">
                      <a href="javascript:;" class="btn-icon">
                        <i class="mdi-set mdi-trash-can-outline"></i>
                        <span>删除角色</span>
                      </a>
                    </li>
                  </ul>
                </td>
              </tr>
              <template v-else>
                <tr v-for="(user, i) in item.users" :key="i">
                  <td v-if="i === 0" :rowspan="item.users.length + user.resources.length">{{ item.code }}</td>
                  <td v-if="i === 0" :rowspan="item.users.length + user.resources.length">{{ item.name }}</td>
                  <td v-if="i === 0" :rowspan="item.users.length + user.resources.length">{{ item.description }}</td>
                  <td v-if="i === 0" :rowspan="item.users.length + user.resources.length" data-actions="true">
                    <ul class="omc-inline-actions">
                      <li @click="showUserAndRes(item)">
                        <a href="javascript:;" class="btn-second">人员与资源</a>
                      </li>
                      <li @click="editPerms(item)">
                        <a href="javascript:;" class="btn-second">编辑角色</a>
                      </li>
                      <li @click="addUsers(item)">
                        <a href="javascript:;" class="btn-second">添加人员</a>
                      </li>
                      <li @click="delRole(item)">
                        <a href="javascript:;" class="btn-icon">
                          <i class="mdi-set mdi-trash-can-outline"></i>
                          <span>删除角色</span>
                        </a>
                      </li>
                    </ul>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </template>
      </div>
    </div>
    <a-modal
      v-model="addModal"
      :title="modalTitle"
      :mask-closable="false"
      :width="800"
      :z-index="1001"
      @ok="onModalOk"
      @cancel="addModal = false;"
    >
      <a-form layout="vertical" :form="form">
        <a-form-item label="角色代码">
          <a-input
            v-decorator="[
              'code',
              { initialValue: '', rules: [{ required: true, message: '必填项' }] }
            ]"
            placeholder="请输入角色代码"
            :disabled="isEdit !== 0 ? true : false"
          ></a-input>
        </a-form-item>
        <a-form-item v-if="isEdit !== 2 && isEdit !== 3" label="角色名称">
          <a-input
            v-decorator="[
              'name',
              { initialValue: '', rules: [{ required: true, message: '必填项' }] }
            ]"
            placeholder="请输入角色名称"
          ></a-input>
        </a-form-item>
        <a-form-item v-if="isEdit !== 2 && isEdit !== 3" label="角色说明">
          <a-textarea
            v-decorator="[
              'description',
              { initialValue: '', rules: [{ required: true, message: '必填项' }] }
            ]"
            placeholder="请输入角色说明"
            :rows="3"
          ></a-textarea>
        </a-form-item>
        <a-form-item v-if="isEdit !== 2 && isEdit !== 3" label="角色策略">
          <json-editor
            v-decorator="[
              'strategry',
              {
                initialValue: '',
                rules: [
                  { required: true, message: '必填项' },
                  { validator: validatePerms }
                ]
              }
            ]"
          ></json-editor>
        </a-form-item>
        <a-form-item v-if="isEdit === 2 || isEdit === 3" label="人员">
          <common-member-picker
            v-decorator="[
              'user_names',
              {
                initialValue: '',
                rules: [{ required: true, message: '必选项' }]
              }
            ]"
            placeholder="请输入英文名选择"
            :disabled="isEdit === 3"
          ></common-member-picker>
        </a-form-item>
        <template v-if="isEdit === 2 || isEdit === 3">
          <a-form-item
            v-for="(k, index) in form.getFieldValue('keys')"
            :key="k"
          >
            <span v-if="index === 0" slot="label">
              自定义资源&nbsp;
              <a-tooltip>
                <span slot="title">点击查看使用说明</span>
                <a-icon type="question-circle-o" @click="showResourceTip" />
              </a-tooltip>
            </span>
            <a-input
              v-decorator="[
                `resources[${k}]`,
                {
                  rules: [
                    { required: true, message: '必填项' },
                    { validator: validateResource }
                  ]
                }
              ]"
              placeholder="请输入资源4段式"
              style="width: 90%; margin-right: 13px"
            ></a-input>
            <a-tooltip>
              <span slot="title">删除</span>
              <a-icon
                v-if="form.getFieldValue('keys').length > 1"
                class="dynamic-delete-button"
                type="minus-circle-o"
                :disabled="form.getFieldValue('keys').length === 1"
                @click="() => removeResource(k)"
              />
            </a-tooltip>
            <a-tooltip>
              <span slot="title">点击填入全部资源</span>
              <a-icon
                class="dynamic-edit-button"
                type="arrow-left"
                @click="setAllResource(k)"
              />
            </a-tooltip>
          </a-form-item>
          <a-form-item>
            <a-button type="dashed" style="width: 95%" @click="addResource">
              <a-icon type="plus" /> 新增资源
            </a-button>
          </a-form-item>
        </template>
      </a-form>
    </a-modal>
    <a-modal
      v-model="userAndResModalStatus"
      :title="`角色【${selectedUserAndRes.name}】人员与资源列表`"
      :width="1000"
      @cancel="onClose"
    >
      <a-table
        v-if="userAndResModalStatus"
        :columns="userAndResColumns"
        :data-source="userAndResData"
        class="table-secondary"
      >
        <div
          slot="filterDropdown"
          slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
          style="padding: 8px"
        >
          <common-member-picker
            v-ant-ref="c => (searchInput = c)"
            :placeholder="`查询${column.title}`"
            :value="selectedKeys[0]"
            :only-input-one="true"
            style="width: 188px; margin-bottom: 8px; display: block;"
            @change="value => setSelectedKeys(value ? [value] : [])"
          />
          <a-button
            type="primary"
            icon="search"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
          >
            查询
          </a-button>
          <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
            重置
          </a-button>
        </div>
        <a-icon
          slot="filterIcon"
          slot-scope="filtered"
          type="search"
          :style="{ color: filtered ? '#6b5aed' : undefined }"
        />
        <span
          slot="user_name"
          slot-scope="text, record"
        >
          {{ text }}
          <ul class="omc-inline-actions delete-user">
            <li @click="editUserResource(record)">
              <a href="javascript:;" class="btn-second">编辑资源</a>
            </li>
            <li @click="delRoleUser(record)">
              <a href="javascript:;" class="btn-icon">
                <i class="mdi-set mdi-trash-can-outline"></i>
                <span>删除角色用户</span>
              </a>
            </li>
          </ul>
        </span>
        <span
          slot="resources"
          slot-scope="text, record"
        >
          <span v-for="(res, i) in text" :key="i">
            {{ res }}
            <ul class="omc-inline-actions delete-resource">
              <li @click="delRoleUser(record, res)">
                <a href="javascript:;" class="btn-icon">
                  <i class="mdi-set mdi-trash-can-outline"></i>
                  <span>删除用户资源</span>
                </a>
              </li>
            </ul>
          </span>
        </span>
      </a-table>
      <template>
        <a-button slot="footer" @click="onClose">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import EmptyPage from '@/components/EmptyPage/index'
import CommonMemberPicker from '@/components/Form/CommonMemberPicker'
import JsonEditor from '@/components/JsonEditor/index'
import {
  getRoles,
  addRoles,
  updateRoles,
  addRoleUsers,
  UpdateRoleResourcesForUsers,
  delRoles,
  delRoleUsers
} from '@/api/system/permission'
import { set } from 'lodash/object'
import { isEmpty } from 'lodash/lang'
import { export_json_to_excel } from '@/utils/export-excel'
import { tHeader, parseConfigsData } from './export-data'

let id = 0
export default {
  name: 'RoleSetting',
  components: {
    EmptyPage,
    CommonMemberPicker,
    JsonEditor
  },
  data() {
    return {
      isEmpty: true,
      tableData: [],
      addModal: false,
      isEdit: 0, // 0-新增角色、1-编辑角色、2-编辑人员、3-编辑资源
      modalTitle: '新增',
      exporting: false,
      userAndResModalStatus: false,
      selectedUserAndRes: {},
      userAndResData: [],
      userAndResColumns: [
        {
          title: '人员',
          dataIndex: 'user_name',
          scopedSlots: {
            customRender: 'user_name',
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) =>
            record.user_name
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          },
          width: '30%'
        },
        { title: '自定义资源', dataIndex: 'resources', scopedSlots: { customRender: 'resources' }, width: '70%' }
      ],
      searchText: '',
      searchInput: null,
      searchedColumn: ''
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'role_config_form' })
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
  },
  created() {
    this.getSettingList()
  },
  methods: {
    getSettingList() {
      getRoles().then(res => {
        const { roles } = res.content
        if (roles.length <= 0) {
          this.isEmpty = true
        } else {
          this.isEmpty = false
        }
        this.tableData = roles
      })
    },
    openAddModal() {
      this.addModal = true
      this.modalTitle = '新增角色'
      this.isEdit = 0
      this.$nextTick(() => {
        this.form.resetFields()
        // Reset the json editor value
        this.form.setFieldsValue({
          'strategry': '{}'
        })
      })
    },
    showUserAndRes(item) {
      this.searchText = ''
      this.searchInput = null
      this.searchedColumn = ''
      this.selectedUserAndRes = item
      this.userAndResData = item.users.map((item, i) => ({
        ...item,
        key: i
      }))
      this.userAndResModalStatus = true
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm()
      this.searchText = selectedKeys[0]
      this.searchedColumn = dataIndex
    },

    handleReset(clearFilters) {
      clearFilters()
      this.searchText = ''
    },
    onClose() {
      this.userAndResModalStatus = false
      this.selectedUserAndRes = {}
    },
    editPerms(item) {
      this.modalTitle = `编辑角色【${item.name}】`
      this.isEdit = 1
      this.addModal = true
      this.$nextTick(() => {
        this.form.setFieldsValue({
          'code': item.code,
          'name': item.name,
          'description': item.description,
          'strategry': item.strategry
        })
      })
    },
    addUsers(item) {
      this.modalTitle = `添加用户到角色【${item.name}】`
      this.isEdit = 2
      id = 1
      this.addModal = true
      this.$nextTick(() => {
        this.form.resetFields()
        this.form.setFieldsValue({
          'keys': [0], // 默认有一个
          'code': item.code
        })
      })
    },
    editUserResource(user) {
      if (isEmpty(this.selectedUserAndRes)) {
        return
      }
      this.modalTitle = `编辑用户【${user.user_name}】的资源`
      this.isEdit = 3
      this.addModal = true
      this.$nextTick(() => {
        const keys = user.resources.map((res, i) => i)
        this.form.resetFields()
        this.form.setFieldsValue({
          'keys': user.resources.length > 0 ? keys : [0],
          'code': this.selectedUserAndRes.code,
          'user_names': user.user_name
        })
      })
      // 设置keys字段后再设置resources才会生效
      setTimeout(() => {
        this.form.setFieldsValue({
          'resources': user.resources
        })
      }, 1)
      id = user.resources.length + 1
    },
    delRole(item) {
      const deleteModal = this.$confirm({
        title: `删除角色`,
        content: `确定要删除角色【${item.name}】吗？`,
        onOk: () => {
          deleteModal.update({ okButtonProps: { props: { loading: true }}})
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              delRoles([item.code]).then(res => {
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
    delRoleUser(user, resource) {
      if (isEmpty(this.selectedUserAndRes)) {
        return
      }
      const deleteModal = this.$confirm({
        title: resource ? `删除角色用户的资源` : `删除角色用户`,
        content: resource
          ? `确定要删除角色【${this.selectedUserAndRes.name}】的用户【${user.user_name}】名下的资源【${resource}】吗？`
          : `确定要删除角色【${this.selectedUserAndRes.name}】的用户【${user.user_name}】吗？`,
        onOk: () => {
          deleteModal.update({ okButtonProps: { props: { loading: true }}})
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              delRoleUsers([{
                role_code: this.selectedUserAndRes.code,
                user_name: user.user_name,
                resource: resource || undefined
              }]).then(res => {
                deleteModal.update({ okButtonProps: { props: { loading: false }}})
                this.getSettingList()
                this.$message.success('删除成功')
                this.userAndResModalStatus = false
                resolve()
              })
            }, 100)
          })
        }
      })
    },
    validatePerms(rule, value, callback) {
      try {
        const parseVal = JSON.parse(value)
        if (typeof parseVal === 'object') {
          callback()
        } else {
          callback('必须严格按照json格式输入！')
        }
      } catch (error) {
        callback('必须严格按照json格式输入！')
      }
    },
    validateResource(rule, value, callback) {
      if (
        /((\S)+(\:)){3}(\S)+/g.test(value) &&
        value.match(/\:/g).length === 3
      ) {
        callback()
      } else {
        callback('必须输入4段式格式，例如：*:*:*:*')
      }
    },
    removeResource(k) {
      const { form } = this
      const keys = form.getFieldValue('keys')
      if (keys.length === 1) {
        return
      }

      form.setFieldsValue({
        keys: keys.filter(key => key !== k)
      })
    },
    addResource() {
      const { form } = this
      const keys = form.getFieldValue('keys')
      const nextKeys = keys.concat(id++)
      form.setFieldsValue({
        keys: nextKeys
      })
    },
    setAllResource(k) {
      const resources = this.form.getFieldValue('resources')
      const filterResource = set(resources, [k], '*:*:*:*')
      this.form.setFieldsValue({
        'resources': filterResource
      })
    },
    showResourceTip() {
      this.$info({
        title: '资源使用说明',
        width: 600,
        zIndex: 1002,
        content: (
          <div>
            <p>资源（resource）元素描述一个或多个操作对象，如 预算资源、产品资源</p>
            <p>格式采用四段式描述，如下所示</p>
            <p>module:product_code:department_id:type:resource</p>
            <br/>
            <p>· module：所属模块，比如budget表示预算模块</p>
            <p>· product_code：产品代码，比如047000表示 QQ仙侠传</p>
            <p>· department_id：HR系统的部门ID，比如11179表示 五彩石工作室</p>
            <p>· type：分类信息，系统内部配置</p>
            <p>· resource：资源ID，根据各类资源特性而定，比如 menu/budget 表示控制台的预算菜单</p>
            <br/>
            <p>支持*匹配全部资源，比如：</p>
            <p>budget:*:*:* 表示预算模块下的所有资源</p>
            <p>vue:*:*:menu/* 表示控制台界面模块所有菜单类型的资源</p>
          </div>
        )
      })
    },
    onModalOk() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (err) return
        let strategry = null
        if (this.isEdit !== 2 && this.isEdit !== 3) {
          try {
            strategry = JSON.stringify(JSON.parse(values['strategry']))
          } catch (error) {
            this.$message.error('解析策略字段json数据失败！')
          }
          if (!strategry) {
            return
          }
        }

        let formData = []
        let handleFun = new Promise(() => {})
        let successMsg = ''

        if (this.isEdit === 0 || this.isEdit === 1) {
          formData = [{
            code: values['code'],
            name: values['name'],
            description: values['description'],
            strategry
          }]
          handleFun = this.isEdit === 0 ? addRoles : updateRoles
          successMsg = this.isEdit === 0 ? '新增角色成功！' : '编辑角色成功！'
        } else if (this.isEdit === 2 || this.isEdit === 3) {
          const { keys, resources } = values
          const mergeResurce = keys.map(key => resources[key])
          formData = [{
            role_code: values['code'],
            user_names: values['user_names'].split(';'),
            resources: mergeResurce
          }]
          handleFun = this.isEdit === 2 ? addRoleUsers : UpdateRoleResourcesForUsers
          successMsg = this.isEdit === 2 ? '添加人员成功！' : '编辑资源成功！'
        }

        handleFun(
          formData
        ).then(res => {
          this.getSettingList()
          this.addModal = false
          this.userAndResModalStatus = false
          this.$message.success(`${successMsg}`)
        })
      })
    },
    exportData() {
      if (!this.tableData.length) {
        return this.$message.error('当前系统角色配置列表为空，请先新增配置后再导出数据！', 5)
      }
      if (this.exporting) {
        return this.$message.info('导出中...')
      }
      this.exporting = true
      try {
        parseConfigsData(this.tableData)
          .then(res => {
            this.exporting = false
            export_json_to_excel({
              header: tHeader,
              data: res,
              filename: '系统角色配置表',
              autoWidth: true,
              bookType: 'xlsx'
            })
          })
          .catch(err => {
            this.exporting = false
            this.$message.error(`导出系统角色配置表失败！${err}`)
          })
      } catch (error) {
        this.exporting = false
        this.$message.error(`导出系统角色配置表失败！${error}`)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.delete-user,.delete-resource {
  display: inline-block;
  vertical-align: middle;
  margin-left: 2px;
}
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
  margin-right: 13px;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
.dynamic-edit-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-edit-button:hover {
  color: #777;
}
.table-secondary {
  .user-name {
    display: inline-block;
    width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }
  .user-name-action {
    border-top: none;
    padding-right: 100px;
    white-space: nowrap;
  }
  .role-action {
    white-space: nowrap;
  }
  tbody tr {
    background-color: #fff;
    td {
      background-color: unset;
    }
    &:hover {
      td {
        background-color: #f4f0ff;
      }
    }
  }
}
</style>
