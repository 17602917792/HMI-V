import request from '@/utils/request'

// 获取所有变量信息
export function getVariablePage(data) {
    return request({
        method: 'get',
        url: '/variable/page',
        data,
    })
}

// 新建变量信息
export function addVaribleInfo(data) {
    return request({
        method: 'post',
        url: '/variable/add',
        data,
    })
}

// 更新变量信息
export function updateVaribleInfo(data) {
    return request({
        method: 'post',
        url: '/variable/edit',
        data,
    })
}

// 删除变量信息
export function deleteVariable(data) {
    return request({
        method: 'post',
        url: '/variable/delete',
        data,
    })
}

// 批量删除变量信息
export function moreDeleteVariable(data) {
    return request({
        method: 'post',
        url: '/variable/batchdelete',
        data,
    })
}

// 导入
export function importVariable(PlcId, data) {
    return request({
        method: 'post',
        url: '/variable/import?PlcId=' + PlcId,
        // 'Content-Type': 'multipart/form-data'
        ContentType: 'multipart/form-data',
        data,
    })
}
// 导出
export function exportVariable(data) {
    return request({
        url: '/variable/export',
        method: 'get',
        responseType: 'blob', // 添加响应类型，重要！！！
        data,
    })
}
