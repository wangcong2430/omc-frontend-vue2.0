<template>
  <div class="col-right">
    <div class="omc-table">
      <div class="omc-table-toolbar">
        <div class="col-left">
          <h2 class="table-title">审核流程项配置</h2>
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
          <table class="omc-table-tree workflow-table">
            <thead>
              <tr>
                <th width="10%">工作单名称</th>
                <th width="10%">流程代码</th>
                <th width="30%">资源规则</th>
                <th width="40%">配置</th>
                <th data-actions="true" width="10%">操作</th>
              </tr>
            </thead>
            <tbody v-for="(item, index) in tableData" :key="index">
              <tr v-if="!item.reviewer_setting.length">
                <td>{{ item.work_name }}</td>
                <td>{{ item.flow_code }}</td>
                <td>{{ item.reviewer_resource }}</td>
                <td>-</td>
                <td>
                  <ul class="omc-inline-actions">
                    <li @click="openEditModal(item)">
                      <a href="javascript:;" class="btn-second">编辑</a>
                    </li>
                  </ul>
                </td>
              </tr>
              <template v-else>
                <tr v-for="(reviewer, i) in item.reviewer_setting" :key="i">
                  <td v-if="i === 0" :rowspan="item.reviewer_setting.length">{{ item.work_name }}</td>
                  <td v-if="i === 0" :rowspan="item.reviewer_setting.length">{{ item.flow_code }}</td>
                  <td v-if="i === 0" :rowspan="item.reviewer_setting.length">{{ item.reviewer_resource }}</td>
                  <td>
                    <ul class="tree-child-list">
                      <li class="tree-child">
                        <div class="child-name">角色代码：{{ reviewer.role_code }}</div>
                      </li>
                      <li class="tree-child">
                        <div class="child-name">标题：{{ reviewer.form_title }}</div>
                      </li>
                      <li class="tree-child">
                        <div class="child-name">表单类型：{{ reviewer.form_element === 1 ? '输入框' : '勾选框' }}</div>
                      </li>
                      <li class="tree-child">
                        <div class="child-name">必填：{{ reviewer.is_required === 1 ? '是' : '否' }}</div>
                      </li>
                      <li class="tree-child">
                        <div class="child-name">排序：{{ reviewer.sort }}</div>
                      </li>
                      <li class="tree-child">
                        <div class="child-name">指定管理员：{{ reviewer.admin }}</div>
                      </li>
                    </ul>
                  </td>
                  <td v-if="i === 0" :rowspan="item.reviewer_setting.length" data-actions="true">
                    <ul class="omc-inline-actions">
                      <li @click="openEditModal(item)">
                        <a href="javascript:;" class="btn-second">编辑</a>
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
      v-model="modalStatus"
      :title="modalTitle"
      :mask-closable="false"
      :width="800"
      @ok="onModalOk"
      @cancel="modalStatus = false;"
    >
      <a-form layout="vertical" :form="form" class="workflow-form-wrapper">
        <a-form-item label="工作单类型">
          <a-select
            v-decorator="[
              'work_type',
              { rules: [{ required: true, message: '必填项' }] }
            ]"
            placeholder="请选择工作单类型"
            :options="workTypeOpt"
          ></a-select>
        </a-form-item>
        <a-form-item label="工作单名称">
          <a-input
            v-decorator="[
              'work_name',
              { initialValue: '', rules: [{ required: true, message: '必填项' }] }
            ]"
            placeholder="请输入工作单名称"
          ></a-input>
        </a-form-item>
        <a-form-item label="流程">
          <a-select
            v-decorator="[
              'flow_code',
              { rules: [{ required: true, message: '必填项' }] }
            ]"
            placeholder="请选择流程"
            :options="flowRulesOpt"
          ></a-select>
        </a-form-item>
        <a-form-item label="资源规则">
          <a-input
            v-decorator="[
              'reviewer_resource',
              {
                rules: [
                  { required: true, message: '必填项' },
                  { validator: validateResource }
                ]
              }
            ]"
            placeholder="请输入资源规则"
          ></a-input>
        </a-form-item>
        <a-form-item
          v-for="(k, index) in form.getFieldValue('keys')"
          :key="k"
          :label="index === 0 ? '审批人表单项配置' : ''"
          :required="true"
        >
          <div class="reviewer-setting-wrapper">
            <div class="setting-left">
              <a-row>
                <a-col span="12">
                  <a-form-item label="角色" v-bind="formItemLayout">
                    <a-select
                      v-decorator="[
                        `role_code[${k}]`,
                        { rules: [{ required: true, message: '必填项' }] }
                      ]"
                      placeholder="请选择角色"
                      :options="rolesOpt"
                      allow-clear
                    ></a-select>
                  </a-form-item>
                </a-col>
                <a-col span="12">
                  <a-form-item label="标题" v-bind="formItemLayout">
                    <a-input
                      v-decorator="[
                        `form_title[${k}]`,
                        { initialValue: '', rules: [{ required: true, message: '必填项' }] }
                      ]"
                      placeholder="请输入标题"
                    ></a-input>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col span="12">
                  <a-form-item label="表单类型" v-bind="formItemLayout">
                    <a-select
                      v-decorator="[
                        `form_element[${k}]`,
                        { rules: [{ required: true, message: '必填项' }] }
                      ]"
                      placeholder="请选择表单类型"
                      :options="formTypeOpt"
                    ></a-select>
                  </a-form-item>
                </a-col>
                <a-col span="12">
                  <a-form-item label="是否必填" v-bind="formItemLayout">
                    <a-radio-group
                      v-decorator="[
                        `is_required[${k}]`,
                        { rules: [{ required: true, message: '必填项' }] }
                      ]"
                    >
                      <a-radio :value="1">是</a-radio>
                      <a-radio :value="2">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col span="12">
                  <a-form-item label="排序" v-bind="formItemLayout">
                    <a-input-number
                      v-decorator="[
                        `sort[${k}]`,
                        { rules: [{ required: true, message: '必填项' }] }
                      ]"
                    >
                      <a-radio :value="1">是</a-radio>
                      <a-radio :value="2">否</a-radio>
                    </a-input-number>
                  </a-form-item>
                </a-col>
                <a-col span="12">
                  <a-form-item label="指定管理员" v-bind="formItemLayout">
                    <common-member-picker
                      v-decorator="[
                        `admin[${k}]`,
                        { initialValue: '' }
                      ]"
                      placeholder="指定管理员"
                    >
                    </common-member-picker>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <div class="setting-right">
              <a-tooltip>
                <span slot="title">删除</span>
                <a-icon
                  class="dynamic-delete-button"
                  type="minus-circle-o"
                  @click="() => removeSetting(k)"
                />
              </a-tooltip>
            </div>
          </div>
        </a-form-item>
        <a-form-item>
          <a-button type="dashed" style="width: 100%" @click="addSetting">
            <a-icon type="plus" /> 新增表单项配置
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import EmptyPage from '@/components/EmptyPage/index'
import CommonMemberPicker from '@/components/Form/CommonMemberPicker'
import {
  getWorkConfigs,
  getWorkTypeOpt,
  getFlowRules,
  addWorkConfig,
  updateWorkConfig
} from '@/api/workflow'
import { getRoles } from '@/api/system/permission'

let id = 0
export default {
  name: 'WorkflowSetting',
  components: {
    EmptyPage,
    CommonMemberPicker
  },
  data() {
    return {
      isEmpty: true,
      tableData: [],
      modalStatus: false,
      modalTitle: '',
      workTypeOpt: [],
      flowRulesOpt: [],
      rolesOpt: [],
      formTypeOpt: [
        { label: '输入框', value: 1 },
        { label: '勾选框', value: 2 }
      ],
      formItemLayout: {
        labelCol: {
          span: 6
        },
        wrapperCol: {
          span: 17
        }
      },
      isEdit: false
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'workflow_config_form' })
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
  },
  created() {
    this.getWorkConfigs()
    this.getWorkTypeOpt()
    this.getFlowRules()
    this.getRoles()
  },
  methods: {
    getWorkConfigs() {
      getWorkConfigs().then(res => {
        const { content } = res
        if (!content.length) {
          this.isEmpty = true
        } else {
          this.isEmpty = false
        }
        this.tableData = content
      })
    },
    getWorkTypeOpt() {
      getWorkTypeOpt().then(res => {
        const { content } = res
        this.workTypeOpt = content.map(item => ({
          label: item.work_name,
          value: item.work_type
        }))
      })
    },
    getFlowRules() {
      getFlowRules().then(res => {
        const { content } = res
        this.flowRulesOpt = content.map(item => ({
          label: item.flow_name,
          value: item.flow_code
        }))
      })
    },
    getRoles() {
      getRoles().then(res => {
        const { roles } = res.content
        this.rolesOpt = roles.map(role => ({
          label: role.name,
          value: role.code
        }))
      })
    },
    openAddModal() {
      this.isEdit = false
      this.modalTitle = '新增审核流程项配置'
      this.$nextTick(() => {
        this.form.resetFields()
      })
      this.modalStatus = true
    },
    openEditModal(item) {
      this.isEdit = true
      this.modalTitle = `编辑审核流程项配置【${item.work_name}】`
      const formElement = []
      const formTitle = []
      const isRequired = []
      const roleCode = []
      const sort = []
      const admin = []
      const keys = item.reviewer_setting.map((list, i) => {
        formElement.push(list.form_element)
        formTitle.push(list.form_title)
        isRequired.push(list.is_required)
        sort.push(list.sort)
        admin.push(list.admin)
        roleCode.push(list.role_code)
        return i
      })
      this.$nextTick(() => {
        this.form.resetFields()
        this.form.setFieldsValue({
          keys,
          'work_type': item.work_type,
          'work_name': item.work_name,
          'flow_code': item.flow_code,
          'reviewer_resource': item.reviewer_resource
        })
      })

      // 设置keys字段后再设置才会生效
      setTimeout(() => {
        this.form.setFieldsValue({
          'form_element': formElement,
          'form_title': formTitle,
          'is_required': isRequired,
          'sort': sort,
          'admin': admin,
          'role_code': roleCode
        })
      }, 1)
      id = item.reviewer_setting.length + 1
      this.modalStatus = true
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
    addSetting() {
      const { form } = this
      const keys = form.getFieldValue('keys')
      const nextKeys = keys.concat(id++)
      form.setFieldsValue({
        keys: nextKeys
      })
    },
    removeSetting(k) {
      const { form } = this
      const keys = form.getFieldValue('keys')

      form.setFieldsValue({
        keys: keys.filter(key => key !== k)
      })
    },
    onModalOk() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (err) return

        let handleFun = new Promise(() => {})
        let successMsg = ''
        const {
          work_type,
          work_name,
          flow_code,
          keys,
          role_code,
          form_title,
          form_element,
          is_required,
          sort,
          admin,
          reviewer_resource
        } = values
        const reviewerSettings = keys.map(key => ({
          role_code: role_code[key],
          form_title: form_title[key],
          form_element: form_element[key],
          is_required: is_required[key],
          sort: sort[key],
          admin: admin[key]
        }))

        if (this.isEdit) {
          handleFun = updateWorkConfig
          successMsg = '编辑审核流程项配置成功！'
        } else {
          handleFun = addWorkConfig
          successMsg = '新增审核流程项配置成功！'
        }
        handleFun(
          work_type,
          work_name,
          flow_code,
          reviewerSettings,
          reviewer_resource
        ).then(res => {
          this.getWorkConfigs()
          this.modalStatus = false
          this.$message.success(successMsg)
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.workflow-form-wrapper {
  .iomc-form-item {
    margin-bottom: 15px;
  }
  .reviewer-setting-wrapper {
    background-color: rgb(245, 247, 250);
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    .iomc-form-item {
      margin-bottom: 10px;
    }
    .setting-left {
      flex: 1;
    }
    .setting-right {
      width: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
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
}
.workflow-table {
  .tree-child-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    .tree-child {
      width: 50%;
    }
  }
}
</style>
