<template>
    <el-row
        type="flex"
        justify="space-between"
        align="middle"
        style="height: 40px;width: 100%;"
    >
        <el-col :span="20">
            <span>{{ nodeData.typeName }}</span>
        </el-col>
        <el-col :span="4">
            <el-row type="flex" justify="end">
                <!-- 两个内容 -->
                <el-col>
                    <!-- 下拉菜单 element -->
                    <el-dropdown @command="handleAction">
                        <span>
                            操作<i class="el-icon-arrow-down" />
                        </span>
                        <!-- 下拉菜单 -->
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="add">添加子目录</el-dropdown-item>
                            <el-dropdown-item command="edit">编辑目录</el-dropdown-item>
                            <el-dropdown-item command="del">删除目录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
import { deleteStationdir } from '@/api/variable'

export default {
    name: 'TreeTool',
    props: {
        nodeData: {
            type: Object,
            required: true,
        },
    },
    methods: {
        handleAction(type) {
            if (type === 'add') {
                //   添加
                // console.log('add')
                this.$emit('showStation', this.nodeData, 'add')
            } else if (type === 'edit') {
                //   编辑
                // console.log('edit')
                this.$emit('showStation', this.nodeData, 'edit')
            } else if (type === 'del') {
                // 删除
                // console.log('del')
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(async () => {
                    const response = await deleteStationdir({ id: this.nodeData.id })
                    // console.log(response)
                    if (response.status === 200 && response.data.success) {
                        this.$emit('on-success')
                        this.$message({
                            type: 'success',
                            message: '删除成功!',
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
            }
        },
    },
}
</script>

<style>

</style>
