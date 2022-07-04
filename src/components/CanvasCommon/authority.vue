<template>
    <div>
        <el-select v-model="auth" value-key="id" placeholder="请选择权限等级">
            <el-option
                v-for="i in rolesList"
                :key="i.id"
                :label="i.name"
                :value="i"
            >
            </el-option>
        </el-select>
        <el-button @click="submit">确认</el-button>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { getAllRolePage } from '../../api/role'

export default {
    components: {},
    props: {
        item: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return { 
            rolesList: [],
            auth: {},
        }
    },
    computed: {
        ...mapState([
            'curComponent',
        ]),
    },
    watch: {
        curComponent: {
            handler() {
                this.auth = this.curComponent.auth
            },
            immediate: true,
        },
    },
    created() {
        this.getAllRolePage()
    },
    methods: {
        submit() {
            this.curComponent.auth = this.auth
        },
        async getAllRolePage() {
            const response = await getAllRolePage({
                PageNo: 1,
                PageSize: 100,
                RoleType: 2,
            })
            if (response.status === 200 && response.data.success) {
                this.rolesList = response.data.data.rows.map(item => {
                    const { id, roleLevel, name } = item
                    item = { id, roleLevel, name }
                    return item
                })
                console.log('this.rolesList', this.rolesList)
            } else {
                this.$message({
                    type: 'warning',
                    message: response.data.message,
                })
            }
        },
    },
}
</script>
