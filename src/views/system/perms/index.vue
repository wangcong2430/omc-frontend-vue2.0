<template>
  <div class="col-right">
    <div class="filter-wrapper">
      <a-input
        v-model="keywords"
        placeholder="请输入类型/名称/权限值查询"
        allow-clear
        style="width: 500px;"
        @pressEnter="search"
      ></a-input>
      <a-button
        class="btn"
        type="primary"
        @click="search"
      >查询</a-button>
      <a-button class="btn" @click="reset">重置</a-button>
    </div>
    <a-table
      :columns="permConfigColumn"
      :data-source="permConfigData"
    >
      <span
        slot="value"
        slot-scope="text"
      >
        {{ text }}
        <span @click.stop="copyPerm(text, $event)">
          <i class="mdi-set mdi-content-copy" />
        </span>
      </span>
    </a-table>
  </div>
</template>
<script>
import { permsConfig } from '@/config'
import handleClipboard from '@/utils/clipboard'

export default {
  name: 'PermConfigs',
  data() {
    return {
      keywords: '',
      permConfigColumn: [
        { title: '类型', dataIndex: 'type', key: 'type' },
        { title: '名称', dataIndex: 'name', key: 'name' },
        { title: '权限值', dataIndex: 'value', scopedSlots: { customRender: 'value' }}
      ],
      permConfigData: permsConfig
    }
  },
  methods: {
    copyPerm(text, event) {
      return handleClipboard(text, event)
    },
    search() {
      this.permConfigData = permsConfig.filter(item => (
        item.type.includes(this.keywords) ||
        item.name.includes(this.keywords) ||
        item.value.includes(this.keywords)
      ))
    },
    reset() {
      this.keywords = ''
      this.permConfigData = permsConfig
    }
  }
}
</script>
<style lang="less" scoped>
.mdi-content-copy {
  cursor: pointer;
}
.filter-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  .btn {
    margin-left: 10px;
  }
}
</style>
