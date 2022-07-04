import request from '@/utils/request'

// 获取所有工位管理工位目录
export function getAllStationdirs(data) {
    return request({
        method: 'get',
        url: '/stationdir/treelist',
        data,
    })
}

// 添加工位目录
export function addStationdir(data) {
    return request({
        method: 'post',
        url: '/stationdir/add',
        data,
    })
}

// 删除工位目录
export function deleteStationdir(data) {
    return request({
        method: 'post',
        url: '/stationdir/delete',
        data,
    })
}

// 更改工位目录
export function editStationdir(data) {
    return request({
        method: 'post',
        url: '/stationdir/edit',
        data,
    })
}

// 分页查询工位信息
export function getstationdPage(data) {
    return request({
        method: 'get',
        url: '/station/page',
        data,
    })
}
