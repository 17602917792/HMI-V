<template>
	<div class="v-switch"> 
		<el-switch
		  v-model="value"
		  :active-text="propValue"
		  active-color="#13ce66"
		  inactive-color="#ff4949">
		</el-switch>
	</div>
</template>

<script>
export default {
	data() {
		return {
			value: ''
		}
	},
    props: {
        propValue: {
            type: String,
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
.v-switch {
  width: 100%;
  height: 100%;
}
</style>
