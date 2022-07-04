<template>
    <div class="container">
        <div class="content">
            <div class="title">
                <p>菜单管理</p>
                <div class="btnBox">
                    <!-- <el-input
                        v-model="searchValue"
                        placeholder="请输入搜索的用户名称"
                        clearable
                        class="searchIpt"
                    >
                    </el-input> -->
                    <!-- <div icon="el-icon-search">
                        <i class="el-icon-search" style="color: #ffffff; font-size: 17px;"></i>
                        <span>搜索</span>
                    </div>
                    <div>
                        <img src="../assets/imgs/stationDelete.svg" alt="">
                        <span>批量删除</span>
                    </div>
                    <div>
                        <img src="../assets//imgs/import.svg" alt="">
                        <span>导入</span>
                    </div>
                    <div>
                        <img src="../assets/imgs/export.svg" alt="">
                        <span>导出</span>
                    </div> -->
                    <div v-if="$isHasAuth('MENU_ADD')" @click="handleAdd">
                        <img src="../assets/imgs/newAdd.svg" alt="">
                        <span>新建</span>
                    </div>
                </div>
            </div>

            <el-table
                :data="menuTableData"
                style="width: 100%;margin-bottom: 20px;"
                row-key="id"
                :default-expand-all="false"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            >
                <el-table-column
                    prop="name"
                    label="菜单名称"
                    align="left"
                >
                    <template slot-scope="scope">
                        {{ scope.row.name }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="code"
                    label="菜单编号"
                    align="left"
                >
                    <template slot-scope="scope">
                        {{ scope.row.code }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="permission"
                    label="权限标识"
                    align="left"
                >
                    <template slot-scope="scope">
                        {{ scope.row.permission }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="菜单类型"
                >
                    <template slot-scope="scope">
                        <el-tag
                            v-if="scope.row.type === '0'"
                            type="primary"
                            disable-transitions
                        >
                            {{ tranteType(scope.row.type) }}
                        </el-tag>
                        <el-tag
                            v-if="scope.row.type === '1'"
                            type="success"
                            disable-transitions
                        >
                            {{ tranteType(scope.row.type) }}
                        </el-tag>
                        <el-tag
                            v-if="scope.row.type === '2'"
                            type="warning"
                            disable-transitions
                        >
                            {{ tranteType(scope.row.type) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="router"
                    label="路由"
                    align="left"
                >
                    <template slot-scope="scope">
                        {{ scope.row.router }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="sort"
                    label="排序"
                    align="left"
                >
                    <template slot-scope="scope">
                        {{ scope.row.sort }}
                    </template>
                </el-table-column>
                
                <el-table-column
                    v-if="$isHasAuth('MENU_UPDATE') || $isHasAuth('MENU_DELETE')"
                    label="操作"
                    width="120"
                    align="left"
                >
                    <template slot-scope="scope">
                        <div class="oprateCell">
                            <span v-if="$isHasAuth('MENU_UPDATE')" class="oprateTable" @click="handleEdit(scope.row)"></span>
                            <span v-if="$isHasAuth('MENU_DELETE')" class="oprateTable" @click="handleDelete(scope.row)"></span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 菜单   -->
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
                    ref="menuForm"
                    :label-position="labelPosition"
                    :rules="ruleMenu"
                    label-width="80px"
                    :model="menuFrom"
                >
                    <el-form-item label="菜单名称" prop="menuName">
                        <el-input v-model="menuFrom.menuName"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单类型" prop="menuType">
                        <!-- <el-input v-model="menuFrom.menuType"></el-input> -->
                        <el-select
                            v-model="menuFrom.menuType"
                            placeholder="请选择菜单类型"
                            style="width:100%;"
                            @change="typeChange"
                        >
                            <el-option
                                v-for="(item) in typeList"
                                :key="item"
                                :label="item"
                                :value="item"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item 
                        v-if=" (dialogTitle == '编辑菜单' && menuFrom.pId != 0) || dialogTitle == '新建菜单'" 
                        label="父级菜单"
                        prop="pId"
                    >
                        <!-- <el-input v-model="menuFrom.menuType"></el-input> -->
                        <SelectTree v-model="menuFrom.pId" :data="treeList"></SelectTree>
                    </el-form-item>
                    <el-form-item v-if="menuFrom.menuType !== '按钮'" label="菜单路由" prop="menuRouter">
                        <el-input v-model="menuFrom.menuRouter"></el-input>
                    </el-form-item>
                    <el-form-item v-if="menuFrom.menuType === '按钮'" label="权限标识" prop="permission">
                        <el-input v-model="menuFrom.permission"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单编号" prop="code">
                        <el-input v-model="menuFrom.code"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="sort">
                        <el-input v-model="menuFrom.sort"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleSubmit">确 定</el-button>
                    <el-button @click="handleClose">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
// import ImportExcel from '../components/ImportExcel/index.vue'
import SelectTree from './components/SelectTree.vue'
import { getMenuList, addMenu, editMenu, deleteMenu, getMenuTreeList } from '../api/menu'

export default {
    components: {
        // ImportExcel,
        SelectTree,
    },
    data() {
        return {
            searchValue: '',
            closeModel: false,
            loading: false,
            importVisible: false,
            menuTableData: [],
            DialogVisible: false,
            dialogTitle: '新建变量',
            labelPosition: 'top',
            menuFrom: {
                menuName: '',
                menuRouter: '',
                code: '',
                permission: '',
                menuType: '',
                sort: '',
                pId: '',
            },
            ruleMenu: {
                menuName: [
                    { required: true, message: '请输入菜单名称', trigger: 'blur' },
                ],
                menuRouter: [
                    { required: true, message: '请输入菜单路由', trigger: 'blur' },
                ],
                code: [
                    { required: true, message: '请输入菜单编号', trigger: 'blur' },
                ],
                permission: [
                    { required: true, message: '请输入权限标识', trigger: 'blur' },
                ],
                menuType: [
                    { required: true, message: '请选择菜单的类型', trigger: 'blur' },
                ],
                pId: [
                    { required: true, message: '请选择父ID', trigger: 'blur' },
                ],
                sort: [
                    { required: true, message: '请输入序号', trigger: 'blur' },
                ],
            },
            treeList: [],
            typeList: ['目录', '菜单', '按钮'],
            updateObj: {},
            selectIdList: [],
        }
    },
    computed: {
        tranteType() {
            return function (type) {
                let str = ''
                if (type === '0') {
                    str = '目录'
                }
                if (type === '1') {
                    str = '菜单'
                } 
                if (type === '2') {
                    str = '按钮'
                }
                // console.log(str)
                return str
            }
        },
    },
    created() {
        this.getMenuList()
    },
    methods: {
        typeChange(val) {
            this.menuFrom.menuType = val
        },
        handleAdd() {
            // this.DialogVisible = true
            this.dialogTitle = '新建菜单'
            this.getMenuTreeList()
        },
        handleEdit(row) {
            // console.log(row)
            // this.DialogVisible = true
            this.dialogTitle = '编辑菜单'

            this.menuFrom.menuName = row.name
            this.menuFrom.code = row.code
            this.menuFrom.sort = row.sort
            this.menuFrom.menuRouter = row.router
            this.menuFrom.permission = row.permission
            this.menuFrom.pId = row.pid
            this.menuFrom.menuType = this.typeList[row.type]

            this.updateObj = row

            this.getMenuTreeList()
        },
        handleDelete(updateObj) {
            this.$confirm('此操作将删除这条数据, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                const response = await deleteMenu({ id: updateObj.id })
                // console.log(response)
                if (response.status === 200 && response.data.success) {
                    this.getMenuList()
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

            this.menuFrom.menuName = ''
            this.menuFrom.code = ''
            this.menuFrom.sort = ''
            this.menuFrom.menuRouter = ''
            this.menuFrom.permission = ''
            this.menuFrom.menuType = ''
            this.menuFrom.pId = ''

            this.updateObj = {}

            this.$refs.menuForm.clearValidate()
        },
        handleSubmit() {
            this.$refs.menuForm.validate(async valid => {
                if (valid) {
                    let title = this.dialogTitle
                    let response
                    let type
                    this.typeList.forEach((element, index) => {
                        if (element === this.menuFrom.menuType) {
                            type = index + ''
                        }
                    })
                    // console.log(this.menuFrom)
                    // console.log(this.menuFrom.pId)
                    if (this.dialogTitle === '新建菜单') {
                        response = await addMenu({
                            name: this.menuFrom.menuName,
                            code: this.menuFrom.code,
                            permission: this.menuFrom.permission,
                            router: this.menuFrom.menuRouter,
                            sort: this.menuFrom.sort,
                            pid: this.menuFrom.pId === '000' ? 0 : this.menuFrom.pId,
                            type,
                        })
                        // console.log(response)
                    } else {
                        response = await editMenu({
                            id: this.updateObj.id,
                            name: this.menuFrom.menuName,
                            code: this.menuFrom.code,
                            permission: this.menuFrom.permission,
                            router: this.menuFrom.menuRouter,
                            sort: this.menuFrom.sort,
                            pid: this.menuFrom.pId === '000' ? 0 : this.menuFrom.pId,
                            type,
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
                        this.getMenuList()
                    } else {
                        this.$message({
                            type: 'warning',
                            message: title + '失败：' + JSON.stringify(response.data.message),
                        })
                    }
                }
            })
        },
        importDialog() {},
        async getMenuTreeList() {
            const response = await getMenuTreeList()
            // console.log(response)
            if (response.status === 200 && response.data.success) {
                this.treeList = [
                    { 
                        id: '000',
                        title: '顶级',
                        value: '000',
                        children: response.data.data,
                    },
                ]
                this.DialogVisible = true
            }
        },
        async getMenuList() {
            const response = await getMenuList()
            if (response.status === 200 && response.data.success) {
                this.menuTableData = response.data.data
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
    .oprateCell{
        width: 100%;
        text-align: center;
    }
    .oprateTable{
        float: left;
        margin: 0 auto;
    }
    .oprateTable:first-child {
        width: 16px;
        height: 16px;
        margin-right: 20px;
        background: url('../assets/imgs/editBlack.svg') no-repeat;
        background-size: 100%;
    }
    .oprateTable:first-child:hover {
         width: 16px;
         height: 16px;
        background: url('../assets/imgs/editBlue.svg') no-repeat;
        background-size: 100%;
    }
    .oprateTable:last-child {
        width: 15px;
        height: 19px;
        background: url('../assets/imgs/deleteBlack.svg') no-repeat;
        background-size: 100%;
    }
    .oprateTable:last-child:hover {
        width: 15px;
        height: 19px;
        background: url('../assets/imgs/sdeleteBule.svg') no-repeat;
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