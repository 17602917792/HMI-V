import request from '@/utils/request'

// 获取所有用户列表
export function getAllUserPage(data) {
    return request({
        method: 'get',
        url: '/sysUser/page',
        data,
    })
}
// 添加用户
export function addUser(data) {
    return request({
        method: 'post',
        url: '/sysUser/add',
        data,
    })
}

// 编辑用户
export function editUser(data) {
    return request({
        method: 'post',
        url: '/sysUser/edit',
        data,
    })
}

// 删除用户
export function deleteUser(data) {
    return request({
        method: 'post',
        url: '/sysUser/delete',
        data,
    })
}
// 导出用户
export function exportUser(data) {
    return request({
        method: 'get',
        url: '/sysUser/export',
        responseType: 'blob', // 添加响应类型，重要！！！
        data,
    })
}

// 获取用户角色列表
export function userRole(data) {
    return request({
        method: 'get',
        url: '/sysUser/ownRole',
        data,
    })
}

export function grantRole(data) {
    return request({
        method: 'post',
        url: '/sysUser/grantRole',
        data,
    })
}

// 修改用户状态
export function changeStatus(data) {
    return request({
        method: 'post',
        url: '/sysUser/changeStatus',
        data,
    })
}

// 导入
export function importUser(data) {
    return request({
        method: 'post',
        url: '/sysUser/import',
        ContentType: 'multipart/form-data',
        data,
    })
}
// 重置密码
export function resetPwd(data) {
    return request({
        method: 'post',
        url: '/sysUser/resetPwd',
        data,
    })
}
