<template>
    <div class="container">
        <div class="content">
            <div class="title">
                <p>用户管理</p>
                <div class="btnBox">
                    <el-input
                        v-if="$isHasAuth('USER_QUERY')"
                        v-model="searchValue"
                        placeholder="请输入搜索的用户账号"
                        clearable
                        class="searchIpt"
                    >
                    </el-input>
                    <div v-if="$isHasAuth('USER_QUERY')" icon="el-icon-search" @click="handleQuery">
                        <i class="el-icon-search" style="color: #ffffff; font-size: 17px;"></i>
                        <span>搜索</span>
                    </div>
                    <div v-if="$isHasAuth('USER_MORE_DELETE')" @click="moreDelete">
                        <img src="../assets/imgs/stationDelete.svg" alt="">
                        <span>批量删除</span>
                    </div>
                    <!-- <div v-if="$isHasAuth('USER_IMPORT')" @click="importVisible = true">
                        <img src="../assets//imgs/import.svg" alt="">
                        <span>导入</span>
                    </div> -->
                    <!-- <div v-if="$isHasAuth('USER_EXPORT')" @click="exportData">
                        <img src="../assets/imgs/export.svg" alt="">
                        <span>导出</span>
                    </div> -->
                    <div v-if="$isHasAuth('USER_ADD')" @click="handleUserAdd">
                        <img src="../assets/imgs/newAdd.svg" alt="">
                        <span>新建</span>
                    </div>
                </div>
            </div>

            <el-table
                :data="usersList"
                style="width: 100%;margin-bottom: 20px;"
                height="calc(100% - 134px)"
                @selection-change="handleSelectionChange"
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
                    prop="account"
                    label="用户账号"
                    align="left"
                >
                    <template slot-scope="scope">
                        {{ scope.row.account }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="用户名称"
                    align="left"
                >
                    <template slot-scope="scope">
                        {{ scope.row.name }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="userType"
                    label="用户平台"
                    align="left"
                >
                    <template slot-scope="scope">
                        <el-tag
                            v-if="scope.row.userType == 1"
                            type="primary"
                            disable-transitions
                        >
                            {{ whereUser(scope.row.userType) }}
                        </el-tag>
                        <el-tag
                            v-if="scope.row.userType === 2"
                            type="success"
                            disable-transitions
                        >
                            {{ whereUser(scope.row.userType) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="用户状态"
                    align="center"
                >
                    <!-- <template slot-scope="scope">
                        {{ changeUserStatus(scope.row.status) }}
                        
                    </template> -->
                    <template slot-scope="scope">
                        <!-- 0 正常    1停用 -->
                        <el-switch
                            v-model="scope.row.status"
                            :active-value="0"
                            :inactive-value="1"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="changeSwitch($event,scope.row)"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="$isHasAuth('USER_OWN_ROLE') || $isHasAuth('USER_UPDATE') 
                        || $isHasAuth('USER_DELETE') || $isHasAuth('USER_RESET_PASSWORD')"
                    label="操作"
                    width="120"
                    align="center"
                >
                    <template slot-scope="scope">
                        <!-- <div class="oprateCell">
                            <span class="oprateTable" @click="handleEdit(scope.row)"></span>
                            <span class="oprateTable" @click="handleDelete(scope.row)"></span>
                        </div> -->
                        <div :class="{ oprateCell:true, oprateFirst: !($isHasAuth('USER_OWN_ROLE') || $isHasAuth('USER_RESET_PASSWORD'))}">
                            <!-- <span
                                v-if="$isHasAuth('USER_OWN_ROLE')"
                                v-show="scope.row.userType == 1"
                                class="oprateTable"
                                @click="editUserRole(scope.row)"
                            >授权角色</span> -->
                            <div
                                v-if="$isHasAuth('USER_UPDATE')" 
                                :class="{ oprateTable:true,}"
                                @click="handleEdit(scope.row)"
                            ></div>
                            <div v-if="$isHasAuth('USER_DELETE')" class="oprateTable" @click="handleDelete(scope.row)"></div>
                            <div v-if="$isHasAuth('USER_OWN_ROLE') || $isHasAuth('USER_RESET_PASSWORD')" class="oprateTable">
                                <el-dropdown placement="bottom" @command="handleCommand($event,scope.row)">
                                    <span 
                                        class="el-dropdown-link"
                                    >
                                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <!-- v-if="$isHasAuth('USER_OWN_ROLE') && scope.row.userType == 1" -->
                                        <el-dropdown-item 
                                            v-if="$isHasAuth('USER_OWN_ROLE')" 
                                            command="auth"
                                        >
                                            授权角色
                                        </el-dropdown-item>
                                        <el-dropdown-item v-if="$isHasAuth('USER_RESET_PASSWORD')" command="pwd">重置密码</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </div>
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
                    ref="userForm"
                    :label-position="labelPosition"
                    :rules="ruleUserForm"
                    label-width="80px"
                    :model="userFromData"
                >
                    <el-form-item label="用户姓名" prop="name">
                        <el-input v-model="userFromData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="用户账号" prop="account">
                        <el-input v-model="userFromData.account"></el-input>
                    </el-form-item>
                    <el-form-item v-if="dialogTitle === '新建用户'" label="账号密码" prop="password">
                        <el-input v-model="userFromData.password"></el-input>
                    </el-form-item>
                    <el-form-item v-if="dialogTitle === '新建用户'" label="确认密码" prop="confirm">
                        <el-input v-model="userFromData.confirm"></el-input>
                    </el-form-item>
                    <el-form-item label="用户平台" prop="userType">
                        <!-- <el-input v-model="userFromData.status"></el-input> -->
                        <el-select
                            v-model="userFromData.userType"
                            placeholder="请选择"
                            style="width:100%;"
                            @change="changeUserType"
                        >
                            <el-option
                                v-for="userType in userTypeList"
                                :key="userType +'userType'"
                                :label="userType"
                                :value="userType"
                            />
                        </el-select>
                    </el-form-item>
                    <!-- <div class="wHR">
                        <el-form-item label="账号状态" prop="status">
                            <el-input v-model="userFromData.status"></el-input>
                            <el-select
                                v-model="userFromData.status"
                                placeholder="请选择"
                                style="width:100%;"
                                @change="changeStatus"
                            >
                                <el-option
                                    v-for="status in statusList"
                                    :key="status +'status'"
                                    :label="status"
                                    :value="status"
                                />
                            </el-select>
                        </el-form-item>
                    </div> -->
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleSubmit">确 定</el-button>
                    <el-button @click="handleClose">取 消</el-button>
                </span>
            </el-dialog>

            <el-dialog
                :visible.sync="roleDialogVisible"
                width="50%"
                :close-on-click-modal="closeModel"
                :before-close="handleRoleClose"
            >   
                <template slot="title">
                    <div class="addDialog">
                        <!-- <img class="addImg" src="../assets/imgs/xj.svg" alt=""> -->
                        <span>授权角色</span>
                    </div>
                </template>
                <el-table
                    ref="roleDataTable"
                    :data="allRoleList"
                    style="width: 100%;margin-bottom: 20px;"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column
                        align="center"
                        type="selection"
                        width="50"
                    >
                    </el-table-column>
                  
                    <el-table-column
                        prop="name"
                        label="角色名称"
                        align="center"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.name }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="code"
                        label="唯一编码"
                        align="center"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.code }}
                        </template>
                    </el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleSubmitRole">确 定</el-button>
                    <el-button @click="handleRoleClose">取 消</el-button>
                </span>
            </el-dialog>

            <!-- 导入 start -->
            <el-dialog title="导入操作" :visible.sync="importVisible" :close-on-click-modal="closeModel">
                <ImportExcel :on-success="onSuccess" :before-upload="beforeUpload" style="margin: 10px 0 30px 0"></ImportExcel>
                <!-- <span slot="footer" class="dialog-footer">
                    <el-button @click="importVisible = false">取 消</el-button>
                </span> -->
            </el-dialog>
            <!-- 导入 end -->
        </div>
    </div>
</template>
<script>
import ImportExcel from '../components/ImportExcel/index.vue'
import { getAllUserPage, addUser, editUser, deleteUser, exportUser, importUser,
    userRole, grantRole, changeStatus, resetPwd } from '../api/user'
import { getAllRolePage } from '../api/role'
import { Loading } from 'element-ui'

export default {
    components: {
        ImportExcel,
    },
    data() {
        return {
            searchValue: '',
            closeModel: false,
            loading: false,
            importVisible: false,
            usersList: [],
            DialogVisible: false,
            dialogTitle: '新建变量',
            total: 1,
            labelPosition: 'top',
            userFromData: {
                account: '',
                password: '',
                confirm: '',
                name: '',
                status: '',
                userType: '',
            },
            ruleUserForm: {
                name: [
                    { required: true, message: '请输入用户姓名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符' },
                ],
                account: [
                    { required: true, message: '请输入用户登录账号', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符' },
                ],
                password: [
                    { required: true, message: '请输入账号密码', trigger: 'blur' },
                    { min: 6, max: 10, message: '长度在 6 到 10 个字符' },
                ],
                confirm: [
                    { required: true, message: '请确认密码', trigger: 'blur' },
                    { min: 6, max: 10, message: '长度在 6 到 10 个字符' },
                ],
                status: [
                    { required: true, message: '请选择账号状态', trigger: 'blur' },
                ],
                userType: [
                    { required: true, message: '请选择用户平台', trigger: 'blur' },
                ],
            },
            pageIndex: 1,
            pageSize: 10,
            singlePage: false,
            updateObj: {},
            selectIdList: [],
            statusList: ['正常', '停用'],
            userTypeList: ['后台管理用户', '客户端用户'],
            roleDialogVisible: false,
            allRoleList: [],
        }
    },
    computed: {
        changeUserStatus() {
            return function (val) {
                if (val === 0) {
                    return '正常'
                } 
                if (val === 1) {
                    return '停用'
                }
                return '删除'
            }
        },
        whereUser() {
            return function (val) {
                if (val == 1) {
                    return '后台管理用户'
                } 
                return '客户端用户'
            }
        },
    },
    created() {
        this.getAllUserPage()
    },
    methods: {
        async handleCommand(command, row) {
            // console.log(command)
            // console.log(row)
            if (command === 'auth') {
                this.editUserRole(row)
            }
            if (command === 'pwd') {
                const response = await resetPwd({ id: row.id })
                if (response.status === 200 && response.data.success) {
                    this.$message({
                        type: 'success',
                        message: `${row.account} 密码已重置为：123456 `,
                    })
                } else {
                    this.$message({
                        type: 'warning',
                        message: '重置密码失败：' + JSON.stringify(response.data.message),
                    })
                }
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
                const formData = new window.FormData()
                formData.append('file', file)
                const response = await importUser(formData)
                // console.log(response)
                if (response.status === 200) {
                    if (response.data.success) {
                        this.importVisible = false
                        this.getAllUserPage()
                    }
                } else {
                    this.$message.error('导入用户失败')
                }
            } catch {
                this.$message.error('导入用户失败')
            }
        },
        async changeSwitch(val, row) {
            // 0 正常    1停用
            // console.log(val)
            
            const response = await changeStatus({ id: row.id, status: parseInt(val) })
            if (response.status === 200 && response.data.success) {
                this.$message({
                    type: 'success',
                    message: '修改用户状态成功~',
                })
                this.getAllUserPage()
            } else {
                row.status = val == 0 ? 1 : 0
                this.$message({
                    type: 'warning',
                    message: '修改用户状态失败：' + JSON.stringify(response.data.message),
                })
            }
        },
        async handleSubmitRole() {
            if (this.selectIdList.length === 0) {
                return this.$message({
                    type: 'warning',
                    message: '请选择该用户所属角色~',
                })
            }
            const result = await grantRole({ id: this.updateObj.id, grantRoleIdList: this.selectIdList })
            if (result.status === 200 && result.data.success) {
                this.roleDialogVisible = false
                this.$message({
                    type: 'success',
                    message: '授权成功~',
                })
            } else {
                this.$message({
                    type: 'warning',
                    message: '用户授权角色失败',
                })
            }
        },
        handleRoleClose() {
            this.allRoleList = []
            this.selectIdList = []
            this.roleDialogVisible = false
            this.updateObj = {}
        },
        cellStyle({ row, column, rowIndex, columnIndex }) {
            // 状态列字体颜色
            if (row.status === 0 && columnIndex === 5) {
                return 'color: rgba(4, 112, 242, 1)'
            }
            if (row.status === 1 && columnIndex === 5) {
                return 'color: rgba(229, 9, 22, 1)'
            } 
            if (row.status === 2 && columnIndex === 5) {
                return 'color: rgba(161, 163, 171, 1)'
            }
            // return 'color: rgba(161, 163, 171, 1)'
        },
        async editUserRole(row) {
            // console.log(row)
            this.updateObj = row
            const loading = Loading.service({ text: '查询中...' })
            const response = await getAllRolePage({ PageSize: 200 })
            if (response.status === 200 && response.data.success) {
                if (response.data.data.rows.length > 0) {
                    this.allRoleList = response.data.data.rows.filter((item) => item.roleType === row.userType)
                } else {
                    this.allRoleList = []
                }
                // this.allRoleList = response.data.data.rows
                const result = await userRole({ id: row.id })
                if (result.status === 200 && result.data.success) {
                    loading.close()
                    // console.log(result)
                    this.selectIdList = result.data.data
                    this.roleDialogVisible = true
                    this.$nextTick(() => {
                        if (this.selectIdList.length > 0 && this.allRoleList.length > 0) {
                            this.selectIdList.forEach(id => {
                                this.allRoleList.forEach(item => {
                                    if (id === item.id) {
                                        this.$refs.roleDataTable.toggleRowSelection(item)
                                    }
                                })
                            })
                        }
                    })
                } else {
                    loading.close()
                    this.$message({
                        type: 'warning',
                        message: '获取用户角色列表失败',
                    })
                }
            } else {
                loading.close()
                this.$message({
                    type: 'warning',
                    message: '获取用户角色列表失败',
                })
            }
            
            // const response1 = await grantRole({ id: row.id })
        },
        async handleQuery() {
            const response = await getAllUserPage({
                PageSize: this.pageSize,
                Account: this.searchValue,
            })
            // console.log(response)
            if (response.status === 200 && response.data.success) {
                this.usersList = response.data.data.rows
                this.total = response.data.data.totalRows
                this.$message({
                    type: 'success',
                    message: '查询成功~',
                })
            } else {
                this.$message({
                    type: 'warning',
                    message: JSON.stringify(response.data.message),
                })
            }
        },
        changeStatus(val) {
            this.userFromData.status = val
        },
        changeUserType(val) {
            this.userFromData.userType = val
        },
        async exportData() {
            this.$confirm('您确定导出所有用户数据吗?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                const response = await exportUser()
                // console.log(response)
                this.excelDownload(response.data, '用户管理' + Date.now())
            }).catch((err) => {
                if (err !== 'cancel') {
                    return this.$message.error('导出失败！')
                }
                this.$message({
                    type: 'info',
                    message: '已取消导出',
                })
            })
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
        moreDelete() {
            this.$message({
                type: 'warning',
                message: '暂无批量删除接口',
            })
            // if (this.selectIdList.length > 0) {
            //     this.$confirm('此操作将删除选中的数据, 是否继续?', '警告', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning',
            //     }).then(async () => {
            //         const response = await moreDeleteVariable({ variableIdList: this.selectIdList })
            //         // console.log(response)
            //         if (response.status === 200 && response.data.success) {
            //             this.getVariablePage()
            //             this.$message({
            //                 type: 'success',
            //                 message: '删除成功!',
            //             })
            //         } else {
            //             this.$message({
            //                 type: 'warning',
            //                 message: '删除失败：' + response.data.message,
            //             })
            //         }
            //     }).catch((err) => {
            //         if (err !== 'cancel') {
            //             return this.$message.error('删除失败！')
            //         }
            //         this.$message({
            //             type: 'info',
            //             message: '已取消删除',
            //         })
            //     })
            // } else {
            //     this.$message({
            //         type: 'warning',
            //         message: '请选择要删除的数据！',
            //     })
            // }
        },
        handleUserAdd() {
            this.DialogVisible = true
            this.dialogTitle = '新建用户'
        },
        handleEdit(obj) {
            // console.log(obj)
            this.DialogVisible = true
            this.dialogTitle = '编辑用户'
            this.updateObj = obj

            this.userFromData.name = obj.name
            this.userFromData.account = obj.account
            // this.userFromData.password = ''
            // this.userFromData.confirm = ''
            if (obj.status === 0) {
                this.userFromData.status = '正常'
            } else {
                this.userFromData.status = '停用'
            }
            if (obj.userType === 1) {
                this.userFromData.userType = '后台管理用户'
            } else {
                this.userFromData.userType = '客户端用户'
            }
        },
        handleDelete(obj) {
            this.$confirm('此操作将删除这条数据, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                const response = await deleteUser({ id: obj.id })
                // console.log(response)
                if (response.status === 200 && response.data.success) {
                    this.getAllUserPage()
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
            this.dialogTitle = ''

            this.userFromData.name = ''
            this.userFromData.account = ''
            this.userFromData.password = ''
            this.userFromData.confirm = ''
            this.userFromData.status = ''
            this.userFromData.userType = ''
            this.updateObj = {}
            this.$refs.userForm.clearValidate()
        },
        handleSubmit() {
            this.$refs.userForm.validate(async valid => {
                if (valid) {
                    if (this.userFromData.password === this.userFromData.confirm) {
                        let response
                        const title = this.dialogTitle
                        if (this.dialogTitle === '新建用户') {
                            response = await addUser({
                                name: this.userFromData.name,
                                account: this.userFromData.account,
                                password: this.userFromData.password,
                                confirm: this.userFromData.confirm,
                                status: parseInt(0),
                                userType: parseInt(this.userFromData.userType === '后台管理用户' ? 1 : 2),
                            })
                        // console.log(response)
                        } else {
                            response = await editUser({
                                id: this.updateObj.id,
                                name: this.userFromData.name,
                                account: this.userFromData.account,
                                password: this.userFromData.password,
                                confirm: this.userFromData.confirm,
                                // status: parseInt(this.userFromData.status),
                                userType: parseInt(this.userFromData.userType === '后台管理用户' ? 1 : 2),
                            })
                        // console.log(response)
                        }
                        if (response.status === 200 && response.data.success) {
                            this.handleClose()
                            this.$message({
                                type: 'success',
                                message: title + '成功!',
                            })
                            // 更新界面
                            this.getAllUserPage()
                        } else {
                            this.$message({
                                type: 'warning',
                                message: title + '失败：' + JSON.stringify(response.data.message),
                            })
                        }
                    } else {
                        this.$message({
                            type: 'warning',
                            message: '密码和确认密码不一致',
                        })
                    }
                }
            })
        },
        importDialog() {},
        handleCurrentChange(val) {
            this.pageIndex = val
            this.getAllUserPage()
        },
        handleSelectionChange(val) {
            // console.log(val)
            this.selectIdList = val.map(item => item.id) 
            // console.log(val)
            // console.log(this.selectIdList)
        },
        async getAllUserPage() {
            const response = await getAllUserPage({
                PageNo: this.pageIndex,
                PageSize: this.pageSize,
            })
            // console.log(response)
            if (response.status === 200 && response.data.success) {
                this.usersList = response.data.data.rows
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
            bottom: 20px;
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
    // .oprateCell{
    //     width: 100%;
    //     text-align: center;
    //     padding-left: 25px;
    // }
    // .oprateTable{
    //     float: left;
    //     margin: 0 auto;
    // }
    // .oprateTable:first-child {
    //     width: 16px;
    //     height: 16px;
    //     margin-right: 20px;
    //     background: url('../assets/imgs/editBlack.svg') no-repeat;
    //     background-size: 100%;
    // }
    // .oprateTable:first-child:hover {
    //      width: 16px;
    //      height: 16px;
    //     background: url('../assets/imgs/editBlue.svg') no-repeat;
    //     background-size: 100%;
    // }
    // .oprateTable:last-child {
    //     width: 15px;
    //     height: 19px;
    //     background: url('../assets/imgs/deleteBlack.svg') no-repeat;
    //     background-size: 100%;
    // }
    // .oprateTable:last-child:hover {
    //     width: 15px;
    //     height: 19px;
    //     background: url('../assets/imgs/sdeleteBule.svg') no-repeat;
    //     background-size: 100%;
    // }

.oprateCell{
        display: flex;
        justify-content: space-between;
        width: 100%;
        text-align: center;
        // padding-left: 25px;
}
.oprateFirst {
    padding: 0 25px;
}

// .oprateTable{
//    di
// }
// .oprateTable:first-child {
//     margin-right: 15px;
//     font-weight: bold;
//     cursor: pointer;
// }
// .oprateTable:first-child:hover {
//     color: #285ad8;
    
// }
.oprateTable:nth-child(1) {
    width: 16px;
    height: 16px;
    margin-right: 10px;
    margin-top: 5px;
    background: url('../assets/imgs/editBlack.svg') no-repeat;
    background-size: 100%;
    vertical-align: middle;
}

.oprateTable:nth-child(1):hover {
    width: 16px;
    height: 16px;
    background: url('../assets/imgs/editBlue.svg') no-repeat;
    background-size: 100%;
    vertical-align: middle;
}
.oprateTable:nth-child(2) {
    width: 15px;
    height: 19px;
    margin-top: 5px;
    background: url('../assets/imgs/deleteBlack.svg') no-repeat;
    background-size: 100%;
    vertical-align: middle;
}
.oprateTable:nth-child(2):hover {
    width: 15px;
    height: 19px;
    background: url('../assets/imgs/sdeleteBule.svg') no-repeat;
    background-size: 100%;
    vertical-align: middle;
}
.oprateTable:last-child {
    margin-left: 10px;
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
.el-dropdown-link {
    cursor: pointer;
    color: #285ad8;
  }
.el-icon-arrow-down {
    font-size: 12px;
}
.oprateCell >>> .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover{
    color: #285ad8 !important;
 }
 
</style>