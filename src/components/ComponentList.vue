<template>
    <div class="component-list" @dragstart="handleDragStart">
        <el-divider content-position="center">展示类</el-divider>
        <div
            v-for="(item, index) in componentList"
            v-if="item.type == 1"
            :key="index"
            class="list"
            draggable 
            :data-index="index"
            :data-component="item.component"
        >
            <span class="iconfont" :class="'icon-' + item.icon"></span>
            <span>{{ item.label }}</span>
        </div>
        <el-divider content-position="center">操作类</el-divider>
        <div
            v-for="(item, index) in componentList"
            v-if="item.type > 1"
            :key="index"
            class="list"
            draggable 
            :data-index="index"
            :data-component="item.component"
        >
            <span class="iconfont" :class="'icon-' + item.icon"></span>
            <span>{{ item.label }}</span>
        </div>
    </div>
</template>

<script>
import componentList from '@/custom-component/component-list'

export default {
    data() {
        return {
            componentList,
        }
    },
    methods: {
        handleDragStart(e) {
            e.dataTransfer.setData('index', e.target.dataset.index)
            e.dataTransfer.setData('component', e.target.dataset.component)
        },
    },
}
</script>

<style lang="scss" scoped>
.component-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 10px;

    .list {
        width: 45%;
        border: 1px solid #ddd;
        cursor: grab;
        margin-bottom: 10px;
        text-align: center;
        color: #333;
        padding: 2px 5px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:active {
            cursor: grabbing;
        }

        .iconfont {
            margin-right: 4px;
            font-size: 20px;
        }

        .icon-wenben,
        .icon-tupian {
            font-size: 18px;
        }
    }
}
</style>