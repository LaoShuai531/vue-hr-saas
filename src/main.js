import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
// import * as 变量 得到的是一个对象{ 变量1:对象1, 变量2:对象2...},所以可以采用对象遍历的方法进行处理
import * as directives from '@/directives'
import * as filters from '@/filters' // 引入工具类
import Components from '@/components' // 导入全局注册的自定义组件
import VuePrint from 'vue-print-nb'
import checkPermission from '@/mixin/checkPermission'
import i18n from '@/lang' // 引入i18n实例
import '@/icons' // icon
import '@/permission' // permission control

// directives是所有指令的一个集合，转换为数组类型，然后再数组遍历
Object.keys(directives).forEach(key => {
  // key就是指令名称
  // console.log(key);
  // console.log(directives[key]); // 这是一个对象形式
  Vue.directive(key, directives[key]) // vue注册自定义指令
})
// 注册全局的过滤器
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})
Vue.use(Components) // 注册自己的自定义组件
Vue.mixin(checkPermission) // 全局混入  会让所有的组件都自动拥有该混入组件的方法和属性
Vue.use(VuePrint) // 注册打印插件
// set ElementUI lang to EN
Vue.use(ElementUI, {
  // t方法是去找 对应的语言下的 显示值
  i18n: (key, value) => i18n.t(key, value)
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
