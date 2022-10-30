<template>
  <div>
    <div class="omc-setting">
      <div class="col-left">
        <ul class="omc-setting-navs">
          <li v-permission="['menu/system_setting_role']">
            <router-link to="/system/setting/role" active-class="active">系统角色配置</router-link>
          </li>
          <li v-permission="['menu/system_setting_interface']">
            <router-link to="/system/setting/interface" active-class="active">权限接口配置</router-link>
          </li>
          <li v-permission="['menu/system_setting_workflow']">
            <router-link to="/system/setting/workflow" active-class="active">审批流程项配置</router-link>
          </li>
          <li v-permission="['menu/system_setting_perms']">
            <router-link to="/system/setting/perms" active-class="active">系统权限配置表</router-link>
          </li>
          <li v-permission="['menu/system_setting_flow']">
            <a href="/flow" target="_blank">流程管理</a>
          </li>
          <li v-permission="['menu/system_setting_setUserSession']">
            <a href="/setUserSession" target="_blank">模拟身份</a>
          </li>
          <!-- <li v-permission="['menu/system_setting_approval']">
            <router-link to="/system/setting/approval" active-class="active">预算审批配置</router-link>
          </li>
          <li v-permission="['menu/system_setting_control']">
            <router-link to="/system/setting/control" active-class="active">填报入口配置</router-link>
          </li> -->
          <!-- <li>
            <router-link to="/system/setting/demand" active-class="active">需求审批配置</router-link>
          </li> -->
          <!-- <li>
            <router-link to="/system/setting/report" active-class="active">报表权限配置</router-link>
          </li>
          <li>
            <router-link to="/system/setting/material" active-class="active">物料配置</router-link>
          </li>
          <li>
            <router-link to="/system/setting/product" active-class="active">产品代码</router-link>
          </li> -->
        </ul>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SystemConfig'
}
</script>
<style lang="less" scoped>
</style>
