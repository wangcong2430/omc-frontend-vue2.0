<template>
  <div class="omc-tabs">
    <ul class="omc-tabs-nav">
      <li v-for="(tab, index) in tabs" :key="index" @click.stop="onChange(tab, index)">
        <span :class="{active: tab.value === currentTab}">{{ tab.title }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
/**
 * 切换标签
 * @param {Array} tabs 标签数据-{ title: 名称, value: 值 }
 * @param {String, Number} defaultActiveTab 默认选中的tab
 * @event Event change 切换标签触发，回调参数为{ tab: 当前选中的tab数据, index: 当前选中的tab的index }
 */
export default {
  name: 'OmcTabs',
  props: {
    tabs: {
      type: Array,
      default() {
        return []
      }
    },
    defaultActiveTab: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      currentTab: this.defaultActiveTab
    }
  },
  methods: {
    onChange(tab, index) {
      this.currentTab = tab.value
      this.$emit('change', { tab, index })
    }
  }
}
</script>
<style lang="less" scoped>
.omc-tabs {
  position: relative;
  .omc-tabs-nav {
    margin: 0 0 -20px 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: nowrap;
    & > li > span {
      cursor: pointer;
      display: block;
      font-size: 14px;
      line-height: 20px;
      padding: 0 10px 12px 10px;
      margin-right: 16px;
      border-bottom: 2px solid transparent;
      color: #414660;
      &:hover, &.active {
        font-weight: bold;
        color: #6b5aed;
      }
      &.active {
        border-bottom-color: #6b5aed;
      }
    }
  }
}
</style>
