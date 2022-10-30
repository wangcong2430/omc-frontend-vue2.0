<template>
  <div class="omc-budget-steps">
    <ul class="steps-horizontal">
      <li
        v-for="(list, index) in stepLists"
        :key="index"
        :class="{
          'finish': !Object.keys(errorStep).includes(String(index)) && currentStep > index,
          'active': !Object.keys(errorStep).includes(String(index)) && currentStep === index,
          'error': Object.keys(errorStep).includes(String(index))
        }"
      >
        <a-tooltip v-if="Object.keys(errorStep).includes(String(index))" placement="bottomLeft">
          <template slot="title">{{ errorStep[index] }}</template>
          <div class="step">
            <div class="step-label">
              <span class="label-order">{{ index + 1 }}</span>
              <span class="label-icon"></span>
            </div>
            <div class="step-value">
              <a href="javascript:;">{{ list }}</a>
            </div>
          </div>
        </a-tooltip>
        <div v-else class="step">
          <div class="step-label">
            <span class="label-order">{{ index + 1 }}</span>
            <span class="label-icon"></span>
          </div>
          <div class="step-value">
            <a href="javascript:;">{{ list }}</a>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'OmcSteps',
  props: {
    // 流程节点名称
    stepLists: {
      type: Array,
      default() {
        return []
      }
    },
    // 当前节点的索引
    currentStep: {
      type: Number,
      default: 0
    },
    // 错误节点：{索引: 名称}
    errorStep: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
