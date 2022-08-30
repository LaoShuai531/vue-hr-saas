// permission.js是控制页面登录权限的文件
// 权限拦截在路由跳转的时候做
// 权限拦截 导航守卫 路由守卫 router
// 路由的拦截权限问题
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例和组件中的this.$store是一回事
// 不需要导出，只需要让代码执行即可
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404'] // 定义白名单 所有不受权限控制的页面

// 前置守卫
// 路由的导航守卫，主要作用：页面的权限拦截（前置守卫）
// next 是前置守卫 必须执行的钩子函数  next必须执行 如果不执行 页面就死了
// next() 放过
// next(false) 跳转终止
// next(地址) 跳转到某个地址
router.beforeEach(async (to, from, next) => {
  NProgress.start() // 开启进度条
  // next是一个必须执行的钩子 不执行就卡住了
  if (store.getters.token) {
    // 如果有token
    if (to.path === '/login') {
      // 如果要访问的是 登录页则跳到主页
      next('/') // 跳到主页
    } else {
      // 只有在放过通行的时候才要去获取用户资料
      // 同时要判断是不是已经获取过资料了
      // 如果当前vuex中有用户的资料的id 表示 已经有资料了 不需要获取了 如果没有id才需要获取
      if (!store.getters.userId) {
        // 如果id不存在 意味着当前没有用户资料 就要去获取用户资料
        // vuex的action是一个promise对象
        const { roles } = await store.dispatch('user/getUserInfo')
        // 此时已经获取完资料
        // 同时因为这里是异步的，如果说后续 需要根据用户资料来获取数据的话 这里必须改成同步，用await
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // 此时得到的routes是当前用户的所拥有的的动态路由的权限
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 将当前动态路由加到当前路由规则上
        // 加await的意思是 强制等待获取完用户资料之后 才去放行  就能保证 用户进到页面时候 有资料
        // 添加完路由之后 不能用next()  要用next(to.path) 否则地址不能生效 这算是一个已知 的小缺陷
        // 执行完addRoutes 必须执行next(to.path) 不能执行 next() 这是一个已知的问题缺陷
        next(to.path) // 解决直接执行next()时的异常
      } else {
        next() // 放行
      }
    }
  } else {
    /* 没有token的情况下 */
    if (whiteList.indexOf(to.path) !== -1) {
      // 表示要去的地址在白名单中
      next() // 放行
    } else {
      // 其他没有访问权限的页面将被重定向到登录页面。
      // next(`/login?redirect=${to.path}`)
      next('/login')
    }
  }
  NProgress.done() // 手动强制关闭一次 为了解决 手动切换地址时 进度条的不关闭的问题
})

// 后置守卫
router.afterEach(() => {
  // 关闭进度条
  NProgress.done()
})
