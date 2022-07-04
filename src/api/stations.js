import request from '@/utils/request'

// 获取所有项目目录
export function getStations(data) {
    return request({
        method: 'get',
        url: '/station/page',
        data,
    })
}

// 添加工位屏
export function addStation(data) {
    return request({
        method: 'post',
        url: '/station/add',
        data,
    })
}

// 删除工位屏
export function deleteStation(data) {
    return request({
        method: 'post',
        url: '/station/delete',
        data,
    })
}

// 更新工位屏
export function updateStation(data) {
    return request({
        method: 'post',
        url: '/station/edit',
        data,
    })
}

// 获取工位屏详情
export function getStationDetail(data) {
    return request({
        method: 'post',
        url: '/station/detail',
        data,
    })
}

// 批量删除工位屏
export function deleteMoreStations(data) {
    return request({
        method: 'post',
        url: '/station/batchdelete',
        data,
    })
}

// 批量关机
export function MoreShutDown(data) {
    return request({
        method: 'post',
        url: '/station/shutdown',
        data,
    })
}

// 批量重启
export function MoreRestart(data) {
    return request({
        method: 'post',
        url: '/station/restart',
        data,
    })
}

// 批量同步时间
export function MoreCalibration(data) {
    return request({
        method: 'post',
        url: '/station/calibration',
        data,
    })
}

// 批量下发工艺模板
export function MoreSendTemplate(data) {
    return request({
        method: 'post',
        url: '/station/sendtemplate',
        data,
    })
}
