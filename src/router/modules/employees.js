import Layout from '@/layout'
// 员工模块的路由规则
// 员工模块
export default {
  path: '/employees', // 地址
  name: 'employees', // 给每一个路由规则加一个name 加它的目的是用于后面的权限设置
  component: Layout, // 一级路由组件，因为静态路由和动态路由是分开的，不能将员工模块直接放到首页主页当中（需设置不同权限），所以这里要单独弄一个layout组件
  children: [{
    //  二级路由的地址如果都不写 意味着当前的组件作为二级路由的默认组件
    path: '', // 这里不用写 什么都不用写 表示 /employees 不但有布局 layout 还有=>员工主页
    name: 'employees',
    component: () => import('@/views/employees'), // 引入 approval作为主页面 动态引用，按需加载
    meta: {
      // 路由元信息 里面可以存储一些路由信息
      title: '员工', // title有用处  表示当前模块的中文名称 meta属性里面的属性 随便定义 但是这里为什么要用title呢？
      // 因为左侧导航会读取我们路由里的meta里面的title作为显示菜单名称
      icon: 'people'
    }
  }, {
    path: 'detail/:id', // 动态路由参数 /:id id必须填  不填跳不过去 /:id? ?表示id可填可不填
    component: () => import('@/views/employees/detail'),
    hidden: true, // 在左侧菜单隐藏
    meta: {
      title: '员工详情'
    }
  }, {
    path: 'print/:id', // 二级路由 写 /表示从根路径开始算  不写表示从 一级的路径开始算
    component: () => import('@/views/employees/print'),
    hidden: true // 在左侧菜隐藏
  }] // 二级路由组件
}
// /approvals => layout  =>
// /approvals/index
