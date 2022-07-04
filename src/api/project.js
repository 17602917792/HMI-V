import request from '@/utils/request'

// 获取所有项目目录
export function getProjects(data) {
    return request({
        method: 'get',
        url: '/project/page',
        data,
    })
}

// 添加项目
export function addProject(data) {
    return request({
        method: 'post',
        url: '/project/add',
        data,
    })
}

// 删除项目
export function deleteProject(data) {
    return request({
        method: 'post',
        url: '/project/delete',
        data,
    })
}

// 更新项目
export function updateProject(data) {
    return request({
        method: 'post',
        url: '/project/edit',
        data,
    })
}
