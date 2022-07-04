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
        <!-- 多变量  start -->
        <el-row v-if="variableList.list.length > 0" type="flex" style="margin-bottom: 5px;">
            <el-col :span="10"><div style="width: 100%;text-align: center;">变量</div></el-col>
            <!-- <el-col :span="4"><div style="width: 100%;text-align: center;margin-left: 5px;">条件</div></el-col> -->
            <el-col :span="10"><div style="width: 100%;text-align: center;">值</div></el-col>
            <!-- <el-col :span="2"><div style="width: 100%;text-align: center;">颜色</div></el-col> -->
            <el-col :span="4"><div style="width: 100%;text-align: center;">操作</div></el-col>
        </el-row>
        
        <el-form
            ref="variableList"
            :model="variableList"
            inline
        >
            <el-row
                v-for="(col,index) in variableList.list"
                :key="index"
                class="variable-row"
                type="flex"
            >
                <el-col :span="10">
                    <div class="grid-content bg-purple">
                        <el-cascader
                            v-model="col.selectValue"
                            :disabled="!variableList.onOff"
                            :options="options"
                            :props="customOption"
                            style="width:100%;"
                            @change="handleChange(col,index)"
                        ></el-cascader>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="grid-content bg-purple-light" style="margin-left:10px;">
                        <!-- :rules="[{ required: true, message: '请输入姓名', trigger: 'blur'}]" -->
                        <el-form-item
                            label=""
                            style="width: 100%;" 
                            :prop="'list.'+ index +'.conditionValue'"
                            :rules="[{required: true, validator: checkAge, trigger: 'blur'}]"
                        >
                            <el-input
                                v-model.trim="col.conditionValue"
                                style="width: 100%;"
                                placeholder="数字"
                                :disabled="!variableList.onOff"
                            ></el-input>
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="4" style="text-align: center;font-size:18px;">
                    <i
                        v-if="variableList.onOff"
                        class="el-icon-delete"
                        :disabled="!variableList.onOff"
                        @click="deleteCondition(col, index)"
                    ></i>
                </el-col>
            </el-row>
        </el-form>
        <!-- 多变量 end -->
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
        let checkAge = (rule, value, callback) => {
            let index = rule.field.slice(5, 6)
            // console.log('下标', index, '值', value, (value == 1 || value == 0))
            let colType = this.variableList.list[index].variableType
            if (Object.keys(colType).length == 0) return callback(new Error('请选择变量'))
            let { variableType, length } = colType
            // if (!value) return callback(new Error(`请输入${variableType}类型`))
            if (variableType == 'string') {
                if (!value) return callback(new Error(`请输入string类型长度不超过${length - 2}位`))
                if (value.length > (length - 2)) return callback(new Error(`请输入string类型长度不超过${length - 2}位`))
            } else if (variableType == 'byte') {
                let reg = /^[+-]?\d*\.?\d*$/
                if (!value) return callback(new Error('请输入-128到255之间的数字1'))
                if (!reg.test(value)) return callback(new Error('请输入-请输入-128到255之间的数字2'))
                if (parseInt(value) > 255 || parseInt(value) < -128) return callback(new Error('请输入-128到255之间的数字3'))
            } else if (variableType == 'char') {
                let reg = /[^a-zA-Z]/g
                if (!value) return callback(new Error('请输入a-z之间的单个字符'))
                if (reg.test(value) || value.length > 1) return callback(new Error('请输入a-z之间的单个字符'))
            } else if (variableType == 'bool') {
                let reg = /^(0|1){1}$/g
                if (!value) return callback(new Error('请输入0或者1'))
                if (!reg.test(value)) return callback(new Error('请输入0或者1'))
            } else if (['int', 'word'].includes(variableType)) {
                let reg = /^[+-]?\d*\.?\d*$/
                if (!value) return callback(new Error('请输入-32768到+32767之间得数字'))
                if (!reg.test(value)) return callback(new Error('请输入-32768到+32767之间得数字'))
                if (parseInt(value) > 32767 || parseInt(value) < -32768) return callback(new Error('请输入-32768到+32767之间得数字'))
            } else if (['dint', 'dword'].includes(variableType)) {
                let reg = /^[+-]?\d*\.?\d*$/
                if (!value) return callback(new Error('请输入-2147483648到2147483647之间得数字'))
                if (!reg.test(value)) return callback(new Error('请输入-2147483648到2147483647之间得数字'))
                if (parseInt(value) > 2147483647 || parseInt(value) < -2147483648) return callback(new Error('请输入-2147483648到2147483647之间得数字'))
            } else if (variableType == 'real') {
                let reg = /[^\d]/g
                if (!value) return callback(new Error('请输入数字'))
                if (reg.test(value)) return callback(new Error('请输入数字'))
            }
            callback()
        }
        return { 
            variableList: { // 多变量绑定数据
                onOff: true,
                selectValue: [],
                variable: {},
                list: [],
            },
            checkAge,
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
                } else {
                    this.variableList = { // 多变量绑定数据
                        onOff: true, // 事件的开关
                        selectValue: [], // 变量绑定的值  以供数据反显
                        variable: {}, // 级联选中的值, 拿到大于小于那些数据
                        list: [], // 多条件绑定的值
                    }
                }
            },
            immediate: true,
        },
    },
    mounted() {
        this.getlistBysid()
    },
    methods: {
        submit() {
            if (this.variableList.list.length == 0) {
                this.$store.commit('addEvent', { 
                    event: this.item.key,
                    param: this.variableList,
                })
                return false
            }
            this.$refs.variableList.validate((valid) => {
                if (valid) {
                    // this.variableList.list = this.variableList.list.map(item => {
                    //     if (['bool', 'byte', 'int', 'word', 'dint', 'dword', 'real'].includes(item.variableType.variableType)) {
                    //         item.conditionValue = parseInt(item.conditionValue)
                    //     }
                    //     return item
                    // })
                    // if (this.variableList.list.length > 0) {
                    this.$store.commit('addEvent', { 
                        event: this.item.key,
                        param: this.variableList,
                    })
                    // } else {
                    //     this.$message({
                    //         type: 'warning',
                    //         message: '请添加数据~',
                    //     })
                    // }
                }
            })
        },
        handleChange(col, index) {
            let item = this.variableList.list[index] 
            item.selectValue = col.selectValue 
            item.variableId = item.selectValue[1]

            this.options.forEach(ele => {
                if (ele.id == col.selectValue[0]) {
                    ele.children.forEach(child => {
                        if (child.id == col.selectValue[1]) {
                            item.variableType = child
                        }
                    })
                }
            })
            this.$set(this.variableList.list, index, item) 
        },
        deleteCondition(col, index) {
            this.variableList.list.splice(index, 1)
        },
        addCondition() {
            this.variableList.list.push(
                {
                    selectValue: [], 
                    conditionValue: '', // 设置值
                    variableId: '',
                    variableType: {},
                },
            )
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
                                length: item.length,
                                // children: this.rangeList,
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
    },
}
</script>
<style scoped>
    >>>.el-form-item__content {
        width: 100%;
    }
</style>
