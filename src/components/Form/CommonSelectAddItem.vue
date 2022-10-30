<template>
  <div>
    <div v-if="label" class="item-label">
      {{ label }}
      <span v-if="required" class="text-danger ml-5">*</span>
    </div>
    <div class="item-control">
      <a-select
        :placeholder="placeholder"
        :value="value === '' ? undefined : value"
        :options="options"
        :disabled="disabled"
        :allow-clear="allowClear"
        :show-search="showSearch"
        :default-active-first-option="false"
        option-filter-prop="children"
        @focus="triggerFocus"
        @change="triggerChange"
      >
        <div slot="dropdownRender" slot-scope="menu">
          <v-nodes :vnodes="menu" />
          <a-divider style="margin: 4px 0;"></a-divider>
          <div
            class="item-add"
            @mousedown="e => e.preventDefault()"
            @click="addItem"
          >
            <a-icon type="plus" /> {{ addText }}
          </div>
        </div>
      </a-select>
    </div>
  </div>
</template>
<script>
/**
 * antd-vue官方提示只有在绑定的值为undefined的时候placeholder才生效
 * @emits add Triggered when add item
 * @emits change Triggered when select changes
 */
export default {
  name: 'CommonSelectAddItem',
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  props: {
    mode: {
      type: String,
      default: 'default'
    },
    label: {
      type: String,
      default: ''
    },
    addText: {
      type: String,
      default: '新增'
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
      default: true
    }
  },
  methods: {
    triggerChange(value) {
      this.$emit('change', value === undefined ? '' : value)
    },
    triggerFocus() {
      this.$emit('focus')
    },
    addItem() {
      this.$emit('add')
    }
  }
}
</script>
<style lang="less" scoped>
.item-add {
  height: 35px;
  line-height: 25px;
  padding: 4px 8px;
  cursor: pointer;
  color: #6b5aed;
}
</style>
