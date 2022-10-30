<template>
  <div>
    <div class="omc-budget-cost">
      <ul class="omc-budget-choose">
        <!-- 部门的树形选择器 -->
        <li class="row">
          <span class="title">部门：</span><a-tree-select
            v-model="selectedDepartment"
            style="width:70%"
            :tree-data="departmentData"
            tree-checkable
            allow-clear
            :show-checked-strategy="SHOW_PARENT"
            search-placeholder="输入关键字筛选"
            placeholder="输入关键字筛选"
          />
        </li>
        <!-- 项目的选择器 -->
        <li class="row"><span class="title">项目名称：</span>
          <common-select
            :value="selectedProjectIds"
            mode="multiple"
            show-search
            style="width: 70%"
            placeholder="输入关键字筛选"
            :options="projectData"
            allow-clear
            @change="onSelectedProjects"
          >
          </common-select>
        </li>
        <!-- 单号的选择器 -->
        <li class="row">
          <span class="title">立项名称/单号：</span>
          <common-select
            :value="selectedNames"
            mode="multiple"
            show-search
            style="width: 70%"
            placeholder="输入关键字筛选"
            :options="nameData"
            allow-clear
            @change="onSelectedNames"
          >
          </common-select>
        </li>
        <!-- 供应商的选择器 -->
        <li class="row">
          <span class="title">供应商名称：</span>
          <common-select
            :value="selectedSuppliers"
            mode="multiple"
            show-search
            style="width:70%"
            placeholder="输入关键字筛选"
            :options="supplierData"
            allow-clear
            @change="onselectedSuppliers"
          >
          </common-select>
        </li>
        <!-- 服务品类的选择器 -->
        <li class="row">
          <span class="title">服务品类：</span>
          <common-select
            :value="selectedCategoryIds"
            mode="multiple"
            show-search
            style="width: 70%"
            placeholder="输入关键字筛选"
            :options="categoryData"
            allow-clear
            @change="onSelectedCategory"
          >
          </common-select>
        </li>
        <!-- 费用类型的选择器 -->
        <li class="row">
          <span class="title">
            <span style="color: #f5222d">* </span>
            <span>费用类型：</span>
          </span>
          <common-select
            :value="selectedFeeType"
            show-search
            placeholder="请选择"
            style="width: 70%"
            :options="feeTypes"
            @change="onSelectedFeeType"
          >
          </common-select>
        </li>
        <!-- 筛选类型的选择器 -->
        <li class="row">
          <span class="title">
            <span style="color: #f5222d">* </span>
            <span>筛选类型：</span>
          </span>
          <common-select
            :value="selectedThingType"
            show-search
            placeholder="请选择"
            style="width:70%"
            :options="thingTypeData"
            @change="onSelectedThingType"
          >
          </common-select>
        </li>
        <!-- 导出时段的选择器 -->
        <li class="row">
          <span class="title">
            <span style="color: #f5222d">* </span>
            <span>导出时段：</span>
          </span>
          <a-range-picker v-model="rangeDate" format="YYYY-MM-DD" style="width: 70%">
          </a-range-picker>
        </li>
        <!-- 导出字段的选择器 -->
        <li class="colums">
          <span class="title">
            <span style="color: #f5222d">* </span>
            <span>导出字段：</span>
          </span>
          <div v-for="(i,k5) in exportColumn" :key="i.key" class="checkBox">

            <div :style="{ borderBottom: '1px solid #E9E9E9' , }">
              <a-checkbox :indeterminate="i.indeterminate" :checked="i.checkAll" :style="{color:'red'}" @change="onCheckAllChange(i,k5,$event)">
                {{ i.label }}
              </a-checkbox>
            </div>
            <br />
            <a-checkbox-group v-model="i.checkedList" :options="i.plainOptions" @change="onChange(i,k5,$event)" />
          </div>
        </li>
        <!-- 导出按钮 -->
        <li class="btn">
          <a-button :loading="submiting" :disabled="submiting" type="primary" size="large" @click="submit()">
            导出
          </a-button>
        </li>
      </ul>

    </div>
  </div>
</template>

<script>
import { TreeSelect } from 'ant-design-vue'
import CommonSelect from '@/components/Form/CommonSelect'
const SHOW_PARENT = TreeSelect.SHOW_PARENT
import { exportCostReport, getCostList } from '@/api/budget/content'
import { mapState } from 'vuex'

export default {
  name: 'BudgetCostProcess',
  components: {
    CommonSelect
  },
  data() {
    return {
      selectedDepartment: undefined,
      departmentData: [],
      projectData: [],
      selectedProjectIds: undefined,
      nameData: [],
      selectedNames: undefined,
      supplierData: [],
      selectedSuppliers: undefined,
      categoryData: [],
      selectedCategoryIds: undefined,
      feeTypes: [
        {
          label: '内容制作费',
          value: '1'
        }
      ],
      selectedFeeType: undefined,
      thingTypeData: [],
      selectedThingType: undefined,
      rangeDate: [],
      exportColumn: [],
      submiting: false,
      SHOW_PARENT,
      iomc: {
        columns: []
      }

    }
  },
  computed: {
    ...mapState({
      englishName: state => state.user.englishName
    })
  },
  created() {
    this.getCostConfigList()
  },
  mounted() {
    this.$watch('data.iomc.columns', (value) => {
      this.exportColumn = value
    })
  },
  methods: {
    onSelectedProjects(value) {
      this.selectedProjectIds = value
    },
    onSelectedNames(value) {
      this.selectedNames = value
    },
    onselectedSuppliers(value) {
      this.selectedSuppliers = value
    },
    onSelectedCategory(value) {
      this.selectedCategoryIds = value
    },
    onSelectedFeeType(value) {
      this.selectedFeeType = value
    },
    onSelectedThingType(value) {
      this.selectedThingType = value
    },
    getExportColumnFieldValue() {
      const values = []
      this.exportColumn.forEach(item => {
        if (item.checkedList) {
          values.push(...item.checkedList)
        }
      })
      return values
    },
    submit() {
      if (!this.selectedFeeType) {
        return this.$message.error('请选择费用类型')
      }
      if (!this.selectedThingType) {
        return this.$message.error('请选择筛选类型')
      }
      if (!this.rangeDate || !this.rangeDate.length) {
        return this.$message.error('请选择导出时段')
      }
      const exportFieldValues = this.getExportColumnFieldValue()
      if (!exportFieldValues.length) {
        return this.$message.error('请选择导出字段')
      }

      this.submiting = true
      const params = {
        category_type: this.selectedFeeType,
        department: [],
        thing_type: this.selectedThingType,
        range_date: this.rangeDate.map(date => date.format('YYYY-MM-DD')),
        download: true,
        project_id: Array.isArray(this.selectedProjectIds) ? this.selectedProjectIds.map(v => String(v)) : [],
        name: Array.isArray(this.selectedNames) ? this.selectedNames.map(v => String(v)) : [],
        pr_name: Array.isArray(this.selectedSuppliers) ? this.selectedSuppliers.map(v => String(v)) : [],
        first_category_id: Array.isArray(this.selectedCategoryIds) ? this.selectedCategoryIds.map(id => ({
          value: String(id)
        })) : [],
        depart: [],
        columns: exportFieldValues,
        staffname: this.englishName
      }

      // 处理选中的部门
      if (this.selectedDepartment) {
        const groups = this.departmentData.filter(dep => this.selectedDepartment.includes(dep.value))
        params.department = groups.map(group => group.key)
        const groupIds = groups.map(group => group.value)
        let departs = this.selectedDepartment.filter(item => !groupIds.includes(item))
        groups.forEach(group => {
          departs = departs.concat(group.children.map(child => `${child.value}`))
        })
        params.depart = departs
      }

      exportCostReport(params).finally(() => {
        this.submiting = false
      })
    },
    onCheckAllChange(item, index, e) {
      const { checked } = e.target
      if (checked) {
        item.indeterminate = false
        item.checkAll = true
        item.checkedList = []
        item.children.forEach(children => {
          item.checkedList.push(children.key)
        })
      } else {
        item.checkAll = false
        item.checkedList = []
      }
      this.$set(this.exportColumn, index, item)
    },
    onChange(item, index, checkedValues) {
      if (item.children.length === checkedValues.length) {
        item.checkAll = true
        item.indeterminate = false
      } else {
        item.indeterminate = true
        item.checkAll = false
      }

      if (!checkedValues.length) {
        item.indeterminate = false
        item.checkAll = false
      }
      this.$set(this.exportColumn, index, item)
      console.log('xxxx checked = ', this.exportColumn)
    },
    async getCostConfigList() {
      const { content } = await getCostList()
      console.log('contentxxx', content)
      if (content) {
        this.departmentData = content.department
        this.projectData = content.project_list
        this.nameData = content.pr_name
        this.supplierData = content.supplier
        this.categoryData = content.category
        this.thingTypeData = Object.keys(content.thing_type).map(key => ({
          label: content.thing_type[key],
          value: `${key}`
        }))

        this._data.exportColumn = content.columns.map(v => {
          v.indeterminate = false
          v.checkAll = false
          v.checkedList = []
          v.plainOptions = v.children.map(i => ({ label: i.label, value: i.key }))
          return v
        })
      }
    }
  }
}

</script>

<style lang="less" scoped>
*{
  list-style: none;
}
.row{
  display: flex;
  margin: 20px 0;
  .title{
    text-align: right;
    width: 120px;
  }
}
.colums{
  display: flex;
  flex-direction: column;

  .title{
    text-align: right;
    width: 120px;
  }
}
.checkBox{
  margin-left: 120px;
  width: 70%;
  margin-bottom: 40px;
  border-bottom:1px solid #E9E9E9;
}
.btn{
  // width: 70%;
  width: 78%;

  text-align: right;
  transform: translateX(-8px);
}
</style>
