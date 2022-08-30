const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 将user模块下的token作为快捷方式放出来
  name: state => state.user.userInfo.username, // 将子模块中的对象中的名称开放出来
  userId: state => state.user.userInfo.userId, // 将子模块中的对象中的用户ID开放出来
  staffPhoto: state => state.user.userInfo.staffPhoto, // 获取头像 建立用户头像的映射
  companyId: state => state.user.userInfo.companyId,
  routes: state => state.permission.routes
}
export default getters
