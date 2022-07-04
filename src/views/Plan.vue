<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>方案配置</span>
                <!-- <span>变量管理</span> -->
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
            </div>
            <div class="mainContent">
                <div class="item-left">
                    <p>方案目录 <span @click="hanleParentDir">+新建目录</span></p>
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
                    <p>工艺信息</p>
                    <div style="margin-bottom: 15px;">
                        <el-button type="primary" @click="dialogForm= true">添加</el-button>
                        <!-- 			<el-button type="primary">删除</el-button>
						<el-button type="primary">复制</el-button> -->
                    </div>
                    <el-dialog title="添加工艺" :visible.sync="dialogForm">
                        <el-form :model="form">
                            <el-form-item label="模板名称" :label-width="formLabelWidth">
                                <el-input v-model="form.name" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="描述" :label-width="formLabelWidth">
                                <el-input v-model="form.describe" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="dialogFormSure">确 定</el-button>
                        </div>
                    </el-dialog>
                    <el-table
                        :data="tableData"
                        border
                        tooltip-effect="dark"
                        style="width: 100%;"
                    >
                        <el-table-column
                            align="center"
                            prop="id"
                            width="80"
                            label="ID"
                        >
                        </el-table-column>
                        <el-table-column align="center" prop="templateName" label="模板名称">
                        </el-table-column>
                        <el-table-column align="center" prop="desc" label="描述">
                        </el-table-column>
                        <el-table-column align="center" prop="operation" label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" @click="handleEdit()">
                                    编辑
                                </el-button>
                                <el-popconfirm
                                    title="是否确定删除吗？"
                                    @confirm="handleDelete(scope.row)"
                                >
                                    <el-button slot="reference" size="mini" type="danger">删除</el-button>
                                </el-popconfirm>
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
        <el-dialog :title="stationDirTitle" :visible.sync="dialogFormVisible" width="500px">
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
import {
    getPlanStationdirs, addPlanStationdirs, getstationdPage, addTemplate, deleteTemplate,
} from '../api/plan.js'

export default {
    components: {
        TreeTool,
    },
    data() {
        return {
            tableData: [],
            dialogForm: false,
            projects: [{
                typeName: 'HMI',
                parentId: 0,
                id: '00',
                children: [{
                    typeName: 'HMI-V2',
                    parentId: '01',
                    id: '011',
                }],
            },
            {
                typeName: 'DT-HMI-001',
                parentId: 1,
                id: 11,
            },
            {
                typeName: 'DT-HMI-001',
                parentId: 2,
                id: 22,
            },
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
                name: '',
                describe: '',
            },
            currentStationdirInfo: {}, // 当前目录信息
            currentStationdirId: '', // 当前目录id
            total: 0,
            pageIndex: 1,
            pageSize: 10,
            singlePage: false,
            currentStationdir: {}, // 当前选择的工位目录
            multipleSelection: [],
        }
    },
    created() {
        this.getAllStationdirsTreelist()
    },
    methods: {
			
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
            const response = await getPlanStationdirs()
            console.log(response)
            if (response.status === 200 && response.data.success) {
                console.log(response.data.data, 5555666)
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
        // 添加工艺信息
        dialogFormSure() {
            this.addTemplate()
            this.dialogForm = false
        },
        async addTemplate() {
            const response = await addTemplate({
                dirId: this.currentStationdir.id,
                templateName: this.form.name,
                desc: this.form.describe,
            })
            console.log(response)
            if (response.status === 200 && response.data.success) {
					    this.getstationdPage()
            }
        },
        // 修改工艺
        handleEdit(id) {
				 this.$router.push('/home')
        },
        // 删除工艺
        handleDelete(row) {
            this.deleteTemplate(row)
        },
        async deleteTemplate(row) {
            console.log()
            const response = await deleteTemplate({
                id: row.id,
            })
            if (response.data.success === true) {
					    this.getstationdPage()
            }
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
                const response = await addPlanStationdirs({
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
                const response = await editPlanStationdir({
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
                const response = await addPlanStationdirs({
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

	.mainContent p span {
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