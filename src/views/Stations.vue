<template>
    <div class="container">
        <div class="operation">
            <div class="sortBox">
                <div class="allSort"><span class="back" @click="goback"></span><span>全部</span></div>
                <div class="timeSort">
                    <span>按时间正序</span>
                    <img src="../assets/imgs/sort.svg" alt="">
                </div>
            </div>
            <div class="btnBox">
                <div v-if="$isHasAuth('STATION_MORE_DELETE')" @click="handleMoreDelete">
                    <img src="../assets/imgs/stationDelete.svg" alt="">
                    <span>批量删除</span>
                </div>
                <div v-if="$isHasAuth('STATION_MORE_SEND')" @click="handleMoreSendTemplate">
                    <img src="../assets/imgs/issue.svg" alt="">
                    <span>批量下发</span>
                </div>
                <div v-if="$isHasAuth('STATION_SYNC_TIME')" @click="handleMoreCalibration">
                    <img src="../assets/imgs/timeSync.svg" alt="">
                    <span>同步时间</span>
                </div>
                <div v-if="$isHasAuth('STATION_MORE_SHUTDOWN')" @click="handleShutDown">
                    <img src="../assets/imgs/shutDown.svg" alt="">
                    <span>批量关机</span>
                </div>
                <div v-if="$isHasAuth('MENU_ADD')" @click="handleRestart">
                    <img src="../assets/imgs/restart.svg" alt="">
                    <span>批量重启</span>
                </div>
                <div v-if="$isHasAuth('STATION_MORE_RESTARE')" @click="handleAddDialog">
                    <img src="../assets/imgs/newAdd.svg" alt="">
                    <span>新建</span>
                </div>
            </div>
        </div>

        <template v-for=" (item, index) in stationsList">
            <StationItem
                :key="index"
                :project-id="projectId"
                :station-object="item"
                @change-checked="handleSelectList"
                @on-success="getAllStations()"
                @update-station="handleUpdateStation"
            ></StationItem>
        </template>

        <div style="width: 100%; height: 80px;"></div>

        <!-- 添加工位屏 对话框  start -->
        <el-dialog
            :visible.sync="DialogVisible"
            width="50%"
            top="15vh"
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
                ref="stationForm"
                :label-position="labelPosition"
                :rules="ruleStationForm"
                label-width="80px"
                :model="stationFromData"
            >
                <el-form-item label="工位屏名称" prop="stationtName">
                    <el-input v-model="stationFromData.stationtName"></el-input>
                </el-form-item>
                <el-form-item label="工位屏地址" prop="PLC" required="">
                    <!-- <el-input v-model="stationFromData.PLC"></el-input> -->
                    <kd-ip-input
                        v-model="stationFromData.PLC"
                        clearable
                        check-empty-on-blur
                        show-port
                        @blur="$refs.stationForm.validateField('PLC')"
                    />
                </el-form-item>
                <div class="wHR">
                    <el-tooltip content="像素" placement="top-start" effect="light">
                        <el-form-item label="宽" prop="width">
                            <el-input v-model="stationFromData.width"></el-input>
                        </el-form-item>
                    </el-tooltip>
                    <el-tooltip content="像素" placement="top-start" effect="light">
                        <el-form-item label="高" prop="height">
                            <el-input v-model="stationFromData.height"></el-input>
                        </el-form-item>
                    </el-tooltip>
                    <el-tooltip content="采集plc信号频次" placement="top-start" effect="light">
                        <el-form-item label="频次(单位/毫秒)" prop="rate">
                            <el-input v-model="stationFromData.rate" placeholder="频次(单位/毫秒)"></el-input>
                        </el-form-item>
                    </el-tooltip>
                </div>
                <el-form-item label="工位屏描述" prop="describe">
                    <el-input
                        v-model="stationFromData.describe"
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
        <el-dialog
            :visible.sync="sendVisible"
            width="50%"
            :close-on-click-modal="closeModel"
            :before-close="handleSendClose"
            title="此操作将给选中的工位屏下发您选择工艺模板数据, 是否继续?"
        >   
            <el-table
                ref="sendTable"
                :data="sendData"
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
                    prop="id"
                    label="序号"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.id }}
                    </template>
                </el-table-column>
                  
                <el-table-column
                    prop="name"
                    label="下发数据"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.name }}
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleSubmitSend">确 定</el-button>
                <el-button @click="handleSendClose">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import StationItem from './components/StationItem.vue'
// import VueIp from 'vue-ip'
// import KdIpInput from 'kd-ip-input'
import { Loading } from 'element-ui'

import { 
    getStations, 
    addStation, 
    updateStation, 
    deleteMoreStations, 
    MoreShutDown, 
    MoreRestart, 
    MoreCalibration, 
    MoreSendTemplate, 
} from '../api/stations'

export default {
    name: 'Stations',
    components: {
        StationItem,
        // 'kd-ip-input': KdIpInput,
    },
    data() {
        return {
            timer: null,
            closeModel: false,
            projectId: this.$route.query.projectId,
            selectStationList: [],
            stationsList: [],
            DialogVisible: false,
            dialogTitle: '新建工位屏',
            labelPosition: 'top',
            updateObject: {},
            stationFromData: {
                stationtName: '',
                PLC: '',
                width: '',
                height: '',
                rate: '',
                describe: '',
            },
            ruleStationForm: {
                stationtName: [
                    { required: true, message: '请输入工位屏名称', trigger: 'blur' },
                    { max: 15, message: '长度最多15个字符' },
                ],
                PLC: [
                    { required: true, message: '请输入PLC地址', trigger: 'blur' },
                ],
                width: [
                    { required: true, message: '请输入宽', trigger: 'blur' },
                ],
                height: [
                    { required: true, message: '请输入高', trigger: 'blur' },
                ],
                rate: [
                    { required: true, message: '请输入频次', trigger: 'blur' },
                ],
                describe: [
                    // { required: true, message: '请输入工位屏描述', trigger: 'blur' },
                ],
            },
            sendData: [
                // 1：PLC数据；2：变量数据；3：报警数据；4：页面数据；5：图片数据；6：用户数据;7.工位数据
                { id: 1, name: 'PLC数据' },
                { id: 2, name: '变量数据' },
                { id: 3, name: '报警数据' },
                { id: 4, name: '页面数据' },
                { id: 5, name: '图片数据' },
                { id: 6, name: '用户数据' },
                { id: 7, name: '工位数据' },
            ],
            sendVisible: false,
            selectIdList: [],
        }
    },
    created() {
        this.getAllStations()
    },
    methods: {
        handleSendClose() {
            this.sendVisible = false
            this.$refs.sendTable.clearSelection()
            this.$message({
                type: 'info',
                message: '已取消下发',
            })
        },
        async handleSubmitSend() {
            // console.log(this.selectIdList)
            if (this.selectIdList.length === 0) {
                return this.$message({
                    type: 'warning',
                    message: '请选择要下发的数据！',
                })
            }
            // console.log(this.selectIdList)
            // console.log(this.selectIdList.length)
            const loading = Loading.service({ text: '下发数据中，请稍后...' })
            const response = await MoreSendTemplate({ stationIdList: this.selectStationList, OperateList: this.selectIdList })
            // console.log(response)
            if (response.status === 200 && response.data.success) {
                this.timer = setTimeout(() => {
                    this.getAllStations()
                }, 0)
                this.$message({
                    type: 'success',
                    message: '下发工艺模板成功!',
                })
                this.sendVisible = false
                this.$refs.sendTable.clearSelection()
                loading.close()
            } else {
                this.$message({
                    type: 'warning',
                    message: response.data.message,
                })
                loading.close()
            }
        },
        handleSelectionChange(val) {
            // console.log(val)
            this.selectIdList = val.map(item => item.id) 
            // console.log(val)
            // console.log(this.selectIdList)
        },
        goback() {
            this.$router.push('/project')
        },
        handleMoreSendTemplate() {
            if (this.selectStationList.length > 0) {
                // this.$confirm('此操作将给选中的工位屏下发工艺模板, 是否继续?', '警告', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     type: 'warning',
                // }).then(async () => {
                //     const response = await MoreSendTemplate({ stationIdList: this.selectStationList })
                //     // console.log(response)
                //     if (response.status === 200 && response.data.success) {
                //         this.timer = setTimeout(() => {
                //             this.getAllStations()
                //         }, 0)
                //         this.$message({
                //             type: 'success',
                //             message: '下发工艺模板成功!',
                //         })
                //     } else {
                //         this.$message({
                //             type: 'warning',
                //             message: response.data.message,
                //         })
                //     }
                // }).catch((err) => {
                //     if (err !== 'cancel') {
                //         return this.$message.error('删除失败！')
                //     }
                //     this.$message({
                //         type: 'info',
                //         message: '已取消删除',
                //     })
                // })
                this.sendVisible = true
                this.$nextTick(() => {
                    this.sendData.forEach(item => this.$refs.sendTable.toggleRowSelection(item))
                })
            } else {
                this.handleMsg()
            }
        },
        handleMoreCalibration() {
            if (this.selectStationList.length > 0) {
                this.$confirm('此操作将同步选中的工位屏的时间, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(async () => {
                    const response = await MoreCalibration({ stationIdList: this.selectStationList })
                    // console.log(response)
                    if (response.status === 200 && response.data.success) {
                        this.getAllStations()
                        this.$message({
                            type: 'success',
                            message: '同步时间成功!',
                        })
                    } else {
                        this.$message({
                            type: 'warning',
                            message: response.data.message,
                        })
                    }
                }).catch((err) => {
                    if (err !== 'cancel') {
                        return this.$message.error('同步失败！')
                    }
                    this.$message({
                        type: 'info',
                        message: '已取消同步时间',
                    })
                })
            } else {
                this.handleMsg()
            }
        },
        handleRestart() {
            if (this.selectStationList.length > 0) {
                this.$confirm('此操作将重启选中的工位屏, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(async () => {
                    const response = await MoreRestart({ stationIdList: this.selectStationList })
                    // console.log(response)
                    if (response.status === 200 && response.data.success) {
                        this.getAllStations()
                        this.$message({
                            type: 'success',
                            message: '重启成功!',
                        })
                    } else {
                        this.$message({
                            type: 'warning',
                            message: response.data.message,
                        })
                    }
                }).catch((err) => {
                    if (err !== 'cancel') {
                        return this.$message.error('重启失败！')
                    }
                    this.$message({
                        type: 'info',
                        message: '已取消重启',
                    })
                })
            } else {
                this.handleMsg()
            }
        },
        handleShutDown() {
            if (this.selectStationList.length > 0) {
                this.$confirm('此操作将关机选中的工位屏, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(async () => {
                    const response = await MoreShutDown({ stationIdList: this.selectStationList })
                    // console.log(response)
                    if (response.status === 200 && response.data.success) {
                        this.getAllStations()
                        this.$message({
                            type: 'success',
                            message: '关机成功!',
                        })
                    } else {
                        this.$message({
                            type: 'warning',
                            message: response.data.message,
                        })
                    }
                }).catch((err) => {
                    if (err !== 'cancel') {
                        return this.$message.error('关机失败！')
                    }
                    this.$message({
                        type: 'info',
                        message: '已取消关机',
                    })
                })
            } else {
                this.handleMsg()
            }
        },
        handleMoreDelete() {
            if (this.selectStationList.length > 0) {
                this.$confirm('此操作将永久删除选中的工位屏, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(async () => {
                    const response = await deleteMoreStations({ stationIdList: this.selectStationList })
                    // console.log(response)
                    if (response.status === 200 && response.data.success) {
                        this.getAllStations()
                        this.$message({
                            type: 'success',
                            message: '删除工位屏成功!',
                        })
                    } else {
                        this.$message({
                            type: 'warning',
                            message: response.data.message,
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
                this.handleMsg()
            }
        },
        handleMsg() {
            this.$message({
                type: 'warning',
                message: '请选择工位屏！',
            })
        },        
        handleSelectList(obj) {
            if (obj.status) {
                this.selectStationList.push(obj.stationId)
            } else {
                this.selectStationList = this.selectStationList.filter(item => item !== obj.stationId)
            }
            // console.log(this.selectStationList)
        },
        async getAllStations() {
            const response = await getStations({
                ProjectId: this.$route.query.projectId,
                PageNo: 1,
                PageSize: 200,
            })
            // console.log(response)
            if (response.status === 200 && response.data.success) {
                this.timer = null
                this.stationsList = response.data.data.rows
                this.selectStationList = []
                this.stationsList.forEach(item => {
                    item.status = false
                })
            } else {
                this.$message({
                    type: 'warning',
                    message: response.data.message,
                })
            }
        },
        handleClose() {
            this.DialogVisible = false
            this.stationFromData.stationtName = ''
            
            this.stationFromData.PLC = ''
            this.stationFromData.width = ''
            this.stationFromData.height = ''
            this.stationFromData.rate = ''
            this.stationFromData.describe = ''
            this.updateObject = {}

            this.$refs.stationForm.clearValidate()
        },
        handleAddDialog() {
            this.DialogVisible = true
            this.dialogTitle = '新建工位屏'

            this.stationFromData.stationtName = ''
            this.stationFromData.PLC = ''
            this.stationFromData.width = ''
            this.stationFromData.height = ''
            this.stationFromData.rate = ''
            this.stationFromData.describe = ''
        },
        handleUpdateStation(updateObject) {
            this.DialogVisible = true
            this.dialogTitle = '编辑工位屏'
            this.updateObject = updateObject

            // console.log(updateObject)
            this.stationFromData.stationtName = updateObject.stationName
            this.stationFromData.PLC = updateObject.ip
            this.stationFromData.width = updateObject.width
            this.stationFromData.height = updateObject.height
            this.stationFromData.rate = updateObject.rate
            this.stationFromData.describe = updateObject.desc
        },
        handleSubmit() {
            this.$refs.stationForm.validate(async valid => {
                if (valid) {
                    let response
                    if (this.dialogTitle === '新建工位屏') {
                        response = await addStation({
                            stationName: this.stationFromData.stationtName,
                            ip: this.stationFromData.PLC,
                            width: this.stationFromData.width,
                            height: this.stationFromData.height,
                            rate: this.stationFromData.rate,
                            desc: this.stationFromData.describe,
                            projectId: this.$route.query.projectId,
                        })
                        // console.log(response)
                    } else {
                        response = await updateStation({
                            stationName: this.stationFromData.stationtName,
                            ip: this.stationFromData.PLC,
                            width: this.stationFromData.width,
                            height: this.stationFromData.height,
                            rate: this.stationFromData.rate,
                            desc: this.stationFromData.describe,
                            id: this.updateObject.id,
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
                        this.getAllStations()
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
<style scoped lang='scss'>
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
.container .operation{
    display: flex;
    width: 100%;
    height: 52px;
    padding-right: 30px;
    margin-bottom: 20px;
}
.sortBox {
    float: left;
    flex: 1;
    height: 40px;
    background-color: #ffffff;
    padding-right: 20px;
    line-height: 40px;
    background: #FFFFFF;
    border-radius: 5px 5px 5px 5px;
    opacity: 1;
    border: 1px solid #F1F2F7;
    font-size: 13px;
    color: #8b8b8b;
}
.sortBox .allSort {
    // padding-left: 30px;
    font-size: 14px;
    font-weight: bold;
    color: #285ad8;
    span {
        float: left;
    }
    .back {
        width: 30px;
        height: 25px;
        margin-left: 20px;
        margin-top: 8px;
        margin-right: 15px;
        cursor: pointer;
        background: url('../assets/imgs/back.svg') no-repeat;
        &:hover {
            background: url('../assets/imgs/buleback.svg') no-repeat;
        }
    }
}
.sortBox .timeSort {
    float: right;
}
.timeSort img {
    width: 25px;
    height: 18px;
    margin-left: 10px;
    vertical-align: middle;
    cursor: pointer;
}
.btnBox {
    float: right;
    margin-left: 40px;
}
.btnBox div {
    float: left;
    width: 127px;
    height: 40px;
    line-height: 40px;
    margin-left: 15px;
    background: #285AD8;
    border-radius: 5px 5px 5px 5px;
    opacity: 1;
    text-align: center;
    color: #ffffff;
    font-size: 15px;
    cursor: pointer;
} 
.btnBox div img {
    vertical-align: middle;
    margin-right: 5px;
    margin-top: -3px;
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
/* 新建工位屏 对话框  end */
</style>
<style scoped>
.wHR >>> .el-form-item__content {
    margin-right: 20px;
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
