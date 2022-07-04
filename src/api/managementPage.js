import request from '@/utils/request'

// 登录功能
export function treePages(data) {
    return request({
        method: 'get',
        url: '/pages/treelist',
        data,
    })
}
export function weight(data) {
    return request({
        method: 'get',
        url: '/pages/treeselect',
        data,
    })
}
export function addPages(data) {
    return request({
        method: 'post',
        url: '/pages/add',
        data,
    })
}
export function editPage(data) {
    return request({
        method: 'post',
        url: '/pages/edit',
        data,
    })
}
export function deletePage(data) {
    return request({
        method: 'post',
        url: '/pages/delete',
        data,
    })
}
export function setstartup(data) {
    return request({
        method: 'post',
        url: '/pages/setstartup',
        data,
    })
}
// 页面树形列表
export function getlistBysid(data) {
    return request({
        method: 'get',
        url: '/variable/getlistBysid',
        data,
    })
}
// 页面保存数据
export function saveContent(data) {
    return request({
        method: 'post',
        url: '/pages/save_content',
        data,
    })
}
// 获取页面信息
export function detail(data) {
    return request({
        method: 'get',
        url: '/pages/detail',
        data,
    })
}

// 获取页面信息
export function getTreeselect(data) {
    return request({
        method: 'get',
        url: '/pages/treeselect',
        data,
    })
}