<template>
    <div class="home">
        <Toolbar />

        <main>
            <!-- 左侧组件列表 -->
            <section class="left">
                <ComponentList />
            </section>
            <!-- 中间画布 -->
            <section class="center">
                <div
                    class="content"
                    @drop="handleDrop"
                    @dragover="handleDragOver"
                    @mousedown="handleMouseDown"
                    @mouseup="deselectCurComponent"
                >
                    <Editor />
                </div>
            </section>
            <!-- 右侧属性列表 -->
            <section class="right">
                <div v-if="menuIndex !=='' && rightContentStatus" class="right-list">
                    <template v-if="curComponent && menuIndex !==''">
                        <component :is="MenuPath"></component>
                    </template>
                    <p v-else style="text-align:center;margin-top: 30px;">请选择元素</p>
                </div>
                <div class="right-menu">
                    <span 
                        v-for="(menu, i) in menuList"
                        :key="i"
                        :class="{active: menuIndex === i}"
                        @click="hangleMenuTab(i)"
                    > {{ menu }}</span>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
import Editor from '@/components/Editor/index'
import ComponentList from '@/components/ComponentList' // 左侧列表组件
import AttrList from '@/components/AttrList' // 右侧属性列表
import AnimationList from '@/components/AnimationList' // 右侧动画列表
import EventList from '@/components/EventList' // 右侧事件列表
import componentList from '@/custom-component/component-list' // 左侧列表数据
import Toolbar from '@/components/Toolbar'
import { deepCopy } from '@/utils/utils'
import { mapState } from 'vuex'
import generateID from '@/utils/generateID'
import { listenGlobalKeyDown } from '@/utils/shortcutKey'
import { detail } from '@/api/managementPage.js'
import { getStations } from '../api/stations'
import { getAllRolePage } from '../api/role'

export default {
    components: { Editor, ComponentList, AttrList, AnimationList, EventList, Toolbar },
    data() {
        return {
            activeName: 'attr',
            reSelectAnimateIndex: undefined,
            menuList: ['属性', '动画', '事件'], // 右侧菜单
            menuIndex: '', // 默认菜单不选中
            rightContentStatus: false, // 右侧菜单内容状态
            stationId: this.$route.query.stationId,
            projectId: this.$route.query.projectId,
            foreun: 0,
            rolesList: [],
        }
    },
    computed: {
        MenuPath() {
            /** **
             * ['0: 属性:', '1: 动画', '2: 事件']
             * ['AttrList: 属性:', 'AnimationList: 动画', 'EventList: 事件']
             */
            let path = this.menuIndex
            return path == 0 ? 'AttrList' : path == 1 ? 'AnimationList' : path == 2 ? 'EventList' : ''
        },
        ...mapState([
            'componentData',
            'curComponent',
            'isClickComponent',
            'canvasStyleData',
            'editor',
			'foreuns'
        ]),
        
    },
    watch: {
        //! 仅为监听 点击 单个元素  打印数据使用
        curComponent(data) {
            console.log(data)
        },
        componentData() {
            this.foreun++
            this.eventClose()
        },
    },
    created() {
        this.foreun = 0
		this.$store.commit('setForeun','')
        this.getStations()
        this.getAllRolePage()
        // 全局监听按键事件
        listenGlobalKeyDown()
    },
    mounted() {
        this.restore()
		if (window.history && window.history.pushState) {
		       // 向历史记录中插入了当前页
		       // history.pushState(null, null, document.URL)
		       window.addEventListener('goBack', this.goBack, false)
		}
    },
    destroyed() {
	    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
		
        window.removeEventListener('goBack', this.goBack, false)
    },
    methods: {
        async getAllRolePage() {
            const response = await getAllRolePage({
                PageNo: 1,
                PageSize: 100,
                RoleType: 2,
            })
            if (response.status === 200 && response.data.success) {
                this.rolesList = response.data.data.rows
            } else {
                this.$message({
                    type: 'warning',
                    message: response.data.message,
                })
            }
        },
		 goBack() {
            console.log(this.foreuns, 'this.foreun')
            if (this.foreun !== '0' && this.foreun != 1 && this.foreuns !== 0) {
				    this.$confirm('系统可能不会保存您所做的更改', {
					  confirmButtonText: '确定',
					  cancelButtonText: '取消',
				    }).then(() => {
						 window.history.go(-1)
				    }).catch(() => {
						
					  })   
            } else {
				 window.history.go(-1)
            }
		    },

        eventClose() {
            window.onbeforeunload = e => {
                e = e || window.event
				    // 兼容IE8和Firefox 4之前的版本
                if (this.foreun != 0 && this.foreun != 1 && this.foreuns !== 0) {
                    if (e) {
                        e.returnValue = '系统可能不会保存您所做的更改'
                        return '系统可能不会保存您所做的更改'
                    }
                }
				    // if (e) {
				    //   e.returnValue = '系统可能不会保存您所做的更改'
				    // }
				    // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
            }
        },
        hangleMenuTab(i) {
            if (this.menuIndex === i) { // 相同隐藏菜单
                this.rightContentStatus = !this.rightContentStatus
            } else {
                this.menuIndex = i
                this.rightContentStatus = true
            }
        },
        async restore() {
            let query = this.$route.query
            let id = query.id
            const response = await detail({ id })
            //  console.log(response, 'response1111')
			 if (response.data.success === true) {
                if (response.data.data.content === null) {
                    this.$store.commit('setComponentData', this.resetID(''))
                } else {
                    this.$store.commit('setComponentData', this.resetID(JSON.parse(response.data.data.content).content))
                }
			 }
        },
        resetID(data) {
            // console.log(data, 'data')
            if (data.length > 0) {
                data.forEach(item => {
                    item.id = generateID()
                })
                return data
            }
        },
        handleDrop(e) {
            // console.log('handleDrop', e)
            e.preventDefault()
            e.stopPropagation()
            const index = e.dataTransfer.getData('index')
            const element = e.dataTransfer.getData('component')
            const rectInfo = this.editor.getBoundingClientRect()
            if (index) {
                const component = deepCopy(componentList[index])
                if (['v-button', 'v-switch'].includes(element)) {
                    const { id, roleLevel, name } = this.rolesList[this.rolesList.length - 1]
                    component.auth = { id, roleLevel, name }
                }
                component.style.top = e.clientY - rectInfo.y
                component.style.left = e.clientX - rectInfo.x
                component.id = generateID()
                this.$store.commit('addComponent', { component })
                this.$store.commit('recordSnapshot')
            }
        },
        handleDragOver(e) {
            e.preventDefault()
            e.dataTransfer.dropEffect = 'copy'
        },
        handleMouseDown(e) {
            e.stopPropagation()
            this.$store.commit('setClickComponentStatus', false)
            this.$store.commit('setInEditorStatus', true)
        },
        deselectCurComponent(e) {
            if (!this.isClickComponent) {
                this.$store.commit('setCurComponent', { component: null, index: null })
            }
            // 0 左击 1 滚轮 2 右击
            if (e.button != 2) {
                this.$store.commit('hideContextMenu')
            }
        },
        async getStations() {
            const response = await getStations({ 
                ProjectId: this.projectId,
                PageNo: 1,
                PageSize: 200,
            })
            if (response.status === 200 && response.data.success) {
                let stations = response.data.data.rows
                if (stations.length > 0) {
                    // console.log(response)
                    const station = stations.find(item => item.id == this.stationId)
                    // console.log(station)
                    const canvasStyleData = {
                        width: station.width,
                        height: station.height,
                        scale: 100,
                    }
                    this.$store.commit('setCanvasStyle', canvasStyleData)
                }
            }
        },
    },
}
</script>

<style lang="scss">
.home {
    height: 100vh;
    background: #fff;
	width: 100%;
    main {
        height: calc(100% - 64px);
        position: relative;
        // display: flex;

        .left {
            position: absolute;
            height: 100%;
            width: 200px;
            left: 0;
            top: 0;
            padding-top: 10px;
        }

        .right {
            position: absolute;
            height: 100%;
            right: 0;
            top: 0;

            display: flex;
            
            .right-list {
                overflow: auto;
                min-width: 300px;
                // width: 300px;
                background: #fff;
                box-shadow: -5px 5px 7px 2px #f3e8e8;;
            }
            .right-menu {
                height: 100%;
                background-color: rgb(233 233 233);
                display: flex;
                flex-direction: column;

                span {
                    display: inline-block;
                    cursor: pointer;
                    writing-mode: vertical-lr;
                    padding: 10px 2px;
                    letter-spacing: 3px;
                }
                span:hover{
                    background-color: #d1d0d0;
                }
            }
        }
        .active {
            background-color: #BDBDBD;
        }

        .center {
            flex: 1;
            margin-left: 200px;
            // margin-right: 262px;
            background: #f5f5f5;
            height: 100%;
            overflow: auto;
            padding: 20px;

            .content {
                width: 100%;
                height: 100%;
                overflow: auto;
            }
        }
    }

    .placeholder {
        text-align: center;
        color: #333;
    }
}
</style>
