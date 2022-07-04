<template>
    <div class="stationItem">
        <div class="main">
            <div v-if="$isHasAuth('STATION_DELETE')" class="threePoint" @click="handleDeleteStation">
                <!-- <div class="grayPoint">
                    <div class="bulePoint">
                        <div @click="handleUpdateStation">
                            <img src="../../assets/imgs/edit.svg" alt="">
                            <span>编辑</span>
                        </div>
                        <div @click="handleDeleteStation">
                            <img src="../../assets/imgs/delete.svg" alt="">
                            <span>删除</span>
                        </div>
                    </div>
                </div> -->
            </div>
            <div>
                <div class="name">
                    <el-checkbox v-model="checked" @change="handleChange"></el-checkbox>
                    <span @click="goToSingleStation">工位屏名称 {{ stationObject.stationName }}</span>
                    <i
                        v-if="$isHasAuth('STATION_UPDATE')"
                        class="el-icon-edit"
                        style="margin-left: 10px;"
                        @click="handleUpdateStation"
                    ></i>
                </div>
                <p class="desc" @click="goToSingleStation">{{ stationObject.desc || '暂无描述' }}</p>
            </div>

            <div class="setting">
                <img src="../../assets/imgs/stationItem.png" alt="" @click="goToSingleStation">
                <div class="settingInfo">
                    <div class="info">
                        <div>
                            <p>宽度</p>
                            <p>{{ stationObject.width }}px</p>
                        </div>
                        <div>
                            <p>高度</p>
                            <p>{{ stationObject.height }}px</p>
                        </div>
                    </div>

                    <div class="issue">
                        <p>状态</p>
                        <!-- 1 : 下发成功 ; 2 ： 下发失败 ;  0 ：未下发 -->
                        <div :class="{ greenBg: stationObject.updateState == 1 , redBg: stationObject.updateState == 2}">
                            {{ changeStateStation }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="information">
                <div class="ip">
                    <p class="nameUn">IP地址</p>
                    <p>{{ stationObject.ip }}</p>
                </div>
                <div class="num">
                    <p class="nameUn">更新频次</p>
                    <p>{{ stationObject.rate }}</p>
                </div>
                <div class="issueTime">
                    <p class="nameUn">下发时间</p>
                    <p>{{ changeTime }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { deleteStation } from '../../api/stations'

export default {
    props: {
        stationObject: {
            type: Object,
            required: true,
        },
        projectId: {
            type: String,
            required: true,
        },
        
    },
    data() { 
        return {
            checked: false,
            canvasStyleData: { 
                width: 1200,
                height: 740,
                scale: 100,
            },
        }
    },
    computed: {
        changeStateStation() {
            if (this.stationObject.updateState === '1') {
                return '下发成功'
            } 
            if (this.stationObject.updateState === '2') {
                return '下发失败'
            } 
            return '未下发'
        },
        changeTime() {
            if (this.stationObject.updateTime != null) {
                return this.stationObject.updateTime.replace(/-/g, '.')
            } 
            return '暂无'
        },
    },
    watch: {
        stationObject() {
            this.checked = false
        },
    },
    methods: {
        goToSingleStation() {
            // console.log(this.stationObject)
            this.$router.push({ 
                path: '/singleStation/PLC', 
                query: { 
                    stationId: this.stationObject.id, 
                    stationName: this.stationObject.stationName, 
                    fromUrl: '/stations', 
                    projectId: this.projectId, 
                    selectTab: 0, 
                }, 
            })
        },
        handleUpdateStation() {
            this.$emit('update-station', this.stationObject)
        },
        handleDeleteStation() {
            this.$confirm('此操作将永久删除该工位屏, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                const response = await deleteStation({ id: this.stationObject.id })
                // console.log(response)
                if (response.status === 200 && response.data.success) {
                    this.$emit('on-success')
                    this.$message({
                        type: 'success',
                        message: '删除工位屏成功!',
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
        handleChange() {
            this.$emit('change-checked', {
                stationId: this.stationObject.id,
                status: this.checked,
            })
            // if (this.checked) {
            //     console.log('item:' + this.stationObject.id)
            // }
        },
    },
}
</script>
<style scoped>
.stationItem {
    position: relative;
    box-sizing: border-box;
    float: left;
    width: calc(25% - 30px);
    height: 280px;
    padding: 20px 15px 10px 15px;
    margin-right: 30px;
    margin-bottom: 20px;
    background: #FFFFFF;
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    border: 1px solid #E5E5E5;
    /* cursor: pointer; */
}
@media screen and (max-width: 1680px) {
    .stationItem {
        width: calc(33.33% - 30px);
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
}
.threePoint:hover {
        background: url('../../assets/imgs/sdeleteBule.svg') no-repeat;
    }
/* .threePoint {
    position: absolute;
    top: 20px;
    right: 15px;
}
.threePoint .grayPoint  {
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
    z-index: 1;
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

.name {
    margin-bottom: 5px;
    font-size: 18px;
    font-weight: 500;
    color: #3C557A;
    cursor: pointer;
}
.desc {
    margin-bottom: 20px;
    font-size: 12px;
    color: #717986;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;

}
.setting {
    display: flex;
    width: 100%;
    height: 112px;
    margin-bottom: 20px;
}

.setting img {
    flex: 1;
    height: 100%;
    vertical-align: middle;
    border-radius: 5px;
    cursor: pointer;
}
.setting .settingInfo {
    position: relative;
    flex: 1;
    height: 100%;
    padding-left: 30px;
    font-size: 12px;
    color: #717986;
}
.info{
    display: flex;
    width: 100%;
    margin-bottom: 10px;
}

.info div {
    flex: 1;
    height: 50%;
    /* background-color: aqua; */
}
.info div p:first-child {
    margin-bottom: 5px;
}
.info div p:last-child {
    font-size: 14px;
}

.issue p:first-child {
    margin-bottom: 5px;
}
.issue div {
    position: absolute;
    left: 30px;
    bottom: 0px;
    width: 148px;
    height: 35px;
    background-color: #f1f2f7;
    line-height: 35px;
    border-radius: 5px;
    color: #717986;
    text-align: center;
}
.issue div.greenBg {
    background-color: #31c690;
    color: #ffffff;

}
.issue div.redBg {
    background-color: #eb2626;
    color: #ffffff;
}

.information {
    display: flex;
    width: 100%;
    font-size: 14px;
    color: #717986;
}
.information div {
    flex: 1;
}
.information div:nth-child(2) {
    flex: 0.8;
}
.information div p:first-child {
    margin-bottom: 10px;
    font-size: 12px;
}

</style>

<style scoped>
.name >>> .el-checkbox__inner {
    /* width: 18px; */
    /* height: 18px; */
    margin-top: -8px;
    margin-right: 10px;
}
</style>