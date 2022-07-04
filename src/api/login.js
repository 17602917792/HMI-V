import request from '@/utils/request'

// 登录功能
export function login(data) {
    return request({
        method: 'post',
        url: '/login',
        data,
    })
}

// 获取用户详情
export function getUserInfo(data) {
    return request({
        method: 'get',
        url: '/getLoginUser',
        data,
    })
}

// 退出登录功能
export function logout(data) {
    return request({
        method: 'get',
        url: '/logout',
        data,
    })
}
