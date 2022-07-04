<template>
    <div class="container">
        <div class="navBar">
            <span class="back" @click="goBack"></span>
            <div class="stationName">
                <img src="../assets/imgs/stationScreen.svg" alt="">工位屏名称 {{ stationName }}
            </div>
            <div class="stationTab">
                <ul>
                    <li>
                        <router-link
                            :to="{ path:'/singleStation/PLC', query: {
                                stationId,
                                stationName,
                                fromUrl,
                                projectId,
                                selectTab: 0
                            }}"
                            :class="{ active: selectTab === 0 ,skip: true }"
                        >
                            PLC管理
                        </router-link>
                    </li>
                    <li>
                        <router-link
                            :to="{ path:'/singleStation/variable', query: {
                                stationId,
                                stationName,
                                fromUrl,
                                projectId,
                                selectTab: 1
                            }}"
                            :class="{ active: selectTab === 1 ,skip: true }"
                        >
                            变量管理
                        </router-link>
                    </li>
                    <li>
                        <router-link
                            :to="{ path:'/singleStation/alarm', query: {
                                stationId,
                                stationName,
                                fromUrl,
                                projectId,
                                selectTab: 2
                            }}"
                            :class="{ active: selectTab === 2 ,skip: true }"
                        >
                            报警管理
                        </router-link>
                    </li>
                    <li>
                        <router-link
                            :to="{ path:'/singleStation/page', query: {
                                stationId,
                                stationName,
                                fromUrl,
                                projectId,
                                selectTab: 3
                            }}"
                            :class="{ active: selectTab === 3 ,skip: true }"
                        >
                            页面管理
                        </router-link>
                    </li>
                    <li>
                        <router-link
                            :to="{ path:'/singleStation/picture', query: {
                                stationId,
                                stationName,
                                fromUrl,
                                projectId,
                                selectTab: 4
                            }}"
                            :class="{ active: selectTab === 4,skip: true }"
                        >
                            图片管理
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
        <router-view />
    </div>
</template>
<script>
export default {
    data() {
        return {
            selectTab: parseInt(this.$route.query.selectTab),
            stationId: this.$route.query.stationId,
            stationName: this.$route.query.stationName,
            fromUrl: this.$route.query.fromUrl,
            projectId: this.$route.query.projectId,
        }
    },
    created() {
    },
    methods: {
        goBack() {
            const fromUrl = this.$route.query.fromUrl
            this.$router.push({
                path: fromUrl,
                query: {
                    stationId: this.stationId,
                    projectId: this.projectId,
                },
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.container {
    box-sizing: border-box;
    width: 100%;
    background-color: #f8f8f9;
    overflow: hidden;
    .navBar {
        display: flex;
        width: 100%;
        height: 52px;
        background-color: #ffffff;
        border-radius: 5px;
        border: 1px solid #f1f2f7;
        .back {
            width: 30px;
            height: 25px;
            margin-left: 20px;
            margin-top: 15px;
            cursor: pointer;
            background: url('../assets/imgs/back.svg') no-repeat;
            &:hover {
                 background: url('../assets/imgs/buleback.svg') no-repeat;
            }
        }
        .stationName{
            width: 280px;
            height: 100%;
            font-size: 18px;
            font-weight: bold;
            color: #303030;
            line-height: 52px;
            img {
                margin: auto 0;
                margin-left: 20px;
                margin-right: 10px;
                margin-top: -3px;
                vertical-align: middle;
            }
        }
        .stationTab {
            flex: 1;
            height: 100%;
            padding: 5px 0;
            ul li {
                float: left;
                width: 149px;
                height: 39px;
                line-height: 39px;
                background-color: #ffffff;
                .skip {
                    display: block;
                    width: 100%;
                    height: 100%;
                    font-size: 14px;
                    color: #8b8b8b;
                    text-align: center;
                    text-decoration: none;
                    &.active {
                        color: #ffffff;
                        background-color: #285ad8;
                    }
                }
                
            }
        }
    }
}

</style>