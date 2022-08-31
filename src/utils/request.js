import axios from 'axios'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
import store from '@/store'
import router from '@/router'
const TimeOut = 5400 // 定义超时时间
const service = axios.create({
  // 设置基础地址
  // 当执行 npm run dev => .env.development => /api => 跨域代理
  // 环境变量 npm run dev  /api   /生产环境 npm run build  /prod-api
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础地址
  timeout: 10000 // 认为只要超过5秒钟不响应 就超时
})
// 请求拦截器
service.interceptors.request.use(async config => {
  // 请求接口  config是请求配置信息
  // 取token(在这个位置需要统一的去注入token)
  if (store.getters.token) {
    // 只有在有token的情况下 才有必要去检查时间戳是否超时，时间戳的时效性
    if (CheckIsTimeOut()) {
      //  如果CheckIsTimeOut()为true表示 过期了
      await store.dispatch('user/logout')
      router.push('/login') // 路由跳转 跳到登录页
      return Promise.reject(new Error('您的token已经失效了'))
    }
    // 如果存在token，注入token
    config.headers.Authorization = `Bearer ${store.getters.token}`
    // return config
  }
  // 这里一定要注意
  // 一定要return config
  return config
}, error => {
  return Promise.reject(error) // 停止，中断
})
// 响应拦截器
service.interceptors.response.use(response => {
  // 成功执行
  // axios默认加了一层data的包裹
  const { success, message, data } = response.data
  // 要根据success的成功与否来决定下面的操作
  if (success) {
    // 此时认为业务执行成功了
    return data // 返回用户所需要的数据
  } else {
    // 当业务失败的时候 还能进then ? 不能！ 应该进catch
    Message.error(message) // 提示错误信息
    return Promise.reject(new Error(message))
  }
}, async error => {
  // error 信息 里面有response对象 config
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当状态码为10002时 表示后端告诉前端token超时了
    await store.dispatch('user/logout') // 调用登出action 删除token
    router.push('/login') // 跳到登录页
    return Promise.reject(new Error('token超时了')) // 返回错误
  } else {
    // 失败
    // Message等同于 this.$message
    Message.error(error.message) // 提示错误信息
    // reject中断
    return Promise.reject(error) // 传入一个错误的对象  就认为promise执行链跳出成功 进入了catch
  }
})

// 检查token是否过期
function CheckIsTimeOut() {
  // 超时逻辑：当前时间  - 存储的时间戳 > 时效性  返回一个 false 或 true
  return (Date.now() - getTimeStamp()) / 1000 > TimeOut
}

export default service
