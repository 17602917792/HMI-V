<template>
    <div class="container">
        <div class="sidebar">
            <el-menu
                default-active="1"
                class="el-menu-vertical-demo"
                :collapse="isCollapse"
                background-color="#EBEDEE"
                :router="routerValue"
                @open="handleOpen"
                @close="handleClose"
            >
                <el-menu-item index="/variable">
                    <i class="el-icon-menu"></i>
                    <span slot="title">工位管理</span>
                </el-menu-item>
                <el-menu-item index="/beat">
                    <i class="el-icon-menu"></i>
                    <span slot="title">节拍数据</span>
                </el-menu-item>
                <el-menu-item index="/plan">
                    <i class="el-icon-menu"></i>
                    <span slot="title">方案配置</span>
                </el-menu-item>
                <el-menu-item index="/warning">
                    <i class="el-icon-warning"></i>
                    <span slot="title">报警信息管理</span>
                </el-menu-item>
                <el-menu-item index="">
                    <i class="el-icon-user-solid"></i>
                    <span slot="title">用户管理</span>
                </el-menu-item>
                <el-menu-item index="/loginmanegement">
                    <i class="el-icon-guide"></i>
                    <span slot="title">登录管理</span>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="main">
            <div class="navbar">
                <el-button
                    v-model="isCollapse"
                    class="navBtn"
                    icon="el-icon-s-unfold"
                    circle
                    @click="handleSidebar"
                ></el-button>
            </div>
            <div class="app-main">
                <router-view :key="key" />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            routerValue: true,
            isCollapse: false,
        }
    },
    computed: {
        key() {
            return this.$route.path
        },
    },
    methods: {
        handleOpen() {

        },
        handleClose() {
            
        },
        handleSidebar() {
            this.isCollapse = !this.isCollapse
        },
        
    },
    
}
</script>
<style  scoped>
.container {
    display: flex;
    position: absolute;
    width: 100%;
    height: 100%;
}
 .container .sidebar {
    float: left;
    height: 100%;
    background-color: #ebedee;
}
 .container .main {
    width: 100%;
}
 .container .navbar {
    float: left;
    width: 100%;
    height: 55px;
    line-height: 55px;
    background-color: #ebedee;
}
.container .navbar .navBtn {
    margin-left: 20px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
</style>