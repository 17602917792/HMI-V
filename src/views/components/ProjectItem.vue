<template>
    <div class="projectItem">
        <div class="main">
            <div v-if="$isHasAuth('PROJECT_DELETE')" class="threePoint" @click="handleDeleteProject">
                <!-- <div class="grayPoint">
                    <div class="bulePoint">
                        <div @click="handleUpdateProject">
                            <img src="../../assets/imgs/edit.svg" alt="">
                            <span>编辑</span>
                        </div>
                        <div @click="handleDeleteProject">
                            <img src="../../assets/imgs/delete.svg" alt="">
                            <span>删除</span>
                        </div>
                        <div></div>
                    </div>
                </div> -->
            </div>
            <p class="name">
                <span @click="goToStations">项目名称 {{ projectObject.projectName }}</span>
                <!-- <span class="editProject" @click="handleUpdateProject"></span> -->
                <i
                    v-if="$isHasAuth('PROJECT_UPDATE')"
                    class="el-icon-edit"
                    style="margin-left: 10px;"
                    @click="handleUpdateProject"
                ></i>
            </p>
            <p class="desc" @click="goToStations">{{ projectObject.desc || '暂无描述' }} </p>
            <div class="recode">
                <div class="timeAndUser">
                    <div class="time">
                        <p class="nameUn">创建日期</p>
                        <p>{{ translateTime }}</p>
                    </div>
                    <div class="user">
                        <p class="nameUn">创建人</p>
                        <p>{{ projectObject.createdUserName }}</p>
                    </div>
                </div>
                <div class="total" @click="goToStations">
                    <p>{{ projectObject.stations.length }}</p>
                    <p>现有工位屏数量</p>
                </div>
            </div>
            <div class="stationName">工位屏</div>
            <div v-if="projectObject.stations.length === 0" class="stationNull">暂无工位屏</div>
            <div v-else class="station">
                <template v-for=" (item, index) in projectObject.stations">
                    <div :key="index" class="stationsItem" @click="goToSingleStation(item)">
                        <div><img src="../../assets/imgs/stationItem.png" alt=""></div>
                        <p>{{ item.stationName }}</p>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import { deleteProject } from '../../api/project'

export default {
    props: {
        projectObject: {
            type: Object,
            required: true,
        },
        
    },
    data() { 
        return {
            abc: '',
            // canvasStyleData: {
            //     width: 1200,
            //     height: 740,
            //     scale: 100,
            // },
        }
    },
    computed: {
        translateTime() {
            return this.projectObject.createdTime.split(' ')[0].replace(/-/g, '.')
        },
    },
    methods: {
        goToSingleStation(item) {
            // console.log(item)
            this.$router.push({ 
                path: '/singleStation/PLC', 
                query: { 
                    stationId: item.id, 
                    stationName: item.stationName, 
                    fromUrl: '/project', 
                    projectId: this.projectObject.id, 
                    selectTab: 0, 
                }, 
            })
            // this.canvasStyleData.width=this.stationObject.width,
            // this.canvasStyleData.height=this.stationObject.height,
            // this.$store.commit('setCanvasStyle',this.canvasStyleData)
        },
        goToStations() {
            this.$router.push({ path: '/stations', query: { projectId: this.projectObject.id } })
        },
        handleUpdateProject() {
            this.$emit('update-project', this.projectObject)
        },
        handleDeleteProject() {
            this.$confirm('此操作将永久删除该项目, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                const response = await deleteProject({ id: this.projectObject.id })
                // console.log(response)
                if (response.status === 200 && response.data.success) {
                    this.$emit('on-success')
                    this.$message({
                        type: 'success',
                        message: '删除项目成功!',
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
        },
    },
}
</script>
<style scoped lang="scss">
.projectItem {
    position: relative;
    box-sizing: border-box;
    float: left;
    width: calc(25% - 30px);
    height: 300px;
    padding: 20px 15px 10px 15px;
    margin-right: 30px;
    margin-bottom: 20px;
    background: #FFFFFF;
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    border: 1px solid #E5E5E5;
}
@media screen and (max-width: 1152px) {
    .projectItem {
        width: calc(33.33% - 30px);
    }
}
@media screen and (max-width: 800px) {
    .projectItem {
        width: calc(50% - 30px);
    }
}

.threePoint {
    position: absolute;
    top: 20px;
    right: 15px;
    width: 20px;
    height: 20px;
    background: url('../../assets/imgs/delete.svg') no-repeat;
    background-size: cover;
    cursor: pointer;
    &:hover {
        background: url('../../assets/imgs/sdeleteBule.svg') no-repeat;
    }
}
/* .threePoint .grayPoint  {
    width: 24px;
    height: 24px;
    background: url('../../assets/imgs/gray.svg');
}
.threePoint .grayPoint .bulePoint {
    display: none;
    position: absolute;
    top: -5px;
    right: 10px;
    width: 125px;
    padding: 20px 25px 20px 30px;
    background: url('../../assets/imgs/Group.svg');
    background-size: 100% 100%;
    cursor: pointer;
}
.threePoint .grayPoint .bulePoint img {
    width: 20px;
    height: 20px;
    margin-right: 15px;
    vertical-align: middle;
}
.threePoint .grayPoint .bulePoint span {
    font-size: 14px;
    color: #98a0a2;
}
.threePoint .grayPoint .bulePoint div:first-child {
    margin-bottom: 15px;
}
.threePoint .grayPoint:hover {
    background: url('../../assets/imgs/bule.svg');
}

.threePoint .grayPoint:hover .bulePoint{
   display: block;
} */

.main .name {
    margin-bottom: 5px;
    font-size: 18px;
    font-weight: 500;
    color: #3C557A;
    cursor: pointer;
    overflow: hidden;
    span {
        float: left;
    }
    .editProject {
        display: block;
        width: 20px;
        height:20px;
        margin-top: 3px;
        background: url('../../assets/imgs/edit.svg') no-repeat;
        &:hover {
            background: url('../../assets/imgs/editBlue.svg') no-repeat;
        }
    }
}
.desc {
    margin-bottom: 10px;
    font-size: 12px;
    color: #717986;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
}
.recode {
    display: flex;
}
.recode .timeAndUser {
    display: flex;
    align-items: center;
    flex: 2;
}
.recode .timeAndUser p {
    font-size: 14px;
    font-weight: 500;
    color: #717986;
}
.recode .timeAndUser .nameUn {
    margin-bottom: 10px;
    font-size: 12px;
    font-weight: 400;
    color: #717986;
}
.recode .timeAndUser .time {
    flex: 1;
}
.recode .timeAndUser .user {
    flex: 1;
}
.recode .total {
    flex: 1;
    height: 70px;
    padding: 15px 0;
    background: #F9F9F9;
    border-radius: 7px 7px 7px 7px;
    opacity: 1;
    text-align: center;
    font-size: 12px;
    color: #717986;
    cursor: pointer;
}
.recode .total p:first-child {
    font-size: 18px;
    font-weight: bold;
    color: #3C557A;
}
.stationName {
    height: 35px;
    line-height: 35px;
    color: #717986;
    font-size: 12px;
    font-weight: 500;
}
.stationNull {
    width: 100%;
    height: 95px;
    /* background-color: #3C557A; */
    text-align: center;
    line-height: 95px;
    border: 1px dashed #717986;
    border-radius: 5px;
    color: #717986;
    font-size: 12px;
}

.station {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    height: 95px;
    overflow-x: auto;
    overflow-y: hidden;
}
.station .stationsItem {
    width: 96px;
    height: 70px;
    margin-right: 45px;
    cursor: pointer;
    /* background-color: aqua; */

}
.station .stationsItem img {
    width: 96px;
    height: 54px;
    margin-bottom: 5px;
    vertical-align: middle;
    border-radius: 5px;
}
.station .stationsItem p {
    font-size: 13px;
    color: #717986;
    text-align: center;
}

.station::-webkit-scrollbar { /*滚动条整体样式*/
    width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 8px;
}
.station::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
    border-radius: 4px;
    background: #0089ff;
}
.station::-webkit-scrollbar-track { /*滚动条里面轨道*/
    border-radius: 4px;
    background: #f1f2f7;
    margin: 0;
}
</style>