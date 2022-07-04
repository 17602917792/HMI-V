import load from '@/utils/dynamicLoadScript.js'
// 编辑器自定义事件
const events = {
    redirect (url) {
        if (url) {
            console.log(url, 'url')
            this.$router.push(url)
        }
    },
}

const mixins = {
    methods: events,
}

// 操作
const eventList = [{
    key: 'redirect',
    label: '跳转事件',
    event: events.redirect,
    param: {},
},
{
    key: 'onmousedown',
    label: '按下事件',
    event: events.onmousedown,
    param: {},
},
{
    key: 'onmouseup',
    label: '弹起事件',
    event: events.onmouseup,
    param: {},
},
]

// 开关
const evenSitch = [
    {
        key: 'open',
        label: '开启',
        event: events.open,
        param: {},
    },
    {
        key: 'close',
        label: '关闭',
        event: events.close,
        param: {},
    },
    {
        key: 'plc',
        label: 'plc变量绑定',
        event: events.plc,
        param: {},
    },
]
const sateLists = [
    {
        key: 'sate',
        label: '状态变量绑定',
        event: events.sate,
        param: {},
    },
]

//  ------------------------------------------------------------------------------------  

//! 操作类    switch
/** *
 * sate 信号监控   ->>>>> 单变量绑定/多条件/设置开关状态/颜色
 * open 开启
 * close 关闭
 */
const switchEvent = [
    {
        key: 'open',
        onOff: true, // 当前事件的状态  true: 开 /  false: 关
        type: 'multivariable',
        label: '开启',
        event: events.open,
        param: {},
    },
    {
        key: 'close',
        onOff: true,
        type: 'multivariable',
        label: '关闭',
        event: events.close,
        param: {},
    },
    {
        key: 'monitoring',
        onOff: true,
        type: 'univariate',
        label: '信号监控',
        event: events.multivariable,
        param: {},
    },
    {
        key: 'authority',
        onOff: true,
        type: 'authority',
        label: '权限等级',
        event: events.authority,
        param: {},
    },
]

//!  操作类   button
/** *
 * redirect 跳转事件
 * onmousedown 按下事件
 * onmouseup 弹起事件
 * sate 信号监控    ->>>>> 单变量绑定/多条件/设置开关状态/颜色
 */
const buttonEvent = [
    {
        key: 'redirect',
        onOff: true,
        type: 'redirect',
        label: '跳转事件',
        event: events.redirect,
        param: {},
    },
    {
        key: 'onmousedown',
        onOff: true,
        type: 'multivariable',
        label: '按下事件',
        event: events.onmousedown,
        param: {},
    },
    {
        key: 'onmouseup',
        onOff: true,
        type: 'multivariable',
        label: '弹起事件',
        event: events.onmouseup,
        param: {},
    },
    {
        key: 'alert',
        onOff: true,
        type: 'alert',
        label: '对话框事件',
        event: events.multivariable,
        param: {},
    },
    {
        key: 'monitoring',
        onOff: true,
        type: 'univariate',
        label: '信号监控',
        event: events.multivariable,
        param: {},
    },
    {
        key: 'authority',
        onOff: true,
        type: 'authority',
        label: '权限等级',
        event: events.authority,
        param: {},
    },
]

//! 信号监控类 
/** **
 * sate 信号监控    ->>>>> 单变量绑定/多条件/设置开关状态/颜色
 */
const signalEvent = [
    {
        key: 'monitoring',
        onOff: true,
        type: 'univariate',
        label: '信号监控',
        event: events.univariate,
        param: {},
    },
]
export {
    mixins,
    events,
    sateLists,
    evenSitch,
    eventList,

    switchEvent,
    buttonEvent,
    signalEvent,
}
