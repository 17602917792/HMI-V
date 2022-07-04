<template>
    <div class="container">
        <div class="content">
            <div class="title">
                <p>PLC管理</p>
                <div v-if="$isHasAuth('PLC_ADD')" @click="hanleAddPlc">
                    <img src="../../assets/imgs/newAdd.svg" alt="">
                    <span>新建</span>
                </div>
            </div>

            <el-table
                :data="plcTableData"
                style="width: 100%;margin-bottom: 20px;"
                height="calc(100% - 134px)"
            >
                <el-table-column
                    prop="sort"
                    label="排序"
                    width="120"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ (pageIndex - 1) * pageSize + scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="plcName"
                    label="PLC名称"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.plcName }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="ip"
                    label="IP地址"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.ip }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="typeName"
                    label="类型"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.typeName }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="brand"
                    label="品牌"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.brand }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="brand"
                    label="型号"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.model }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="protocol"
                    label="通讯协议"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.protocol }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="desc"
                    label="描述"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.desc }}
                    </template>
                </el-table-column>
                
                <el-table-column
                    v-if="$isHasAuth('PLC_UPDATE') || $isHasAuth('PLC_DELETE')"
                    label="操作"
                    width="120"
                    align="center"
                >
                    <template slot-scope="scope">
                        <div class="oprateCell">
                            <span v-if="$isHasAuth('PLC_UPDATE')" class="oprateTable" @click="handleEdit(scope.$index, scope.row)"></span>
                            <span v-if="$isHasAuth('PLC_DELETE')" class="oprateTable" @click="handleDelete(scope.$index, scope.row)"></span>
                        </div>
                        <!-- <img src="../../assets/imgs/edit.svg" alt="">
                        <img src="../../assets/imgs/delete.svg" alt=""> -->
                    </template>
                </el-table-column>
            </el-table>
            <div>
                <el-pagination
                    background
                    layout="prev, pager, next, total"
                    :total="total"
                    :current-page.sync="pageIndex"
                    :page-size="pageSize"
                    :hide-on-single-page="singlePage"
                    @current-change="handleCurrentChange"
                >
                </el-pagination>
            </div>

            <!-- 添加PLC 对话框  start -->
            <el-dialog
                :visible.sync="DialogVisible"
                width="50%"
                :close-on-click-modal="closeModel"
                :before-close="handleClose"
            >   
                <template slot="title">
                    <div class="addDialog">
                        <img class="addImg" src="../../assets/imgs/xj.svg" alt="">
                        <span>{{ dialogTitle }}</span>
                    </div>
                </template>

                <el-form
                    ref="plcForm"
                    :label-position="labelPosition"
                    :rules="rulePlcForm"
                    label-width="80px"
                    :model="plcFromData"
                >
                    <el-form-item label="PLC名称" prop="plctName">
                        <el-input v-model="plcFromData.plctName"></el-input>
                    </el-form-item>
                    <el-form-item label="PLC地址" prop="PLC">
                        <!-- <el-input v-model="plcFromData.PLC"></el-input> -->
                        <kd-ip-input
                            v-model="plcFromData.PLC"
                            clearable
                            check-empty-on-blur
                            @blur="$refs.plcForm.validateField('PLC')"
                        />
                    </el-form-item>
                    <div class="wHR">
                        <el-form-item label="PLC类型" prop="plcType">  
                            <el-select
                                v-model="plcFromData.plcType"
                                placeholder="请选择PLC类型"
                                style="width:100%;"
                                @change="plcTypeChange"
                            >
                                <el-option
                                    v-for="item in plcTypeList"
                                    :key="item.id"
                                    :label="item.typeName"
                                    :value="item"
                                />
                            </el-select>
                            <!-- <el-input v-model="plcFromData.plcType"></el-input> -->
                        </el-form-item>
                        <el-form-item label="品牌" prop="plcBrand">
                            <el-input v-model="plcFromData.plcBrand" placeholder="根据选择的PLC类型自动带出" disabled></el-input>
                        </el-form-item>
                        <el-form-item v-if="dialogTitle === '编辑PLC'" label="型号">
                            <el-input v-model="plcFromData.model" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="通讯协议" prop="protocol">
                            <el-input v-model="plcFromData.protocol" placeholder="根据选择的PLC类型自动带出" disabled></el-input>
                        </el-form-item>
                    </div>
                    <template v-if="plcFromData.plcType != ''">
                        <div
                            v-for="(item,index) in plcKuozhanList"
                            :key="index"
                            class="kuozhanBox"
                        >
                            <el-form-item v-if="item.fieldType === '下拉框'" :label="item.fieldName">
                                <el-select
                                    v-model="item.value"
                                    placeholder="请选择"
                                    style="width:100%;"
                                    @change="plcKzChange($event,index)"
                                >
                                    <el-option
                                        v-for="(option,indexOption) in item.option.split('|')"
                                        :key="indexOption +'option'"
                                        :label="option"
                                        :value="option"
                                    />
                                </el-select>
                            </el-form-item>
                        
                            <el-form-item v-else :label="item.fieldName">
                                <el-input v-model="item.value" @input="handleInput($event,index)"></el-input>
                            </el-form-item>
                        </div>
                    </template>
                    
                    <el-form-item label="PLC描述" prop="describe">
                        <el-input
                            v-model="plcFromData.describe"
                            resize="none"
                            type="textarea"
                            class="iptTextarea"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleSubmit">确 定</el-button>
                    <el-button @click="handleClose">取 消</el-button>
                </span>
            </el-dialog>
            <!-- 添加PLC 对话框  end -->
        </div>
    </div>
</template>
<script>
import { getPlcInfo, getPlcType, addPlcInfo, deletePlc, updatePlcInfo } from '../../api/plc'
import { getPlctypeConfig } from '../../api/plctype'

export default {
    data() {
        return {
            closeModel: false,
            plcTableData: [],
            total: 1,
            pageIndex: 1,
            pageSize: 10,
            singlePage: false,
            stationId: this.$route.query.stationId,
            DialogVisible: false,
            dialogTitle: '新建PLC',
            labelPosition: 'top',
            plcFromData: {
                plctName: '',
                PLC: '',
                plcType: '',
                plcBrand: '',
                protocol: '',
                describe: '',
                model: '',
            },
            rulePlcForm: {
                plctName: [
                    { required: true, message: '请输入PLC名称', trigger: 'blur' },
                ],
                PLC: [
                    { required: true, message: '请输入PLC地址', trigger: 'blur' },
                ],
                plcType: [
                    { required: true, message: '请选择PLC类型', trigger: 'blur' },
                ],
                plcBrand: [
                    { required: true, message: '请输入PLC品牌', trigger: 'blur' },
                ],
                protocol: [
                    { required: true, message: '请输入PLC通迅协议', trigger: 'blur' },
                ],
                describe: [
                    // { required: true, message: '请输入PLC描述', trigger: 'blur' },
                ],
            },
            plcTypeId: '',
            plcTypeList: [],
            updateObj: {},
            plcKuozhanList: [], // 扩展字段集合
            kuoZhanForm: {},
        }
    },
    created() {
        this.getPlcPages()
        // console.log(this.stationId)
    },
    methods: {
        plcKzChange(val, index) {
            // console.log(val)
            // console.log(index)

            // this.plcKuozhanList[index].value = val
            // this.$forceUpdate()   // 此方法性能不好

            let item = this.plcKuozhanList[index] // 取到 index 位置的对象
            item.value = val // 更新这个对象的 value 属性
            this.$set(this.plcKuozhanList, index, item) // 更新 index 位置的对象值
        },
        handleInput(val, index) {
            let item = this.plcKuozhanList[index] 
            item.value = val 
            this.$set(this.plcKuozhanList, index, item) 
        },
        handleDelete(index, plcObj) {
            this.$confirm('此操作将删除这条数据, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                const response = await deletePlc({ id: plcObj.id })
                // console.log(response)
                if (response.status === 200 && response.data.success) {
                    this.getPlcPages()
                    this.$message({
                        type: 'success',
                        message: '删除成功!',
                    })
                } else {
                    this.$message({
                        type: 'warning',
                        message: '删除失败：' + JSON.stringify(response.data.message),
                    })
                }
            }).catch((err) => {
                if (err !== 'cancel') {
                    return this.$message.error('删除失败！')
                }
                this.$message({
                    type: 'info',
                    message: '已取消删除',
                })
            })
        },
        handleEdit(index, plcObj) {
            this.dialogTitle = '编辑PLC'
            // this.DialogVisible = true
            this.getPlcTypeList()
            this.updateObj = plcObj

            // console.log(plcObj)
            this.plcKuozhanList = JSON.parse(plcObj.fields) // 扩展字段集合

            this.plcTypeId = plcObj.typeId
            this.plcFromData.plctName = plcObj.plcName
            this.plcFromData.PLC = plcObj.ip
            this.plcFromData.describe = plcObj.desc
            this.plcFromData.protocol = plcObj.protocol
            this.plcFromData.plcBrand = plcObj.brand   
            this.plcFromData.plcType = plcObj.typeName
            this.plcFromData.model = plcObj.model
        },
        handleSubmit() {
            this.$refs.plcForm.validate(async valid => {
                if (valid) {
                    let response
                    if (this.dialogTitle === '新建PLC') {
                        response = await addPlcInfo({
                            fields: JSON.stringify(this.plcKuozhanList),
                            stationId: this.stationId,
                            typeId: this.plcTypeId,
                            PlcName: this.plcFromData.plctName,
                            ip: this.plcFromData.PLC,
                            desc: this.plcFromData.describe,
                        })
                        // console.log(response)
                    } else {
                        response = await updatePlcInfo({
                            fields: JSON.stringify(this.plcKuozhanList),
                            id: this.updateObj.id,
                            typeId: this.plcTypeId,
                            PlcName: this.plcFromData.plctName,
                            ip: this.plcFromData.PLC,
                            desc: this.plcFromData.describe,
                        })
                        // console.log(response)
                    }
                    if (response.status === 200 && response.data.success) {
                        this.handleClose()
                        this.$message({
                            type: 'success',
                            message: this.dialogTitle + '成功!',
                        })
                        // 更新界面
                        this.getPlcPages()
                    } else {
                        this.$message({
                            type: 'warning',
                            message: this.dialogTitle + '失败：' + JSON.stringify(response.data.message),
                        })
                    }
                }
            })
        },
        handleCurrentChange(val) {
            this.pageIndex = val
            this.getPlcPages()
        },
        handleClose() {
            this.DialogVisible = false
            this.plcFromData.plctName = ''
            this.plcFromData.PLC = ''
            this.plcFromData.plcType = ''
            this.plcFromData.plcBrand = ''
            this.plcFromData.protocol = ''
            this.plcFromData.describe = ''
            this.plcFromData.model = ''
            this.updateObj = {}

            this.plcTypeId = ''
            this.plcTypeList = []

            this.$refs.plcForm.clearValidate()

            this.plcKuozhanList = []
        },
        hanleAddPlc() {
            this.dialogTitle = '新建PLC'
            this.getPlcTypeList()
        },
        plcTypeChange(val) {
            this.plcType = val
            this.plcTypeId = val.id
            this.plcFromData.plcBrand = val.brand
            this.plcFromData.protocol = val.protocol
            this.plcFromData.plcType = val.typeName

            this.getPlctypeConfig() // 获取扩展字段接口
        },
        async getPlctypeConfig() {
            const response = await getPlctypeConfig({
                PlcTypeId: this.plcType.id,
            })
            console.log(response)
            if (response.status === 200 && response.data.success) {
                this.plcKuozhanList = response.data.data
                // console.log(this.plcKuozhanList)
                this.plcKuozhanList.forEach(item => {
                    item.value = ''
                })

                // console.log(this.plcKuozhanList)
            }
        },
        async getPlcPages() {
            const response = await getPlcInfo({
                StationId: this.$route.query.stationId,
                PageNo: this.pageIndex,
                PageSize: this.pageSize,
            })
            // console.log(response)
            if (response.status === 200) {
                if (response.data.success) {
                    this.plcTableData = response.data.data.rows
                    this.total = response.data.data.totalRows
                    // this.pageIndex = 1
                } else {
                    this.$message({
                        type: 'warning',
                        message: JSON.stringify(response.data.message),
                    })
                }
            }
        },
        async getPlcTypeList() {
            const response = await getPlcType()
            // console.log(response)
            if (response.status === 200) {
                if (response.data.success) {
                    this.DialogVisible = true
                    this.plcTypeList = response.data.data.rows
                } else {
                    this.$message({
                        type: 'warning',
                        message: JSON.stringify(response.data.message),
                    })
                }
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.container {
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 15px 20px 25px;
    overflow: hidden;
    .content {
        position: relative;
        width: 100%;
        height: calc(100% - 132px);
        padding: 0px 20px 20px 15px;
        background-color: #ffffff;
        border-radius: 5px;
        border: solid 1px #f1f2f7;
        overflow-x: hidden;
        overflow-y: auto;
        .title {
            position: relative;
            width: 100%;
            line-height: 40px;
            margin-bottom: 30px;
            p {
                height: 52px;
                line-height: 52px;
                font-size: 20px;
                font-weight: bold;
                letter-spacing: 0px;
                color: #303030;
            }
            div {
                position: absolute;
                top: 20px;
                right: 0;
                width: 127px;
                height: 40px;
                background-color: #285ad8;
                border-radius: 5px;
                line-height: 40px;
                text-align: center;
                cursor: pointer;
                img {
                    width: 24px;
                    height: 24px;
                    margin-top: -5px;
                    vertical-align: middle;
                }
                span {
                    margin-left: 10px;
                    font-size: 16px;
                    color: #ffffff;
                    font-weight: none;
                }
            }
        } 
        .pageBox {
            position: absolute;
            left: 10px;
            bottom: 10px;
        }
    }

    /* 新建工位屏 对话框  start */
    .addDialog .addImg {
        width: 20px;
        height: 20px;
        margin-top: -5px;
        vertical-align: middle;
    }
    .addDialog span {
        margin-left: 15px;
        font-size: 18px;
        color: #3c557a;
    }
    .iptTextarea {
        width: 100%;
        height: 80px;
    }
    .wHR {
        display: flex;
        width: 100%;
    }
    .oprateCell{
        width: 100%;
        text-align: center;
        padding-left: 25px;
    }
    .oprateTable{
        float: left;
        margin: 0 auto;
    }
    .oprateTable:first-child {
        width: 16px;
        height: 16px;
        margin-right: 20px;
        background: url('../../assets/imgs/editBlack.svg') no-repeat;
        background-size: 100%;
    }
    .oprateTable:first-child:hover {
         width: 16px;
         height: 16px;
        background: url('../../assets/imgs/editBlue.svg') no-repeat;
        background-size: 100%;
    }
    .oprateTable:last-child {
        width: 15px;
        height: 19px;
        background: url('../../assets/imgs/deleteBlack.svg') no-repeat;
        background-size: 100%;
    }
    .oprateTable:last-child:hover {
        width: 15px;
        height: 19px;
        background: url('../../assets/imgs/sdeleteBule.svg') no-repeat;
        background-size: 100%;
    }
    
    /* 新建工位屏 对话框  end */
}

</style>
<style scoped>
.wHR >>> .el-form-item__content {
        margin-right: 20px;
}
.wHR >>> .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    flex: 1;
}
.container >>> .el-dialog__header {
    padding: 20px 30px 0px;
}
.container >>> .el-dialog__body {
    padding: 15px 30px 5px;
}
.container >>> .el-form-item__label{
    font-size: 18px;
    color: #3c557a;
}
.container >>> .el-input__inner {
    border: 1px solid  #c4c4c4;
    border-radius: 0px;
}
.container >>> .el-input--small .el-input__inner {
    height: 40px;
    line-height: 40px;
}
.container >>> .el-textarea__inner {
    height: 80px;
}
.el-button {
    padding: 10px 40px;
    font-size: 18px;
    background: #285ad8;
    border-radius: 5px 5px 5px 5px;
    color: #ffffff;
}
.container >>> .el-dialog__footer {
    padding: 0 0 20px;
    text-align: center;
}
.el-button+.el-button  {
    margin-left: 20px;
}
.container >>> .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before {
    content: '';
    /* content: '*'; */
    /* color: #F56C6C; */
    /* margin-right: 4px; */
}
.container >>> .kd-ip-input-group .kd-ip-input-group__input-ul {
    height: 40px;
    border-radius: 0px;
    border:1px solid #c4c4c4;
}
</style>