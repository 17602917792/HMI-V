<template>
    <div class="container">
        <div class="content">
            <div class="title">
                <p>报警管理</p>
                <div class="btnBox">
                    <el-input
                        v-if="$isHasAuth('ALARM_QUERY')"
                        v-model="searchValue"
                        placeholder="请输入报警内容"
                        clearable
                        class="searchIpt"
                    >
                    </el-input>
                    <div v-if="$isHasAuth('ALARM_QUERY')" icon="el-icon-search" @click="handleQuery">
                        <i class="el-icon-search" style="color: #ffffff; font-size: 17px;"></i>
                        <span>搜索</span>
                    </div>
                    <div v-if="$isHasAuth('ALARM_MORE_DELETE')" @click="moreDelete">
                        <img src="../../assets/imgs/stationDelete.svg" alt="">
                        <span>批量删除</span>
                    </div>
                    <div v-if="$isHasAuth('ALARM_IMPORT')" @click="importDialog">
                        <img src="../../assets//imgs/import.svg" alt="">
                        <span>导入</span>
                    </div>
                    <div v-if="$isHasAuth('ALARM_EXPORT')" @click="exportData">
                        <img src="../../assets/imgs/export.svg" alt="">
                        <span>导出</span>
                    </div>
                    <div v-if="$isHasAuth('ALARM_ADD')" @click="handleAddAralm">
                        <img src="../../assets/imgs/newAdd.svg" alt="">
                        <span>新建</span>
                    </div>
                </div>
            </div>

            <div ref="tableWrapper" class="table-wrapper">
                <el-table
                    :data="alarmTableData"
                    style="width: 100%;margin-bottom: 20px;"
                    :cell-style="columnbackgroundStyle"
                    :cell-class-name="tableCellClassName"
                    :height="tableH"
                    @cell-dblclick="tableDbEdit"
                    @selection-change="handleSelectionChange"
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
                        prop="variableType"
                        label="变量类型"
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
                        prop="warningType"
                        label="报警类型"
                        align="center"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.warningType }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="color"
                        label="颜色"
                        width="120"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <el-color-picker
                                v-if="scope.row.index + ',' + scope.column.index == currentCell"
                                :ref="scope.row.index + ',' + scope.column.index"
                                v-model="scope.row.color"
                                show-alpha 
                                :predefine="predefineColors"
                                @change="changeColor($event,scope.row)" 
                            >
                            </el-color-picker>
                            <span v-else>{{ }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="warningText"
                        label="报警描述"
                        align="center"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.warningText }}
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
                        prop="enable"
                        label="使能"
                        align="center"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.enable }}
                        </template>
                    </el-table-column>
                
                    <el-table-column
                        v-if="$isHasAuth('ALARM_DELETE') || $isHasAuth('ALARM_UPDATE')"
                        label="操作"
                        width="120"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <div class="oprateCell">
                                <span v-if="$isHasAuth('ALARM_UPDATE')" class="oprateTable" @click="handleEdit(scope.$index, scope.row)"></span>
                                <span v-if="$isHasAuth('ALARM_DELETE')" class="oprateTable" @click="handleDelete(scope.$index, scope.row)"></span>
                            </div>
                        <!-- <img src="../../assets/imgs/edit.svg" alt="">
                        <img src="../../assets/imgs/delete.svg" alt=""> -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            
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
                    ref="alarmForm"
                    :label-position="labelPosition"
                    :rules="alarmPlcForm"
                    label-width="80px"
                    :model="alarmFromData"
                >
                    <div class="wHR">
                        <el-form-item label="PLC名称" prop="plcName">  
                            <el-select
                                v-model="alarmFromData.plcObj"
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
                            <!-- <el-input v-model="alarmFromData.plcType"></el-input> -->
                        </el-form-item>
                        <!-- <el-form-item label="变量类型" prop="variableType">
                            <el-input v-model="alarmFromData.variableType" placeholder="String、Boolean、Int"> </el-input>
                        </el-form-item> -->
                        <el-form-item label="变量类型" prop="variableType">
                            <el-select
                                v-model="alarmFromData.variableType"
                                placeholder="请选择变量类型"
                                style="width:100%;"
                                value-key="id"
                                @change="alarmTypeChange"
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
                        <el-form-item label="使能" prop="enable">
                            <el-input v-model="alarmFromData.enable"></el-input>
                        </el-form-item>
                        <el-form-item label="颜色" prop="color" class="colorSelect">
                            <el-color-picker
                                v-model="alarmFromData.color"
                                show-alpha
                                :predefine="predefineColors"
                            >
                            </el-color-picker>
                        </el-form-item>
                    </div>
                    <el-form-item label="报警类型" prop="alarmType">
                        <el-input v-model="alarmFromData.alarmType"></el-input>
                    </el-form-item>
                    <el-form-item label="报警地址" prop="address">
                        <el-input v-model="alarmFromData.address"></el-input>
                    </el-form-item>
                    <!-- <div class="wHR">
                    </div> -->
                    
                    <el-form-item label="报警描述" prop="describe">
                        <el-input
                            v-model="alarmFromData.describe"
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
                        v-model="alarmFromData.plcObj"
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
import { getWarningPage, addAlarmInfo, updateAlarmInfo, 
    deleteAlarm, moreDeleteAlarm, exportAlarm, importAlarm } from '../../api/alarm'
import { getPlcInfo } from '../../api/plc'
import ImportExcel from '../../components/ImportExcel/index.vue'

export default {
    components: {
        ImportExcel,
    },
    data() {
        return {
            tableH: 0,
            currentCell: null,
            searchValue: '',
            closeModel: false,
            importVisible: false,
            alarmTableData: [],
            DialogVisible: false,
            dialogTitle: '',
            total: 1,
            labelPosition: 'top',
            alarmFromData: {
                plcObj: {},
                plcName: '',
                variableType: '',
                color: '',
                enable: '',
                alarmType: '',
                address: '',
                describe: '',
            },
            alarmPlcForm: {
                plcName: [
                    { required: true, message: '请选择PLC名称', trigger: 'blur' },
                ],
                variableType: [
                    { required: true, message: '请输入变量类型', trigger: 'blur' },
                ],
                color: [
                    { required: true, message: '请选择报警颜色', trigger: 'blur' },
                ],
                enable: [
                    { required: true, message: '请输入报警使能', trigger: 'blur' },
                ],
                alarmType: [
                    { required: true, message: '请选择报警类型', trigger: 'blur' },
                ],
                address: [
                    { required: true, message: '请输入报警地址', trigger: 'blur' },
                ],
                describe: [
                    { required: true, message: '请输入报警描述', trigger: 'blur' },
                ],
            },
            plcList: [],
            plcId: '',
            plcName: '',
            pageIndex: 1,
            pageSize: 10,
            singlePage: false,
            updateObj: {},
            selectIdList: [],
            predefineColors: [
                '#E50916',
                '#FFDB00',
                '#0470F2',
                '#22B14C',
                '#A1A3AB',
                // '#285ad8',
                // '#ff4500',
                // '#ff8c00',
                // '#ffd700',
                // '#90ee90',
                // '#00ced1',
                // '#1e90ff',
                // '#c71585',
                // 'rgba(255, 69, 0, 0.68)',
                // 'rgb(255, 120, 0)',
                // 'hsv(51, 100, 98)',
                // 'hsva(120, 40, 94, 0.5)',
                // 'hsl(181, 100%, 37%)',
                // 'hsla(209, 100%, 56%, 0.73)',
                // '#c7158577',
            ],
            typeList: ['bool', 'byte', 'char', 'int', 'dint', 'word', 'dword', 'real', 'string'],
        }
    },
    created() {
        this.getPlcPages()
    },
    mounted() {
        this.fetTableHeight()
    },
    methods: {
        async typeChangeTable(val, row) {
            this.plcId = row.id
            this.plcName = row.plcName
            this.currentCell = null
            // console.log(row)
            const response = await updateAlarmInfo({
                id: row.id,
                warningText: row.warningText,
                warningType: row.warningType,
                variableType: val,
                address: row.address,
                enable: row.enable,
                color: row.color,
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
        alarmTypeChange(val) {
            this.alarmFromData.variableType = val
        },
        // 重置table高度
        resetHeight() {
            return new Promise((resolve, reject) => {
                this.tableH = 0
                resolve()
            })
        },
        // 设置table高度
        fetTableHeight() {
            this.resetHeight().then(res => {
                this.tableH = this.$refs.tableWrapper.getBoundingClientRect().height - 10
                // console.log(this.tableH)
            })
        },
        async changeColor(val, row) {
            // console.log(val)
            // console.log(row)
            if (val !== null) {
                row.color = val
                this.currentCell = null
                const response = await updateAlarmInfo({
                    id: row.id,
                    warningText: row.warningText,
                    warningType: row.warningType,
                    variableType: row.variableType,
                    address: row.address,
                    enable: row.enable,
                    color: row.color,
                    plcId: row.plcObj.id,
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
            }
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
                if (column.index === 2 || column.index === 4) {
                    this.$refs[row.index + ',' + column.index].focus()
                }
            })
        },
        // 当input失去焦点的时候，隐藏input
        hideInput() {
            this.currentCell = null
        },
        async tableDbEdit(row, column, cell, event) {
            // console.log(row, column, cell, event)s
            // 定义我们要排除的编辑的列，
            let noEditColumns = []
            // 全表格可编辑的话直接注释下⼀⾏即可
            noEditColumns = ['所属PLC', '排序', '变量类型', '颜色', '操作']
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
            // outline: none; 
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
                    cell.removeChild(cellInput)
                    // 修改值
                    event.target.innerHTML = cellInput.value
                    // ⾃⼰的请求在这⾥书写，下边只是⽰例
                    let form = {
                        id: row.id,
                        warningText: column.property === 'warningText' ? cellInput.value : row.warningText,
                        warningType: column.property === 'warningType' ? cellInput.value : row.warningType,
                        variableType: column.property === 'variableType' ? cellInput.value : row.variableType,
                        address: column.property === 'address' ? cellInput.value : row.address,
                        enable: column.property === 'enable' ? cellInput.value : row.enable,
                        plcId: row.plcId,
                    }
                    // console.log(form)
                    let response = await updateAlarmInfo(form)
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
        columnbackgroundStyle({ row, column, rowIndex, columnIndex }) {
            if (columnIndex == 5) { 
                // console.log(row)
                return `background:${row.color};`
            }
        },
        async handleQuery() {
            const response = await getWarningPage({
                StationId: this.$route.query.stationId,
                PageSize: this.pageSize,
                WarningText: this.searchValue,
            })
            // console.log(response)
            if (response.status === 200 && response.data.success) {
                // this.alarmTableData = response.data.data.rows
                const tempList = response.data.data.rows
                if (tempList.length > 0) {
                    tempList.forEach(element => {
                        const plcObj = this.plcList.find(item => element.plcId === item.id)
                        element.plcObj = plcObj
                    })
                    this.alarmTableData = tempList
                    // console.log(this.alarmTableData)
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
                    const response = await importAlarm(this.plcId, formData)
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
            this.alarmFromData.plctName = ''
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
        async exportData() {
            this.$confirm('您确定导出所有数据吗?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                const response = await exportAlarm({
                    StationId: this.$route.query.stationId, 
                })
                // console.log(response)
                this.excelDownload(response.data, '报警管理' + Date.now())
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
        handleEdit(index, updateObj) {
            this.dialogTitle = '编辑报警信息'
            this.updateObj = updateObj
            // console.log(updateObj)
            this.plcName = updateObj.plcName
            this.plcId = updateObj.plcId

            this.alarmFromData.plcName = updateObj.plcName
            this.alarmFromData.variableType = updateObj.variableType
            this.alarmFromData.enable = updateObj.enable
            this.alarmFromData.alarmType = updateObj.warningType
            this.alarmFromData.address = updateObj.address
            this.alarmFromData.describe = updateObj.warningText
            this.alarmFromData.color = updateObj.color
            this.alarmFromData.plcObj = updateObj.plcObj

            // this.getPlcPages()
            this.DialogVisible = true
        },
        moreDelete() {
            if (this.selectIdList.length > 0) {
                this.$confirm('此操作将删除选中的数据, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(async () => {
                    const response = await moreDeleteAlarm({ warningIdList: this.selectIdList })
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
        handleDelete(index, updateObj) {
            this.$confirm('此操作将删除这条数据, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                const response = await deleteAlarm({ id: updateObj.id })
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
        handleClose() {
            this.DialogVisible = false
            // this.plcList = []
            this.plcId = ''
            this.plcName = ''

            this.alarmFromData.plcName = ''
            this.alarmFromData.variableType = ''
            this.alarmFromData.enable = ''
            this.alarmFromData.alarmType = ''
            this.alarmFromData.address = ''
            this.alarmFromData.describe = ''
            this.alarmFromData.color = ''
            this.alarmFromData.plcObj = {}
            this.updateObj = {}
            this.$refs.alarmForm.clearValidate()
        },
        plcChange(item) {
            this.plcId = item.id
            this.plcName = item.plcName
            this.alarmFromData.plcName = item.plcName
            this.alarmTableData.plcObj = item
        },
        async plcChangeTable(item, row) {
            // console.log(item)
            // console.log(row)
            this.plcId = item.id
            this.plcName = item.plcName
            row.plcObj = item
            row.plcName = item.plcName
            this.currentCell = null

            const response = await updateAlarmInfo({
                id: row.id,
                warningText: row.warningText,
                warningType: row.warningType,
                variableType: row.variableType,
                address: row.address,
                enable: row.enable,
                color: row.color,
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
            this.$refs.alarmForm.validate(async valid => {
                if (valid) {
                    let response
                    if (this.dialogTitle === '新建报警信息') {
                        response = await addAlarmInfo({
                            plcId: this.plcId,
                            warningText: this.alarmFromData.describe,
                            warningType: this.alarmFromData.alarmType,
                            variableType: this.alarmFromData.variableType,
                            address: this.alarmFromData.address,
                            enable: this.alarmFromData.enable,
                            color: this.alarmFromData.color,
                        })
                        // console.log(response)
                    } else {
                        response = await updateAlarmInfo({
                            id: this.updateObj.id,
                            warningText: this.alarmFromData.describe,
                            warningType: this.alarmFromData.alarmType,
                            variableType: this.alarmFromData.variableType,
                            address: this.alarmFromData.address,
                            enable: this.alarmFromData.enable,
                            color: this.alarmFromData.color,
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
        handleAddAralm() {
            this.dialogTitle = '新建报警信息'
            this.DialogVisible = true
            // this.getPlcPages()
        },
        async getPlcPages() {
            const response = await getPlcInfo({
                StationId: this.$route.query.stationId,
                PageNo: 1,
                PageSize: 200,
            })
            // console.log(response)
            if (response.status === 200 && response.data.success) {
                this.plcList = response.data.data.rows
                this.getWarningPage()
                // console.log(this.plcList)
                // if (this.plcList.length === 0) {
                //     this.$message({
                //         type: 'warning',
                //         message: '请先添加PLC管理界面数据~',
                //     })
                // } 
            } else {
                this.$message({
                    type: 'warning',
                    message: JSON.stringify(response.data.message),
                })
            }
        },
        async getWarningPage() {
            const response = await getWarningPage({
                StationId: this.$route.query.stationId,
                PageNo: this.pageIndex,
                PageSize: this.pageSize,
            })
            // console.log(response)
            if (response.status === 200 && response.data.success) {
                // this.alarmTableData = response.data.data.rows
                const tempList = response.data.data.rows
                if (tempList.length > 0) {
                    tempList.forEach(element => {
                        const plcObj = this.plcList.find(item => element.plcId === item.id)
                        element.plcObj = plcObj
                    })
                    this.alarmTableData = tempList
                    // console.log(this.alarmTableData)
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
    input {
        outline: none;
    }
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
                .el-input {
                    border-radius: 5px;
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
        .table-wrapper{
            width: 100%;
            height: calc(100% - #{114px});
            // height: 600px;
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
    flex: 3;
}
.wHR >>> .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item.colorSelect {
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