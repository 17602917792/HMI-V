<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>报警信息管理</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
            </div>
            <div class="mainContent">
                <div style="margin-bottom: 15px;">
                    <el-button type="danger">删除报警</el-button>
                    <el-button type="warning">编辑报警</el-button>
                    <el-button type="primary">添加报警</el-button>
                    <el-button type="warning" style="margin-left: 50px;">报警导入</el-button>
                    <el-button type="danger">报警导出</el-button>
                </div>
                <el-table
                    :data="tableData"
                    border
                    tooltip-effect="dark"
                    style="width: 100%;margin-bottom: 20px;"
                >
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
                        label="报警文本"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.stationName }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="address"
                        label="报警类型"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.ip }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="address"
                        label="PCL"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.desc }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="address"
                        label="DB块"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.templateName }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="address"
                        label="起始地址"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.updateState }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="address"
                        label="位地址"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.updateTime }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="address"
                        label="使能"
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
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tableData: [], 
            pageIndex: 1,
            pageSize: 10,
            total: 100,
            singlePage: false,
        }
    },
    methods: {
        handleCurrentChange(val) {
            this.pageIndex = val
            // this.getstationdPage()
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
    width: 100%;
    height: 100%;
}

</style>