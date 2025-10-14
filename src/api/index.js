import request from '../utils/request'

//发送验证码
export const getCode = (data) => {
  return request.post('/get/code', data)
}

//注册用户(验证码验证)

export const userAuthentication = (data) => {
  return request.post('/user/authentication', data)

}

//登录
export const login = (data) => {
  return request.post('/login', data)
}

//权限管理列表(账号管理中的每个账号的信息(id,create_time,active,mobile,name))
export const authAdmin = (params) => {
  return request.get('/auth/admin', { params })

}

//菜单权限数据(不需要携带参数params)
export const userGetMenu = () => {
  return request.get('/user/getmenu')
}

//菜单权限修改
export const userSetMenu = (data) => {
  return request.post('/user/setmenu', data)
}

//菜单权限列表
export const menuList = (params) => {
  return request.get('/menu/list', { params })
}

//权限下拉列表(在权限管理中，点击编辑后菜单权限下拉框的内容)
export const menuSelectList = () => {
  return request.get('/menu/selectlist')
}

//用户数据修改(得到修改后的权限，昵称)
export const updataUser = (data) => {
  return request.post('/update/user', data)
}

//用户菜单权限(登录的时候要调用这个接口),得到给某个用户账号权限设置后组别所具有的权限
export const menuPermissions = () => {
  return request.get('/menu/permissions')
}

//陪护师头像列表
export const photoList = () => {
  return request.get('/photo/list')
}

//陪护师的创建
export const companion = (data) => {
  return request.post('/companion', data)
}

//陪护列表
export const companionList = (params) => {
  return request.get('/companion/list', { params })
}

//陪护师删除
export const deleteCompanion = (data) => {
  return request.post('/delete/companion', data)
}

//订单列表
export const adminOrder = (params) => {
  return request.get('/admin/order', { params })
}

//订单状态完成
export const updateOrder = (data) => {
  return request.post('/update/order', data)
}

// 控制台接口
export const getControlData = () => {
  return request.get('/report')
}