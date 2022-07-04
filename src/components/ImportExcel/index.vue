<template>
    <div class="upload-excel">
        <div class="btn-upload">
            <el-button
                :loading="loading"
                size="mini"
                type="primary"
                @click="handleUpload"
            >
                点击上传
            </el-button>
        </div>

        <input
            ref="excel-upload-input"
            class="excel-upload-input"
            type="file"
            accept=".xlsx, .xls"
            @change="handleClick"
        >
        <div
            class="drop"
            @drop="handleDrop"
            @dragover="handleDragover"
            @dragenter="handleDragover"
        >
            <i class="el-icon-upload" />
            <span>将文件拖到此处</span>
        </div>
    </div>
</template>

<script>
// import XLSX from 'xlsx'

export default {
    props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
    },
    data() {
        return {
            loading: false,
            excelData: {
                header: null,
                results: null,
            },
        }
    },
    methods: {
        handleDrop(e) {
            e.stopPropagation()
            e.preventDefault()
            if (this.loading) return
            const files = e.dataTransfer.files
            if (files.length !== 1) {
                this.$message.error('Only support uploading one file!')
                return
            }
            const rawFile = files[0] // only use files[0]
            if (!this.isExcel(rawFile)) {
                this.$message.error('Only supports upload .xlsx, .xls, .csv suffix files')
                return false
            }
            this.upload(rawFile)
            e.stopPropagation()
            e.preventDefault()
        },
        handleDragover(e) {
            e.stopPropagation()
            e.preventDefault()
            e.dataTransfer.dropEffect = 'copy'
        },
        handleUpload() {
            this.$refs['excel-upload-input'].click()
        },
        handleClick(e) {
            const files = e.target.files
            const rawFile = files[0] // only use files[0]
            if (!rawFile) return
            this.upload(rawFile)
        },
        upload(rawFile) {
            this.onSuccess && this.onSuccess(rawFile)
        },
        isExcel(file) {
            return /\.(xlsx|xls|csv)$/.test(file.name)
        },
    },
}
</script>

<style scoped lang="scss">
.upload-excel {
  display: flex;
  justify-content: center;
  margin-top: 50px;
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
  .btn-upload,
  .drop {
    border: 1px dashed #bbb;
    width: 350px;
    height: 160px;
    text-align: center;
    line-height: 160px;
  }
  .drop {
    padding-top: 20px;
    line-height: 80px;
    color: #bbb;
    i {
      font-size: 60px;
      display: block;
    }
  }
}
</style>