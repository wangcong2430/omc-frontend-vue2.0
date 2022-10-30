<template>
  <div class="omc-modal" :class="{'modal-show': show}">
    <div class="omc-modal-dialog dialog-sm">
      <div class="modal-head">
        <div class="col-left">
          <div class="modal-title">
            <a-input-search
              placeholder="输入COA产品名称查询"
              style="width: 250px"
              allow-clear
              @search="onSearch"
            />
          </div>
          <a class="modal-close" href="javascript:;" @click="troggleProjectList(false)"><i></i></a>
        </div>
        <div class="col-right"></div>
      </div>
      <div class="modal-body" @scroll="onScroll">
        <ul class="omc-project-list">
          <li v-for="(project, index) in filterProjects" :key="project.product_code" @click="selectProject(project, index)">
            <a href="javascript:;" class="project-item" :class="{ active: index === activeProIndex }">
              <h4>{{ project.product_name }}</h4>
              <div class="item-arrow">
                <i class="mdi-set mdi-chevron-double-right"></i>
              </div>
              <div class="item-subinfo">
                <div class="col-left">{{ project.depart_name }}</div>
                <div class="col-right">{{ project.product_code }}</div>
              </div>
            </a>
          </li>
        </ul>
        <div class="omc-status-text">
          <a-spin v-if="loading" tip="加载中...">
            <a-icon slot="indicator" type="loading" style="font-size: 24px"></a-icon>
          </a-spin>
          <span v-else>没有更多数据了！！</span>
        </div>
      </div>
    </div>
    <div class="omc-modal-backdrop" @click="troggleProjectList(false)"></div>
  </div>
</template>
<script>
export default {
  name: 'ProjectListModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    projectLists: {
      type: Array,
      default: () => {
        return []
      }
    },
    activeProIndex: {
      type: Number,
      default: 0
    },
    selectProject: {
      type: Function,
      required: true
    },
    onSearch: {
      type: Function,
      required: true
    },
    troggleProjectList: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      filterProjects: [],
      scrollId: 1,
      loading: false
    }
  },
  watch: {
    projectLists(newVal) {
      this.handleProjectList()
    }
  },
  created() {
    this.handleProjectList()
  },
  methods: {
    handleProjectList() {
      // 项目过多的时候需要处理
      this.filterProjects = []
      this.scrollId = 1
      if (this.projectLists.length > 100) {
        this.filterProjects = this.projectLists.slice(0, 100)
      } else {
        this.filterProjects = this.projectLists
      }
    },
    onScroll(e) {
      if (this.filterProjects.length >= this.projectLists.length) {
        this.loading = false
        return
      }

      this.loading = true
      const scrollTop = e.target.scrollTop
      const clientHeight = e.target.clientHeight
      const scrollHeight = e.target.scrollHeight
      // 是否滚动到底部
      const isScrollBottom = (scrollTop + clientHeight) >= scrollHeight

      if (this.filterProjects.length < this.projectLists.length && isScrollBottom) {
        const opts = this.projectLists.slice(100 * this.scrollId, 100 * this.scrollId + 100)
        this.filterProjects = [...this.filterProjects, ...opts]
        this.scrollId += 1
      }

      setTimeout(() => {
        this.loading = false
      }, 5000)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
