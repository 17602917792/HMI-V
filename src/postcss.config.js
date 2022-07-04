module.exports = {
    plugins: {
        // 控制样式属性前面自动添加前缀
        autoprefixer: {},
        'postcss-pxtorem': {
            // 设计稿 1920 x 1080 px
            rootValue: 192,
            // 控制那些样式的属性需要转换
            propList: ['*'],
        },
    },
}
