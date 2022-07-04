<template>
	<div class="rect-shape">
		{{date}}
	</div>
</template>

<script>
	var moment = require('moment');
	export default {
		data() {
			return {
				date: '',
			}
		},
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
		created(){
			console.log(this.date,1111111)
		},
		mounted() {
			this.getDate(this.element.date)
		},
		watch: {
			"element.date" () {
				this.getDate(this.element.date)
			}
			
		},
		methods: {
			getDate( date='YYYY-M-D') {
				const that = this
				that.date = moment().format(date);
			}
		}
	}
</script>

<style lang="scss" scoped>
.rect-shape {
    width: 100%;
    height: 100%;
}
</style>
