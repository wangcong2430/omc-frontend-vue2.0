<template>
  <div>
    <div class="omc-budget-choice">
      <ul class="omc-budget-options">
        <li>
          <div class="omc-budget-option">
            <div class="option-head">
              <div class="option-icon">
                <i class="mdi-set mdi-file-table-box-outline"></i>
              </div>
            </div>
            <div class="option-body">
              <h4>内容制作费</h4>
              <div class="option-text">游戏研发及运营阶段所需的用于游戏内容的素材外包委托制作，包含但不限于美术、游戏内视频、音频、文案、翻译等；采购资源用于游戏内容，需同营销推广用途相区分采购为委托制作的性质，需同购买IP版权相区分</div>
            </div>
            <div class="option-foot">
              <router-link to="/budget/cp-predict">
                2022年预测填报
                <i class="mdi-set mdi-chevron-right ml-5"></i>
              </router-link>
              <router-link to="/budget/cp-add">
                2023年预算填报
                <i class="mdi-set mdi-chevron-right ml-5"></i>
              </router-link>
              <!-- <a-tooltip v-else placement="top">
                <template slot="title">
                  <span>内容制作费填报已截止，有问题请联系Jodiejli/Janexma</span>
                </template>
                <a href="javascript:;" class="close-apply">
                  {{ nextYear }}年预算填报
                  <i class="mdi-set mdi-chevron-right ml-5"></i>
                </a>
              </a-tooltip> -->
            </div>
          </div>
        </li>
        <li>
          <div class="omc-budget-option">
            <div class="option-head">
              <div class="option-icon">
                <i class="mdi-set mdi-layers-outline"></i>
              </div>
            </div>
            <div class="option-body">
              <h4>研发费</h4>
              <div class="option-text">产品研发过程中涉及到的相关费用，包含但不限于外包开发测试，AI物料，高校合作，开发软件摊销，资质认证（21年新增），用研费用等</div>
            </div>
            <div class="option-foot">
              <router-link to="/budget/rd-predict">
                2022年预测填报
                <i class="mdi-set mdi-chevron-right ml-5"></i>
              </router-link>
              <router-link to="/budget/rd-add">
                2023年预算填报
                <i class="mdi-set mdi-chevron-right ml-5"></i>
              </router-link>
              <!-- <a-tooltip v-else placement="top">
                <template slot="title">
                  <span>研发费填报已截止，有问题请联系Jodiejli/Janexma</span>
                </template>
                <a href="javascript:;" class="close-apply">
                  {{ nextYear }}年预算填报
                  <i class="mdi-set mdi-chevron-right ml-5"></i>
                </a>
              </a-tooltip> -->
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { checkEntryStatus } from '@/utils/permission'

export default {
  name: 'BudgetPlanningEntry',
  data() {
    return {
      currentYear: new Date().getFullYear(),
      nextYear: new Date().getFullYear() + 1
    }
  },
  methods: {
    checkEntryStatus(value) {
      return checkEntryStatus(value)
    }
  }
}
</script>
<style lang="less" scoped>
.close-apply {
  cursor: not-allowed;
  color: #414660 !important;
  opacity: 0.5;
  &:hover {
    opacity: 0.5;
    color: #414660 !important;
  }
}
.option-text {
  height: 100px !important;
}
</style>
