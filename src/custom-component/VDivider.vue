<template>
    <div>
        <div class="divider" :style="{ 'background-color': element.color, height: element.height + 'px' }" />
    </div>
</template>

<script>
    export default {
        props: {
            propValue: {
                type: String,
                require: true,
                default: '',
            },
            element: {
                type: Object,
                default: () => {},
            },
        },
    }
</script>

<style lang="scss" scoped>
.divider {
    position: relative;
    display: block;
    width: 100%;
    margin: 20px 0;
}
</style>
