import request from '@/utils/request'

/** *
 * 登录接口封装
* **/
export function login(data) {
  // 返回了promise对象
  return request({
    url: '/sys/login',
    method: 'post',
    data // body参数体位于data
  })
}
/** *
 * 获取用户资料的接口
 * **/
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
/** *
 * 获取用户基础信息的接口（根据用户id获取用户的详情） 现在写这个接口，完全是为了显示头像
 * **/
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
    // get类型不需要写method，默认请求类型就是get
  })
}

export function logout() {

}
