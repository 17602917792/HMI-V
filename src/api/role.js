import request from '@/utils/request'

// 获取所有角色列表
export function getAllRolePage(data) {
    return request({
        method: 'get',
        url: '/sysRole/page',
        data,
    })
}

// 添加角色
export function addRoleInfo(data) {
    return request({
        method: 'post',
        url: '/sysRole/add',
        data,
    })
}

// 更新角色
export function updateRoleInfo(data) {
    return request({
        method: 'post',
        url: '/sysRole/edit',
        data,
    })
}

// 更新角色
export function deleteRoleInfo(data) {
    return request({
        method: 'post',
        url: '/sysRole/delete',
        data,
    })
}

// 获取角色拥有的菜单ID
export function getOwnMenu(data) {
    return request({
        method: 'get',
        url: '/sysRole/ownMenu',
        data,
    })
}
// 授权角色菜单
export function grantMenu(data) {
    return request({
        method: 'post',
        url: '/sysRole/grantMenu',
        data,
    })
}