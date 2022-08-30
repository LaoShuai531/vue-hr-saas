import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
const state = {
  token: getToken(), // 设置token为共享
  userInfo: {} // 这里为什么不写null ?因为后边我们会在getters中引用userInfo的变量，如果设置为null，则会报错
}
const mutations = {
  // 设置token的mutations
  setToken(state, token) {
    state.token = token // 只是设置了vuex中的数据
    // 需要将vuex中的数据同步到缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null // 设置vuex中的token为null
    removeToken() // 同步删除缓存中的token
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo // 这样是响应式
    // state.userInfo = { ...userInfo } // 浅拷贝 如果要去改属性里面的某一个值 可以用浅拷贝的方式
    // state.userInfo['username'] = userInfo // 这样才不是响应式
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {} // 重置为空对象，同样不能重置为null
  }
}
const actions = {
  // 封装一个登录的action
  // data认为是 { mobile,password }
  // 只要用async标记了函数 那么这个函数本身就是promise对象
  async login(context, data) {
    // 调用登录接口
    // login(data).then(result => {

    // })
    // await下方永远都是 reslove成功执行的逻辑
    const result = await login(data)
    // result就是token
    context.commit('setToken', result)

    setTimeStamp() // 设置时间戳
  },
  // 获取用户资料
  async getUserInfo(context) {
    const result = await getUserInfo() // 获取返回值
    // 此时result里面已经有userId
    const baseInfo = await getUserDetailById(result.userId) // 获取用户的基本信息
    context.commit('setUserInfo', { ...result, ...baseInfo }) // 修改state中的用户资料，将整个的个人信息设置到用户的vuex数据对象中 将两个接口结果合并
    return result // 这里这句话 是伏笔 当下是用不上的 但是后期会用上 后期做权限需要用到这个result
  },
  // 登录退出action
  logout({ commit }) {
    // 删除token，这个方法已经有了
    commit('removeToken') // 不仅仅删除了vuex中的，还删除了缓存中的
    // 删除用户资料，这个方法也已经有了
    commit('removeUserInfo') // 删除用户信息
    // 重置路由
    resetRouter()
    // 清空路由模块下的路由信息
    // Vuex子模块 调用子模块的mutation
    commit('permission/setRoutes', [], { root: true }) // commit默认是提交的当前子模块的mutations
    // 如果加上 root: true 就表示commit此时是根级的commit
    // this.$store.commit('permission/setRoutes')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
