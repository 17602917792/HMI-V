<template>
    <div class="container">
        <!-- <page-tools>
            <template #left>
                <span>总记录数: {{ total }} 条</span>
            </template>

            <template #right>
                <el-button type="primary" size="small" @click="handleAddPlc">新增PLC类型</el-button>
            </template>
        </page-tools> -->
       
        <div class="content">
            <div class="title">
                <p>PLC类型管理</p>
                <div v-if="$isHasAuth('PLCTYPE_ADD')" @click="handleAddPlc">
                    <img src="../assets/imgs/newAdd.svg" alt="">
                    <span>新建</span>
                </div>
            </div>
            <el-table
                :data="plcTypeList"
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
                    prop="brand"
                    label="品牌"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.brand }}
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
                    label="型号"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.model }}
                    </template>
                </el-table-column>
                
                <el-table-column
                    v-if="$isHasAuth('PLCTYPE_EXPAND') || $isHasAuth('PLCTYPE_UPDATE') || $isHasAuth('PLCTYPE_DELETE')"
                    label="操作"
                    width="140"
                    align="center"
                >
                    <template slot-scope="scope">
                        <div class="oprateCell">
                            <span v-if="$isHasAuth('PLCTYPE_EXPAND')" class="oprateTable" @click="handleExtend(scope.$index, scope.row)">扩展</span>
                            <span v-if="$isHasAuth('PLCTYPE_UPDATE')" class="oprateTable" @click="handleEdit(scope.$index, scope.row)"></span>
                            <span v-if="$isHasAuth('PLCTYPE_DELETE')" class="oprateTable" @click="handleDelete(scope.$index, scope.row)"></span>
                        </div>
                        <!-- <img src="../../assets/imgs/edit.svg" alt="">
                        <img src="../../assets/imgs/delete.svg" alt=""> -->
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <div>
                <el-pagination
                    background
                    layout="prev, pager, next, total"
                    :total="total"
                    :current-page="pageIndex"
                    :page-size="pageSize"
                    :hide-on-single-page="singlePage"
                    @current-change="handleCurrentChange"
                >
                </el-pagination>
            </div>

            <!-- PLC类型 对话框  start -->
            <el-dialog
                :visible.sync="DialogVisible"
                width="50%"
                :close-on-click-modal="closeModel"
                :before-close="handleClose"
            >   
                <template slot="title">
                    <div class="addDialog">
                        <img class="addImg" src="../assets/imgs/xj.svg" alt="">
                        <span>{{ dialogTitle }}</span>
                    </div>
                </template>

                <el-form
                    ref="plctypeForm"
                    :label-position="labelPosition"
                    :rules="rulePlcForm"
                    label-width="80px"
                    :model="plcFromData"
                >
                    <el-form-item label="品牌" prop="brand">
                        <el-input v-model="plcFromData.brand"></el-input>
                    </el-form-item>
                    <el-form-item label="型号" prop="model">
                        <el-input v-model="plcFromData.model"></el-input>
                    </el-form-item>
                    <el-form-item label="PLC类型" prop="typeName">
                        <el-input v-model="plcFromData.typeName"></el-input>
                    </el-form-item>
                    <el-form-item label="PLC通讯协议" prop="protocol">
                        <el-input v-model="plcFromData.protocol"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" class="oprateBtn" @click="handleSubmit">确 定</el-button>
                    <el-button class="oprateBtn" @click="handleClose">取 消</el-button>
                </span>
            </el-dialog>
            <!-- PLC类型 对话框  end -->

            <!-- 扩展字段 对话框 start -->
            <el-dialog
                title="扩展字段"
                width="60%"
                :close-on-click-modal="closeModel"
                :visible.sync="extendVisiable"
                :before-close="handleCloseExtend"
            >
                <el-button
                    type="primary"
                    size="small"
                    style="margin-bottom: 10px;"
                    @click="addExtend"
                >
                    新增扩展字段
                </el-button>
                <el-table :data="extendList">
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
                    <el-table-column property="date" label="表单项名称" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.fieldName }}
                        </template>
                    </el-table-column>
                    <el-table-column property="date" label="表单项key" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.key }}
                        </template>
                    </el-table-column>
                    <el-table-column property="name" label="表单项类型" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.fieldType }}
                        </template>
                    </el-table-column>
                    <el-table-column property="address" label="选项" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.option }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作"
                        width="120"
                    >
                        <template slot-scope="scope">
                            <div class="oprateCell">
                                <span class="oprateTableInner" @click="handleExtendEdit(scope.row)"></span>
                                <span class="oprateTableInner" @click="handleExtendDelete(scope.row)"></span>
                            </div>
                            <!-- <el-button type="text" size="small" @click="handleExtendEdit(scope.row)">编辑</el-button>
                            <el-button type="text" size="small" @click="handleExtendDelete(scope.row)">删除</el-button> -->
                        </template>
                    </el-table-column>
                    <el-dialog
                        width="35%"
                        title="内层 Dialog"
                        :visible.sync="innerVisible"
                        append-to-body
                        class="extendStyle"
                        :close-on-click-modal="closeModel"
                        :before-close="handleCloseExtendInner"
                    >   
                        <template slot="title">
                            <div class="addDialog">
                                <img class="addImg" src="../assets/imgs/xj.svg" alt="">
                                <span>{{ extendDialogTitle }}</span>
                            </div>
                        </template>
                        <el-form
                            ref="extendForm"
                            :label-position="labelPosition"
                            :rules="ruleExtendForm"
                            label-width="80px"
                            :model="extendForm"
                        >
                            <el-form-item label="表单项名称" prop="fieldName">
                                <el-input v-model="extendForm.fieldName"></el-input>
                            </el-form-item>
                            <el-form-item label="key" prop="key">
                                <el-input v-model="extendForm.key"></el-input>
                            </el-form-item>
                            <el-form-item label="表单项类型" prop="fieldType">
                                <el-select
                                    v-model="extendForm.fieldType"
                                    placeholder="请选择类型"
                                    style="width:100%;"
                                    @change="feildTypeChange"
                                >
                                    <el-option
                                        v-for="(item,index) in fieldTypeList"
                                        :key="index"
                                        :label="item"
                                        :value="item"
                                    />
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="extendForm.fieldType === '下拉框'" label="选项" prop="option">
                                <el-input v-model="extendForm.option" placeholder="示例：选项A|选项B|选项C（ 注意：| 分割线隔开 ）"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="handleSubmitExtend">确 定</el-button>
                            <el-button @click="handleCloseExtendInner">取 消</el-button>
                        </span>
                    </el-dialog>
                </el-table>
            </el-dialog>
            <!-- 扩展字段 对话框 end -->
        </div>
    </div>
</template>
<script>
// import PageTools from '../components/PageTools/index.vue'
import { 
    getPlcTypePages, 
    deletePlcType, 
    addPlcType, 
    updatePlcType, 
    getPlctypeConfig,
    addPlctypeconfig,
    updatePlctypeconfig,
    deletePlctypeconfig,
} from '../api/plctype'

export default {
    components: { 
        // PageTools, 
    },
    data() {
        return {
            closeModel: false,
            plcTypeList: [],
            total: 20,
            pageIndex: 1,
            pageSize: 10,
            singlePage: false,
            DialogVisible: false, // 是否显示PLC类型对话框
            dialogTitle: '新建PLCl类型',
            labelPosition: 'top',
            plcFromData: {
                brand: '',
                typeName: '',
                protocol: '',
                model: '',
            },
            rulePlcForm: {
                brand: [
                    { required: true, message: '请输入品牌名称', trigger: 'blur' },
                ],
                typeName: [
                    { required: true, message: '请输入PLC类型名称', trigger: 'blur' },
                ],
                protocol: [
                    { required: true, message: '请输入PLC通迅协议', trigger: 'blur' },
                ],
                model: [
                    { required: true, message: '请输入PLC类型型号', trigger: 'blur' },
                ],
            },
            updateObj: {},
            extendVisiable: false, // 是否显示扩展字段对话框
            extendList: [],
            innerVisible: false,
            extendDialogTitle: '新建扩展字段',
            extendForm: {
                fieldName: '',
                key: '',
                fieldType: '',
                option: '',
            },
            ruleExtendForm: {
                fieldName: [
                    { required: true, message: '请输入表单项名称', trigger: 'blur' },
                ],
                key: [
                    { required: true, message: '请输入表单项key', trigger: 'blur' },
                ],
                fieldType: [
                    { required: true, message: '请选择表单项类型', trigger: 'blur' },
                ],
                option: [
                    { required: true, message: '请输入选项', trigger: 'blur' },
                ],
            },
            fieldTypeList: ['数字', '文本框', '下拉框'],
            updateExtend: {},
        }
    },
    created() {
        this.getPlcTypePages()
    },
    methods: {
        handleExtendDelete(extendObj) { 
            this.$confirm('此操作将删除这条数据, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                const response = await deletePlctypeconfig({ id: extendObj.id })
                // console.log(response)
                if (response.status === 200 && response.data.success) {
                    this.getPlctypeConfig()
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
        handleSubmitExtend() {
            this.$refs.extendForm.validate(async valid => {
                if (valid) {
                    let response
                    if (this.extendDialogTitle === '新增扩展字段') {
                        let param = {
                            plcTypeId: this.updateObj.id,
                            fieldName: this.extendForm.fieldName,
                            key: this.extendForm.key,
                            fieldType: this.extendForm.fieldType,
                        }
                        if (this.extendForm.fieldType === '下拉框') {
                            param.option = this.extendForm.option
                        }
                        response = await addPlctypeconfig(param)
                        // console.log(response)
                    } else {
                        response = await updatePlctypeconfig({
                            option: this.extendForm.option,
                            id: this.updateExtend.id,
                            plcTypeId: this.updateObj.id,
                            fieldName: this.extendForm.fieldName,
                            key: this.extendForm.key,
                            fieldType: this.extendForm.fieldType,
                        })
                        // console.log(response)
                    }
                    if (response.status === 200 && response.data.success) {
                        this.handleCloseExtendInner()
                        this.$message({
                            type: 'success',
                            message: this.extendDialogTitle + '成功!',
                        })
                        // 更新界面
                        this.getPlctypeConfig()
                    } else {
                        this.$message({
                            type: 'warning',
                            message: this.extendDialogTitle + '失败：' + JSON.stringify(response.data.message),
                        })
                    }
                }
            })
        },
        handleCloseExtendInner() {
            this.extendForm.fieldName = ''
            this.extendForm.key = ''
            this.extendForm.fieldType = ''
            this.extendForm.option = ''
            this.updateExtend = {}
            this.$refs.extendForm.clearValidate()
            this.innerVisible = false
        },
        feildTypeChange(val) {
            this.extendForm.fieldType = val
        },
        addExtend() {
            this.extendDialogTitle = '新增扩展字段'
            this.innerVisible = true
        },
        handleExtend(indes, plcTypeObj) {
            this.updateObj = plcTypeObj
            this.getPlctypeConfig()
        },
        handleExtendEdit(extendObj) {
            console.log(extendObj)
            this.extendDialogTitle = '编辑扩展字段'
            this.updateExtend = extendObj
            this.extendForm.fieldName = extendObj.fieldName
            this.extendForm.key = extendObj.key
            this.extendForm.fieldType = extendObj.fieldType
            this.extendForm.option = extendObj.option
            this.innerVisible = true
        },
        handleCloseExtend() {
            this.extendVisiable = false
            this.extendList = []
            this.updateObj = {}
        },
        handleSubmit() {
            this.$refs.plctypeForm.validate(async valid => {
                if (valid) {
                    let response
                    if (this.dialogTitle === '新建PLC类型') {
                        response = await addPlcType({
                            typeName: this.plcFromData.typeName,
                            brand: this.plcFromData.brand,
                            protocol: this.plcFromData.protocol,
                            model: this.plcFromData.model,
                        })
                        // console.log(response)
                    } else {
                        response = await updatePlcType({
                            id: this.updateObj.id,
                            typeName: this.plcFromData.typeName,
                            brand: this.plcFromData.brand,
                            protocol: this.plcFromData.protocol,
                            model: this.plcFromData.model,
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
                        this.getPlcTypePages()
                    } else {
                        this.$message({
                            type: 'warning',
                            message: this.dialogTitle + '失败：' + JSON.stringify(response.data.message),
                        })
                    }
                }
            })
        },
        handleAddPlc() {
            this.dialogTitle = '新建PLC类型'
            this.DialogVisible = true
        },
        handleClose() {
            this.DialogVisible = false

            this.plcFromData.brand = ''
            this.plcFromData.typeName = ''
            this.plcFromData.protocol = ''
            this.plcFromData.model = ''

            this.$refs.plctypeForm.clearValidate()
            this.updateObj = {}
        },
        handleEdit(index, plcObj) {
            this.dialogTitle = '编辑PLC类型'
            this.DialogVisible = true
            this.updateObj = plcObj
            this.plcFromData.brand = plcObj.brand
            this.plcFromData.typeName = plcObj.typeName
            this.plcFromData.protocol = plcObj.protocol
            this.plcFromData.model = plcObj.model
        },
        handleDelete(index, plcTypeObj) {
            this.$confirm('此操作将删除这条数据, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                const response = await deletePlcType({ id: plcTypeObj.id })
                // console.log(response)
                if (response.status === 200 && response.data.success) {
                    this.getPlcTypePages()
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
        handleCurrentChange(index) {
            this.pageIndex = index
            this.getPlcTypePages()
        },
        async getPlcTypePages() {
            const response = await getPlcTypePages({
                PageNo: this.pageIndex,
                PageSize: this.pageSize,
            })
            // console.log(response)
            if (response.status === 200 && response.data.success) {
                this.total = response.data.data.totalRows
                this.plcTypeList = response.data.data.rows
            }
        },
        async getPlctypeConfig() {
            const response = await getPlctypeConfig({
                PlcTypeId: this.updateObj.id,
            })
            // console.log(response)
            if (response.status === 200 && response.data.success) {
                this.extendVisiable = true
                this.extendList = response.data.data
            }
        },
    },
}
</script>
<style scoped lang="scss">
.container {
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 15px 20px 25px;
    background-color: #f8f8f9;
    overflow: hidden;
    .content {
        position: relative;
        width: 100%;
        height: calc(100% - 80px);
        padding: 0px 20px 20px 15px;
        background-color: #ffffff;
        border-radius: 5px;
        border: solid 1px #f1f2f7;
        overflow-x: hidden;
        overflow-y: auto;
        .title {
            position: relative;
            width: 100%;
            line-height: 52px;
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
            bottom: 20px;
        }
    }

}

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
    margin-right: 15px;
    font-weight: bold;
    cursor: pointer;
}
.oprateTable:first-child:hover {
    color: #285ad8;
    
}
.oprateTable:nth-child(2) {
    width: 16px;
    height: 16px;
    margin-right: 15px;
    margin-top: 5px;
    background: url('../assets/imgs/editBlack.svg') no-repeat;
    background-size: 100%;
    vertical-align: middle;
}
.oprateTable:nth-child(2):hover {
    width: 16px;
    height: 16px;
    background: url('../assets/imgs/editBlue.svg') no-repeat;
    background-size: 100%;
    vertical-align: middle;
}
.oprateTable:last-child {
    width: 15px;
    height: 19px;
    margin-top: 5px;
    background: url('../assets/imgs/deleteBlack.svg') no-repeat;
    background-size: 100%;
    vertical-align: middle;
}
.oprateTable:last-child:hover {
    width: 15px;
    height: 19px;
    background: url('../assets/imgs/sdeleteBule.svg') no-repeat;
    background-size: 100%;
    vertical-align: middle;
}
.oprateTableInner{
    float: left;
    margin: 0 auto;
}
.oprateTableInner:nth-child(1) {
    width: 16px;
    height: 16px;
    margin-right: 15px;
    margin-top: 5px;
    // margin-left: 20px;
    background: url('../assets/imgs/editBlack.svg') no-repeat;
    background-size: 100%;
    vertical-align: middle;
}
.oprateTableInner:nth-child(1):hover {
    width: 16px;
    height: 16px;
    background: url('../assets/imgs/editBlue.svg') no-repeat;
    background-size: 100%;
    vertical-align: middle;
}
.oprateTableInner:last-child {
    width: 15px;
    height: 19px;
    margin-top: 5px;
    background: url('../assets/imgs/deleteBlack.svg') no-repeat;
    background-size: 100%;
    vertical-align: middle;
}
.oprateTableInner:last-child:hover {
    width: 15px;
    height: 19px;
    background: url('../assets/imgs/sdeleteBule.svg') no-repeat;
    background-size: 100%;
    vertical-align: middle;
}
</style>
<style scoped>
.wHR >>> .el-form-item__content {
        margin-right: 20px;
}
.wHR >>> .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    flex: 1;
}
.content >>> .el-dialog__header {
    padding: 20px 30px 0px;
}
.content >>> .el-dialog__body {
    padding: 15px 30px 5px;
}
.content >>> .el-dialog__body {
    padding: 15px 30px 5px;
}
.extendStyle >>> .el-form-item__label{
    font-size: 18px;
    color: #3c557a;
}
.content >>> .el-input__inner {
    border: 1px solid  #c4c4c4;
    border-radius: 0px;
}
.content >>> .el-input--small .el-input__inner {
    height: 40px;
    line-height: 40px;
}
.content >>> .el-textarea__inner {
    height: 80px;
}
.oprateBtn.el-button {
    padding: 10px 40px;
    font-size: 18px;
    background: #285ad8;
    border-radius: 5px 5px 5px 5px;
    color: #ffffff;
}
.el-button {
     background: #285ad8;
     color: #ffffff;
}
.content >>> .el-dialog__footer {
    padding: 0 0 20px;
    text-align: center;
}
.el-button+.el-button  {
    margin-left: 20px;
}
.content >>> .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before {
    content: '';
    /* content: '*'; */
    /* color: #F56C6C; */
    /* margin-right: 4px; */
}
.extendStyle >>> .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before {
    content: '';
    /* content: '*'; */
    /* color: #F56C6C; */
    /* margin-right: 4px; */
}
</style>