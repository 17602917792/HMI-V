import request from '@/utils/request'

// 获取方案配置的工位目录
export function getPlanStationdirs(data) {
    return request({
        method: 'get',
        url: '/plandir/treelist',
        data,
    })
}
// 增加方案目录

export function addPlanStationdirs(data) {
    return request({
        method: 'post',
        url: '/plandir/add',
        data,
    })
}
// 编辑方案目录
export function editPlanStationdir(data) {
    return request({
        method: 'post',
        url: '/plandir/edit',
        data,
    })
}
// 删除目录
export function deletePlanStationdir(data) {
    return request({
        method: 'post',
        url: '/plandir/delete',
        data,
    })
}
// 工艺信息
export function getstationdPage(data) {
    return request({
        method: 'get',
        url: '/template/page',
        data,
    })
}
// 添加工艺信息
export function addTemplate(data) {
    return request({
        method: 'post',
        url: '/template/add',
        data,
    })
}
// 删除工艺信息
export function deleteTemplate(data) {
    return request({
        method: 'post',
        url: '/template/delete',
        data,
    })
}
