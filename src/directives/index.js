// 注册自定义指令
// 负责管理所有的自定义指令
// 只负责导出指令对象
// 变量名称就是指令名称
export const imageerror = {
  // 指令内容
  // 指令作用在 图片上的 dom是图片对象
  // inserted 在Vue3中也改名 => mounted
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted(dom, options) {
    // options是 指令中的变量的解释 其中有一个属性叫做 value
    // dom 表示当前指令作用的dom对象 dom认为此时就是图片
    // inserted执行的之后 此时 并没有对 src 赋值
    // 图片有地址 但是地址加载图片失败的时候 会报错 会执行一个函数 => onerror
    dom.src = dom.src || options.value // 判断初始值
    dom.onerror = function () {
      // 监听onerror事件
      // options.value就是指令传过来的值
      dom.src = options.value // 当图片异常的时候 接收指令传过来的值 让这个值作为头像的备选
    }
    // 只有src有值 并且加载失败才会触发onerror
  },
  // 此钩子会在给image赋值之后执行
  // 这个钩子函数在Vue3中改名了 => updated
  // 在赋值后重新处理
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}
