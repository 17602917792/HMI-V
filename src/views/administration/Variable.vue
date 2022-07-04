<template>
    <div class="container">
        <div class="content">
            <div class="title">
                <p>变量管理</p>
                <div class="btnBox">
                    <el-input
                        v-if="$isHasAuth('VARIABLE_QUERY')"
                        v-model="searchValue"
                        placeholder="请输入搜索的变量名称"
                        clearable
                        class="searchIpt"
                    >
                    </el-input>
                    <div v-if="$isHasAuth('VARIABLE_QUERY')" icon="el-icon-search" @click="handleQuery">
                        <i class="el-icon-search" style="color: #ffffff; font-size: 17px;"></i>
                        <span>搜索</span>
                    </div>
                    <div v-if="$isHasAuth('VARIABLE_MORE_DELETE')" @click="moreDelete">
                        <img src="../../assets/imgs/stationDelete.svg" alt="">
                        <span>批量删除</span>
                    </div>
                    <div v-if="$isHasAuth('VARIABLE_IMPORT')" @click="importDialog">
                        <img src="../../assets//imgs/import.svg" alt="">
                        <span>导入</span>
                    </div>
                    <div v-if="$isHasAuth('VARIABLE_EXPORT')" @click="getExportData">
                        <img src="../../assets/imgs/export.svg" alt="">
                        <span>导出</span>
                    </div>
                    <div v-if="$isHasAuth('VARIABLE_ADD')" @click="addVariable">
                        <img src="../../assets/imgs/newAdd.svg" alt="">
                        <span>新建</span>
                    </div>
                </div>
            </div>

            <el-table
                :data="variableTableData"
                style="width: 100%;margin-bottom: 20px;"
                :cell-class-name="tableCellClassName"
                height="calc(100% - 134px)"
                @selection-change="handleSelectionChange"
                @cell-dblclick="tableDbEdit"
                @row-dblclick="dbclick"
            >
                <el-table-column
                    align="center"
                    type="selection"
                    width="50"
                >
                </el-table-column>
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
                    label="所属PLC"
                    align="center"
                >
                    <!-- <template slot-scope="scope">
                        {{ scope.row.plcName }}
                    </template> -->
                    <template slot-scope="scope">
                        <!--v-if去判断双击的是不是当前单元格-->
                        <el-select
                            v-if="scope.row.index + ',' + scope.column.index == currentCell" 
                            :ref="scope.row.index + ',' + scope.column.index" 
                            v-model="scope.row.plcObj" 
                            placeholder="请选择导入数据所属PLC"
                            style="width:100%;"
                            value-key="id"
                            @change="plcChangeTable($event,scope.row)"
                        >
                            <el-option
                                v-for="item in plcList"
                                :key="item.id"
                                :label="item.plcName"
                                :value="item"
                            />
                        </el-select>
                        <span v-else>{{ scope.row.plcName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="variableName"
                    label="变量名称"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.variableName }}
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
                    prop="address"
                    label="地址"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.address }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="variableType"
                    label="类型"
                    align="center"
                >
                    <template slot-scope="scope">
                        <el-select
                            v-if="scope.row.index + ',' + scope.column.index == currentCell" 
                            :ref="scope.row.index + ',' + scope.column.index" 
                            v-model="scope.row.variableType" 
                            placeholder="请选择变量类型"
                            style="width:100%;"
                            value-key="id"
                            @change="typeChangeTable($event,scope.row)"
                        >
                            <el-option
                                v-for="item in typeList"
                                :key="item"
                                :label="item"
                                :value="item"
                            />
                        </el-select>
                        <span v-else>{{ scope.row.variableType }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="length"
                    label="长度"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.length }}
                    </template>
                </el-table-column>
                
                <el-table-column
                    v-if="$isHasAuth('VARIABLE_DELETE') || $isHasAuth('VARIABLE_UPDATE')"
                    label="操作"
                    width="120"
                    align="center"
                >
                    <template slot-scope="scope">
                        <div class="oprateCell">
                            <span v-if="$isHasAuth('VARIABLE_UPDATE')" class="oprateTable" @click="handleEdit(scope.$index, scope.row)"></span>
                            <span v-if="$isHasAuth('VARIABLE_DELETE')" class="oprateTable" @click="handleDelete(scope.$index, scope.row)"></span>
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

            <!-- 添加工位屏 对话框  start -->
            <el-dialog
                :visible.sync="DialogVisible"
                width="40%"
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
                    ref="variableForm"
                    :label-position="labelPosition"
                    :rules="ruleVForm"
                    label-width="80px"
                    :model="vFromData"
                >
                    <el-form-item label="变量名称" prop="variableName">
                        <el-input v-model="vFromData.variableName"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="vFromData.address"></el-input>
                    </el-form-item>
                    <div class="wHR">
                        <el-form-item label="所属PLC" prop="plcName">  
                            <el-select
                                v-model="vFromData.plcObj"
                                placeholder="请选择所属PLC"
                                style="width:100%;"
                                value-key="id"
                                @change="plcChange"
                            >
                                <el-option
                                    v-for="item in plcList"
                                    :key="item.id"
                                    :label="item.plcName"
                                    :value="item"
                                />
                            </el-select>
                            <!-- <el-input v-model="vFromData.plcType"></el-input> -->
                        </el-form-item>
                        <el-form-item label="变量类型" prop="variableType">
                            <el-select
                                v-model="vFromData.variableType"
                                placeholder="请选择变量类型"
                                style="width:100%;"
                                value-key="id"
                                @change="variableTypeChange"
                            >
                                <el-option
                                    v-for="item in typeList"
                                    :key="item"
                                    :label="item"
                                    :value="item"
                                />
                            </el-select>
                            <!-- <el-input v-model="vFromData.variableType" placeholder=""></el-input> -->
                        </el-form-item>
                        <el-form-item label="长度" prop="length">
                            <el-input v-model="vFromData.length" placeholder=""></el-input>
                        </el-form-item>
                    </div>
                    <el-form-item label="变量描述" prop="describe">
                        <el-input
                            v-model="vFromData.describe"
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
            <!-- 添加工位屏 对话框  end -->

            <!-- 导入 start -->
            <el-dialog title="导入操作" :visible.sync="importVisible" :close-on-click-modal="closeModel">
                <div class="wHR">
                    <el-select
                        v-model="vFromData.plcObj"
                        placeholder="请选择导入数据所属PLC"
                        style="width:100%;"
                        value-key="id"
                        @change="plcChange"
                    >
                        <el-option
                            v-for="item in plcList"
                            :key="item.id"
                            :label="item.plcName"
                            :value="item"
                        />
                    </el-select>
                </div>
                <ImportExcel :on-success="onSuccess" :before-upload="beforeUpload"></ImportExcel>
                <span slot="footer" class="dialog-footer">
                    <!-- <el-button type="primary" @click="handleImportSubmit">确 定</el-button> -->
                    <el-button @click="handleImportClose">取 消</el-button>
                </span>
            </el-dialog>
            <!-- 导入 end -->
        </div>
    </div>
</template>
<script>
import { getVariablePage, addVaribleInfo, updateVaribleInfo, 
    deleteVariable, moreDeleteVariable, exportVariable, importVariable } from '../../api/variablepage'
import { getPlcInfo } from '../../api/plc'
import ImportExcel from '../../components/ImportExcel/index.vue'

export default {
    components: {
        ImportExcel,
    },
    data() {
        return {
            // 用一个字符串来保存当前双击的是哪一个单元格
            currentCell: null,
            searchValue: '',
            closeModel: false,
            loading: false,
            importVisible: false,
            variableTableData: [],
            DialogVisible: false,
            dialogTitle: '',
            total: 1,
            labelPosition: 'top',
            vFromData: {
                plctName: '',
                variableName: '',
                address: '',
                variableType: '',
                length: '',
                describe: '',
                plcObj: {},
            },
            ruleVForm: {
                plctName: [
                    { required: true, message: '请选择PLC', trigger: 'blur' },
                ],
                variableName: [
                    { required: true, message: '请输入变量名称', trigger: 'blur' },
                ],
                address: [
                    { required: true, message: '请选择PLC', trigger: 'blur' },
                ],
                variableType: [
                    { required: true, message: '请选择变量类型', trigger: 'blur' },
                ],
                // length: [
                //     { message: '请输入长度', trigger: 'blur' },
                // ],
                // describe: [
                //     { message: '请输入变量描述', trigger: 'blur' },
                // ],
            },
            plcList: [],
            plcId: '',
            plcName: '',
            pageIndex: 1,
            pageSize: 10,
            singlePage: false,
            updateObj: {},
            selectIdList: [],
            typeList: ['bool', 'byte', 'char', 'int', 'dint', 'word', 'dword', 'real', 'string'],
        }
    },
    created() {
        this.getPlcPages()
    },
    methods: {
        variableTypeChange(val) {
            this.vFromData.variableType = val
        },
        // 给单元格绑定横向和竖向的index，这样就能确定是哪一个单元格
        tableCellClassName({ row, column, rowIndex, columnIndex }) {
            row.index = rowIndex
            column.index = columnIndex
        },
        // 获得当前双击的单元格的横竖index，然后拼接成一个唯一字符串用于判断，并赋给currentCell
        // 拼接后类似这样："1,0","1,1",
        dbclick(row, column) {
            this.currentCell = row.index + ',' + column.index
            // 这里必须要setTimeout，因为在点击的时候，input才刚被v-if显示出来，不然拿不到dom
            setTimeout(() => {
                // 双击后自动获得焦点
                // console.log(row.index + ',' + column.index)
                if (column.index === 2) {
                    this.$refs[row.index + ',' + column.index].focus()
                }
            })
        },
        // 当input失去焦点的时候，隐藏input
        hideInput() {
            this.currentCell = null
        },
        async tableDbEdit(row, column, cell, event) {
            // console.log(row, column, cell, event)
            // 定义我们要排除的编辑的列，
            let noEditColumns = []
            // 全表格可编辑的话直接注释下⼀⾏即可
            noEditColumns = ['所属PLC', '排序', '操作', '类型']
            // 注意对应关系 column.property对应的是我们的数据列名   column.label对应的是标题的中⽂名称
            if (noEditColumns.indexOf(column.label) != -1) {
                return
            }
            // 记录要编辑的表格，原本的值
            let msg = row[column.property]
            event.target.innerHTML = ''
            // 双击添加  input框 
            let cellInput = document.createElement('input')
            // 设置input框样式及类型
            cellInput.value = msg
            cellInput.setAttribute('type', 'input')
            cellInput.style.width = '80%'
            cellInput.style.height = '30px'
            cellInput.style.paddingLeft = '10px'
            cellInput.style.outline = 'none'
            cellInput.style.border = '1px solid #285ad8'
            // cellInput.style.border = '1px solid #c4c4c4'
            cellInput.style.borderRadius = '3px'
            cell.appendChild(cellInput)
            // 注意此处需要将焦点设置给cellInput,否则不好使 
            cellInput.focus()
            // 为⿏标添加失去焦点事件 onBlur
            cellInput.onblur = async () => {
                // 判断input输⼊是否为空，为空则删除
                if (cellInput.value == '') {
                    cell.removeChild(cellInput)
                    event.target.innerHTML = msg
                } else {
                    // 修改值
                    event.target.innerHTML = cellInput.value
                    cell.removeChild(cellInput)
                    // ⾃⼰的请求在这⾥书写，下边只是⽰例
                    let form = {
                        id: row.id,
                        length: column.property === 'length' ? cellInput.value : row.length,
                        address: column.property === 'address' ? cellInput.value : row.address,
                        desc: column.property === 'desc' ? cellInput.value : row.desc,
                        variableName: column.property === 'variableName' ? cellInput.value : row.variableName,
                        variableType: column.property === 'variableType' ? cellInput.value : row.variableType,
                        plcId: row.plcId,
                    }
                    // console.log(form)
                    let response = await updateVaribleInfo(form)
                    // console.log(response)
                    if (response.status === 200 && response.data.success) {
                        this.$message({
                            type: 'success',
                            message: '更新成功!',
                        })
                        // 更新界面
                        this.getPlcPages()
                    } else {
                        this.$message({
                            type: 'warning',
                            message: '更新失败：' + JSON.stringify(response.data.message),
                        })
                    }
                }
            }
        },
        async handleQuery() {
            const response = await getVariablePage({
                StationId: this.$route.query.stationId,
                PageSize: this.pageSize,
                VariableName: this.searchValue,
            })
            // console.log(response)
            if (response.status === 200 && response.data.success) {
                const tempList = response.data.data.rows
                if (tempList.length > 0) {
                    tempList.forEach(element => {
                        const plcObj = this.plcList.find(item => element.plcId === item.id)
                        element.plcObj = plcObj
                    })
                    this.variableTableData = tempList
                    // console.log(this.variableTableData)
                }
                this.total = response.data.data.totalRows
            } else {
                this.$message({
                    type: 'warning',
                    message: JSON.stringify(response.data.message),
                })
            }
        },
        // 上传文件之前执行该函数
        beforeUpload(file) {
            // 参数file其实就是选中的文件
            if (file.name.endsWith('.xlsx')) {
                // 选中的文件是Excel格式
                return true
            } 
            this.$message.error('仅仅支持Excel文件')
            return false
        },
        // 导入Excel数据成功回调函数
        async onSuccess(file) {
            try {
                if (this.plcId != '') {
                    const formData = new window.FormData()
                    formData.append('file', file)
                    const response = await importVariable(this.plcId, formData)
                    // console.log(response)
                    if (response.status === 200) {
                        if (response.data.success) {
                            this.handleImportClose()
                            this.getPlcPages()
                        }
                    } else {
                        this.$message.error('导入变量失败')
                    }
                } else {
                    this.$message.error('请选择导入数据所属于PLC！')
                }
            } catch {
                this.$message.error('导入变量失败')
            }
        },
        handleImportClose() {
            this.importVisible = false
            // this.plcList = []
            this.plcId = ''
            this.plcName = ''
            this.vFromData.plctName = ''
            this.vFromData.plcObj = {}
        },
        async importDialog() {
            const response = await getPlcInfo({
                StationId: this.$route.query.stationId,
                PageNo: 1,
                PageSize: 200,
            })
            // console.log(response)
            if (response.status === 200) {
                if (response.data.success) {
                    this.plcList = response.data.data.rows
                    if (this.plcList.length > 0) {
                        this.importVisible = true
                    } else {
                        this.$message({
                            type: 'warning',
                            message: '请先添加PLC管理界面数据~',
                        })
                    }
                } else {
                    this.$message({
                        type: 'warning',
                        message: JSON.stringify(response.data.message),
                    })
                }
            } 
        },
        // 1. 定义导出excel方法
        // 参数1: 文件流对象; 参数2: 文件名称; 参数3: 文件后缀, 即文件格式
        excelDownload(obj, name = Date.now(), suffix = 'xlsx') {
            const url = window.URL.createObjectURL(
                new Blob([obj], { type: 'application/vnd.ms-excel' }),
            )
            const aDOM = document.createElement('a')
            aDOM.style.display = 'none'
            aDOM.href = url
            const fileName = name + '.' + suffix
            aDOM.setAttribute('download', fileName)
            document.body.appendChild(aDOM)
            aDOM.click()
            document.body.removeChild(aDOM)
        },
        async getExportData() {
            this.$confirm('您确定导出所有数据吗?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                const response = await exportVariable({
                    StationId: this.$route.query.stationId, 
                })
                // console.log(response)
                this.excelDownload(response.data, '变量管理' + Date.now())
            }).catch((err) => {
                if (err !== 'cancel') {
                    return this.$message.error('删除失败！')
                }
                this.$message({
                    type: 'info',
                    message: '已取消导出',
                })
            })
        },
        handleSelectionChange(val) {
            this.selectIdList = val.map(item => item.id) 
            // console.log(val)
            // console.log(this.selectIdList)
        },
        addVariable() {
            this.dialogTitle = '新建变量'
            this.DialogVisible = true
        },
        handleEdit(index, updateObj) {
            this.dialogTitle = '编辑变量'
            this.updateObj = updateObj

            this.plcId = updateObj.plcId
            this.plcName = updateObj.plcName
            this.vFromData.variableName = updateObj.variableName
            this.vFromData.address = updateObj.address
            this.vFromData.describe = updateObj.desc
            this.vFromData.length = updateObj.length
            this.vFromData.plcObj = updateObj.plcObj
            this.vFromData.variableType = updateObj.variableType
            this.DialogVisible = true
        },
        handleDelete(index, updateObj) {
            this.$confirm('此操作将删除这条数据, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                const response = await deleteVariable({ id: updateObj.id })
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
        moreDelete() {
            if (this.selectIdList.length > 0) {
                this.$confirm('此操作将删除选中的数据, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(async () => {
                    const response = await moreDeleteVariable({ variableIdList: this.selectIdList })
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
            } else {
                this.$message({
                    type: 'warning',
                    message: '请选择要删除的数据！',
                })
            }
        },
        handleClose() {
            this.DialogVisible = false
            this.plcId = ''
            this.plcName = ''

            this.vFromData.plctName = ''
            this.vFromData.variableName = ''
            this.vFromData.address = ''
            this.vFromData.variableType = ''
            this.vFromData.length = ''
            this.vFromData.describe = ''
            this.vFromData.plcObj = {}
            this.updateObj = {}
            this.$refs.variableForm.clearValidate()
        },
        plcChange(item) {
            this.plcId = item.id
            this.plcName = item.plcName
            this.vFromData.plcObj = item
        },
        async typeChangeTable(val, row) {
            this.plcId = row.id
            this.plcName = row.plcName
            this.currentCell = null

            const response = await updateVaribleInfo({
                length: row.length,
                address: row.address,
                desc: row.describe,
                id: row.id,
                variableName: row.variableName,
                variableType: val,
                plcId: row.plcId,
            })
            if (response.status === 200 && response.data.success) {
                this.$message({
                    type: 'success',
                    message: '更新成功!',
                })
                // 更新界面
                this.getPlcPages()
            } else {
                this.$message({
                    type: 'warning',
                    message: '更新失败：' + JSON.stringify(response.data.message),
                })
            }
        },
        async plcChangeTable(item, row) {
            // console.log(item)
            // console.log(row)
            this.plcId = item.id
            this.plcName = item.plcName
            row.plcObj = item
            row.plcName = item.plcName
            this.currentCell = null

            const response = await updateVaribleInfo({
                length: row.length,
                address: row.address,
                desc: row.describe,
                id: row.id,
                variableName: row.variableName,
                variableType: row.variableType,
                plcId: this.plcId,
            })
            if (response.status === 200 && response.data.success) {
                this.$message({
                    type: 'success',
                    message: '更新成功!',
                })
                // 更新界面
                this.getPlcPages()
            } else {
                this.$message({
                    type: 'warning',
                    message: '更新失败：' + JSON.stringify(response.data.message),
                })
            }
        },
        handleSubmit() {
            this.$refs.variableForm.validate(async valid => {
                if (valid) {
                    let response
                    if (this.dialogTitle === '新建变量') {
                        response = await addVaribleInfo({
                            length: this.vFromData.length == '' ? 0 : this.vFromData.length,
                            address: this.vFromData.address,
                            desc: this.vFromData.describe,
                            plcId: this.plcId,
                            variableName: this.vFromData.variableName,
                            variableType: this.vFromData.variableType,
                        })
                        // console.log(response)
                    } else {
                        response = await updateVaribleInfo({
                            length: this.vFromData.length,
                            address: this.vFromData.address,
                            desc: this.vFromData.describe,
                            id: this.updateObj.id,
                            variableName: this.vFromData.variableName,
                            variableType: this.vFromData.variableType,
                            plcId: this.plcId,
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
        async getPlcPages() {
            const response = await getPlcInfo({
                StationId: this.$route.query.stationId,
                PageNo: 1,
                PageSize: 200,
            })
            // console.log(response)
            if (response.status === 200) {
                if (response.data.success) {
                    this.plcList = response.data.data.rows
                    // if (this.plcList.length === 0) {
                    //     this.$message({
                    //         type: 'warning',
                    //         message: '请添加PLC管理界面数据~',
                    //     })
                    // }
                    this.getVariablePage()
                } else {
                    this.$message({
                        type: 'warning',
                        message: JSON.stringify(response.data.message),
                    })
                }
            }
        },
        async getVariablePage() {
            const response = await getVariablePage({
                StationId: this.$route.query.stationId,
                PageNo: this.pageIndex,
                PageSize: this.pageSize,
            })
            // console.log(response)
            if (response.status === 200 && response.data.success) {
                // this.variableTableData = response.data.data.rows
                const tempList = response.data.data.rows
                if (tempList.length > 0) {
                    tempList.forEach(element => {
                        const plcObj = this.plcList.find(item => element.plcId === item.id)
                        element.plcObj = plcObj
                    })
                    this.variableTableData = tempList
                    // console.log(this.variableTableData)
                }
                this.total = response.data.data.totalRows
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
            .btnBox {
                position: absolute;
                top: 20px;
                right: 0;
                .searchIpt  {
                    width: 300px;
                }
                div.searchIpt{
                    background: #ffffff;
                }
                div {
                    float: left;
                    width: 127px;
                    height: 40px;
                    margin-left: 20px;
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
        } 
        .pageBox {
            position: absolute;
            left: 10px;
            bottom: 10px;
        }
    }

    /* 新建 对话框  start */
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
    
    /* 新建 对话框  end */
}

</style>
<style scoped>
.btnBox >>> .el-input--small .el-input__inner {
    height: 40px !important;
    line-height: 40px !important;
    font-size: 16px;
}
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
</style>