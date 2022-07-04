<template>
    <div class="container">
        <div class="content">
            <div class="title">
                <p>权限管理</p>
                <div class="btnBox">
                    <el-input
                        v-model="searchValue"
                        placeholder="请输入搜索的用户名称"
                        clearable
                        class="searchIpt"
                    >
                    </el-input>
                    <div icon="el-icon-search">
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
                    </div>
                    <div>
                        <img src="../assets/imgs/newAdd.svg" alt="">
                        <span>新建</span>
                    </div>
                </div>
            </div>

            <el-table
                :data="variableTableData"
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
                    prop="variableName"
                    label="变量名称"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.variableName }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="desc"
                    label="描述"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.desc }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="地址"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.address }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="variableType"
                    label="类型"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.variableType }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="length"
                    label="长度"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row.length }}
                    </template>
                </el-table-column>
                
                <el-table-column
                    label="操作"
                    width="120"
                    align="center"
                >
                    <template slot-scope="scope">
                        <div class="oprateCell">
                            <span class="oprateTable" @click="handleEdit(scope.$index, scope.row)"></span>
                            <span class="oprateTable" @click="handleDelete(scope.$index, scope.row)"></span>
                        </div>
                        <!-- <img src="../../assets/imgs/edit.svg" alt="">
                        <img src="../../assets/imgs/delete.svg" alt=""> -->
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
        </div>
    </div>
</template>
<script>
// import ImportExcel from '../components/ImportExcel/index.vue'

export default {
    components: {
        // ImportExcel,
    },
    data() {
        return {
            searchValue: '',
            closeModel: false,
            loading: false,
            importVisible: false,
            variableTableData: [],
            DialogVisible: false,
            dialogTitle: '新建变量',
            total: 1,
            labelPosition: 'top',
            vFromData: {
                plctName: '',
                variableName: '',
                address: '',
                variableType: '',
                length: '',
                describe: '',
            },
            ruleVForm: {
                plctName: [
                    { required: true, message: '请选择PLC', trigger: 'blur' },
                ],
                variableName: [
                    { required: true, message: '请输入变量名称', trigger: 'blur' },
                ],
                address: [
                    { required: true, message: '请选择PLC', trigger: 'blur' },
                ],
                variableType: [
                    { required: true, message: '请输入变量类型', trigger: 'blur' },
                ],
                length: [
                    { required: true, message: '请输入长度', trigger: 'blur' },
                ],
                describe: [
                    { required: true, message: '请输入变量描述', trigger: 'blur' },
                ],
            },
            plcList: [],
            plcId: '',
            plcName: '',
            pageIndex: 1,
            pageSize: 10,
            singlePage: false,
            updateObj: {},
            selectIdList: [],
        }
    },
    created() {
    },
    methods: {
        importDialog() {},
        handleCurrentChange() {},
        handleSelectionChange() {},
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
    padding: 20px 40px;
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