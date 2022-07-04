<template>
  <div class="infinite-list-wrapper" style="overflow:auto">
    <ul
      class="list"
      v-infinite-scroll="load"
      infinite-scroll-disabled="disabled">
      <li 
		  v-for="item in demoData" 
		  class="list-item" 
		  :style="{ 'height': element.lineheight+'px','background': element.linebackground,'color':item.color }">
		  [<span>{{item.time}}</span>] [{{item.type}}]:{{ item.msg }}
	  </li>
    </ul>
    <p v-if="loading" style="text-align: center;">加载中...</p>
    <p v-if="noMore" style="text-align: center;">没有更多了</p>
  </div>
</template>

<script>
  var moment = require('moment');
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
    data () {
      return {
        count: 10,
        loading: false,
		demoData:[],
      }
    },
	created() {
		moment.locale('zh-cn');
		this.waring();
	},
    computed: {
      noMore () {
        return this.demoData.length >= 20
      },
      disabled () {
        return this.loading || this.noMore
      }
    },
    methods: {
      load () {
        this.loading = true
        setTimeout(() => {
          this.demoData.push({
			  time: moment().calendar(),
              type: '气缸类',
              msg: ' 气缸 PLC:192.168.2.108 XXXXXXX未伸出到位 ',
              color: '#ff8484'
          })
          this.loading = false
        }, 500)
      }
    }
  }
</script>
<style>
.infinite-list-wrapper .list {
    padding: 0;
    margin: 0;
    list-style: none;
	
}

.infinite-list-wrapper .list-item {
    display: flex;
    align-items: center;
    justify-content: left;
    height: 50px;
    margin: 8px;
	
}
.list-item span{

}

</style>