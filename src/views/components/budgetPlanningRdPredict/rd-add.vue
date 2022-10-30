<template>
  <div class="page-container">
    <div class="page-container-A">
      <div class="page-container-A-a">
        <a-form layout="inline">
          <div class="w-paragraph-a">
            <a-form-item label="部门" style="margin-bottom: 42px">
              <a-select
                placeholder="请选择部门"
                show-search
                style="width: 500px"
                option-filter-prop="children"
                @change="departHandleChange"
                @focus="handleFocus"
                @blur="handleBlur"
              >
                <a-select-option v-for="item in productOpts" :key="item"> {{ item }} </a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="w-paragraph-b">
            <a-form-item label="COA产品" style="margin-left: -30px">
              <a-select
                mode="multiple"
                :allow-clear="true"
                style="width: 500px"
                placeholder="请选择COA产品"
                :loading="dataLoading"
                @change="productHandler"
                @search="handleSearch"
                @popupScroll="handlePopupScroll"
                @select="handleSelect"
              >
                <a-select-option v-for="item in renderedOptions" :key="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </a-form>
        <button
          data-v-b0a0a724=""
          theme="filled"
          type="button"
          class="ant-btn ant-btn-default btn1"
          data-uc-report-self="1"
          style="width: 112px; font-size: 14px; margin-left: 50px; margin-right: 50px; margin-top: 50px"
          @click="downloadfilerdadd"
        >
          <span>下载模板</span>
        </button>
        <a-upload
          name="file"
          :multiple="true"
          :show-upload-list="false"
          action="/srv.download/import_list?project=iomc_budgetsrv&schema=budget_submit_rd"
          :headers="headers"
          @change="handleChangeRdadd"
        >
          <a-button style="background-color: #456fea; color: #fff"> <a-icon type="upload" /> 模板导入 </a-button>
        </a-upload>
      </div>
    </div>
  </div>
</template>

<script>
import { getDepart } from '@/api/budget'
import { downLoadTemplatefile } from '@/api/budget/adjustment'
import debounce from 'lodash/debounce'
import { getProductList } from '@/api/product/index'
const LOAD_NUM = 50 // 加载条数

export default {
  name: 'Rdadd',
  components: {},
  data() {
    return {
      productOpts: [],
      departmentOption: '',
      CoaproductOption: '',
      headers: {
        authorization: 'authorization-text'
      },
      judgedepart: '',
      judgeproduct: '',
      dataLoading: false,
      oriDataList: [], // 原数据列表
      renderedOptions: [], // 已渲染的下拉列表
      searchVal: '' // 搜索的内容
    }
  },
  mounted() {
    this.getDepartlist()
    this.getProductListopts()
  },

  methods: {
    // 获取部门列表
    async getDepartlist() {
      getDepart().then((res) => {
        const { data } = res
        this.productOpts = data.map((item) => {
          return item.depart_name + '-' + item.depart_code
        })
      })
    },
    // 获取COA产品列表
    getProductListopts() {
      this.dataLoading = true
      getProductList(1, 10000).then((res) => {
        this.dataLoading = false
        const { data } = res
        const data1 = data.map((item) => item.product_name + `(${item.product_code})`)
        this.oriDataList = data1
        // console.log('data1',data1);
        this.renderedOptions = this.oriDataList.slice(0, LOAD_NUM)
        // console.log('data',data);
        // const data1 = data.filter((x, i) => i < 10001).map(item => item.product_name + `(${item.product_code})`)
      })
    },
    // 文本框值变化时触发 -- 从数据源中过滤出含搜索内容的数据，并取过滤结果的前n条作为下拉列表的可选项
    handleSearch(val) {
      this.searchVal = val
      let filterList = []
      if (val) {
        filterList = this.oriDataList.filter((item) => item.indexOf(val) > -1)
      } else {
        filterList = this.oriDataList
      }
      this.filterDataList = filterList
      this.renderedOptions = filterList.length < LOAD_NUM ? filterList : filterList.slice(0, LOAD_NUM)
    },
    // 滚动时触发（防止抖动）
    handlePopupScroll: debounce(function() {
      if (this.searchVal === '') {
        this.loadMoreData(this.oriDataList)
      } else {
        this.loadMoreData(this.filterDataList)
      }
    }, 300),
    // 加载更多数据到select框
    loadMoreData(dataList) {
      const renderedLen = this.renderedOptions.length // 已渲染的下拉列表长度
      const totalLen = dataList.length // 当前数据源的长度
      let addList = []
      if (renderedLen < totalLen) {
        if (renderedLen + LOAD_NUM <= totalLen) {
          addList = dataList.slice(renderedLen, renderedLen + LOAD_NUM)
        } else {
          addList = dataList.slice(renderedLen, renderedLen + (totalLen % LOAD_NUM))
        }
        this.renderedOptions = this.renderedOptions.concat(addList)
      }
    },

    // 被选中时调用，参数为选中项的 value (或 key) 值
    handleSelect(val) {
      if (this.searchVal) {
        const selectedArr = this.oriDataList.filter((item) => item === val) // 从数据源中过滤出下拉框选中的值，并返回一个数组
        const restList = this.oriDataList.filter((item) => item !== val) // 从数据源中过滤出其他的值，返回一个数组
        const newList = selectedArr.concat(restList).slice(0, LOAD_NUM) // 将选中的元素放到下拉列表的第一位
        this.renderedOptions = newList // 更新已渲染的下拉列表
        this.oriDataList = selectedArr.concat(restList) // 更新数据源
        this.searchVal = '' // 因为触发handleSelect函数时，会自动清空用户输入的内容。因此，searchVal需要重置。
      }
    },

    // 下载模板
    downloadfilerdadd() {
      //   console.log('下载触发rd-add')
      if (this.judgedepart) {
        downLoadTemplatefile({
          custom: [
            { id: '数据类别', option: '2023年预算' },
            { id: '部门', default: this.departmentOption },
            { id: '关联COA产品', option: this.CoaproductOption },
            { id: '该阶段起始年月', default: '2023/01' },
            { id: '该阶段终止年月', default: '2023/12' }
          ],
          //   正式环境加上srv
          project: 'iomc_budgetsrv',
          schema: 'budget_submit_rd'
        }).then((res) => {
          // console.log('这是下载触发的res',res);
          if (res.ret == 0) {
            const data = res.data
            window.open(data)
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.$message.error('请选择部门或COA产品')
      }
    },
    // 部门列表处理函数
    departHandleChange(value) {
      //   console.log(`selected ${value}`)
      const newValue = value.split('-')[0]
      this.departmentOption = newValue
      this.judgedepart = value
    },
    // 产品列表处理函数
    productHandler(value) {
      //   console.log(`selected ${value}`)
      var newValue = ''
      let str = ''
      value.forEach((item, index) => {
        newValue = item.slice(0, item.length - 8)
        if (index === 0) {
          str = newValue
        } else {
          str += '|' + newValue
        }
        this.CoaproductOption = str
        this.judgeproduct = str
      })
    },

    // 组件函数
    handleBlur() {
      // console.log('blur')
    },
    handleFocus() {
      // console.log('focus')
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 导入
    handleChangeRdadd(info) {
      if (info.file.status == 'done') {
        if (info.fileList && info.fileList.length > 0) {
          var obj = info.fileList[info.fileList.length - 1]
          if (obj.response && obj.response.response && obj.response.response.ret == 0) {
            this.$message.success('文件导入成功', 30)
          } else if (obj.response && obj.response.response && obj.response.response.ret !== 0) {
            if (obj.response.response.msg.indexOf('http') > -1) {
              window.open(obj.response.response.msg)
              this.$message.error('您上传的模板有错误，请参照回传的模板修改错误！', 30)
            } else {
              this.$message.error(obj.response.response.msg, 30)
            }
          } else {
            this.$message.error('导入错误，请检查上传文件', 30)
          }
        } else {
          this.$message.error('导入错误，请检查上传文件', 30)
        }
      }
    }
  }
}
</script>

<style lang="less">
.page-container {
  padding: 12px 18px;
  min-height: calc(100vh - 124px);
  height: 100%;
}

.page-container-A {
  padding: 10px;
  background: rgb(255, 255, 255);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .page-container-A-a {
    position: absolute;
    left: 80px;
    padding: 80px;
  }
}

.w-paragrap-a {
  width: 900px;
  height: 90px;
  position: relative;
}

.w-paragraph-b {
  width: 900px;
}

.ant-btn {
  background-color: #fff;
  background-image: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
  color: rgba(0, 0, 0, 0.65);
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
  height: 32px;
  line-height: 1.499;
  padding: 0 15px;
  position: relative;
  text-align: center;
  touch-action: manipulation;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  user-select: none;
  white-space: nowrap;
  border-radius: 2px;
}

.btn1:hover {
  border-color: #0052d9;
  color: #0052d9;
}
</style>
