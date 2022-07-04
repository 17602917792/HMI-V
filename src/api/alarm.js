import request from '@/utils/request'

// 获取所有报警信息
export function getWarningPage(data) {
    return request({
        method: 'get',
        url: '/warning/page',
        data,
    })
}

// 新建报警信息
export function addAlarmInfo(data) {
    return request({
        method: 'post',
        url: '/warning/add',
        data,
    })
}
// 更新报警信息
export function updateAlarmInfo(data) {
    return request({
        method: 'post',
        url: '/warning/edit',
        data,
    })
}

// 删除报警信息
export function deleteAlarm(data) {
    return request({
        method: 'post',
        url: '/warning/delete',
        data,
    })
}

// 批量删除报警信息
export function moreDeleteAlarm(data) {
    return request({
        method: 'post',
        url: '/warning/batchdelete',
        data,
    })
}

// 导入
export function importAlarm(PlcId, data) {
    return request({
        method: 'post',
        url: '/warning/import?PlcId=' + PlcId,
        ContentType: 'multipart/form-data',
        data,
    })
}

// 导出
export function exportAlarm(data) {
    return request({
        method: 'get',
        url: '/warning/export',
        responseType: 'blob', // 添加响应类型，重要！！！
        data,
    })
}
