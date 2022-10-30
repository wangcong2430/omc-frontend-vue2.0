<template>
  <div>
    <div class="omc-table">
      <div class="omc-table-toolbar">
        <div class="col-left">
          <h2 class="table-title">{{ title }}</h2>
        </div>
        <div class="col-right">
          <ul class="table-actions">
            <li @click="openFilter">
              <a href="javascript:;" class="btn-second" :class="{'active': filterActived}">
                过滤
                <i class="omc-icon-filter ml-5"><em></em><em></em><em></em></i>
              </a>
            </li>
            <li v-permission="['button/g_add_demand_approval']" @click="openModal">
              <a href="javascript:;" class="btn-second">
                新增
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="workType === 2" class="category-list-wrapper">
        <ul class="coa-secondnav">
          <li
            v-for="category in categoryList"
            :key="category.value"
            @click.stop="selectCategory(category)"
          >
            <a href="javascript:;" :class="{'active': category.value == selectedCategory}">{{ category.label }}
              <span v-if="category.value == selectedCategory" class="text-success ml-5">
                <i class="mdi-set mdi-check-bold"></i>
              </span>
            </a>
          </li>
        </ul>
      </div>
      <div v-if="filterActived" class="omc-table-filter" :class="{'active': filterActived}">
        <a-form layout="inline" :form="searchForm">
          <a-form-item label="产品">
            <common-select
              v-decorator="[
                'selectedProduct'
              ]"
              style="width: 400px;"
              :allow-clear="true"
              show-search
              :placeholder="'请选择产品查询'"
              :options="productOpt"
            ></common-select>
          </a-form-item>
          <a-form-item label="部门">
            <common-select
              v-decorator="[
                'selectedDepart'
              ]"
              style="width: 300px;"
              :allow-clear="true"
              show-search
              :placeholder="'请选择部门查询'"
              :options="departOpt"
            ></common-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="search">查询</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="omc-table-content">
        <empty-page v-if="isEmpty" :show-blank-text="false"></empty-page>
        <template v-else>
          <table class="omc-table-tree demand-approval-table">
            <thead>
              <tr>
                <th width="10%">产品名称</th>
                <th width="10%">产品代码</th>
                <th width="10%">所属部门</th>
                <th width="20%">成本中心</th>
                <th width="40%">配置</th>
                <th width="10%">操作</th>
              </tr>
            </thead>
            <tbody v-for="item in tableData" :key="item.product_code">
              <tr v-if="!item.reviewers.length">
                <td>{{ item.product_name }}</td>
                <td>{{ item.product_code }}</td>
                <td>{{ item.depart_name }}</td>
                <td>{{ item.cost_center_name }}</td>
                <td>-</td>
                <td>
                  <ul class="omc-inline-actions">
                    <li>
                      <a href="javascript:;" class="btn-second">编辑</a>
                    </li>
                  </ul>
                </td>
              </tr>
              <template v-else>
                <tr>
                  <td :rowspan="item.reviewers.length">{{ item.product_name }}</td>
                  <td :rowspan="item.reviewers.length">{{ item.product_code }}</td>
                  <td :rowspan="item.reviewers.length">{{ item.depart_name }}</td>
                  <td :rowspan="item.reviewers.length">{{ item.cost_center_name }}</td>
                  <td>
                    <ul class="tree-child-list">
                      <li v-for="(reviewer, i) in item.reviewers" :key="i" class="tree-child">
                        <div class="child-name">{{ reviewer.setting.form_title }}：{{ formatReviewers(reviewer) }}</div>
                      </li>
                    </ul>
                  </td>
                  <td :rowspan="item.reviewers.length" data-actions="true">
                    <ul class="omc-inline-actions">
                      <li @click="editSetting(item)">
                        <a href="javascript:;" class="btn-second">编辑</a>
                      </li>
                    </ul>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
          <div v-if="total > 0" class="omc-table-pagination">
            <pagination
              :total="total"
              :current="page"
              :show-size-changer="true"
              :page-size="pageSize"
              :page-size-options="['5', '15', '25', '35', '45', '55']"
              @change="pageChange"
              @showSizeChange="pageSizeChange"
            ></pagination>
          </div>
        </template>
      </div>
    </div>
    <a-modal
      v-model="modalStatus"
      :title="modalTitle"
      :mask-closable="false"
      :width="1000"
      :confirm-loading="confirmLoading"
      @ok="onModalOk"
      @cancel="modalStatus = false;"
    >
      <div class="omc-coa-edit">
        <a-form layout="horizontal" :form="mainForm">
          <a-row>
            <a-col span="12">
              <a-form-item label="产品名称">
                <common-select
                  v-decorator="[
                    `product_code`,
                    { rules: [{ required: true, message: '必填项' }] }
                  ]"
                  placeholder="请选择产品"
                  :options="productOpt"
                  :disabled="isEdit"
                  show-search
                  @change="onProductChanged"
                ></common-select>
              </a-form-item>
            </a-col>
            <a-col span="12">
              <a-form-item label="产品代码">
                <a-input
                  v-decorator="[
                    `product_index`,
                    { rules: [{ required: true, message: '必填项' }]}
                  ]"
                  :disabled="true"
                  placeholder="选择产品自动关联"
                ></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col span="12">
              <a-form-item label="成本中心">
                <a-input
                  v-decorator="[
                    `cost_center_name`,
                    { rules: [{ required: true, message: '必填项' }]}
                  ]"
                  :disabled="true"
                  placeholder="选择产品自动关联"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col span="12">
              <a-form-item label="所属部门">
                <a-input
                  v-decorator="[
                    `depart_name`,
                    { rules: [{ required: true, message: '必填项' }]}
                  ]"
                  :disabled="true"
                  placeholder="选择产品自动关联"
                ></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="workType === 2">
            <a-col span="12">
              <a-form-item label="服务品类">
                <a-select
                  v-decorator="[
                    `category`,
                    { rules: [{ required: true, message: '必填项' }]}
                  ]"
                  :disabled="true"
                  :options="categoryList"
                ></a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="omc-coa-edit detail-wrapper">
        <div class="ant-btn-group" style="margin-bottom: 12px;">
          <a-button-group>
            <a-button :disabled="!details.length" @click="copySetting">
              <span><i class="mdi-set mdi-content-copy mr-5"></i>复制</span>
            </a-button>
            <a-button :disabled="!copyDetail.length" @click="pasteSetting">
              <span><i class="mdi-set mdi-content-paste mr-5"></i>黏贴</span>
            </a-button>
          </a-button-group>
        </div>
        <a-form layout="horizontal" :form="detailForm">
          <a-row v-for="(detail, index) in details" :key="index">
            <a-col span="24">
              <a-form-item :label="detail.setting.form_title">
                <common-member-picker
                  v-if="detail.setting.form_element === 1"
                  v-decorator="[
                    `${detail.setting.role_code}`,
                    {
                      initialValue: '',
                      rules: [
                        {
                          required: detail.setting.is_required === 1,
                          message: detail.setting.is_required === 1 ? '必填项' : ''
                        }
                      ]
                    }
                  ]"
                  :disabled="!!detail.disable"
                  placeholder="请输入英文选择人名"
                />
                <template v-else-if="detail.setting.form_element === 2">
                  <a-select
                    v-decorator="[
                      `${detail.setting.role_code}`,
                      {
                        rules: [
                          {
                            required: detail.setting.is_required === 1,
                            message: detail.setting.is_required === 1 ? '必选项' : ''
                          }
                        ]
                      }
                    ]"
                    placeholder="请选择"
                    :disabled="!!detail.disable"
                    :options="checkOpt"
                  ></a-select>
                </template>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
/**
 * form_element: 1-输入框、2-下拉框
 * is_required: 1-必填、2-非必填
 * checked: 1-否、2-是
 * disable: false-否、true-是
 */
import EmptyPage from '@/components/EmptyPage/index'
import Pagination from '@/components/Pagination/index'
import CommonMemberPicker from '@/components/Form/CommonMemberPicker'
import CommonSelect from '@/components/Form/CommonSelect'
import {
  getReviewerSettingAndUsers,
  getAllReviewerSettingList,
  updateReviewers
} from '@/api/workflow/index'
import { getProductList } from '@/api/product'
import { getCntCategoryList } from '@/api/demand/content'

export default {
  name: 'DemandApprovalList',
  components: {
    EmptyPage,
    Pagination,
    CommonMemberPicker,
    CommonSelect
  },
  props: {
    title: {
      type: String,
      default: '列表'
    },
    workType: {
      type: Number, // 1-研发费、2-内容制作费、3-内容制作费（自行采购）
      required: true
    },
    resourceRule: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isEmpty: true,
      total: 0,
      page: 1,
      pageSize: 5,
      tableData: [],
      productOpt: [],
      departOpt: [],
      details: [],
      checkOpt: [
        { label: '否', value: 1 },
        { label: '是', value: 2 }
      ],
      filterActived: false,
      searchProductName: undefined,
      searchDepartName: undefined,
      modalStatus: false,
      confirmLoading: false,
      modalTitle: '',
      isEdit: false,
      copyDetail: [],
      categoryList: [],
      selectedCategory: ''
    }
  },
  beforeCreate() {
    this.searchForm = this.$form.createForm(this, { name: 'demand-approval-filter-form' })
    this.mainForm = this.$form.createForm(this, { name: 'demand_approval_main_form' })
    this.detailForm = this.$form.createForm(this, { name: 'demand_approval_detail_form' })
  },
  created() {
    this.getProjectList()

    if (this.workType === 2) { // 获取内容制作费的大类
      getCntCategoryList(
        `consume:*:*:item_type/1`,
        '/iomc.WorkflowSrv/UpdateReviewers'
      ).then(res => {
        const { content } = res
        this.categoryList = content.map(item => ({
          label: item.title,
          value: String(item.id)
        }))
        if (content.length > 0) {
          this.selectedCategory = String(content[0].id)
        }
        this.getAllReviewerSetting()
      })
    } else {
      this.getAllReviewerSetting()
    }
  },
  methods: {
    getAllReviewerSetting() {
      // 需求研发费和内容制作费module字段默认是'consume'
      getAllReviewerSettingList(
        this.page,
        this.pageSize,
        this.workType,
        this.searchDepartName ? this.searchDepartName : undefined,
        this.searchProductName ? this.searchProductName : undefined,
        this.workType === 2
          ? { module: 'consume', type: {
            level1: this.selectedCategory, level2: '0', level3: '0', level4: '0' }
          } // 没有的级别传0
          : { module: 'consume' }
      ).then(res => {
        if (!res.content) return
        const { count, list } = res.content
        if (count > 0) {
          this.isEmpty = false
        } else {
          this.isEmpty = true
        }
        this.total = count
        this.tableData = list
      })
    },
    formatReviewers(item) {
      if (item.setting.form_element === 1) {
        return item.user_names.join(';')
      } else if (item.setting.form_element === 2) {
        return item.checked === 1 ? '否' : item.checked === 2 ? '是' : ''
      }
      return ''
    },
    getReviewerList(productCode) {
      getReviewerSettingAndUsers(
        this.workType,
        { product: productCode }
      ).then(res => {
        const { content } = res
        this.details = content
      })
    },
    pageChange({ page, pageSize }) {
      this.page = page
      this.getAllReviewerSetting()
    },
    pageSizeChange(pageSize) {
      this.page = 1
      this.pageSize = pageSize
      this.getAllReviewerSetting()
    },
    getProjectList() {
      getProductList(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        this.resourceRule
      ).then(res => {
        const { data } = res
        const products = []
        const departs = []
        const departIds = []
        data.forEach(item => {
          products.push({
            label: `${item.product_name}【${item.product_code}】`,
            value: item.product_code,
            cost_center_name: item.cost_center_name,
            depart_name: item.depart_name
          })

          if (!departIds.includes(item.depart_id)) {
            departs.push({
              label: item.depart_name,
              value: item.depart_id
            })
            departIds.push(item.depart_id)
          }
        })
        this.productOpt = products
        this.departOpt = departs
      })
    },
    openFilter() {
      this.filterActived = !this.filterActived
      if (!this.filterActived) {
        this.searchProductName = undefined
        this.searchDepartName = undefined
        this.getAllReviewerSetting()
      }
    },
    search() {
      const productValue = this.searchForm.getFieldValue('selectedProduct')
      const departValue = this.searchForm.getFieldValue('selectedDepart')
      this.searchProductName = productValue
      this.searchDepartName = departValue
      this.getAllReviewerSetting()
    },
    openModal() {
      this.modalTitle = '新增'
      this.modalStatus = true
      this.isEdit = false
      this.details = []
      this.mainForm.resetFields()
      this.detailForm.resetFields()
      this.$nextTick(() => {
        // 内容制作费设置服务品类
        if (this.workType === 2) {
          this.mainForm.setFieldsValue({
            'category': this.selectedCategory
          })
        }
      })
    },
    editSetting(item) {
      this.details = []
      this.detailForm.resetFields()
      this.modalTitle = '编辑'
      this.modalStatus = true
      this.isEdit = true
      this.details = item.reviewers
      this.$nextTick(() => {
        this.mainForm.setFieldsValue({
          'product_code': item.product_code,
          'product_index': item.product_code,
          'cost_center_name': item.cost_center_name,
          'depart_name': item.depart_name
        })
        // 内容制作费设置服务品类
        if (this.workType === 2) {
          this.mainForm.setFieldsValue({
            'category': this.selectedCategory
          })
        }

        item.reviewers.forEach(reviewer => {
          if (reviewer.setting.form_element === 1 && reviewer.user_names.length > 0) {
            this.detailForm.setFieldsValue({
              [reviewer.setting.role_code]: reviewer.user_names.join(';')
            })
          } else if (reviewer.setting.form_element === 2 && reviewer.checked !== 0) {
            this.detailForm.setFieldsValue({
              [reviewer.setting.role_code]: reviewer.checked
            })
          }
        })
      })
    },
    onProductChanged(value) {
      this.details = []
      if (!value) {
        return
      }
      const option = this.productOpt.find(item => item.value === value)
      if (option) {
        this.mainForm.setFieldsValue({
          'product_index': value,
          'cost_center_name': option.cost_center_name,
          'depart_name': option.depart_name
        })
      }
      this.getReviewerList(value)
    },
    onModalOk() {
      this.mainForm.validateFieldsAndScroll((err, mainValues) => {
        if (err) return
        this.detailForm.validateFieldsAndScroll((error, detailValues) => {
          if (error) return
          this.confirmLoading = true
          const details = this.details.map(detail => {
            if (detail.setting.form_element === 1) {
              return {
                role_code: detail.setting.role_code,
                form_element: detail.setting.form_element,
                user_names: detailValues[detail.setting.role_code].split(';')
              }
            } else if (detail.setting.form_element === 2) {
              return {
                role_code: detail.setting.role_code,
                form_element: detail.setting.form_element,
                checked: detailValues[detail.setting.role_code]
              }
            }
          })
          updateReviewers(
            this.workType,
            details,
            this.workType === 2
              ? {
                module: 'consume',
                product: mainValues['product_code'],
                type: { level1: mainValues['category'], level2: '0', level3: '0', level4: '0' }
              }
              : {
                module: 'consume',
                product: mainValues['product_code']
              }
          ).then(res => {
            this.confirmLoading = false
            this.getAllReviewerSetting()
            this.modalStatus = false
            this.$message.success('保存成功！')
          }).catch(() => {
            this.confirmLoading = false
          })
        })
      })
    },
    copySetting() {
      if (!this.details.length) return
      const detailValue = this.detailForm.getFieldsValue()
      const currentDetails = []

      this.details.forEach(item => {
        if (item.setting.form_element === 1 && detailValue[item.setting.role_code]) {
          currentDetails.push({
            ...item,
            user_names: detailValue[item.setting.role_code].split(';')
          })
        } else if (item.setting.form_element === 2 && detailValue[item.setting.role_code]) {
          currentDetails.push({
            ...item,
            checked: detailValue[item.setting.role_code]
          })
        }
      })

      this.copyDetail = currentDetails
      this.$message.success('复制成功！')
    },
    pasteSetting() {
      const selectedProductCode = this.mainForm.getFieldValue('product_code')
      if (!selectedProductCode) {
        return this.$message.info('请先选择产品再粘贴！')
      }
      const detailKeys = Object.keys(this.detailForm.getFieldsValue())

      if (detailKeys.length > 0 && this.copyDetail.length > 0) {
        detailKeys.forEach(key => {
          const filterDetail = this.copyDetail.find(item => item.setting.role_code === key)
          if (filterDetail) {
            if (filterDetail.setting.form_element === 1 && filterDetail.user_names.length > 0) {
              this.detailForm.setFieldsValue({
                [key]: filterDetail.user_names.join(';')
              })
            } else if (filterDetail.setting.form_element === 2 && filterDetail.checked !== 0) {
              this.detailForm.setFieldsValue({
                [key]: filterDetail.checked
              })
            }
          }
        })
      }
      this.$message.success('粘贴成功！')
    },
    selectCategory(category) {
      if (this.selectedCategory === category.value) {
        return
      }

      this.selectedCategory = category.value
      this.getAllReviewerSetting()
    }
  }
}
</script>
<style lang="less" scoped>
.demand-approval-table {
  tbody > tr:hover {
    background-color: #f4f0ff;
  }
  .tree-child-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    .tree-child {
      width: 50%;
      word-break: break-all;
    }
  }
}
.detail-wrapper {
  border-top: 1px solid #e8e8e8;
}
.category-list-wrapper {
  padding: 15px 0;
  .coa-secondnav {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -5px;
    padding: 0;
    list-style: none;
    & > li {
      padding: 0 5px;
      a {
        display: block;
        font-size: 14px;
        line-height: 20px;
        padding: 7px 12px;
        background-color: #fff;
        color: #6a6f85;
        margin-bottom: 10px;
        border-radius: 3px;
        &:hover {
          color: #6b5aed;
        }
        &.active {
          background-color: #6b5aed;
          color: #fff;
          .text-success{color: #fff !important;}
        }
      }
    }
  }
}
</style>
