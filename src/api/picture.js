import request from '@/utils/request'

// 获取所有图片
export function getGalleryPage(data) {
    return request({
        method: 'get',
        url: '/gallery/page',
        data,
    })
}

// 新建图片
export function addGalleryInfo({ formData, stationId, imageName, desc }) {
    return request({
        method: 'post',
        url: `/gallery/add?stationId=${stationId}&imageName=${imageName}&desc=${desc}`,
        data: formData,
    })
}

// 编辑图片
export function editGalleryInfo({ formData, id, imageName, desc }) {
    return request({
        method: 'post',
        url: `/gallery/edit?imageId=${id}&imageName=${imageName}&desc=${desc}`,
        data: formData,
    })
}

// 删除图片
export function deleteGalleryInfo(data) {
    return request({
        method: 'post',
        url: '/gallery/delete',
        data,
    })
}

// 删除图片
export function moreDeleteGalleryInfo(data) {
    return request({
        method: 'post',
        url: '/gallery/batchdelete',
        data,
    })
}

// 配置页上传
export function addGalleryInfos({ formData, stationId, imageName }) {
    return request({
        method: 'post',
        url: `/gallery/add?stationId=${stationId}&imageName=${imageName}&desc=''`,
        data: formData,
    })
}