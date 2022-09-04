import request from '@/utils/request'
// 获取组织架构数据（封装api接口）
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}
/** *
 *  根据id根据部门  接口是根据restful的规则设计的   删除 delete  新增 post  修改put 获取 get
 * **/

// 封装组织架构-删除部门接口
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete' // 接口是满足restful接口规范的（同样的地址 不同的方法 执行不同的业务）
  })
}

/** *
 *  新增部门
 * **/
// 封装组织架构-添加接口
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data // axios的body参数 data
  })
}

/** *
 *  获取某个部门详情信息
 * **/
// 封装组织架构-获取数据接口
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 封装组织架构-更新接口
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
// restful 接口开发规范
// CRUD  增删改查
// C  creare
// R  read
// U  update
// D  delete

// C  post /user(新增用户)  data(新增用户的信息)
// R  get  /user(查询列表)   get  /user/123(查询用户详情)
// U  put  /user/123(修改用户信息) data(修改用户的信息)
// D  delete  /user/123(删除某个用户)
