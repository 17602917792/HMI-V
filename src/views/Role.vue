<template>
    <div class="container">
        <div class="content">
            <div class="title">
                <p>角色管理</p>
                <div class="btnBox">
                    <div v-if="$isHasAuth('ROLE_ADD')" @click="handleAddRole">
                        <img src="../assets/imgs/newAdd.svg" alt="">
                        <span>新建</span>
                    </div>
                </div>
            </div>

            <el-table
                :data="rolesList"
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
                    prop="name"
                    label="角色名称"
                    align="left"
                >
                    <template slot-scope="scope">
                        {{ scope.row.name }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="code"
                    label="角色编码"
                    align="left"
                >
                    <template slot-scope="scope">
                        {{ scope.row.code }}
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    prop="status"
                    label="状态"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.status }}
                    </template>
                </el-table-column> -->
                <el-table-column
                    prop="roleType"
                    label="用户平台"
                    align="left"
                >
                    <template slot-scope="scope">
                        <el-tag
                            v-if="scope.row.roleType == 1"
                            type="primary"
                            disable-transitions
                        >
                            {{ whereRole(scope.row.roleType) }}
                        </el-tag>
                        <el-tag
                            v-if="scope.row.roleType === 2"
                            type="success"
                            disable-transitions
                        >
                            {{ whereRole(scope.row.roleType) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="roleLevel"
                    label="角色等级"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.roleLevel }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="sort"
                    label="排序"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.sort }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="角色备注"
                    align="left"
                >
                    <template slot-scope="scope">
                        {{ scope.row.remark }}
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="$isHasAuth('ROLE_OWN_MENU') || $isHasAuth('ROLE_UPDATE') || $isHasAuth('ROLE_DELETE')"
                    label="操作"
                    width="120"
                    align="center"
                >
                    <template slot-scope="scope">
                        <!-- <div class="oprateCell">
                            <span class="oprateTable" @click="handleEdit(scope.row)"></span>
                            <span class="oprateTable" @click="handleDelete(scope.row)"></span>
                        </div> -->
                        <div :class="{oprateCell: true,oprateLess: !($isHasAuth('ROLE_OWN_MENU') && scope.row.roleType == 1)}">
                            <div v-if="$isHasAuth('ROLE_UPDATE')" class="oprateTable" @click="handleEdit(scope.row)"></div>
                            <div v-if="$isHasAuth('ROLE_DELETE')" class="oprateTable" @click="handleDelete(scope.row)"></div>
                            <div
                                v-if="$isHasAuth('ROLE_OWN_MENU') && scope.row.roleType == 1"
                                class="oprateTable"
                                @click="handleAuth(scope.row)"
                            >
                                分配权限
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
                    ref="roleForm"
                    :label-position="labelPosition"
                    :rules="ruleRoleForm"
                    label-width="80px"
                    :model="roleFromData"
                >
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="roleFromData.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色编码" prop="code">
                        <el-input v-model="roleFromData.code"></el-input>
                    </el-form-item>
                    <div class="wHR">
                        <el-form-item label="排序" prop="sort">
                            <el-input
                                ref="sort"
                                v-model="roleFromData.sort"
                                placeholder="数字"
                                @input="onlyNumber($event,'sort')"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="用户平台" prop="status">
                            <!-- <el-input v-model="userFromData.status"></el-input> -->
                            <el-select
                                v-model="roleFromData.roleType"
                                placeholder="请选择"
                                style="width:100%;"
                                @change="changeRoleType"
                            >
                                <el-option
                                    v-for="roleType in roleTypeList"
                                    :key="roleType +'roleType'"
                                    :label="roleType"
                                    :value="roleType"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="角色等级" prop="roleLevel">
                            <el-input
                                ref="role"
                                v-model="roleFromData.roleLevel"
                                placeholder="数字"
                                @input="onlyNumber($event,'roleLevel')"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <el-form-item label="角色备注" prop="remark">
                        <el-input
                            v-model="roleFromData.remark"
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
            <el-dialog
                :visible.sync="authDialog"
                width="30%"
                :close-on-click-modal="closeModel"
                :before-close="handleAuthClose"
                @open="loadAuthList"
            >
                <template slot="title">
                    <div class="addDialog">
                        <span>授权菜单</span>
                    </div>
                </template>
                <div class="el-dialog-div">
                    <div style="padding-left: 16px; font-size: 16px;">菜单权限：</div>
                    <div style="flex: 1;">
                        <el-checkbox v-model="roleChecked" style="margin:3px 0 10px 10px;" @change="checkedAllRole" /> 全部/全不选
                        <el-scrollbar>
                            <div class="content-box">
                                <el-tree
                                    ref="authTree"
                                    :data="permissionData"
                                    :props="{ label: 'name' }"
                                    :default-checked-keys="ownAuthList"
                                    :default-expand-all="true"
                                    :show-checkbox="true"
                                    :check-strictly="true"
                                    node-key="id"
                                    style=" margin-bottom: 20px;"
                                />
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleAuthSubmit">确 定</el-button>
                    <el-button @click="handleAuthClose">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
// import ImportExcel from '../components/ImportExcel/index.vue'
import { getAllRolePage, addRoleInfo, updateRoleInfo, deleteRoleInfo, getOwnMenu, grantMenu } from '../api/role'
import { getMenuList } from '../api/menu'

export default {
    components: {
        // ImportExcel,
    },
    data() {
        return {
            roleChecked: false,
            permissionData: [], // 所有菜单
            ownAuthList: [], // 角色拥有的菜单id
            authDialog: false,
            closeModel: false,
            rolesList: [],
            DialogVisible: false,
            dialogTitle: '新建角色',
            total: 1,
            labelPosition: 'top',
            roleFromData: {
                roleName: '',
                code: '',
                remark: '',
                sort: '',
                roleType: '',
                roleLevel: '',
            },
            ruleRoleForm: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                ],
                code: [
                    { required: true, message: '请输入角色编码', trigger: 'blur' },
                ],
                // remark: [
                //     { required: true, message: '请输入角色备注', trigger: 'blur' },
                // ],
                sort: [
                    { required: true, message: '请输入排序', trigger: 'blur' },
                ],
                roleLevel: [
                    { required: true, message: '请输入角色等级', trigger: 'blur' },
                ],
                roleType: [
                    { required: true, message: '请选择角色平台', trigger: 'blur' },
                ],
            },
            pageIndex: 1,
            pageSize: 10,
            singlePage: false,
            updateObj: {},
            roleTypeList: ['后台管理用户', '客户端用户'],
            idList: [],
        }
    },
    computed: {
        whereRole() {
            return function (val) {
                if (val == 1) {
                    return '后台管理角色'
                } 
                return '客户端角色'
            }
        },
    },
    created() {
        this.getAllRolePage()
    },
    methods: {
        onlyNumber(val, type) {
            // console.log(val)
            // console.log(type)
            this.roleFromData[type] = val.replace(/[^\d]/g, '')
            // console.log(this.roleFromData[type])
        },
        queryId(array) {
            if (array.length > 0) {
                array.forEach(item => {
                    this.idList.push(item.id)
                    if (item.children) {
                        this.queryId(item.children)
                    }
                })
            } 
        },
        checkedAllRole() {
            if (this.roleChecked) {
                // 全选
                this.queryId(this.permissionData)
                // console.log(this.permissionData)
                // console.log(this.idList)
                // this.$refs.authTree.setCheckedNodes(this.permissionData)
                this.ownAuthList = this.idList
            } else {
                // 取消选中
                this.$refs.authTree.setCheckedKeys([])
            }
        },
        changeRoleType(val) {
            this.roleFromData.roleType = val
        },
        async handleAuthSubmit() {
            const response = await grantMenu({
                id: this.updateObj.id,
                grantMenuIdList: this.$refs.authTree.getCheckedKeys(),
            })
            if (response.status === 200 && response.data.success) {
                this.authDialog = false
                this.$message({
                    type: 'success',
                    message: '授权菜单成功!',
                })
            } else {
                this.$message.error('授权菜单失败!')
            }
        },
        // 获取权限列表数据
        loadAuthList() {
            const response = getMenuList()
            const auths = getOwnMenu({ id: this.updateObj.id })
            Promise.all([response, auths]).then(results => {
                this.permissionData = results[0].data.data
                // console.log(this.permissionData)
                this.ownAuthList = results[1].data.data
                // console.log(this.ownAuthList)
                // this.$nextTick(() => {
                //     this.$refs.authTree.setCheckedKeys(results[1].data.data)
                // })
            }).catch(() => {
                this.$message.error('获取权限列表失败')
            })
        },
        handleAuth(row) {
            this.updateObj = row
            this.authDialog = true
        },
        handleAuthClose() {
            this.updateObj = {}
            this.permissionData = []
            this.ownAuthList = []
            this.authDialog = false
            this.idList = []
            this.roleChecked = false 
        },
        handleAddRole() {
            this.DialogVisible = true
            this.dialogTitle = '新建角色'
        },
        handleClose() {
            this.DialogVisible = false
            this.dialogTitle = ''

            this.roleFromData.roleName = ''
            this.roleFromData.code = ''
            this.roleFromData.remark = ''
            this.roleFromData.sort = ''
            this.roleFromData.roleType = ''
            this.roleFromData.roleLevel = ''

            this.updateObj = {}

            this.$refs.roleForm.clearValidate()
        },
        handleEdit(obj) {
            // console.log(obj)
            this.DialogVisible = true
            this.dialogTitle = '编辑角色'
            this.updateObj = obj

            this.roleFromData.roleName = obj.name
            this.roleFromData.code = obj.code
            this.roleFromData.remark = obj.remark
            this.roleFromData.sort = obj.sort
            this.roleFromData.roleLevel = obj.roleLevel
            if (obj.roleType === 1) {
                this.roleFromData.roleType = '后台管理用户'
            } else {
                this.roleFromData.roleType = '客户端用户'
            }
        },
        handleDelete(obj) {
            this.$confirm('此操作将删除这条数据, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                const response = await deleteRoleInfo({ id: obj.id })
                // console.log(response)
                if (response.status === 200 && response.data.success) {
                    this.getAllRolePage()
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
        handleSubmit() {
            this.$refs.roleForm.validate(async valid => {
                if (valid) {
                    let response
                    const title = this.dialogTitle
                    if (this.dialogTitle === '新建角色') {
                        response = await addRoleInfo({
                            name: this.roleFromData.roleName,
                            code: this.roleFromData.code,
                            remark: this.roleFromData.remark,
                            sort: parseInt(this.roleFromData.sort),
                            roleType: parseInt(this.roleFromData.userType === '后台管理用户' ? 1 : 2),
                            roleLevel: this.roleFromData.roleLevel,
                        })
                        // console.log(response)
                    } else {
                        response = await updateRoleInfo({
                            id: this.updateObj.id,
                            name: this.roleFromData.roleName,
                            code: this.roleFromData.code,
                            remark: this.roleFromData.remark,
                            sort: parseInt(this.roleFromData.sort),
                            roleType: parseInt(this.roleFromData.roleType === '后台管理用户' ? 1 : 2),
                            roleLevel: this.roleFromData.roleLevel,
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
                        this.getAllRolePage()
                    } else {
                        this.$message({
                            type: 'warning',
                            message: title + '失败：' + JSON.stringify(response.data.message),
                        })
                    }
                }
            })
        },
        handleCurrentChange(val) {
            this.pageIndex = val
            this.getAllRolePage()
        },
        handleSelectionChange() {},
        async getAllRolePage() {
            const response = await getAllRolePage({
                PageNo: this.pageIndex,
                PageSize: this.pageSize,
            })
            // console.log(response)
            if (response.status === 200 && response.data.success) {
                this.rolesList = response.data.data.rows
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
        width: 100%;
        display: flex;
        justify-content: space-between;
        // padding-left: 25px;
}
.oprateLess {
    padding: 0 20px;
}
// .oprateTable{
//     float: left;
//     margin: 0 auto;
// }

.oprateTable:nth-child(1) {
    width: 16px;
    height: 16px;
    margin-right: 15px;
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
    margin-left: 5px;
    font-weight: bold;
    cursor: pointer;
}
.oprateTable:last-child:hover {
    color: #285ad8;
}  
    /* 新建 对话框  end */
}

</style>
<style scoped>
.btnBox >>> .el-input--small .el-input__inner {
    height: 52px !important;
    line-height: 52px !important;
    font-size: 16px;
}
.el-dialog-div {
    display: flex;
    height: 70vh;
    overflow: auto;
    margin-bottom: 20px;
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