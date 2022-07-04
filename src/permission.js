import router from './router'
import store from './store'
import { Message } from 'element-ui'

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
    const token = sessionStorage.getItem('token')
    // console.log(to)
    if (token) {
        if (to.path === '/login') {
            // 是登录页面，跳转到主页面
            next('/project')
        } else {
            // if (store.state.user.userInfo.menus == undefined) {
            await store.dispatch('user/loginUserInfo')
            // }
            const menus = store.state.user.userInfo.menus
            // console.log(menus)
            if (menus !== undefined && menus.length > 0) {
                const flag = menus.some(item => {
                    if (item.path === to.path) {
                        return true
                    }
                    return false
                })
                if (flag) {
                    next()
                } else {
                    Message.error('您没有该访问权限，请联系管理员！')
                }
            } else {
                Message.error('您没有该访问权限，请联系管理员！')
            }
        }
    } else if (whiteList.includes(to.path)) {
        // 在白名单里面，放行通过即可
        next()
    } else {
        // 不在白名单里面，跳转到登录页面
        router.push('/login')
    }
})