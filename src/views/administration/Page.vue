<template>
    <div class="pages_main">
        <el-button type="primary" style="margin-bottom:2%" @click="addbur">添加目录</el-button>
        <el-table
            :data="tableData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
            <el-table-column
                prop="name"
                label="名称"
                sortable
            >
            </el-table-column>
            <el-table-column
                prop="desc"
                label="描述"
                sortable
            >
            </el-table-column>
            <el-table-column
                prop="weight"
                label="是否启动项"
            >
                <template slot-scope="scope">
                    <div v-show="scope.row.type == 1" slot="reference" class="name-wrapper">
                        <el-popconfirm
                            style="margin-left: 20px;"
                            title="是否确定确认操作吗？"
                            @confirm="handleClick(scope.row)"
                        >
                            <el-tag slot="reference" size="medium">{{ scope.row.isStartUp == true ? '是':'否' }}</el-tag>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="operation"
                label="操作"
                width="500"
            >
                <template slot-scope="scope">
                    <el-button v-show="scope.row.type == 1" size="small" @click="drawPicture(scope.row)">画图{{ scope.row.children.weight }}</el-button>
                    <el-button v-show="scope.row.type !== 1" size="small" @click="addPage(scope.row)">添加页面</el-button>
                    <el-button size="small" @click="editClick(scope.row)">编辑</el-button>
                    <el-popconfirm
                        style="margin-left: 20px;"
                        title="是否确定删除吗？"
                        @confirm="deledeClick(scope.row)"
                    >
                        <el-button slot="reference" size="small" type="danger">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
        >   
            <template slot="title">
                <div class="addDialog">
                    <img class="addImg" src="../../assets/imgs/xj.svg" alt="">
                    <span>{{ dialogTitle }}</span>
                </div>
            </template>
            <el-form
                ref="pageForm"
                :label-position="labelPosition"
                :rules="rulePlcForm"
                label-width="80px"
                :model="pageFromData"
            >
                <el-form-item label="工位" prop="station">
                    <el-input v-model="pageFromData.station"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="describe">
                    <el-input v-model="pageFromData.describe"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { treePages, addPages, editPage, deletePage, setstartup } from '@/api/managementPage.js'

export default {
    data() {
        return {
            tableData: [],
            dialogVisible: false,
            dialogTitle: '添加文档',
            labelPosition: 'top',
            rulePlcForm: {
		    station: [
		        { required: true, message: '请输入工位名称', trigger: 'blur' },
		    ],
		    describe: [
		        { required: true, message: '请输入描述', trigger: 'blur' },
		    ],
            },
            rowId: '',
            type: '',
            pageFromData: {
                station: '',
                describe: '',
            },
        }
    },
    created() {
        this.treePages()
    },
    methods: {
        async treePages() {
            let query = this.$route.query
			
            let stationId = query.stationId
            const response = await treePages({
                StationId: stationId,
            })
            console.log(response, 9587)
            if (response.status === 200 && response.data.success) {
                this.tableData = response.data.data
            }
        },
        async addPages() {
            let query = this.$route.query
            let stationId = query.stationId
            const response = await addPages({
                stationId,
                parentId: this.rowId,
                name: this.pageFromData.station,
                desc: this.pageFromData.describe,
                type: this.type,
            })
            console.log(response)
            if (response.status === 200 && response.data.success === true) {
                this.$notify({
				          title: '成功',
				          message: response.data.message,
				          type: 'success',
				 })
                this.dialogVisible = false
				 this.treePages()
            } else {
                this.$notify({
				          title: '失败',
				          message: response.data.message,
				          type: 'warning',
				 })
            }
        },
		
        async editPage() {
            let query = this.$route.query
            let stationId = query.stationId
            const response = await editPage({
                stationId,
                parentId: this.rowId,
                name: this.pageFromData.station,
                desc: this.pageFromData.describe,
                type: this.type,
            })
            console.log(response)
            if (response.status === 200 && response.data.success === true) {
                this.$notify({
				          title: '成功',
				          message: response.data.message,
				          type: 'success',
				 })
				   this.dialogVisible = false
				 this.treePages()
            } else {
                this.$notify({
				          title: '失败',
				          message: response.data.message,
				          type: 'warning',
				 })
            }
        },
        async deletePage(id) {
            const response = await deletePage({
                id,
            })
            console.log(response)
            if (response.status === 200 && response.data.success === true) {
                this.$notify({
				          title: '成功',
				          message: response.data.message,
				          type: 'success',
				 })
				   this.dialogVisible = false
				 this.treePages()
            } else {
                this.$notify({
				          title: '失败',
				          message: response.data.message,
				          type: 'warning',
				 })
            }
        },
        async setstartup(id) {
            const response = await setstartup({
                id,
            })
            console.log(response)
            if (response.status === 200 && response.data.success === true) {
                this.$notify({
				          title: '成功',
				          message: response.data.message,
				          type: 'success',
				 })
				   this.dialogVisible = false
				 this.treePages()
            } else {
                this.$notify({
				          title: '失败',
				          message: response.data.message,
				          type: 'warning',
				 })
            }
        },
	  drawPicture(row) {
		  let query = this.$route.query
		  let stationId = query.stationId
		  this.$router.push({ path: '/home', query: { stationId, id: row.id } })
	  },
	  addPage(row) {
		  console.log(row, 'addpage')
		  this.dialogTitle = '添加文档'
		  this.dialogVisible = true
		  this.rowId = row.id
		  this.type = 1
	  },
	  addbur() {
		  this.dialogTitle = '添加目录' 
		  this.dialogVisible = true
		  this.type = 0
		  this.rowId = 0
	  },
	  handleClick(row) {
		  this.$emit('confirm')
            this.setstartup(row.id)
	  },
	  editClick(row) {
            console.log(row)
		 this.pageFromData.station = row.title
		  this.pageFromData.describe = row.value,
		  this.dialogVisible = true
		  this.dialogTitle = '编辑文档'
	  },
	 deledeClick(row) {
		 this.$emit('confirm')
	  	this.deletePage(row.id)
	  },
	  handleClose() {
	      this.dialogVisible = false
	  },
	  handleSubmit() {
		  if (this.dialogTitle == '添加文档') {
			  this.addPages()
		  } else if (this.dialogTitle == '添加目录') {
			   this.addPages()
			  console.log('编辑')
		  } else {
			   this.editPage()
		  }
	  },
    },
}
</script>
<style type="text/css">
	.pages_main{
		width: 90%;
		margin: 5% auto;
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
</style>	