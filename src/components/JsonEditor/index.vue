<template>
  <div>
    <vue-json-editor
      v-model="currentVal"
      :options="options"
      :plus="false"
      :height="height"
    ></vue-json-editor>
  </div>
</template>
<script>
/**
 * JSON编辑器，支持在表单中使用，并支持自定义数据校验规则
 * @event change JSON数据发生变化是触发，参数类型为jsonString
 * @param option 参考https://github.com/josdejong/jsoneditor/blob/master/docs/api.md#configuration-options?blank
 */
import VueJsonEditor from 'v-jsoneditor'

export default {
  name: 'JsonEditor',
  components: {
    VueJsonEditor
  },
  props: {
    value: {
      type: String || Object,
      default: () => {
        return ''
      }
    },
    height: {
      type: String,
      default: '400px'
    },
    option: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      currentVal: this.value,
      options: Object.assign({
        mode: 'code',
        mainMenuBar: false,
        onChangeText: (json) => {
          this.$emit('change', json)
        }
      }, this.option)
    }
  },
  watch: {
    value(newVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(this.currentVal)) {
        try {
          this.currentVal = JSON.parse(newVal)
        } catch (error) {
          this.currentVal = ''
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
