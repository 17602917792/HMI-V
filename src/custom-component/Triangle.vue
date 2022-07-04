<template>
    <div class="triangle" :style="{'background-image':'url('+ Img +')'}">
        <v-text :prop-value="element.propValue" :element="element" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            Img:"",
            padding: 10,
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
    created()
    {
        this.showImg();		
    },
    watch:{		
        'element.stroke':function () {
            this.showImg();
        },
        'element.strokewidth':function () {
            this.showImg();
        },
        'element.fill':function () {
            this.showImg();
        },
    },
    methods:{
        showImg(){
            const svg = `<svg width="65" height="60" xmlns="http://www.w3.org/2000/svg">
             <g id="Layer_1">
              <title>Layer 1</title>
              <path stroke="${this.element.stroke}" stroke-width="${this.element.strokewidth}"  d="m0.915,57.93313l31.5,-57l31.5,57l-63,0z" fill="${this.element.fill}"/>
             </g>
            </svg>`;
            this.Img = `data:image/svg+xml;base64,${window.btoa(svg)}`;
        }
    }
}
</script>

<style lang="scss" scoped>
.triangle {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    padding: 10px;
}
</style>
