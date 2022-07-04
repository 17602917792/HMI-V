<!-- TODO: 这个页面后续将用 JSX 重构 -->
<template>
	<div class="attr-list">
		<el-form>
			<el-form-item v-for="({key,label}, index) in styleKeys" :key="index" :label="label">
				<el-color-picker v-if="key == 'borderColor'" v-model="curComponent.style[key]"></el-color-picker>
				<el-color-picker v-else-if="key == 'color'" v-model="curComponent.style[key]"></el-color-picker>
				<el-color-picker v-else-if="key == 'backgroundColor'" v-model="curComponent.style[key]">
				</el-color-picker>
				<el-select v-else-if="selectKey.includes(key)" v-model="curComponent.style[key]">
					<template v-if="key == 'textAlign'">
						<el-option v-for="item in textAlignOptions" :key="item.value" :label="item.label"
							:value="item.value"></el-option>
					</template>
					<template v-else-if="key == 'borderStyle'">
						<el-option v-for="item in borderStyleOptions" :key="item.value" :label="item.label"
							:value="item.value"></el-option>
					</template>
					<template v-else>
						<el-option v-for="item in verticalAlignOptions" :key="item.value" :label="item.label"
							:value="item.value"></el-option>
					</template>
				</el-select>
				<el-input v-else v-model.number="curComponent.style[key]" type="number" />
			</el-form-item>
			<el-form-item v-if="curComponent && curComponent.component == 'v-divider'" label="线条宽度">
				<el-input v-model.number="curComponent.height" type="number" />
			</el-form-item>
			<el-form-item
				v-if="curComponent && (curComponent.component == 'warning' || curComponent.component == 'operation-log')"
				label="行高">
				<el-input v-model.number="curComponent.lineheight" type="number" />
			</el-form-item>
			<el-form-item
				v-if="curComponent && (curComponent.component == 'warning' || curComponent.component == 'operation-log')"
				label="行背景色">
				<el-color-picker v-model="curComponent.linebackground"></el-color-picker>
			</el-form-item>
			<el-form-item v-if="curComponent && curComponent.component == 'v-divider'" label="线条颜色">
				<el-color-picker v-model="curComponent.color"></el-color-picker>
			</el-form-item>
			<el-form-item v-if="curComponent && curComponent.component == 'triangle'" label="边框颜色">
				<el-color-picker v-model="curComponent.stroke"></el-color-picker>
			</el-form-item>
			<el-form-item v-if="curComponent && curComponent.component == 'triangle'" label="填充颜色">
				<el-color-picker v-model="curComponent.fill"></el-color-picker>
			</el-form-item>
			<el-form-item v-if="curComponent && !excludes.includes(curComponent.component)" label="内容">
				<el-input v-model="curComponent.propValue" type="textarea" />
			</el-form-item>
			<el-form-item v-if="curComponent && curComponent.component == 'v-iframe'" label="内嵌链接地址">
				<el-input v-model="curComponent.propUrl" type="textarea" />
			</el-form-item>
			<el-form-item v-if="curComponent && curComponent.component == 'switch-button'" label="弹起文本">
				<el-input v-model="curComponent.startTxt" type="textarea" />
			</el-form-item>
			<el-form-item v-if="curComponent && curComponent.component == 'switch-button'" label="按下文本">
				<el-input v-model="curComponent.endTxt" type="textarea" />
			</el-form-item>
			<el-form-item v-if="curComponent && curComponent.component == 'switch-button'" label="默认">
				<el-select v-model="curComponent.status">
					<el-option v-for="item in switchStatus" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item v-if="curComponent && curComponent.component == 'v-date'"  label="日期格式">
				<el-select v-model="curComponent.date" placeholder="请选择">
					<el-option
					  v-for="item in date"
					  :key="item.value"
					  :label="item.value"
					  :value="item.value">
					</el-option>
				  </el-select>
			</el-form-item>
			<el-form-item v-if="curComponent && curComponent.component == 'v-time'"  label="时间格式">
				<el-select v-model="curComponent.style.time" @change="changes" placeholder="请选择">
					<el-option
					  v-for="item in timeList"
					  :key="item.value"
					  :label="item.value"
					  :value="item.value">
					</el-option>
				  </el-select>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import {
		styleData,
	} from '@/utils/style'
	import variable from '/src/components/variable'

	export default {
		data() {
			return {
				comName: [],
				date: [
					{
						value: 'YYYY年M月D日',
					},
					{
						value: 'YYYY-M-D',
					},
					{
						value: 'YYYY:M:D',
					},
				],
				timeList: [
					{
						value: 'HH时mm分ss秒',
					},
					{
						value: 'HH:mm:ss',
					},
					{
						value: 'HH-mm-ss',
					},
				],
				value: '',
				excludes: ['Picture', 'Group', 'switch-button', 'v-date', 'v-time', 'v-divider', 'warning','v-iframe',
					'operation-log'], // 这些组件不显示内容
				textAlignOptions: [{
						label: '左对齐',
						value: 'left',
					},
					{
						label: '居中',
						value: 'center',
					},
					{
						label: '右对齐',
						value: 'right',
					},
				],
				switchStatus: [{
						label: '按下',
						value: true,
					},
					{
						label: '弹起',
						value: false,
					},
				],
				borderStyleOptions: [{
						label: '实线',
						value: 'solid',
					},
					{
						label: '虚线',
						value: 'dashed',
					},
				],
				verticalAlignOptions: [{
						label: '上对齐',
						value: 'top',
					},
					{
						label: '居中对齐',
						value: 'middle',
					},
					{
						label: '下对齐',
						value: 'bottom',
					},
				],
				selectKey: ['textAlign', 'borderStyle', 'verticalAlign'],
				styleData,
			}
		},
		methods: {
			changes (val) {
				console.log(val)
			}
		},
		computed: {
			styleKeys() {
				if (this.$store.state.curComponent) {
					const curComponentStyleKeys = Object.keys(this.$store.state.curComponent.style)
					return this.styleData.filter(item => curComponentStyleKeys.includes(item.key))
					console.log(curComponentStyleKeys.includes(item.key), 5555555555555)
				}
				return []
			},
			curComponent() {
				return this.$store.state.curComponent
			},
		},
	}
</script>

<style lang="scss" scoped>
	.attr-list {
		overflow: auto;
		padding: 20px;
		padding-top: 0;
		height: 100%;
	}

	.variable {
		position: relative;
	}

	.variable-row {
		margin-top: 2%;
	}
</style>
