<template>
    <div class="container">
        <div class="content">
            <div class="title">
                <p>图片管理</p>
                <div class="btnBox">
                    <div @click="handleMoreDelete">
                        <img src="../../assets/imgs/stationDelete.svg" alt="">
                        <span>批量删除</span>
                    </div>
                    <div @click="handleAdd">
                        <img src="../../assets/imgs/newAdd.svg" alt="">
                        <span>新建</span>
                    </div>
                </div>
            </div>
            <template v-for="(item,index) in pictureList">
                <PictureItem
                    :key="index"
                    :page-object="item"
                    :src-list="srcList"
                    @on-success="getGalleryPage"
                    @update-picture="handleEdit"
                    @change-checked="handleSelectList"
                ></PictureItem>
            </template>

            <!-- 添加 对话框  start -->
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
                    ref="plcForm"
                    :label-position="labelPosition"
                    :rules="ruleForm"
                    label-width="80px"
                    :model="fromData"
                >
                    <el-form-item label="图片名称" prop="name">
                        <el-input v-model="fromData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="上传图片">
                        <el-upload
                            action="#"
                            list-type="picture-card"
                            :auto-upload="false"
                            :limit="limtImgNum"
                            :file-list="fileList"
                            :on-change="handleChange"
                            accept="image/jpeg,image/jpg,image/png,image/gif"
                            :on-remove="handleRemove"
                            :on-preview="handlePictureCardPreview"
                            :class="{disabled:uploadDisabled}"
                        >
                            <i slot="default" class="el-icon-plus"></i>
                            <!-- <div slot="file" slot-scope="{file}">
                                <img
                                    class="el-upload-list__item-thumbnail"
                                    :src="file.url"
                                    alt=""
                                >
                                <span class="el-upload-list__item-actions">
                                    <span
                                        class="el-upload-list__item-preview"
                                        @click="handlePictureCardPreview(file)"
                                    >
                                        <i class="el-icon-zoom-in"></i>
                                    </span>
                                    <span
                                        class="el-upload-list__item-delete"
                                        @click="handleRemove(file)"
                                    >
                                        <i class="el-icon-delete"></i>
                                    </span>
                                </span>
                            </div> -->
                        </el-upload>
                    </el-form-item>
                    
                    <el-form-item label="图片描述" prop="describe">
                        <el-input
                            v-model="fromData.describe"
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
            <!-- 添加 对话框  end -->
            <el-dialog :visible.sync="imgVisible">
                <div class="el-dialog-div">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import PictureItem from '../components/PictureItem.vue'
import { getGalleryPage, moreDeleteGalleryInfo, addGalleryInfo, editGalleryInfo } from '../../api/picture'
import { location } from '../../utils/request'

export default {
    components: {
        PictureItem,
    },
    data() {
        return {
            srcList: [],
            imgVisible: false,
            dialogImageUrl: '',
            limtImgNum: 1,
            uploadDisabled: false,
            fileList: [],
            pictureList: [],
            selectList: [],
            closeModel: false,
            stationId: this.$route.query.stationId,
            DialogVisible: false,
            dialogTitle: '',
            labelPosition: 'top',
            fromData: {
                name: '',
                describe: '',
            },
            ruleForm: {
                name: [
                    { required: true, message: '请输入图片名称', trigger: 'blur' },
                    { max: 13, message: '长度最多输入 13 个字符' },
                ],
                describe: [
                    // { required: true, message: '请输入PLC描述', trigger: 'blur' },
                ],
            },
            plcTypeId: '',
            plcTypeList: [],
            updateObj: {},
            plcKuozhanList: [], // 扩展字段集合
            kuoZhanForm: {},
        }
    },
    created() {
        this.getGalleryPage()
    },
    methods: {
        handleChange(file, fileList) {
            this.fileList = fileList
            if (fileList.length === 0) {
                this.uploadDisabled = false
            } else {
                this.uploadDisabled = true
            }
            this.$forceUpdate()
            // console.log(this.fileList)
        },
        beforeUpload(file) {
            // ".jpg", ".jpeg", ".png", ".gif"
            // console.log(file)
            const isJPG = (file.type === 'image/jpg' 
            || file.type === 'image/jpeg' 
            || file.type === 'image/png' 
            || file.type === 'image/gif') 
            const isLt10M = file.size / 1024 / 1024 < 10

            if (!isJPG) {
                console.log(file)
                console.log(isJPG)
                this.$message.error('上传头像图片只能是 JPG/JPEG/PNG/GIF 格式!')
            }
            if (!isLt10M) {
                this.$message.error('上传头像图片大小不能超过 10MB!')
            }
            // console.log(isJPG)
            // console.log(isJPG && isLt10M)
            return isJPG && isLt10M
        },
        handleRemove(file, fileList) {
            // console.log(file)
            // console.log(fileList)
            this.fileList = fileList
            this.uploadDisabled = false
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.imgVisible = true
        },
        handleMoreDelete() {
            if (this.selectList.length > 0) {
                this.$confirm('此操作将永久删除选中的图片, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(async () => {
                    const response = await moreDeleteGalleryInfo({ galleryIdList: this.selectList })
                    // console.log(response)
                    if (response.status === 200 && response.data.success) {
                        this.getGalleryPage()
                        this.$message({
                            type: 'success',
                            message: '删除图片成功!',
                        })
                    } else {
                        this.$message({
                            type: 'warning',
                            message: JSON.stringify(response.data.message),
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
                    message: '请选择要删除的图片',
                })
            }
        },
        handleEdit(obj) {
            // console.log(obj)
            this.DialogVisible = true
            this.dialogTitle = '编辑图片'

            this.fromData.name = obj.imageName
            this.fromData.describe = obj.desc

            const urlBefore = location.charAt(location.length - 1) == '/' ? location.substring(0, location.length - 1) : location
            this.fileList = [{
                url: urlBefore + obj.path,
            }]

            this.updateObj = obj 
            // console.log(obj)
            if (this.fileList.length === 0) {
                this.uploadDisabled = false
            } else {
                this.uploadDisabled = true
            }
        },
        handleAdd() {
            this.DialogVisible = true
            this.dialogTitle = '新建图片'
            this.uploadDisabled = false
        },
        handleSubmit() {
            this.$refs.plcForm.validate(async valid => {
                if (valid) {
                    let response
                    if (this.fileList.length === 0) {
                        return this.$message({
                            type: 'warning',
                            message: '请选择图片！',
                        })
                    }
                    if (!this.beforeUpload(this.fileList[0].raw)) {
                        return
                    }
                    const formData = new window.FormData()
                    formData.append('file', this.fileList[0].raw)
                    if (this.dialogTitle === '新建图片') {
                        response = await addGalleryInfo({
                            stationId: this.stationId,
                            imageName: this.fromData.name,
                            desc: this.fromData.describe,
                            formData,
                        })
                        // console.log(response)
                    } else {
                        response = await editGalleryInfo({
                            // stationId: this.stationId,
                            id: this.updateObj.id,
                            imageName: this.fromData.name,
                            desc: this.fromData.describe,
                            formData,
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
                        this.getGalleryPage()
                    } else {
                        this.$message({
                            type: 'warning',
                            message: this.dialogTitle + '失败：' + JSON.stringify(response.data.message),
                        })
                    }
                }
            })
        },
        handleClose() {
            this.DialogVisible = false
            this.fromData.name = ''
            this.fromData.imgUrl = ''
            this.fromData.describe = ''

            this.fileList = []
            this.updateObj = {}
        },
        handleSelectList(obj) {
            // console.log(obj)
            if (obj.status) {
                this.selectList.push(obj.id)
            } else {
                this.selectList = this.selectList.filter(item => item != obj.id)
            }
            // console.log(this.selectList)
        },
        async getGalleryPage() {
            const response = await getGalleryPage({ stationId: this.stationId })
            // console.log(response)
            if (response.status === 200 && response.data.success) {
                this.pictureList = response.data.data.rows
                this.selectList = []
                this.srcList = []
                const urlBefore = location.charAt(location.length - 1) == '/' ? location.substring(0, location.length - 1) : location
                this.pictureList.forEach(item => {
                    item.status = false
                    this.srcList.push(urlBefore + item.path)
                })
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
        box-sizing: border-box;
        width: 100%;
        height: calc(100% - 132px);
        padding: 0px 0px 20px 15px;
        background-color: #ffffff;
        border-radius: 5px;
        border: solid 1px #f1f2f7;
        overflow-x: hidden;
        overflow-y: auto;
        .title {
            position: relative;
            width: 100%;
            line-height: 40px;
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
                right: 20px;
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
        
    }

    /* 新建工位屏 对话框  start */
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
    
    /* 新建工位屏 对话框  end */
}

</style>
<style scoped>
.container >>> .disabled .el-upload.el-upload--picture-card {
    display: none !important;
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
.container >>> .kd-ip-input-group .kd-ip-input-group__input-ul {
    height: 40px;
    border-radius: 0px;
    border:1px solid #c4c4c4;
}
</style>