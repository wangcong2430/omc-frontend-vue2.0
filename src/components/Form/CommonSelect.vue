<template>
  <div>
    <div v-if="label" class="item-label">
      {{ label }}
      <span v-if="required" class="text-danger ml-5">*</span>
    </div>
    <div class="item-control">
      <a-select
        style="width: 100%;"
        :mode="mode"
        :placeholder="placeholder"
        :value="value === '' ? undefined : value"
        :disabled="disabled"
        :allow-clear="allowClear"
        :show-search="showSearch"
        :filter-option="canFilter"
        :default-active-first-option="false"
        :dropdown-class-name="dropdownClassName"
        :label-in-value="labelInValue"
        option-filter-prop="children"
        :not-found-content="(searching && !notContent) ? undefined : (!searching && notContent) ? undefined : null"
        @change="triggerChange"
        @search="triggerSearch"
        @focus="triggerFocus"
        @blur="onBlur"
        @popupScroll="triggerPopupScroll"
      >
        <a-spin v-if="searching && !notContent" slot="notFoundContent" size="small" />
        <a-empty
          v-else-if="!searching && notContent"
          slot="notFoundContent"
          :image="simpleImage"
        />
        <a-select-option
          v-for="item in filterOpts"
          :key="item.value"
        >{{ item.label }}</a-select-option>
      </a-select>
    </div>
  </div>
</template>
<script>
/**
 * antd-vue官方提示只有在绑定的值为undefined的时候placeholder才生效
 * @emits change Triggered when select changes
 * @emits search Triggered when input and search
 * @emits focus Triggered when focus
 */
import { Empty } from 'ant-design-vue'

export default {
  name: 'CommonSelect',
  props: {
    mode: {
      type: String,
      default: 'default'
    },
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Array, Number],
      default: undefined
    },
    options: {
      type: Array,
      default() {
        return []
      }
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    showSearch: {
      type: Boolean,
      default: false
    },
    canFilter: {
      type: Boolean,
      default: true
    },
    dropdownClassName: {
      type: String,
      default: ''
    },
    labelInValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filterOpts: [],
      searchOpts: [],
      scrollId: 1,
      searching: false,
      notContent: false
    }
  },
  watch: {
    options(val) {
      this.handleOptions()
    }
  },
  beforeCreate() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
  },
  methods: {
    handleOptions() {
      // focus时重置，优化首次加载速度
      this.searchOpts = this.options
      this.filterOpts = []
      this.scrollId = 1
      // options大于100个时需要滚动加载，优化组件性能
      if (this.options.length > 100) {
        this.filterOpts = this.options.slice(0, 100)
      } else {
        this.filterOpts = this.options
      }
    },
    triggerChange(value) {
      this.searching = false
      this.$emit('change', value === undefined ? '' : value)
    },
    triggerSearch(value) {
      this.searching = true
      this.notContent = false
      this.scrollId = 1
      let opts = []
      if (value === '') { // 输入为空时不处理数据源
        opts = this.options
      } else {
        opts = this.options.filter(opt => {
          if (opt.label.toLowerCase().includes(value.toLowerCase())) {
            return true
          }
          return false
        })
      }

      this.searchOpts = opts
      if (opts.length > 100) {
        this.filterOpts = opts.slice(0, 100)
      } else {
        this.filterOpts = opts
      }

      this.searching = false
      if (!opts.length) {
        this.notContent = true
      }
      this.$emit('search', value)
    },
    triggerFocus() {
      this.handleOptions()
      this.$emit('focus', this.value)
    },
    onBlur() {
      this.filterOpts = []
      this.scrollId = 1
    },
    triggerPopupScroll(e) {
      const scrollTop = e.target.scrollTop
      const clientHeight = e.target.clientHeight
      const scrollHeight = e.target.scrollHeight
      // 是否滚动到底部
      const isScrollBottom = (scrollTop + clientHeight) >= scrollHeight

      if (this.filterOpts.length < this.searchOpts.length && isScrollBottom) {
        const opts = this.searchOpts.slice(100 * this.scrollId, 100 * this.scrollId + 100)
        this.filterOpts = [...this.filterOpts, ...opts]
        this.scrollId += 1
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
