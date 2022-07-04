import { Table } from 'element-ui'
import Vue from 'vue'

const components = [
    'Picture',
    'VText',
    'VButton',
    'Group',
    'RectShape',
	'VSwitch',
    'CircleShape',
	'VIframe',
	'Triangle',
    'VDivider',
    'VDate',
    'VTime',
    'Warning',
    'OperationLog',
]

components.forEach(key => {
    Vue.component(key, () => import(`@/custom-component/${key}`))
})
