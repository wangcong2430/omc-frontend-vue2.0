<template>
  <div class="member-picker">
    <a-select
      ref="selectRef"
      mode="multiple"
      :value="values"
      :placeholder="placeholder"
      :not-found-content="searching ? undefined : null"
      :filter-option="false"
      :disabled="disabled"
      :default-active-first-option="false"
      style="width: 100%"
      @search="searchUser"
      @change="handleChange"
      @focus="onFocus"
      @inputKeydown="onHandleInputKeyDown"
    >
      <a-spin v-if="searching" slot="notFoundContent" size="small" />
      <a-select-option v-for="item in lists" :key="item.value" :value="item.value" :class="isTips === true ? 'show':'hide'">
        <span v-html="item.label"></span>
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
/**
 * 人名搜索控件
 * @param {String} value 已选人名项
 * @param {String} placeholder 选择框默认文字
 * @param {Number} maxMemberCount 最大匹配的名字数目
 * @param {Boolean} onlyInputOne 是否只能选择一个
 * @param {Boolean} isCache 是否缓存上一次的搜索结果
 * @param {Boolean} emptyEnterSelect 人名不存在，并且按下enter键时是否自动填入
 * @emits member-picker(param:String) 选择人名后触发
 * @todo  保留可扩展功能：获取历史搜索人名数据
 */
import { get, set } from '@/utils/local-storage'
import { mapState } from 'vuex'
import { message } from 'ant-design-vue'

export default {
  name: 'MemberPicker',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxMemberCount: {
      type: Number,
      default: 5
    },
    onlyInputOne: {
      type: Boolean,
      default: false
    },
    isCache: {
      type: Boolean,
      default: true
    },
    emptyEnterSelect: {
      type: Boolean,
      default: true
    },
    isTips: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      allMemberList: [], // 所有的人员名单
      memberPickerValue: [], // 已经输入的值
      values: [],
      lists: [],
      searching: false,
      searchText: ''
    }
  },
  computed: {
    ...mapState({
      'sourceData': state => state.user.memberData
    })
  },
  watch: {
    value(val, oldVal) {
      if (val !== oldVal) {
        this.setValues()
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.allMemberList = this.sourceData.allMemberList ? this.sourceData.allMemberList : []
      this.setValues()
      this.maxMemberCount = this.maxMemberCount > 8 ? 8 : this.maxMemberCount
    },
    setValues() {
      const inputMemberArr = this.parseString(this.value)
      const matchMemberArr = this.getFullNames(inputMemberArr)
      this.values = matchMemberArr
      this.memberPickerValue = matchMemberArr
    },
    searchUser(value) {
      this.searchText = value
      if (this.onlyInputOne && this.values.length >= 1) return
      this.searching = true
      // 没有人名数据的时候重新设置
      if (!this.allMemberList.length) {
        this.init()
      }
      const inputMemberArr = this.parseString(value)
      const matchMemberArr = this.getFullNames(inputMemberArr)
      if (matchMemberArr.length > 1) {
        const allMatchedMember = Array.from(new Set([...this.values, ...matchMemberArr]))
        this.handleChange(allMatchedMember)
        this.searching = false
        this.$refs['selectRef'].blur()
        return
      }
      this.showFilterUser(value)
    },
    handleChange(values) {
      this.memberPickerValue = values
      this.setHistory(values)
      Object.assign(this, {
        values,
        lists: []
      })
      const data = values.map(value => value.replace(/\([^\)]*\)/g, ''))
      this.$emit('member-picker', data.join(';'))
    },
    showFilterUser(value) {
      // 过滤中文输入法产生的分词符号
      value = value.replace(/['\+|\s+]/g, '')

      if (!value || !this.allMemberList || !this.allMemberList.length) {
        return
      }

      const ret = []
      const newValue = value.replace(/\(/g, '\\(').replace(/\)/g, '\\)')

      const highlightRegExp = new RegExp('^(' + newValue + ')', 'i')
      if (this.allMemberList.indexOf(value.toLowerCase()) > -1 && this.memberPickerValue.indexOf(value) < 0) {
        ret.push(value)
      }
      for (let i = 0, len = this.allMemberList.length; i < len; i++) {
        if (this.allMemberList[i].toLowerCase().indexOf(value.toLowerCase()) === 0) {
          // 已经输入值不再出现
          if (this.memberPickerValue.indexOf(this.allMemberList[i]) < 0 && ret.indexOf(this.allMemberList[i]) < 0) {
            ret.push(this.allMemberList[i])
          }

          if (ret.length >= this.maxMemberCount) {
            break
          }
        }
      }

      this.lists = ret.map(tipsItem => {
        return {
          value: tipsItem,
          label:
            '<a href="javascript:;">' +
            tipsItem.replace(highlightRegExp, '<em style="color: #e95b5f;font-style: normal;font-weight: 700;">$1</em>') +
            '</a>'
        }
      })

      if (this.lists.length > 0) {
        this.searching = false
      }
    },
    /**
     * 验证输入
     * @param  {Array} nameArr 验证源
     * @return {Array}         过滤后的结果
     */
    getFullNames(nameArr) {
      const ret = []
      // 去重
      nameArr = Array.from(new Set(nameArr))

      nameArr.forEach(name => {
        let fullName = this.allMemberList.find(member => member.replace(/\(.*?\)/g, '') === name)
        if (!fullName && this.emptyEnterSelect) {
          fullName = name
        }

        if (fullName) {
          ret.push(fullName)
        }
      })

      return ret
    },
    /**
     * 解析用户输入，处理各种输入法的问题
     * @param  {String} string 用户输入
     * @return {Array<String>} 提取合适的输入
     */
    parseString(string) {
      string = string
        .replace(/[,，;；、 ]/g, ';')
        .replace(/\<.*?\>/g, '')
        .replace(/\(.*?\)/g, '')
        .replace(/@[\w\.-]*/g, '')
      const ret = string.split(';').filter(name => {
        return name
      })

      return ret
    },
    setHistory(memberArr) {
      // 将查询历史记录存入本地存储，以便后续获取
      let targetMemberArr = memberArr.slice()
      if (targetMemberArr.length < 4) {
        // 如果小于4条，则与旧记录合并
        targetMemberArr = targetMemberArr.concat(this.getHistory())
      }

      targetMemberArr = targetMemberArr
        .filter((memberItem, index) => {
          return index === targetMemberArr.lastIndexOf(memberItem)
        })
        .slice(0, this.maxMemberCount)
      set('MEMBER_HISTORY', targetMemberArr)
    },
    getHistory() {
      return get('MEMBER_HISTORY') || []
    },
    onFocus() {
      this.searching = false
      if (!this.isCache) {
        this.lists = []
      }
    },
    focus() {
      this.$refs['selectRef'].focus()
    },
    onHandleInputKeyDown(e) {
      // Enter键keyCode=13
      if (e.keyCode !== 13) {
        return
      }
      // 人名不存在，并且按下enter键时自动填入
      if (
        this.searchText &&
        this.emptyEnterSelect &&
        (!this.lists.length || this.lists.findIndex(list => list.value === this.searchText) === -1)
      ) {
        const isExit = this.values.includes(this.searchText)
        if (isExit) {
          message.info(`人名${this.searchText}已存在!`)
          return
        }

        const newValues = [...this.values, this.searchText]
        this.handleChange(newValues)
        this.$refs['selectRef'].blur()
      }
    }
  }
}
</script>
<style lang="less">
.hide{display: none;padding: 4px;}
.iomc-select-dropdown-menu{
  padding: 0px;
}
</style>
