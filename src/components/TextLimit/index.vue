<template>
  <div>
    <div
      v-if="text.length > limitLength"
      class="omc-text-limit"
      :class="{'text-toggle': openStatus}"
    >
      <div class="text-abstarct">
        <span>{{ text | sliceString(limitLength) }}</span>
        <a
          href="javascript:;"
          class="limit-change"
          @click.stop="changeItemOpen()"
        >
          查看全文
          <i class="mdi-set mdi-menu-down"></i>
        </a>
      </div>
      <div class="text-fullcontent">
        <span>{{ text }}</span>
        <a
          href="javascript:;"
          class="limit-change"
          @click.stop="changeItemOpen()"
        >
          收起
          <i class="mdi-set mdi-menu-up"></i>
        </a>
      </div>
    </div>
    <div v-else class="omc-text-limit">
      <div class="text-abstarct"><span>{{ text }}</span></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TextLimit',
  props: {
    text: {
      type: String,
      default: ''
    },
    limitLength: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      openStatus: false
    }
  },
  methods: {
    changeItemOpen() {
      this.openStatus = !this.openStatus
    }
  }
}
</script>
<style lang="less" scoped>
.omc-text-limit {
  font-size: 12px;
  line-height: 20px;
  .text-fullcontent {
    display: none;
  }
  .limit-change {
    display: inline-block;
    vertical-align: top;
    white-space: nowrap;
    &:hover {
      text-decoration: underline;
    }
  }
  .text-abstarct {
    word-break: break-all;
    white-space: pre-wrap;
  }
  &.text-toggle {
    .text-fullcontent {
      word-break: break-all;
      white-space: pre-wrap;
      display: block;
    }
    .text-abstarct{
      display: none;
    }
  }
}
</style>
