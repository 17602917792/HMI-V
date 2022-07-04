import request from '@/utils/request'

// 获取所有PLC
export function getPlcInfo(data) {
    return request({
        method: 'get',
        url: '/plcInfo/page',
        data,
    })
}

// 添加PLC
export function addPlcInfo(data) {
    return request({
        method: 'post',
        url: '/plcInfo/add',
        data,
    })
}

// 更新PLC
export function updatePlcInfo(data) {
    return request({
        method: 'post',
        url: '/plcInfo/edit',
        data,
    })
}

// 删除PLC信息
export function deletePlc(data) {
    return request({
        method: 'post',
        url: '/plcInfo/delete',
        data,
    })
}

// 获取所有PLC类型
export function getPlcType(data) {
    return request({
        method: 'get',
        url: '/plcType/page',
        data,
    })
}
