<template>
  <div class="expend-from-item">
    <div class="item-label">
      <span v-if="option.is_required === 1" class="text-danger mr-5">*</span>{{ option.multiple === '1' ? `${option.title}(可多选)` : option.title }}
    </div>
    <div class="item-control">
      <a-form-item :self-update="true">
        <a-select
          v-decorator="[
            `attribute-${option.id}`,
            {
              rules: [{ required: option.is_required === 1, message: '必选项' }],
            },
          ]"
          :placeholder="`请选择${option.title}`"
          :options="optionHandler(option)"
          :index="index"
          :select-handler="selectHandler"
          :disabled="disabled"
          :mode="option.multiple === '1' ? 'multiple' : 'default'"
          dropdown-class-name="common-select-dropdown"
          @change="(value) => handlerChange(value, index)"
        ></a-select>
      </a-form-item>
    </div>
    <ul v-if="option.multiple === '1'" class="omc-inline-actions">
      <li @click="applyToSameType">
        <a href="javascript:;" class="btn-icon">
          <i class="mdi-set mdi-import"></i>
          <span>应用到该需求下同一类别的所有物件</span>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'DemandSelectField',
  props: {
    form: {
      type: Object,
      required: true
    },
    option: {
      type: Object,
      required: true
    },
    formId: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: undefined
    },
    selectHandler: {
      type: Function,
      default: undefined
    }
  },
  data() {
    return {
      selectKey: '',
      opt2: '',
      flag: 0
    }
  },
  methods: {
    applyToSameType() {
      this.$confirm({
        title: '提示',
        content: '确定要应用到该需求下同一类别的所有物件吗？',
        onOk: () => {
          this.$emit('apply-to-same-type', `attribute-${this.option.id}`)
        }
      })
    },
    optionHandler(option) {
      if (option.id === '162') {
        return option.options
      } else if (option.id === '163') {
        const arr = option.options.filter((item, i) => i < 3)
        const arrFilter = option.options.filter((item, i) => i > 2)
        return window.flag === 1 ? arr : arrFilter
      } else {
        return option.options
      }
    },
    handlerChange(value, index) {
      window.flag = 0
      if (index === 0) {
        this.selectKey = value
        if (this.selectKey === '买量视频') {
          window.flag = 1
          this.$emit('selectHandler')
        } else {
          this.$emit('selectHandler')
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.iomc-form-item {
  margin-bottom: 0;
}
.omc-inline-actions {
  margin-left: 1px;
}
</style>
