<template>
	<el-button :type="element.status ? 'primary':'default'">{{ element.status ? element.endTxt : element.startTxt }}</el-button>
</template>

<script>
export default {
    props: {
        propValue: {
            type: String,
            default: '',
        },
        element: {
            type: Object,
            default: () => {
			},
        },
    }
}
</script>
