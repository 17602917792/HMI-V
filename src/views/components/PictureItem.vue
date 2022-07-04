<template>
    <div class="stationItem">
        <div class="main">
            <div class="threePoint" @click="handleDeletePicture">
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
                    <span>{{ pageObject.imageName }} </span>
                    <i
                        class="el-icon-edit"
                        style="margin-left: 10px; cursor: pointer;"
                        @click="handleUpdatePicture"
                    ></i>
                </div>
                <p class="desc">{{ pageObject.desc|| '暂无描述' }}</p>
            </div>

            <div class="setting">
                <!-- <img src="../../assets/imgs/stationItem.png" alt=""> -->
                <!-- <el-image
                    style="width: 100%; height: 140px"
                    :src="imgUrlBefore + pageObject.path"
                    fit="cover"
                ></el-image> -->
                <div class="demo-image__preview">
                    <el-image 
                        style="width: 100%; height: 140px"
                        :src="imgUrlBefore + pageObject.path"
                        fit="cover"
                        :preview-src-list="srcList"
                    >
                    </el-image>
                </div>
                <!-- {{ imgUrlBefore }} -->
            </div>
        </div>
    </div>
</template>
<script>
import { deleteGalleryInfo } from '../../api/picture'
import { location } from '../../utils/request'

export default {
    props: {
        pageObject: {
            type: Object,
            required: true,
        },
        srcList: {
            type: Array,
            required: true,
        },
    },
    data() { 
        return {
            imgUrlBefore: location.charAt(location.length - 1) == '/' ? location.substring(0, location.length - 1) : location,
            imgUrl: '../../assets/imgs/stationItem.png',
            checked: false,
        }
    },
    watch: {
        stationObject() {
            this.checked = false
        },
    },
    mounted() {
        
    },
    methods: {
        handleUpdatePicture() {
            this.$emit('update-picture', this.pageObject)
        },
        handleDeletePicture() {
            this.$confirm('此操作将永久删除该图片, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                const response = await deleteGalleryInfo({ id: this.pageObject.id })
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
                ...this.pageObject,
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
    width: calc(20% - 20px);
    height: 230px;
    padding: 20px 15px 10px 15px;
    margin-right: 20px;
    margin-bottom: 20px;
    background: #FFFFFF;
   
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    border: 1px solid #E5E5E5;
    /* cursor: pointer; */
}
/* @media screen and (max-width: 1680px) {
    .stationItem {
        width: calc(33.33% - 30px);
    }
} */
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
}
.desc {
    margin-bottom: 10px;
    font-size: 12px;
    color: #717986;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

}
.setting {
    display: flex;
    width: 100%;
    height: 140px;
    margin-bottom: 20px;
}

.setting img {
    flex: 1;
    height: 100%;
    vertical-align: middle;
    border-radius: 5px;
    cursor: pointer;
}

</style>

<style scoped>
.name >>> .el-checkbox__inner {
    /* width: 18px; */
    /* height: 18px; */
    margin-top: -8px;
    margin-right: 10px;
}
.main >>> .demo-image__preview {
    width: 100%;
}
</style>