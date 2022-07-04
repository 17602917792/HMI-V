<template>
    <div>
        <div class="navbar">
            <div class="logo">
                <img src="../assets/imgs/logo.svg" alt="">
                <span>HMI2.0</span>
            </div>
            <div class="nav">
                <el-menu
                    :default-active="currentMenu"
                    class="el-menu-demo"
                    mode="horizontal"
                    text-color="#303030"
                    active-text-color="#285AD8"
                    :router="routerValue"
                >
                    <el-menu-item v-if="$isHasMenu('/project')" index="/project">项目管理</el-menu-item>
                    <el-submenu index="2">
                        <template 
                            v-if="$isHasMenu('/user') || $isHasMenu('/menu') || $isHasMenu('/role') || $isHasMenu('/plctype')" 
                            slot="title"
                        >
                            系统管理
                        </template>
                        <el-menu-item v-if="$isHasMenu('/user')" index="/user">用户管理</el-menu-item>
                        <el-menu-item v-if="$isHasMenu('/menu')" index="/menu">菜单管理</el-menu-item>
                        <!-- <el-menu-item index="/permission">权限管理</el-menu-item> -->
                        <el-menu-item v-if="$isHasMenu('/role')" index="/role">角色管理</el-menu-item>
                        <el-menu-item v-if="$isHasMenu('/plctype')" index="/plctype">PLC类型管理</el-menu-item>
                    <!-- <el-submenu index="2-4">
                        <template slot="title">选项4</template>
                        <el-menu-item index="2-4-1">选项1</el-menu-item>
                        <el-menu-item index="2-4-2">选项2</el-menu-item>
                        <el-menu-item index="2-4-3">选项3</el-menu-item>
                    </el-submenu> -->
                    </el-submenu>
                </el-menu>
            </div>
            <div class="user">
                <img class="avater" src="" alt="">
                <div>
                    <p>用户名</p>
                    <p>用户账号：{{ userInfo.account }}</p>
                </div>
                <img class="setting" src="../assets/imgs/setting.svg" alt="">
                <img
                    class="exit"
                    src="../assets/imgs/exit.svg"
                    alt=""
                    @click="exitLogin"
                >
            </div>
        </div>
        <router-view :key="key" />
    </div>
</template>
<script>
import { logout } from '../api/login'
import { mapState, 
    // mapActions, 
} from 'vuex'

export default {
    data() {
        return {
            routerValue: true,
            currentMenu: '',
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
        }),
        
        key() {
            this.handleSelect(this.$route.path)
            return this.$route.path
        },
    },
    created() {
        // this.$store.dispatch('user/loginUserInfo')
    },
    methods: {
        // ...mapActions(['user/loginUserInfo']),
        handleSelect(path) {
            // console.log(path)
            // console.log(path.split('/'))
            this.currentMenu = path
            if (path.split('/').length > 2 || path === '/stations') {
                this.currentMenu = '/project'
            }
        },
        async exitLogin() {
            const response = await logout()
            // console.log(respose)
            if (response.status === 200 && response.data.success) {
                sessionStorage.setItem('token', '')
                this.$router.push('/')
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
<style scoped>
.div::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.div{
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  overflow-x: hidden;
  overflow-y: auto;
}

.navbar {
    box-sizing: border-box;
    width: 100%;
    height: 80px;
    background: #FFFFFF;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    border-radius: 0px 0px 0px 0px;
    opacity: 1;
}
.logo {
    float: left;
    height: 80px;
    line-height: 80px;
}
.logo img {
    width: 64px;
    height: 40px;
    margin-left: 31px;
    opacity: 1;
    vertical-align: middle;
}
.logo span {
    margin-left: 15px;
    font-family: Source Han Sans CN-Bold, Source Han Sans CN;
    font-weight: bold;
    color: #285AD8;
}
.nav {
    float: left;
}
.user {
    display: flex;
    align-items: center;
    float: right;
    height: 80px;
    padding-right: 20px;
}
.user .avater {
    width: 40px;
    height: 40px;
    border: 1px solid #285AD8;
    border-radius: 50%;
    overflow: hidden;
    vertical-align: middle;
}
.user div p:last-child {
    font-size: 12px;
    color: #8b8b8b;
}
.user div {
    margin-left: 15px;
}
.user div p:first-child {
    font-size: 16px;
    color: #303030;
}
.user img {
    vertical-align: middle;
}
.user .setting {
    margin-left: 35px;
    width: 28px;
    height: 28px;
    cursor: pointer;
}
.user .exit {
    margin-left: 35px;
    width: 21px;
    height: 21px;
    cursor: pointer;
}

</style>

<style scoped>
.el-menu--horizontal>.el-menu-item  {
    height: 80px;
    line-height: 80px;
}

.navbar >>> .el-menu--horizontal>.el-submenu .el-submenu__title {
    height: 80px;
    line-height: 80px;
}
</style>