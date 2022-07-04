<template>
    <div class="event-list">
        <div v-if="styleData.length == 0" style="text-align: center; margin-top: 30px;"> 该元素为纯展示类，不支持事件 </div>
        <template v-else>
            <el-collapse>
                <el-collapse-item 
                    v-for="(item, i) in styleData"
                    :key="i"
                    :title="item.label"
                    :name="i"
                >
                    <template v-if="item.type == 'redirect'">
                        <!-- <el-select v-if="item.key == 'redirect'" v-model="item.param" placeholder="请选择跳转页面">
                            <el-option
                                v-for="option in options"
                                :key="option.param"
                                :value="option.param"
                                @keydown.native.stop
                            >
                            </el-option>
                        </el-select> -->
                        <redirect :item="item"></redirect>
                    </template>
                    <!-- 变量绑定展示 -->
                    <template v-if="item.type == 'univariate'" class="variable">
                        <univariate :item="item"></univariate>
                    </template>
                    <!-- plc多变量绑定 操作 -->
                    <template v-if="item.type == 'multivariable'" class="variable">
                        <multivariable :item="item"></multivariable>
                    </template>
                    <template v-if="item.type == 'alert'">
                        <alert :item="item"></alert>
                    </template>
                    <template v-if="item.type == 'authority'">
                        <authority :item="item" />
                    </template>
                </el-collapse-item>
            </el-collapse>
        </template>
    </div>
</template>

<script>
import { mapState } from 'vuex'
// import Modal from '@/components/Modal'
import { eventList, evenSitch, sateLists,
    switchEvent,
    buttonEvent,
    signalEvent } from '@/utils/events'
// import variable from './variable'
// import variables from './variables'

import univariate from './CanvasCommon/univariate' // 单变量
import multivariable from './CanvasCommon/multivariable' // 多变量
import redirect from './CanvasCommon/redirect.vue'
import { getTreeselect } from '../api/managementPage' // 页面下拉菜单
import alert from './CanvasCommon/alert' // 对话框事件
import authority from './CanvasCommon/authority' // 对话框事件

export default {
    components: { 
        // variable, 
        univariate,
        multivariable,
        alert,
        redirect,
        authority,
    },
    data() {
        return {
            comName: [],
            tabPosition: 'left',
            value: '',
            isShowEvent: false,
            eventURL: '',
            styleData: [],
            eventActiveName: 'redirect',
            eventList,
            evenSitch,
            sateLists,
            options: [],
            
            variableList: [],
        }
    },
    computed: {
        ...mapState([
            'curComponent',
        ]),
    },
    watch: {
        /**
         * 每次中间界面点击元素 就根据元素类型显示不同的数据
         * 监听 中间界面 直接元素之间切换 
         */
        curComponent: {
            handler() {
                // console.log(this.curComponent, 'curComponent')
                let { component } = this.curComponent
                if (component == 'v-button') { // todo 操作类
                    this.styleData = buttonEvent
                } else if (component == 'v-switch') { // todo 操作类
                    this.styleData = switchEvent
                } else if (['v-divider', 'v-date', 'v-time', 'v-iframe', 'warning', 'operation-log'].includes(component)) { // todo 纯展示类  没有事件1
                    this.styleData = []
                } else { // todo 其他都属于 信号监控类
                    this.styleData = signalEvent
                }
            },
            immediate: true,
        },
    },
    created() {
        this.getTreeselect()
    },
    methods: {
        addEvent(event, param) {
            if (event === 'sate') {
                if (this.variableList.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '请点击 √ 确认添加该变量绑定数据',
                    })
                } else {
                    // this.eventList.forEach(element => {
                    //     if (element.key === 'variable') {
                    //         element.param = this.variableList
                    //     }
                    // })
                    // console.log(this.eventList)
                    param.variableList = this.variableList
                    // console.log(param)
                }
            }
            console.log(event, param, 888855555)
            // this.isShowEvent = false
            this.$store.commit('addEvent', { event, param })
        },
        removeEvent(event) {
            this.$store.commit('removeEvent', event)
        },
        async getTreeselect() {
            const response = await getTreeselect({ StationId: this.$route.query.stationId })
            // console.log(response)
            if (response.status === 200 && response.data.success) {
                // this.options = 
                const tempList = response.data.data
                if (tempList.length > 0) {
                    tempList.forEach(element => {
                        let obj = {
                            id: element.id, // 目录的id
                            title: element.title, // 目录的名称
                            children: [],
                        }
                        if (element.children.length > 0) {
                            element.children.forEach(item => {
                                obj.children.push({
                                    id: item.id, // 页面id
                                    title: item.title, // 页面名称
                                })
                            })
                        }
                        this.options.push(obj)
                    })
                }
            } else {
                this.$message({
                    type: 'warning',
                    message: '获取页面列表失败',
                })
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.el-tabs_content{
    padding-top: 5%;
}
.event-list {
    padding: 0 5px;
    ::v-deep.el-collapse .el-collapse-item .el-collapse-item__header{
        height: 35px;
        font-size: 14px;
        font-weight: 600;
    }
    .div-events {
        text-align: center;
        padding: 0 20px;

        .el-button {
            display: inline-block;
            margin-bottom: 10px;
        }

        .el-tag {
            display: block;
            width: 50%;
            margin: auto;
            margin-bottom: 10px;
        }
    }
}
</style>
