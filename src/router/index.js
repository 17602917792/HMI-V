import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/layout/index1.vue'

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        component: () => import('@/views/Login'),
    },
    {
        path: '/home',
        component: () => import('@/views/Home'),
    },
    // 项目管理
    {
        path: '/project',
        component: Layout,
        children: [
            {
                path: '',
                name: 'Project',
                component: () => import('@/views/Project'),
            },
        ],
    },
    // 用户管理
    {
        path: '/user',
        component: Layout,
        children: [
            {
                path: '',
                name: 'User',
                component: () => import('@/views/User'),
            },
        ],
    },
    // 角色管理
    {
        path: '/role',
        component: Layout,
        children: [
            {
                path: '',
                name: 'Role',
                component: () => import('@/views/Role'),
            },
        ],
    },
    // 菜单管理
    {
        path: '/menu',
        component: Layout,
        children: [
            {
                path: '',
                name: 'Menu',
                component: () => import('@/views/Menu'),
            },
        ],
    },
    // 权限管理
    {
        path: '/permission',
        component: Layout,
        children: [
            {
                path: '',
                name: 'Permission',
                component: () => import('@/views/Permission'),
            },
        ],
    },
    // PLC类型管理
    {
        path: '/plctype',
        component: Layout,
        children: [
            {
                path: '',
                name: 'PlcType',
                component: () => import('@/views/PlcType'),
            },
        ],
    },
    // 工位管理
    {
        path: '/stations',
        component: Layout,
        children: [
            {
                path: '',
                name: 'Stations',
                component: () => import('@/views/Stations'),
            },
        ],
    },
    // 单个工位
    {
        path: '/singleStation',
        component: Layout,
        children: [
            {
                path: '',
                name: 'SingleStation',
                component: () => import('@/views/SingleStation'),
                children: [
                    {
                        path: 'page',
                        name: 'Page',
                        component: () => import('@/views/administration/PageManagement.vue'),
                    },
                    {
                        path: 'alarm',
                        name: 'Alarm',
                        component: () => import('@/views/administration/Alarm.vue'),
                    },
                    {
                        path: 'configure',
                        name: 'Configure',
                        component: () => import('@/views/administration/Configure.vue'),
                    },
                    {
                        path: 'PLC',
                        name: 'PLC',
                        component: () => import('@/views/administration/PLC.vue'),
                    },
                    {
                        path: 'variable',
                        name: 'Variable',
                        component: () => import('@/views/administration/Variable.vue'),
                    },
                    {
                        path: 'picture',
                        name: 'Picture',
                        component: () => import('@/views/administration/Picture.vue'),
                    },
                ],
            },
        ],
    },
]

export default new Router({
    routes,
})
