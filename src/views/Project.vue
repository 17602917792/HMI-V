<template>
    <div class="container">
        <div class="operation">
            <div class="sort">
                <div class="allSort">全部</div>
                <div class="timeSort">
                    <span>按时间正序</span>
                    <img src="../assets/imgs/sort.svg" alt="">
                </div>
            </div>
            <div v-if="$isHasAuth('PROJECT_ADD')" class="addBtn" @click="addProject">+  新建项目</div>
        </div>
        <template v-for=" (item, index) in projectList">
            <ProjectItem
                :key="index"
                :project-object="item"
                @on-success="getAllProjects()"
                @update-project="handleUpdateProject"
            ></ProjectItem>
        </template>
        <div style="width: 100%; height: 80px;"></div>

        <!-- 添加项目 对话框  start -->
        <el-dialog
            :visible.sync="DialogVisible"
            width="50%"
            top="15vh"
            :close-on-click-modal="closeModel"
            :before-close="handleAddClose"
        >   
            <template slot="title">
                <div class="addDialog">
                    <img class="addImg" src="../assets/imgs/xj.svg" alt="">
                    <span>{{ dialogTitle }}</span>
                </div>
            </template>

            <el-form
                ref="addForm"
                :label-position="labelPosition"
                :rules="ruleAddForm"
                label-width="80px"
                :model="addFromData"
            >
                <el-form-item label="项目名称" prop="projectName">
                    <el-input v-model="addFromData.projectName"></el-input>
                </el-form-item>
                <el-form-item v-if="dialogTitle === '编辑项目'" label="创建人" prop="addUser">
                    <el-input v-model="addFromData.addUser"></el-input>
                </el-form-item>
                <el-form-item label="项目描述" prop="describe">
                    <el-input
                        v-model="addFromData.describe"
                        resize="none"
                        type="textarea"
                        class="iptTextarea"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleAddSubmit">确 定</el-button>
                <el-button @click="handleAddClose">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 添加项目 对话框  end -->
    </div>
</template>
<script>
import ProjectItem from './components/ProjectItem.vue'
import { getProjects, addProject, updateProject } from '../api/project'

export default {
    name: 'Project',
    components: { ProjectItem },
    data() {
        return {
            closeModel: false,
            projectList: [],
            DialogVisible: false,
            dialogTitle: '新建项目',
            updateObject: {},
            labelPosition: 'top',
            addFromData: {
                projectName: '',
                addUser: '',
                describe: '',
            },
            ruleAddForm: {
                projectName: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' },
                    { max: 15, message: '长度最多15个字符' },
                ],
                addUser: [
                    { required: true, message: '请输入创建人', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符' },
                ],
                describe: [
                    // { required: true, message: '请输入项目描述', trigger: 'blur' },
                ],
            },
        }
    },
    created() {
        this.getAllProjects()
    },
    methods: {
        handleUpdateProject(updateObject) {
            this.DialogVisible = true
            this.dialogTitle = '编辑项目'

            // console.log(updateObject)
            this.updateObject = updateObject
            this.addFromData.projectName = updateObject.projectName
            this.addFromData.addUser = updateObject.createdUserName
            this.addFromData.describe = updateObject.desc
        },
        async getAllProjects() {
            const response = await getProjects({
                PageNo: 1,
                PageSize: 200,
            })
            // console.log(response)
            if (response.status === 200 && response.data.success) {
                this.projectList = response.data.data.rows
            } else {
                this.$message({
                    type: 'warning',
                    message: '获取项目列表失败：' + JSON.stringify(response.data.message),
                })
            }
        },
        addProject() {
            this.DialogVisible = true
            this.dialogTitle = '新建项目'

            this.addFromData.projectName = ''
            this.addFromData.addUser = ''
            this.addFromData.describe = ''
            this.updateObject = {}
        },
        handleAddClose() {
            this.DialogVisible = false
            this.addFromData.projectName = ''
            this.addFromData.addUser = ''
            this.addFromData.describe = ''
            this.$refs.addForm.clearValidate()
        },
        handleAddSubmit() {
            this.$refs.addForm.validate(async valid => {
                if (valid) {
                    let response
                    if (this.dialogTitle === '新建项目') {
                        response = await addProject({
                            projectName: this.addFromData.projectName,
                            desc: this.addFromData.describe,
                            // addUser: this.addFromData.addUser,
                            // sort: 0,
                            parentId: 0,
                        })
                        // console.log(response)
                    } else {
                        response = await updateProject({
                            projectName: this.addFromData.projectName,
                            desc: this.addFromData.describe,
                            addUser: this.addFromData.addUser,
                            // sort: 0,
                            parentId: 0,
                            id: this.updateObject.id,
                        })
                        // console.log(response)
                    }
                    if (response.status === 200 && response.data.success) {
                        this.handleAddClose()
                        this.$message({
                            type: 'success',
                            message: this.dialogTitle + '成功!',
                        })
                        // 更新界面
                        this.getAllProjects()
                    } else {
                        this.$message({
                            type: 'warning',
                            message: this.dialogTitle + '失败：' + JSON.stringify(response.data.message),
                        })
                    }
                }
            })
        },
    },
}
</script>
<style scoped>
.container {
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    height: 100%;
    padding-left: 30px;
    padding-top: 20px;
    padding-bottom: 80px;
    background-color: #f8f8f9;
    /* background-color: #2525be; */
    overflow-y: auto;
}
.operation {
    display: flex;
    width: 100%;
    height: 52px;
    margin-bottom: 20px;
}
.operation .sort {
    flex: 1;
    height: 52px;
    padding-right: 20px;
    line-height: 52px;
    background: #FFFFFF;
    border-radius: 5px 5px 5px 5px;
    opacity: 1;
    border: 1px solid #F1F2F7;
    font-size: 13px;
    color: #8b8b8b;
}
.operation .sort img{
    width: 25px;
    height: 18px;
    margin-left: 10px;
    vertical-align: middle;
    cursor: pointer;
}
.operation .addBtn {
    width: 127px;
    height: 52px;
    margin: 0 30px;
    background: #285AD8;
    border-radius: 5px 5px 5px 5px;
    opacity: 1;
    line-height: 52px;
    font-size: 18px;
    color: #ffffff;
    text-align: center;
    cursor: pointer;
}
.sort .allSort {
    padding-left: 30px;
    float: left;
    font-size: 14px;
    font-weight: bold;
    color: #285ad8;
}
.sort .timeSort {
    float: right;
}

/* 新建项目 对话框  start */
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
/* 新建项目 对话框  end */

</style>
<style scoped>
.container >>> .el-dialog__header {
    padding: 20px 30px 0px;
}
.container >>> .el-dialog__body {
    padding: 15px 30px 35px;
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
    padding: 0 0 50px;
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
