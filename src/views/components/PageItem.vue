<template>
    <div class="everiItem">
        <ul>
            <template v-for="(pageItem,index) in pageObject.children">
                <li v-if="isShow" :key="index+'pageItem'">
                    <div class="desc">
                        <img src="../../assets/imgs/page.svg" alt="">
                        <!-- <i class="el-icon-document"></i> -->
                        <span class="name">{{ pageItem.name }}</span>
                        <span>{{ pageItem.desc }}</span>
                    </div>
                    
                    <div class="oprate">
                        <div class="switchBox">
                            <div v-if="$isHasAuth('PAGE_STARTUP')" class="addBorder" @click="handleStaetUp(pageItem)">
                                <div :class="{open: pageItem.isStartUp}">开启</div>
                                <div :class="{close: !pageItem.isStartUp}">关闭</div>
                            </div>
                        </div>
                        <div class="spanBox">
                            <span v-if="$isHasAuth('PAGE_DRAW')" @click="gotoDrow(pageItem)"><img src="../../assets/imgs/draw.svg" alt="">画图</span>
                            <span v-if="$isHasAuth('PAGE_UPDATE')" @click="handlePageEdit(pageItem)"><img src="../../assets/imgs/editBlue.svg">编辑</span>
                            <span v-if="$isHasAuth('PAGE_DELETE')" @click="handleDeletePage(pageItem)"><img src="../../assets/imgs/sdeleteBule.svg">删除</span>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
    </div>
</template>
<script>
import { deletePage } from '../../api/managementPage'

export default {
    props: {
        pageObject: {
            type: Object,
            required: true,
        },
        isShow: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            isShowing: false,
        }
    },
    methods: {
        handleStaetUp(pageItem) {
            this.$emit('handleStaetUp', pageItem)
        },
        handleDeletePage(pageItem) {
            this.$confirm('此操作将删除这个页面数据, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                const response = await deletePage({ id: pageItem.id })
                // console.log(response)
                if (response.status === 200 && response.data.success) {
                    this.$emit('onsuccess')
                    this.$message({
                        type: 'success',
                        message: '删除成功!',
                    })
                } else {
                    this.$message({
                        type: 'warning',
                        message: '删除失败：' + JSON.stringify(response.data.message),
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
        },
        handlePageEdit(pageItem) {
            this.$emit('handlePageEdit', pageItem)
        },
        gotoDrow(page) {
            // console.log(this.$parent.$parent.stationId)
            // console.log(page)
            this.$router.push({ path: '/home', 
                query: { 
                    stationId: this.$parent.$parent.stationId,
                    stationName: this.$parent.$parent.stationName,
                    fromUrl: this.$parent.$parent.fromUrl,
                    selectTab: this.$parent.$parent.selectTab,
                    id: page.id, 
                    projectId: this.$parent.$parent.projectId } })
        },
    },
}
</script>
<style lang="scss" scoped>
.everiItem {
    box-sizing: border-box;
    width: 100%;
    padding-top: 20px;
    ul {
        width: 100%;
        padding-right: 20px;
    }
    ul li {
        display: flex;
        position: relative;
        width: 100%;
        height: 60px;
        padding: 0 10px;
        margin: 0 0 20px 10px;
        border: 1px solid #f1f2f7;
        &:last-child {
            margin-bottom: 0;
        }
        .desc {
            font-size: 16px;
            line-height: 60px;
            .name{
                margin-left: 10px;
                margin-right: 40px;
            }
            span:first-child {
                color: #3c557a;
            }
            span:last-child {
                color: #7a8596;
            }
        }
        .oprate {
            position: absolute;
            right: 0;
            line-height: 60px;
            text-align: center;
            span {
                padding: 0 20px;
                font-size: 15px;
                color: #285ad8;
                border-right: 1px solid #f1f2f7;
                line-height: 60px;
                cursor: pointer;
                img {
                    margin-right: 5px;
                    margin-top: -2px;
                    vertical-align: middle;
                }
                &:last-child {
                    border-right: none;
                }
            }
            .switchBox {
                float: left;
                width: 104px;
                height: 60px;
                padding: 20px 0px;
                line-height: 60px;
                .addBorder {
                    display: flex;
                    align-items: center;
                    padding: 0px 20px;
                    border-right: 1px solid #f1f2f7;
                    cursor: pointer;
                    div {
                        flex: 1;
                        height: 20px;
                        line-height: 20px;
                        text-align: center;
                        font-size: 12px;
                        color: #f1f2f7;
                        background-color: #f1f2f7;
                    }
                    div.open {
                        color: #ffffff;
                        background-color: #31c690;
                    }
                    div.close {
                        color: #ffffff;
                        background-color: #eb2626;
                    }
                }
                
            }
            .spanBox {
                float: left;
            }
        }
    }
}
</style>