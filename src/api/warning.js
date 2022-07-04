import request from '@/utils/request'

// 分页查询报警信息
export function getstationdPage(data) {
    return request({
        method: 'get',
        url: '/station/page',
        data,
    })
}
