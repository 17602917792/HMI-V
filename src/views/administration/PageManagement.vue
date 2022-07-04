<template>
    <div class="container">
        <div class="content">
            <div class="title">
                <p>页面管理</p>
                <div v-if="$isHasAuth('PAGE_DIR_ADD')" @click="handleDirAdd">
                    <img src="../../assets/imgs/newAdd.svg" alt="">
                    <span>新建</span>
                </div>
            </div>
            <div class="main">
                <ol>
                    <template v-for="(item,index) in treeList">
                        <li :key="index">
                            <div class="parentItem">
                                <div>
                                    <span class="order">{{ index + 1 }}.</span>
                                    <span class="name">{{ item.name }}</span>
                                    <span class="desc">描述：{{ item.desc }}</span>
                                </div>
                                <div class="oprate">
                                    <span v-if="$isHasAuth('PAGE_ADD')" @click="handlePageAdd(item)">添加页面</span>
                                    <span v-if="$isHasAuth('PAGE_DIR_ADD')" @click="handleDirEdit(item)">编辑目录</span>
                                    <span @click="handleExpand(index)">{{ item.isShowName }}</span>
                                    <span v-if="$isHasAuth('PAGE_DIR_DELETE')" @click="handleDelete(item)">删除目录</span>
                                </div>
                            </div>
                            <div class="childContent">
                                <PageItem
                                    :page-object="item"
                                    :is-show="item.isShow"
                                    @onsuccess="onsuccess"
                                    @handlePageEdit="handlePageEdit"
                                    @handleStaetUp="handleStaetUp"
                                ></PageItem>
                            </div>
                        </li>
                    </template>
                </ol>
            </div>

            <!-- 对话框 start -->
            <el-dialog
                :visible.sync="DialogVisible"
                width="50%"
                top="15vh"
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
                    ref="pageForm"
                    :label-position="labelPosition"
                    :rules="rulePageForm"
                    label-width="80px"
                    :model="pageFromData"
                >
                    <el-form-item v-if="dialogTitle === '新建目录' || dialogTitle === '编辑目录'" label="目录名称" prop="dirName">
                        <el-input v-model="pageFromData.dirName"></el-input>
                    </el-form-item>

                    <el-form-item v-else label="页面名称" prop="pageName">
                        <el-input v-model="pageFromData.pageName"></el-input>
                    </el-form-item>
                    
                    <el-form-item label="描述" prop="describe">
                        <el-input
                            v-model="pageFromData.describe"
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
            <!-- 对话框  end -->
        </div>
    </div>
</template>
<script>
import PageItem from '../components/PageItem.vue'
import { treePages, deletePage, addPages, editPage, setstartup } from '../../api/managementPage'

export default {
    components: {
        PageItem,
    },
    data() {
        return {
            stationId: this.$route.query.stationId,
            projectId: this.$route.query.projectId,
            treeList: [],
            DialogVisible: false,
            closeModel: false,
            dialogTitle: '',
            labelPosition: 'top',
            pageFromData: {
                dirName: '',
                pageName: '',
                describe: '',
            },
            rulePageForm: {
                dirName: [
                    { required: true, message: '请输入目录名称', trigger: 'blur' },
                    { max: 20, message: '长度最多输入 20 个字符' },
                ],
                pageName: [
                    { required: true, message: '请输入页面名称', trigger: 'blur' },
                    { max: 20, message: '长度最多输入 20 个字符' },
                ],
                describe: [
                    // { required: true, message: '请输入描述', trigger: 'blur' },
                    { max: 40, message: '长度最多输入 40 个字符' },
                ],
            },
            updateObj: {},
            parentId: 0,
        }
    },
    created() {
        this.treePages()
        // console.log(this.stationId)
        // console.log(this.projectId)
    },
    methods: {
        async handleStaetUp(pageItem) {
            const response = await setstartup({ id: pageItem.id })
            if (response.status === 200 && response.data.success) {
                this.treePages()
            } else {
                this.$message({
                    type: 'warning',
                    message: JSON.stringify(response.data.message),
                })
            }
        },
        handlePageEdit(pageItem) {
            this.DialogVisible = true
            this.dialogTitle = '编辑页面'
            // console.log(object)
            this.updateObj = pageItem
            this.pageFromData.dirName = ''
            this.pageFromData.describe = pageItem.desc
            this.pageFromData.pageName = pageItem.name
        },
        handleDirEdit(object) {
            this.DialogVisible = true
            this.dialogTitle = '编辑目录'
            // console.log(object)
            this.updateObj = object
            this.pageFromData.dirName = object.name
            this.pageFromData.describe = object.desc
            this.pageFromData.pageName = ''
        },
        handleDirAdd() {
            this.DialogVisible = true
            this.dialogTitle = '新建目录'
            this.parentId = 0
        },
        handlePageAdd(item) {
            // console.log(item)
            this.DialogVisible = true
            this.dialogTitle = '新建页面'
            this.parentId = item.id
        },
        handleClose() {
            this.DialogVisible = false
            this.dialogTitle = ''
            this.updateObj = {}
            this.pageFromData.dirName = ''
            this.pageFromData.pageName = ''
            this.pageFromData.describe = ''

            this.parentId = 0
            this.$refs.pageForm.clearValidate()
        },
        handleSubmit() {
            // console.log(this.updateObj)
            this.$refs.pageForm.validate(async valid => {
                if (valid) {
                    let response
                    const title = this.dialogTitle
                    if (this.dialogTitle === '新建目录') {
                        response = await addPages({
                            stationId: this.stationId,
                            parentId: this.parentId,
                            name: this.pageFromData.dirName,
                            type: 0, // 0目录 1页面
                            desc: this.pageFromData.describe,
                        })
                        // console.log(response)
                    } else if (this.dialogTitle === '新建页面') {
                        response = await addPages({
                            stationId: this.stationId,
                            parentId: this.parentId,
                            name: this.pageFromData.pageName,
                            type: 1, // 0目录 1页面
                            desc: this.pageFromData.describe,
                        })
                    } else if (this.dialogTitle === '编辑目录') {
                        response = await editPage({
                            id: this.updateObj.id,
                            name: this.pageFromData.dirName,
                            desc: this.pageFromData.describe,
                        })
                    } else if (this.dialogTitle === '编辑页面') {
                        response = await editPage({
                            id: this.updateObj.id,
                            name: this.pageFromData.pageName,
                            desc: this.pageFromData.describe,
                        })
                    }
                    // console.log(response)
                    if (response.status === 200 && response.data.success) {
                        this.handleClose()
                        this.$message({
                            type: 'success',
                            message: title + '成功!',
                        })
                        // 更新界面
                        this.treePages()
                    } else {
                        this.$message({
                            type: 'warning',
                            message: title + '失败：' + JSON.stringify(response.data.message),
                        })
                    }
                }
            })
        },
        handleDelete(object) {
            this.$confirm('此操作将删除这个目录, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                const response = await deletePage({ id: object.id })
                // console.log(response)
                if (response.status === 200 && response.data.success) {
                    this.treePages()
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
        onsuccess() {
            this.treePages()
        },        
        handleExpand(index) {
            let item = this.treeList[index] 
            item.isShow = !item.isShow 
            if (item.isShow) {
                item.isShowName = '收起目录'
            } else {
                item.isShowName = '展开目录'
            }
            this.$set(this.treeList, index, item) 
        },
        async treePages() {
            const response = await treePages({
                StationId: this.stationId,
            })
            // console.log(response)
            if (response.status === 200 && response.data.success) {
                this.treeList = response.data.data
                this.treeList.forEach(item => {
                    item.isShow = true
                    item.isShowName = '收起目录'
                })
                // console.log(this.treeList)
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
        .main {
            ol li {
                width: 100%;
                margin-bottom: 30px;
            }
            .parentItem {
                display: flex;
                position: relative;
                padding-bottom: 10px;
                border-bottom: 1px solid #f1f2f7;
                span {
                    margin-right: 30px;
                    font-size: 16px;
                }
                span.name {
                    color: #3c557a;
                }
                span.order {
                    margin-right: 20px;
                    font-size: 20px;
                }
                 span.desc {
                    color: #7a8596;
                }
                // span.name{
                //     display: inline-block;
                //     width: 260px;
                // }
                .oprate {
                    position: absolute;
                    right: 0;
                    span {
                        margin-left: 50px;
                        margin-right: 0;
                        font-size: 16px;
                        color: #285ad8;
                        cursor: pointer;
                    }
                }
                
            }
            .childContent {
                width: 100%;
            }
        }
        // 对话框 start
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
        // 对话框 end
    }
    
}

</style>

<style scoped>
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
