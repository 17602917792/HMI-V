import Vue from 'vue'

export default {
    mutations: {
        //! 给元素自身绑定变量使用
        addEvent ({ curComponent }, { event, param }) {
            curComponent.events[event] = param
        },

        removeEvent ({ curComponent }, event) {
            Vue.delete(curComponent.events, event)
        },
    },
}