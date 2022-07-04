<template>
    <el-row class="variable-row">
        <el-col :span="10">
            <div class="grid-content bg-purple">
                <el-cascader
                    v-model="selectValue"
                    :options="options"
                    :props="customOption"
                    @change="handleChange"
                ></el-cascader>
            </div>
        </el-col>
        <el-col :span="9">
            <div class="grid-content bg-purple-light" style="margin-left:5px;">
                <el-input v-model="numValue" placeholder="请输入数字" @change="isDisable = false"></el-input>
            </div>
        </el-col>
        <el-col :span="3">
            <div class="grid-content bg-purple-light" style="margin-left:5px;">
                <el-color-picker
                    v-model="color"
                    show-alpha
                    :predefine="predefineColors"
                    @change="isDisable = false"
                >
                </el-color-picker>
            </div>
        </el-col>
        <el-col :span="2">
            <div class="grid-content bg-purple-light" style="margin-left:5px;">
                <el-button
                    type="success"
                    icon="el-icon-check"
                    circle
                    :disabled="isDisable"
                    @click="submit"
                ></el-button>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import { getlistBysid } from '@/api/managementPage.js'
import { v4 } from 'uuid'

export default {
    data() {
        return {
            uuid: '', // 当前组件的唯一标识
            isDisable: false,
            color: '#285ad8',
            numValue: '',
            selectValue: [],
            options: [],
            customOption: {
                label: 'name', 
                value: 'id',
                children: 'children',
                expandTrigger: 'click',
                checkStrictly: false,
            },
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
                    type: '=',
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
        }
    },
    created() {
        this.getlistBysid()
        this.uuid = v4()
    },
    methods: {
        submit() {
            if (this.numValue == '') {
                this.$message({
                    type: 'warning',
                    message: '请输入数字',
                })
            }
            if (this.color == '') {
                this.$message({
                    type: 'warning',
                    message: '请选择颜色',
                })
            }
            if (this.selectValue.length === 0) {
                this.$message({
                    type: 'warning',
                    message: '请选择变量',
                })
            }

            if (this.numValue != '' && this.color != '' && this.selectValue.length > 0) {
                const condtionObj = this.rangeList.find((item) => item.id === parseInt(this.selectValue[2]))
                let subObj = {
                    // plcId: this.selectValue[0],
                    variableId: this.selectValue[1],
                    condition: condtionObj.type,
                    contionValue: this.numValue,
                    color: this.color,
                    uuid: this.uuid,
                }
                // console.log(subObj)
                this.$emit('submit-variable', subObj)
                this.isDisable = true
            }
        },
        handleChange(val) {
            this.isDisable = false
            this.selectValue = val
            // console.log(val)
        },
        async getlistBysid() {
            const stationId = this.$route.query.stationId
            const response = await getlistBysid({
                StationId: stationId,
            })
            if (response.status === 200 && response.data.success) {
                // this.options = response.data.data
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
                                children: this.rangeList,
                            })
                        })
                    }
                    this.options.push(obj)
                })
                // console.log(this.options)
            } else {
                this.$message({
                    type: 'warning',
                    message: JSON.stringify(response.data.message),
                })
            }
        },
    },

}
</script>

<style>
</style>
