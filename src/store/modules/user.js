import { getUserInfo } from '../../api/login'
import { Message } from 'element-ui'

export default {
    namespaced: true,
    state: () => ({
        token: '',
        userInfo: {},
    }),
    mutations: {
        updateUserInfo(state, payload) {
            state.userInfo = payload
            // console.log(state.userInfo)
        },
    },
    actions: {
        async loginUserInfo(context) {
            const response = await getUserInfo()
            if (response.status === 200 && response.data.success) {
                context.commit('updateUserInfo', response.data.data)
            } else {
                Message.error('获取用户详情失败，请稍后再试~')
            }
        },
    },
}