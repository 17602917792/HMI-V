<template>
	<div class="rect-shape">
		{{time}}
	</div>
</template>

<script>
	var moment = require('moment');
	export default {
		data() {
			return {
				time: '当前时间',
				timer: ''
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
		mounted() {
			this.getTime(this.element.style.time)
		},
		watch: {
			// "element.style" () {
			// 	this.getTime(this.element.style.time)
			// }
			"element": {
			    handler() {
					this.getTime(this.element.style.time)
				},
				deep: true,
			}
		},
		methods: {
			getTime(time) {
				const that = this
				that.time = moment().format(time);
				 clearInterval(this.timer)
				this.timer = setInterval(function() {
					that.time = moment().format(time);
				}, 1000);
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
