<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>工位管理</span>
                <!-- <span>变量管理</span> -->
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
            </div>
            <div class="mainContent">
                <div class="item-left">
                    <p>工位目录 <span @click="hanleParentDir">+新建目录</span></p>
                    <!-- 树形菜单 -->
                    <el-tree
                        :data="projects"
                        :props="defaultProps"
                        style="padding-right:15px;"
                        @node-click="handleStationtDirNodeClick"
                    >
                        <!-- 中间的代码就是插槽内容，用于定制每一行的布局效果 -->
                        <template v-slot="scope">
                            <tree-tool :node-data="scope.data" @on-success="onSuccess" @showStation="showStation" />
                        </template>
                    </el-tree>
                </div>
                <div class="item-right">
                    <p>工位信息</p>
                    <div style="margin-bottom: 15px;">
                        <el-button type="danger">批量关机</el-button>
                        <el-button type="warning">批量重启</el-button>
                        <el-button type="primary">批量校准时间</el-button>
                        <el-button type="info">添加工位</el-button>
                        <el-button type="info">删除工位</el-button>
                        <el-button type="info">同步下发</el-button>
                        <el-button type="info">基础配置</el-button>
                    </div>
                    <el-table
                        :data="tableData"
                        border
                        tooltip-effect="dark"
                        style="width: 100%;margin-bottom: 20px;"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column
                            align="center"
                            type="selection"
                            width="50"
                        >
                        </el-table-column>
                        <!-- <el-table-column
                            align="center"
                            prop="date"
                            width="80"
                            label="序号"
                        >
                        </el-table-column> -->
                        <el-table-column
                            prop="id"
                            align="center"
                            width="60"
                            label="序号"
                        >
                            <template slot-scope="scope">
                                {{ (pageIndex - 1) * pageSize + scope.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="name"
                            label="工位名称"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.stationName }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="address"
                            label="IP地址"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.ip }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="address"
                            label="工位描述"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.desc }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="address"
                            label="使用模板"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.templateName }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="address"
                            label="更新时间"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.updateState }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="address"
                            label="更新状态"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.updateTime }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="address"
                            label="操作"
                        >
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="primary"
                                    @click="handleEdit(scope.$index, scope.row)"
                                >
                                    编辑
                                </el-button>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDelete(scope.$index, scope.row)"
                                >
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

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
            </div>
        </el-card>
        <el-dialog
            :title="stationDirTitle"
            :close-on-click-modal="closeModel"
            :visible.sync="dialogFormVisible"
            width="500px"
        >
            <el-form :model="form">
                <el-form-item label="目录名称" :label-width="formLabelWidth">
                    <el-input v-model="form.stationName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import TreeTool from './components/TreeTool.vue'
import { getAllStationdirs, addStationdir, editStationdir, getstationdPage } from '@/api/variable.js'

export default {
    components: {
        TreeTool,
    },
    data() {
        return {
            closeModel: false,
            tableData: [],
            projects: [
                {
                    typeName: 'HMI',
                    parentId: 0,
                    id: '00',
                    children: [{ typeName: 'HMI-V2', parentId: '01', id: '011' }],
                },
                { typeName: 'DT-HMI-001', parentId: 1, id: 11 },
                { typeName: 'DT-HMI-001', parentId: 2, id: 22 },
            ],
            defaultProps: {
                label: 'typeName',
                children: 'children',
            },
            stationDirTitle: '', // 目录对话框名称
            formLabelWidth: '80px',
            dialogFormVisible: false, // 新建 编辑 目录对话框
            form: {
                stationName: '',
            },
            currentStationdirInfo: {}, // 当前目录信息
            currentStationdirId: '', // 当前目录id
            total: 0,
            pageIndex: 1,
            pageSize: 10,
            singlePage: false,
            currentStationdir: {}, // 当前选择的工位目录
            multipleSelection: [], // 表格多选数据
        }
    },
    created() {
        this.getAllStationdirsTreelist()
    },
    methods: {
        // checkbox 选中
        handleSelectionChange(val) {
            this.multipleSelection = val
            console.log(val)
        },
        handleCurrentChange(val) {
            this.pageIndex = val
            this.getstationdPage()
        },
        handleStationtDirNodeClick(data) {
            this.currentStationdir = data
            this.getstationdPage()
            // console.log(data)
        },
        async getAllStationdirsTreelist() {
            const response = await getAllStationdirs()
            // console.log(response)
            if (response.status === 200 && response.data.success) {
                this.projects = response.data.data
            }
        },
        async getstationdPage() {
            const response = await getstationdPage({
                DirId: this.currentStationdir.id,
                PageNo: this.pageIndex,
                PageSize: this.pageSize,
            })
            console.log(response)
            if (response.status === 200 && response.data.success) {
                this.tableData = response.data.data.rows
                this.total = response.data.data.totalRows
            }
        },
        onSuccess() {
            this.getAllStationdirsTreelist()
        },
        showStation(obj, type) {
            if (type === 'add') {
                this.form.stationName = ''
                this.stationDirTitle = '新建子目录'
                // console.log('add', obj)
                this.currentStationdirId = obj.id
                this.dialogFormVisible = true
            }
            if (type === 'edit') {
                this.stationDirTitle = '编辑该目录'
                // console.log('edit', obj)
                this.currentStationdirInfo = obj
                this.form.stationName = obj.typeName
                this.dialogFormVisible = true
            }
        },
        async handleSubmit() {
            if (this.stationDirTitle === '新建子目录') {
                const response = await addStationdir({
                    parentId: this.currentStationdirId,
                    typeName: this.form.stationName,
                    sort: 0,
                })
                if (response.status === 200 && response.data.success) {
                    this.dialogFormVisible = false
                    this.$message({
                        type: 'success',
                        message: '添加成功!',
                    })
                    this.onSuccess()
                }
            }
            if (this.stationDirTitle === '编辑该目录') {
                const response = await editStationdir({
                    id: this.currentStationdirInfo.id,
                    parentId: this.currentStationdirInfo.parentId,
                    sort: 0,
                    typeName: this.form.stationName,
                })
                if (response.status === 200 && response.data.success) {
                    this.dialogFormVisible = false
                    this.$message({
                        type: 'success',
                        message: '修改成功!',
                    })
                    this.onSuccess()
                }
            }

            if (this.stationDirTitle === '新建目录') {
                const response = await addStationdir({
                    parentId: 0,
                    typeName: this.form.stationName,
                    sort: 0,
                })
                if (response.status === 200 && response.data.success) {
                    this.dialogFormVisible = false
                    this.$message({
                        type: 'success',
                        message: '添加成功!',
                    })
                    this.onSuccess()
                }
            }
        },
        hanleParentDir() {
            this.form.stationName = ''
            this.stationDirTitle = '新建目录'
            this.dialogFormVisible = true
        },
    },
}
</script>
<style scoped>
.box-card {
    position: absolute;
    top: 50px;
    width: 100%;
    height: 100%;

}
.box-card .mainContent {
    display: flex;
    width: 100%;
    height: 100%;
}
.mainContent p {
    position: relative;
    margin-bottom: 15px;
    font-size: 14px;
    font-weight: bold;
}
.mainContent p span{
    position: absolute;
    right: 10px;
    padding: 1px;
    font-size: 14px;
    font-weight: normal;
    border: 1px solid #909399;
}
.mainContent .item-left {
    width: 400px;
    margin-right: 10px;
    border-right: 1px solid #ebeef5;
}
.mainContent .item-right {
    flex: 1;
}
.mainContent .item-right .el-table {
    width: 100%;
}

</style>