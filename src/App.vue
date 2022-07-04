<template>
    <router-view />
</template>

<style>
#app {
    font-family:
        "Helvetica Neue",
        Helvetica,
        Arial,
        "PingFang SC",
        "Hiragino Sans GB",
        "Heiti SC",
        "Microsoft YaHei",
        "WenQuanYi Micro Hei",
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
/* 全局设置 element ui dialog水平垂直居中 */
.el-dialog {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0px !important;
}

/* 全局滚动条样式 */
::-webkit-scrollbar{ /*滚动条整体样式*/
    width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
}
::-webkit-scrollbar-thumb{ /*滚动条里面小方块*/
    border-radius: 4px;
    background: #A8ACB1;
    /* background: #D9D9D9; */
}
::-webkit-scrollbar-track{ /*滚动条里面轨道*/
    border-radius: 4px;
    background: transparent;
}
</style>
