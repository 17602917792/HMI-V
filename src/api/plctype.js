import request from '@/utils/request'

// 获取所有PLC类型
export function getPlcTypePages(data) {
    return request({
        method: 'get',
        url: '/plctype/page',
        data,
    })
}

// 添加PLC类型
export function addPlcType(data) {
    return request({
        method: 'post',
        url: '/plctype/add',
        data,
    })
}

// 更新PLC类型
export function updatePlcType(data) {
    return request({
        method: 'post',
        url: '/plctype/edit',
        data,
    })
}

// 删除PLC信息
export function deletePlcType(data) {
    return request({
        method: 'post',
        url: '/plctype/delete',
        data,
    })
}

// 获取所有扩展字段
export function getPlctypeConfig(data) {
    return request({
        method: 'get',
        url: '/plctypeconfig/list',
        data,
    })
}
// 添加扩展字段
export function addPlctypeconfig(data) {
    return request({
        method: 'post',
        url: '/plctypeconfig/add',
        data,
    })
}

// 更新扩展字段
export function updatePlctypeconfig(data) {
    return request({
        method: 'post',
        url: '/plctypeconfig/edit',
        data,
    })
}

// 删除扩展字段
export function deletePlctypeconfig(data) {
    return request({
        method: 'post',
        url: '/plctypeconfig/delete',
        data,
    })
}
