<template>
    <div class="circle">
        <v-text :prop-value="element.propValue" :element="element" />
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
    .circle {
        border: 1em solid #0f1c3f;
        border-radius: 50%;
        height: 5em;
        width: 5em;
    }
</style>
