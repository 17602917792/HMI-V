import store from '../store/index'

// const isHasAuth = (authPoint) => {
//     const points = store.state.user.userInfo.permissions
//     // console.log(points, authPoint)
//     let flag = false
//     if (points !== undefined && points.length > 0) {
//         flag = points.includes(authPoint)
//     }
//     // console.log('aaaaaaaaaaaaaaaaaaaaa')
//     if (flag) {
//         return true
//     }
//     // Message.error('没有该操作权限！')
//     return false
// }
// export default isHasAuth
export default {
    install(Vue) {
        Vue.prototype.$isHasAuth = (authPoint) => {
            const points = store.state.user.userInfo.permissions
            let flag = false
            if (points !== undefined && points.length > 0) {
                flag = points.includes(authPoint)
            }
            if (flag) {
                return true
            }
            // Message.error('没有该操作权限！')
            return false
        }
        Vue.prototype.$isHasMenu = (path) => {
            const menus = store.state.user.userInfo.menus
            let flag = false
            if (menus !== undefined && menus.length > 0) {
                flag = menus.some(item => {
                    if (item.path === path) {
                        return true
                    }
                    return false
                })
            }
            if (flag) {
                return true
            }
            // Message.error('没有该操作权限！')
            return false
        }
    },
}
