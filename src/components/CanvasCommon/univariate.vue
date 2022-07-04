<template>
    <div>
        <!-- 事件的启用开关 -->
        <el-switch
            v-model="variableList.onOff"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="开启"
            inactive-text="禁用"
        >
        </el-switch>
        <el-divider></el-divider>
        <el-button :disabled="!variableList.onOff" @click="addCondition">添加</el-button>
        <el-divider></el-divider>
        <el-row class="variable-row header" style="text-align: center;" type="flex">
            <el-col v-if="variableList.list.length !=0" :span="6" style="min-width: 170px;"> 变量 </el-col>
            <el-col :span="18" style="margin-left: 5px;">
                <el-row
                    v-if="variableList.list.length !=0"
                    type="flex"
                    class="colList"
                    style="align-items: center;text-align: center;"
                >
                    <el-col :span="6" style="padding-right: 5px;">条件</el-col>
                    <el-col :span="5" style="padding-right: 5px;min-width: 170px;">数字</el-col>
                    <el-col v-if="elementType === 'text'" :span="8">文本内容</el-col>
                    <el-col v-if=" elementType === 'onOff'" :span="8">状态</el-col>
                    <el-col v-if=" elementType === 'img'" :span="11">路径</el-col>
                    <el-col v-if="colorStatus" :span="3">颜色</el-col>
                    <el-col :span="3" style="text-align: center;">操作</el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row class="variable-row" type="flex">
            <el-col :span="6">
                <div class="grid-content bg-purple" style="min-width: 170px;">
                    <el-cascader
                        v-if="variableList.list.length !=0"
                        v-model="variableList.selectValue"
                        :disabled="!variableList.onOff"
                        :options="options"
                        :props="customOption"
                        @change="handleChange"
                    ></el-cascader>
                </div>
            </el-col>
            <el-col :span="18" style="margin-left: 5px;">
                <el-row
                    v-for="(col,index) in variableList.list"
                    :key="index"
                    type="flex"
                    class="colList"
                    style="align-items: center;text-align: center;"
                >
                    <el-col :span="6" style="padding-right: 5px;">
                        <el-select v-model="col.condition" :disabled="!variableList.onOff" placeholder="请选择条件">
                            <el-option
                                v-for="src in rangeList"
                                :key="src.id"
                                :label="src.name"
                                :value="src.type"
                            >
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5" style="padding-right: 5px;min-width: 170px;">
                        <el-input
                            v-model="col.contionValue"
                            oninput="value=value.replace(/[^0-9]/g,'')"
                            :disabled="!variableList.onOff"
                            placeholder="请输入数字"
                        ></el-input>
                    </el-col>
                    <el-col v-if="elementType === 'text'" :span="8">
                        <el-input v-model="col.text" :disabled="!variableList.onOff" placeholder="请输入文本内容"></el-input>
                    </el-col>
                    <el-col v-if=" elementType === 'onOff'" :span="8">
                        <el-select v-model="col.status" :disabled="!variableList.onOff" placeholder="请选择开关状态">
                            <el-option
                                v-for="switchs in switchList"
                                :key="switchs.value"
                                :label="switchs.label"
                                :value="switchs.value"
                            >
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col v-if=" elementType === 'img'" :span="11">
                        <el-select v-model="col.src" :disabled="!variableList.onOff" placeholder="请设置图片路径">
                            <el-option
                                v-for="src in imgList"
                                :key="src.id"
                                :label="src.imageName"
                                :value="src.path"
                            >
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col v-if="colorStatus" :span="3">
                        <el-color-picker
                            v-model="col.color"
                            :disabled="!variableList.onOff"
                            style="margin-top: 5px;"
                            show-alpha
                            :predefine="predefineColors"
                        >
                        </el-color-picker>
                    </el-col>
                    <el-col :span="3" style="text-align: center;">
                        <i class="el-icon-delete" @click="deleteCondition(index)"></i>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-button @click="submit">确认</el-button>
    </div>
</template>

<script>
import { getlistBysid } from '@/api/managementPage.js'
import { mapState } from 'vuex'
import { deepCopy } from '@/utils/utils'
import { getGalleryPage } from '@/api/picture'

export default {
    props: {
        item: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            variableList: { // 单变量绑定数据
                onOff: true,
                selectValue: [],
                list: [],
            },
            // 设置开关状态列表
            switchList: [
                {
                    value: true,
                    label: '开启',
                },
                {
                    value: false,
                    label: '关闭',
                },
            ],
            // 设置图片的列表
            imgList: [
                // {
                //     value: 'https://t7.baidu.com/it/u=1595072465,3644073269&fm=193&f=GIF',
                //     label: '图片1',
                // },
                // {
                //     value: 'https://t7.baidu.com/it/u=1956604245,3662848045&fm=193&f=GIF',
                //     label: '图片2',
                // },
            ],
            elementType: '', // todo 定义一个变量 用来判断元素具体展示那些内容  有的元素只能设置颜色 有的可以设置文本 颜色 
            colorStatus: '', // 设置颜色是否展示 

            // ---------- chen
            options: [],
            customOption: {
                label: 'name', 
                value: 'id',
                children: 'children',
                expandTrigger: 'click',
                checkStrictly: false,
            },
            rangeList: [
                {
                    id: 0,
                    name: '大于',
                    type: '>',
                },
                {
                    id: 1,
                    name: '小于',
                    type: '<',
                },
                {
                    id: 2,
                    name: '等于',
                    type: '==',
                },
                {
                    id: 3,
                    name: '大于等于',
                    type: '>=',
                },
                {
                    id: 4,
                    name: '小于等于',
                    type: '<=',
                },
                {
                    id: 5,
                    name: '不等于',
                    type: '!=',
                },
            ],
            // 颜色选择器
            predefineColors: [
                '#285ad8',
                '#ff4500',
                '#ff8c00',
                '#ffd700',
                '#90ee90',
                '#00ced1',
                '#1e90ff',
                '#c71585',
                'rgba(255, 69, 0, 0.68)',
                'rgb(255, 120, 0)',
                'hsv(51, 100, 98)',
                'hsva(120, 40, 94, 0.5)',
                'hsl(181, 100%, 37%)',
                'hsla(209, 100%, 56%, 0.73)',
                '#c7158577',
            ],
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
                    // console.log(this.variableList, 'this.variableList', this.curComponent.events[this.item.key])
                } else {
                    this.variableList = { // 单变量绑定数据
                        onOff: true, // 事件的开关
                        // type: this.item.type, // 事件的类型
                        selectValue: [], // 变量绑定的值  以供数据反显
                        list: [], // 多条件绑定的值
                    }
                }
                //! 设置元素展示的内容
                let { component } = this.curComponent
                if (component === 'v-text' || component === 'v-button') { // 可以设置颜色 和 文字
                    this.elementType = 'text'
                } else if (component === 'v-switch') { // 可以设置开关状态  和 颜色
                    this.elementType = 'onOff'
                } else if (component === 'Picture') {
                    this.elementType = 'img'
                } else {
                    this.elementType = ''
                }

                //! 设置颜色的判断条件
                if (component === 'Picture') {
                    this.colorStatus = false
                } else {
                    this.colorStatus = true
                }
            },
            immediate: true,
        },
    },
    mounted() {
        this.getlistBysid()
        this.getGalleryPage()
    },
    methods: {
        // 确认新增单变量事件
        submit() {
            let { selectValue, list } = this.variableList
            if (selectValue.length === 0 || list.length === 0) {
                this.$message({
                    type: 'warning',
                    message: '请选择变量及条件',
                })
                return false
            }
            list.forEach(item => {
                item.variableId = selectValue[1]
            })
            this.$store.commit('addEvent', { 
                event: this.item.key,
                param: this.variableList,
            })
        },
        // 添加条件
        addCondition() {
            this.variableList.list.push(
                {
                    condition: '', // 条件
                    contionValue: '', // 判断的值
                    text: '', // 设置文本内容
                    color: '#285ad8', // 设置颜色
                    status: '', // 设置开关状态
                    src: '', // 设置图片路径
                },
            )
        },
        // 删除单条条件
        deleteCondition(i) {
            this.variableList.list.splice(i, 1)
        },
        // 级联选择器 选中赋值
        handleChange(val) {
            console.log(val)
            this.variableList.selectValue = val
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
        },
        async getGalleryPage() {
            const StationId = this.$route.query.stationId
            const response = await getGalleryPage({
                PageNo: 1,
                PageSize: 1000,
                StationId,
            })
            if (response.status === 200 && response.data.success) {
                this.imgList = response.data.data.rows
            } else {
                this.$message({
                    type: 'warning',
                    message: response.data.message,
                })
            }
        },
    },
}
</script>
<style lang="scss" scoped>
    .variable-row {
        align-items: center;
    }
    .el-divider--horizontal {
        margin: 10px 0;
    }
    .colList:not(:first-child) {
        margin-top: 5px;
    }
</style>
