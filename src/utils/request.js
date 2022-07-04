import axios from 'axios'
import router from '../router'
// import { Message } from 'element-ui'

// export const baseURL = 'http://w21.dt1.biz:8888' // 外网地址
// export const baseURL = 'http://192.168.1.6:8096/' // 内网地址
export const baseURL = 'http://192.168.1.122:8095/' // 内网地址
export const location = String(process.env.NODE_ENV == 'development' ? baseURL : window.location.origin)

const instance = axios.create({
    baseURL,
    timeout: 10000,
})

// 请求拦截器
instance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token')
    // console.log(config)
    if (token != '' || token != null || token != undefined) {
        config.headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': config.ContentType,
        }
    }
    return config
})

instance.interceptors.response.use((response) => {
    if (response.data.code === 401) {
        // token过期
        sessionStorage.setItem('token', '')
        router.push('/login')
    } 
    return response
}, (error) => Promise.reject(error))
// 请求工具函数

export default (options) => instance({
    method: options.method || 'get',
    url: options.url,
    [options.method.toLowerCase() === 'get' ? 'params' : 'data']: options.data,
    responseType: options.responseType,
    ContentType: options.ContentType ? options.ContentType : 'application/json;charset=utf-8',
})