<template>
    <div class="login-container">
        <el-form
            ref="ruleForm"
            :model="loginForm"
            :rules="loginRules"
            label-width="60px"
            class="login-form"
            :label-position="labelPosition"
        >
            <h2 style="text-align: center;">HMI后台系统管理</h2>
            <el-form-item label="账号" :rules="loginRules.username">
                <el-input v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" :rules="loginRules.password">
                <el-input v-model="loginForm.password"></el-input>
            </el-form-item>
            <el-button
                class="login-btn"
                type="primary"
                style="width: 100%; margin-bottom: 30px;"
                @click.native.prevent="handleLogin"
            >
                Login
            </el-button>
            <div class="tips">
                <span style="margin-right: 20px;">账号: Admin</span>
                <span> 密码: 123456</span>
            </div>
        </el-form>
    </div>
</template>
<script>
import { login } from '@/api/login.js'
import { mapActions } from 'vuex'

export default {
    data() {
        return {
            labelPosition: 'left',
            loginForm: {
                username: 'Admin',
                password: '123456',
            },
            loginRules: {
                username: [
                    { required: true, trigger: 'blur', message: '请输入账号' },
                ],
                password: [
                    { required: true, trigger: 'blur', message: '请输入密码' },
                ],
            },
        }
    },
    methods: {
        ...mapActions(['user/loginUserInfo']),
        handleLogin() {
            this.$refs.ruleForm.validate(async valid => {
                if (valid) {
                    const respose = await login({
                        account: this.loginForm.username,
                        password: this.loginForm.password,
                    })
                    // console.log(respose)
                    if (respose.status === 200 && respose.data.success) {
                        sessionStorage.setItem('token', respose.data.data)
                        this.$store.dispatch('user/loginUserInfo')
					      this.$message({
					          message:respose.data.message,
					          type:'success',
							  duration:1000
					        });
						setTimeout(() => {
								this.$router.push('/project')
						}, 1000);
                    } else {
                        this.$message({
                            type: 'warning',
                            message: respose.data.message,
                        })
                    }
                }
            })
        },
    },
}
</script>
<style scoped lang='scss'>
.login-container {
    position: absolute;
    background-color: #68A0FF;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.login-form {
    position: relative;
    top: 200px;
    width: 520px;
    max-width: 100%;
    margin: 0 auto;
    padding: 30px;
    overflow: hidden;
    background-color: #fff;
    border-radius: 20px;
}

.el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.9); // 输入登录表单的背景色
    border-radius: 5px;
    color: #454545;
  }
  .el-form-item__error {
    color: #fff;
    font-size: 14px;
  }
  .el-form-item__content {
      margin-left: 40px !important;
  }
  .el-form-item__label {
      text-align: left !important;
  }
 
</style>