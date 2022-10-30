// 显示我的待办相关操作指令

export default {
  // 是否选中我的待办
  todo: {
    inserted: function(el, binding, vnode) {
      const { value } = binding
      if (value !== 1) { // 1-我的待办
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  }
}
