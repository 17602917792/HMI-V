<template>
    <div>
        <div>
            <el-switch
                v-model="variableList.onOff"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="开启"
                inactive-text="禁用"
            >
            </el-switch>
        </div>
		<el-radio v-model="radio" label="1">
        <el-cascader
            v-model="skip.selectValue"
            :options="options"
            :props="customOption"
            placeholder="请选择跳转页面"
            :disabled="!variableList.onOff"
            style="margin-top:5%;"
            @change="handleChangePage"
        ></el-cascader>
		</el-radio>
		<div class="skip">
			<el-radio v-model="radio" label="2">
			<el-input v-model="skip.url"  :disabled="!variableList.onOff" placeholder="请输入URL"  style="width:75%;"></el-input>
			</el-radio>
		</div>

		<el-button type="primary" @click="submit">确定</el-button>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { getTreeselect } from '../../api/managementPage' // 页面下拉菜单
import { deepCopy } from '@/utils/utils'

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
            options: [],
			 radio: '1',
            variableList: { // 单变量绑定数据
			    onOff: true,
			    list: [],
            },
            customOption: {
                label: 'title', 
                value: 'id',
                children: 'children',
                expandTrigger: 'click',
                checkStrictly: false,
            },
            skip: {},
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
                if (this.curComponent.events[this.item.key]) {
                    this.skip = deepCopy(this.curComponent.events[this.item.key])
                    console.log(this.skip, 'this.skip', this.curComponent.events[this.item.key])
                } else {
					this.variableList = { // 单变量绑定数据
					    onOff: true, // 事件的开关
					    // type: this.item.type, // 事件的类型
					    selectValue: [], // 变量绑定的值  以供数据反显
					    list: [], // 多条件绑定的值
					}
                    this.skip = { // 跳转事件
                        selectValue: [
							
						], //  以供数据反显
                    }
                }
            },
            immediate: true,
        },
    },
    created() {
        this.getTreeselect()
		this.radio=this.skip.radio
		this.variableList.onOff=this.skip.onOff
    },
    methods: {
		submit(){
			let radio = "radio",
				onOff = "onOff";
			this.skip[radio] = this.radio;
			this.skip[onOff] = this.variableList.onOff;
			this.$store.commit('addEvent', {
				event: this.item.key,
				param: this.skip,
			})
			
		},
        handleChangePage(val) {
			let pageId = "pageId";
			this.skip[pageId] = val[1];
        },
        async getTreeselect() {
            const response = await getTreeselect({ StationId: this.$route.query.stationId })
            // console.log(response)
            if (response.status === 200 && response.data.success) {
                const tempList = response.data.data
                if (tempList.length > 0) {
                    tempList.forEach(element => {
						console.log(element,22255555)
                        let obj = {
                            id: element.id, // 目录的id
                            title: element.title, // 目录的名称
                            children: [],
                        }
                        if (element.children.length > 0) {
                            element.children.forEach(item => {
								console.log(item,55588888)
                                obj.children.push({
                                    id: item.id, // 页面id
                                    title: item.title, // 页面名称
                                })
                            })
                        }
                        this.options.push(obj)
                    })
                }
            } else {
                this.$message({
                    type: 'warning',
                    message: '获取页面列表失败',
                })
            }
        },
    },
}
</script>
<style scoped>
.skip{
	margin:3% 0;
}
</style>
