<template>
  <div class="control-wrapper">
    <a-row v-for="(item, index) in entrySetting" :key="index" :gutter="12" class="control-item">
      <a-col :span="12">
        <div class="item-title">{{ item.biz_type === 'rd' ? '研发费' : '内容制作费' }}</div>
        <div class="item-date">
          <a-range-picker
            :show-time="{ format: 'HH:mm:ss' }"
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="['开始时间', '结束时间']"
            :default-value="handleDefaultDateValue(item)"
            style="width: 100%;"
            @ok="onOk($event, item)"
          />
        </div>
      </a-col>
      <a-col :span="12" class="delete-action">
        <a-button @click="deleteSetting(item)">删除</a-button>
      </a-col>
    </a-row>
    <a-row :gutter="12" class="add-action">
      <a-col :span="24">
        <a-button @click="addSetting">新增</a-button>
      </a-col>
    </a-row>
    <a-modal
      :visible="visible"
      title="新增类型"
      ok-text="提交"
      @cancel="visible = false;"
      @ok="onSubmit"
    >
      <a-form layout="vertical" :form="form">
        <a-form-item label="类型">
          <a-select
            v-decorator="[
              'biz_type',
              {
                rules: [{ required: true, message: '必选项' }],
              }
            ]"
            placeholder="请选择类型"
            :options="typeOpts"
          />
        </a-form-item>
        <a-form-item label="时间">
          <a-range-picker
            v-decorator="['time_range', rangeConfig]"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="['开始时间', '结束时间']"
            style="width: 100%;"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import { saveEntrySetting } from '@/api/system/entry-setting'
import { mapGetters } from 'vuex'

export default {
  name: 'ControlSetting',
  data() {
    return {
      visible: false,
      typeOpts: [
        {
          label: '内容制作费',
          value: 'cp'
        },
        {
          label: '研发费',
          value: 'rd'
        }
      ],
      rangeConfig: {
        rules: [{ type: 'array', required: true, message: '请选择时间' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'entrySetting'
    ])
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'control-setting-form' })
  },
  methods: {
    onOk(value, item) {
      if (Array.isArray(value) && value.length > 1) {
        const startDate = value[0].format('YYYY-MM-DD HH:mm:ss')
        const endDate = value[1].format('YYYY-MM-DD HH:mm:ss')
        saveEntrySetting(
          item.id,
          item.biz_type,
          startDate,
          endDate,
          1
        ).then(res => {
          this.$message.success('保存配置成功！')
          this.$store.dispatch('omc/getEntrySetting')
        })
      }
    },
    handleDefaultDateValue(item) {
      if (item.start_time && item.end_time) {
        const startTime = moment(item.start_time)
        const endTime = moment(item.end_time)
        return [startTime, endTime]
      }
      return []
    },
    addSetting() {
      this.form.resetFields()
      this.visible = true
    },
    onSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return
        }

        const timeRange = fieldsValue['time_range']
        const values = {
          'biz_type': fieldsValue['biz_type'],
          'start_time': timeRange[0].format('YYYY-MM-DD HH:mm:ss'),
          'end_time': timeRange[1].format('YYYY-MM-DD HH:mm:ss')
        }
        const isExit = this.entrySetting.some(t => t.biz_type === values['biz_type'])
        if (isExit) {
          return this.$message.info('新创建的类型已经存在，请重新选择类型或者在已存在类型里面更改配置！')
        }
        saveEntrySetting(
          undefined,
          values['biz_type'],
          values['start_time'],
          values['end_time'],
          1
        ).then(res => {
          this.visible = false
          this.$message.success('新增成功！')
          this.$store.dispatch('omc/getEntrySetting')
        })
      })
    },
    deleteSetting(item) {
      this.$confirm({
        title: '删除配置类型',
        content: `确定要删除该类型的配置吗？`,
        onOk: () => {
          saveEntrySetting(
            item.id,
            item.biz_type,
            item.start_time,
            item.end_time,
            2
          ).then(res => {
            this.$message.success('删除成功')
            this.$store.dispatch('omc/getEntrySetting')
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.control-wrapper {
  width: 100%;
  .control-item:not(:first-child) {
    margin-top: 10px;
  }
  .control-item {
    .delete-action {
      margin-top: 31px;
    }
  }
  .add-action {
    margin-top: 20px;
  }
  .item-title {
    margin-bottom: 10px;
  }
}
</style>
