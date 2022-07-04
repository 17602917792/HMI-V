import request from '@/utils/request'

// 获取菜单列表
export function getMenuList(data) {
    return request({
        method: 'get',
        url: '/sysMenu/list',
        data,
    })
}
// 添加菜单
export function addMenu(data) {
    return request({
        method: 'post',
        url: '/sysMenu/add',
        data,
    })
}
// 删除菜单
export function deleteMenu(data) {
    return request({
        method: 'post',
        url: '/sysMenu/delete',
        data,
    })
}
// 更新菜单
export function editMenu(data) {
    return request({
        method: 'post',
        url: '/sysMenu/edit',
        data,
    })
}

// 获取菜单列表
export function getMenuTreeList(data) {
    return request({
        method: 'get',
        url: '/sysMenu/tree',
        data,
    })
}