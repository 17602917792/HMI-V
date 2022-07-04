<template>
    <div>
        <!-- 事件的启用开关 -->
        <el-switch
            v-model="variableList.onOff"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="开"
            inactive-text="关"
        >
        </el-switch>
        <el-divider></el-divider>
        <w-textarea v-model="variableList.value" tag="wise" ref="testText" maxlength="100">
            <el-row type="flex" style="margin-top: 10px;">
                <el-col :span="18">
                    <el-cascader
                        style="width: 100%;"
                        v-model="selectValue"
                        :disabled="!variableList.onOff"
                        :options="options"
                        :props="customOption"
                    ></el-cascader>
                </el-col>
                <el-col style="margin-left: 10px;">
                    <el-button @click="handleInsertion">插入</el-button>
                </el-col>
            </el-row>
        </w-textarea>
        <el-divider></el-divider>
        <el-button @click="submit">确认</el-button>
    </div>
</template>

<script>
    import { getlistBysid } from '@/api/managementPage.js'
    import { mapState } from 'vuex'
    import { deepCopy } from '@/utils/utils'

    export default {
        components: {},
        props: {
            item: {
                type: Object,
                default: () => {},
            },
        },
        data() {
            return { 
                variableList: {
                    onOff: true, // 事件的开关
                    value: '', // alert内容
                },
                selectValue: [],
                options: [],
                    customOption: {
                    label: 'name', 
                    value: 'id',
                    children: 'children',
                    expandTrigger: 'click',
                    checkStrictly: false,
                },
            }
        },
        computed: {
            ...mapState([
                'curComponent',
            ]),
        },
        watch: {
            curComponent: {
                handler() {
                    if (this.curComponent.events[this.item.key]) {
                        this.variableList = deepCopy(this.curComponent.events[this.item.key])
                    } else {
                        this.variableList = { // 单变量绑定数据
                            onOff: true, // 事件的开关
                            value: '', // alert内容
                        }
                    }
                },
                immediate: true,
            }
        },
        mounted() {
            this.getlistBysid()
        },
        methods: {
            // 保存
            submit () {
                if( this.variableList.value == '') {
                    this.$message.warning('请输入内容')
                    return false
                }
                this.$store.commit('addEvent', {
                    event: this.item.key,
                    param: this.variableList,
                })
            },
            // 插入
            handleInsertion () {
                if (this.selectValue.length == 0) {
                    this.$message.warning('请选择需要插入的变量')
                    return false
                }
                let str = '';
                this.options.forEach( item => {
                    item.children.forEach( ele => {
                        if(ele.id == this.selectValue[1]) {
                            str = ele.name;
                        }
                    })
                })
                this.$refs.testText.addTag(`[${this.selectValue[1]}](${str})`)
            },
            // 级联选择器动态数据
            async getlistBysid() {
                const stationId = this.$route.query.stationId
                const response = await getlistBysid({
                    StationId: stationId,
                })
                if (response.status === 200 && response.data.success) {
                    let tempList = response.data.data
                    tempList.forEach(element => {
                        let obj = {
                            id: element.id, // plc的id
                            name: element.plcName, // plc的名称
                            children: [],
                        }
                        if (element.variables.length > 0) {
                            element.variables.forEach(item => {
                                obj.children.push({
                                    plcId: item.plcId,
                                    id: item.id, // 变量id
                                    name: item.variableName, // 变量名称
                                    variableType: item.variableType,
                                })
                            })
                        }
                        this.options.push(obj)
                    })
                } else {
                    this.$message({
                        type: 'warning',
                        message: response.data.message,
                    })
                }
            }
        }
    }
</script>
<style scoped>
    .el-divider--horizontal {
        margin: 10px 0;
    }
    >>>.w-textarea_tools {
        display: none;
    }
</style>
