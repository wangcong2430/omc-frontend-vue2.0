<template>
  <div class="user-session-wrapper">
    <div class="exchange-box">
      <div class="title">模拟测试</div>
      <div class="current-user-name">当前用户：<span>{{ englishName }}</span></div>
      <a-form v-if="!loadingUser" :form="form">
        <a-form-item label="切换至指定用户">
          <common-member-picker
            v-decorator="[
              `staff_name`,
              {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '必填项'
                  }
                ]
              }
            ]"
            :placeholder="'请输入英文选择人名'"
            :only-input-one="true"
          ></common-member-picker>
        </a-form-item>
        <a-button type="primary" @click="submit">提交</a-button>
      </a-form>
      <h2 class="button-tip">系统预设角色</h2>
      <div class="tip">
        系统管理员：jonyhuang<br />
        项目管理员：sndzhao<br />
        资源管理员：shengguyang<br />
        需求人：catccliu<br />
        财管：hashma<br />
        审核人：guiwuliu<br />
        审批人：hhu<br /><br />

        切换为系统管理员后，可访问 <a href="http://dev.iomc.oa.com/flow/#/" target="_blank">http://dev.iomc.oa.com/flow/#/</a>，查看流程规则<br />
      </div>
      <div class="action-button">
        <a-button @click="toBasePage">返回首页</a-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import CommonMemberPicker from '@/components/Form/CommonMemberPicker'
import { setUserSession } from '@/api/workflow'

export default {
  name: 'SetUserSession',
  components: {
    CommonMemberPicker
  },
  data() {
    return {
      loadingUser: true
    }
  },
  computed: {
    ...mapState({
      englishName: state => state.user.englishName,
      chineseName: state => state.user.chineseName
    })
  },
  async beforeCreate() {
    await this.$store.dispatch('user/getInfo')
    this.$store.dispatch('user/getMemberData').then(res => {
      this.loadingUser = false
    })
    this.form = this.$form.createForm(this, { name: 'user-session-form' })
  },
  methods: {
    submit() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (err) return
        setUserSession(values['staff_name']).then(res => {
          this.$message.success('设置成功！')
          setTimeout(() => {
            window.location.reload()
          }, 10)
        })
      })
    },
    toBasePage() {
      this.$router.push('/')
    }
  }
}
</script>
<style lang="less" scoped>
.user-session-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .exchange-box {
    width: 800px;
    height: 100px;
    padding: 10px 10px;
    padding-top: 50px;
    .title {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
    }
    .current-user-name {
      padding-top: 100px;
      padding-bottom: 10px;
      span {
        color: #6b5aed;
        font-size: 16px;
      }
    }
    .button-tip {
      padding-top: 30px;
    }
    .tip {
      padding-top: 20px;
    }
    .action-button {
      margin-top: 20px;
    }
  }
}
</style>
