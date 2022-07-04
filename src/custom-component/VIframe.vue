<template>
    <div  class="v-iframe">
        <iframe :src='element.propUrl'  id="map" :element="element" width="100%" height="100%"  ></iframe>
    </div>
</template>
 
 
<script>
    export default {
		props: {
		    propUrl: {
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
            }
        },
        mounted(){
            /**
            * iframe-宽高自适应显示   
            */
 //            function changeMapIframe(){
 //                const map = document.getElementById('map');
 //                const deviceWidth = document.body.clientWidth;
 //                const deviceHeight = document.body.clientHeight;
 //                map.style.width = (Number(deviceWidth)-240) + 'px'; //数字是页面布局宽度差值
 //                map.style.height = (Number(deviceHeight)+764) + 'px'; //数字是页面布局高度差
 //            }
 
 //            changeMapIframe()
 
 //            window.onresize = function(){
 //                changeMapIframe()
 //            }
        }
    }
</script>
<style lang="scss" scoped>
.v-iframe {
    width: 100%;
     height: 100%;
     overflow: hidden;
}
</style>
