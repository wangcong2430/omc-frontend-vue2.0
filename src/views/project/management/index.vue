<template>
  <div>
    <div class="omc-table">
      <div class="omc-table-toolbar">
        <div class="col-left">
          <h2 class="table-title">项目列表</h2>
        </div>
        <div class="col-right">
          <ul class="table-actions">
            <li>
              <a href="javascript:;" class="btn-second">
                过滤
                <i class="omc-icon-filter ml-5">
                  <em></em>
                  <em></em>
                  <em></em>
                </i>
              </a>
            </li>
            <li>
              <a href="javascript:;" class="btn-second">导出数据</a>
            </li>
            <li v-permission="['menu/project_management']" @click="onAddProject">
              <a href="javascript:;" class="btn-primary js-open-modal">新增项目</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="omc-table-filter">
      </div>
      <div class="omc-table-content">
        <table class="table-default">
          <thead>
            <tr>
              <th>项目名称</th>
              <th>关联COA产品代码</th>
              <th>关联KPI产品名称</th>
              <th>所属部门</th>
              <th>成本中心</th>
              <th>项目负责人</th>
              <th>项目组成员</th>
              <th>预算年度项目所处阶段</th>
              <th>项目背景及收益</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tableData" :key="index">
              <td>{{ item.name }}</td>
              <td>{{ item.product_code }}</td>
              <td>{{ item.product_name }}</td>
              <td>{{ item.dept_name }}</td>
              <td>{{ item.costcenter_name }}</td>
              <td>{{ item.principal }}</td>
              <td>{{ item.members.join(';') }}</td>
              <td>
                <span class="text-primary">{{ item.stage_name }}</span>
              </td>
              <td>{{ item.description }}</td>
              <td>
                <ul class="omc-inline-actions">
                  <li>
                    <a href="javascript:;" class="btn-icon">
                      <i class="mdi-set mdi-text-subject"></i>
                      <span>项目详细</span>
                    </a>
                  </li>
                  <li v-permission="['button/project_management_modify']">
                    <a href="javascript:;" class="btn-icon">
                      <i class="mdi-set mdi-pencil"></i>
                      <span>编辑</span>
                    </a>
                  </li>
                  <li v-permission="['button/project_management_delete']" @click="delProject(item.id, item.name)">
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
          <pagination :total="total" :current="page"></pagination>
        </div>
      </div>
    </div>
    <a-modal
      v-model="showAddProjectModal"
      title="新增项目"
      width="700px"
      :mask-closable="false"
      :footer="null"
      @cancel="showAddProjectModal = false;"
    >
      <add-project-form
        ref="addProjectForm"
        @close="showAddProjectModal = false;"
        @submit="onProjectFormSubmit"
      ></add-project-form>
    </a-modal>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination/index'
import AddProjectForm from '@/views/components/add-project-form'
import { getProjects, delProjects } from '@/api/project/index'

export default {
  name: 'ProjectManagement',
  components: {
    Pagination,
    AddProjectForm
  },
  data() {
    return {
      page: 1,
      total: 0,
      tableData: [],
      showAddProjectModal: false
    }
  },
  created() {
    this.getProjectList()
    this.$store.dispatch('budget/getDepart')
  },
  methods: {
    getProjectList() {
      return new Promise((resolve, reject) => {
        getProjects().then(res => {
          const { items } = res.content
          this.tableData = items
          resolve(items)
        }).catch(err => {
          reject(err)
        })
      })
    },
    onAddProject() {
      this.showAddProjectModal = true
      // Must reset form after the dom rendered!!!
      this.$nextTick(() => {
        this.$refs.addProjectForm.resetForm()
      })
    },
    onProjectFormSubmit() {
      this.getProjectList()
    },
    delProject(id, name) {
      this.$confirm({
        title: '删除项目',
        content: `确定要删除项目：${name}吗？`,
        onOk: () => {
          delProjects([].concat(id)).then(res => {
            this.$message.success('删除项目成功')
            this.getProjectList()
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
