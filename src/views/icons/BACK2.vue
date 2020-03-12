<!--<template>-->
<!--  <div class="icons-container">-->
<!--    <el-tabs type="border-card">-->
<!--      <el-tab-pane label="本地">-->

<!--        <div class="grid">-->
<!--          <div v-for="item of svgIcons" :key="item">-->
<!--              <div class="icon-item">-->
<!--                <svg-icon :icon-class="item" class-name="disabled" />-->
<!--                <span>{{ item }}</span>-->
<!--              </div>-->
<!--          </div>-->

<!--        <el-upload-->
<!--          action="#"-->
<!--          list-type="picture-card"-->
<!--          :auto-upload="false">-->
<!--          <i slot="default" class="el-icon-plus"></i>-->
<!--          <div slot="file" slot-scope="{file}">-->
<!--            <img-->
<!--              class="el-upload-list__item-thumbnail"-->
<!--              :src="file.url" alt=""-->
<!--            >-->
<!--            <span class="el-upload-list__item-actions">-->
<!--        <span-->
<!--          class="el-upload-list__item-preview"-->
<!--          @click="handlePictureCardPreview(file)"-->
<!--        >-->
<!--          <i class="el-icon-zoom-in"></i>-->
<!--        </span>-->
<!--        <span-->
<!--          v-if="!disabled"-->
<!--          class="el-upload-list__item-delete"-->
<!--          @click="handleDownload(file)"-->
<!--        >-->
<!--          <i class="el-icon-download"></i>-->
<!--        </span>-->
<!--        <span-->
<!--          v-if="!disabled"-->
<!--          class="el-upload-list__item-delete"-->
<!--          @click="handleRemove(file)"-->
<!--        >-->
<!--          <i class="el-icon-delete"></i>-->
<!--        </span>-->
<!--      </span>-->
<!--          </div>-->
<!--        </el-upload>-->
<!--        </div>-->

<!--        <el-dialog :visible.sync="dialogVisible" append-to-body top="15px">-->
<!--          <img width="100%" :src="dialogImageUrl" alt="">-->
<!--        </el-dialog>-->

<!--      </el-tab-pane>-->
<!--      <el-tab-pane label="七牛云">-->
<!--      </el-tab-pane>-->
<!--    </el-tabs>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import clipboard from '@/utils/clipboard'-->
<!--import svgIcons from './svg-icons'-->
<!--import elementIcons from './element-icons'-->

<!--export default {-->
<!--  name: 'Icons',-->
<!--  data() {-->
<!--    return {-->
<!--      svgIcons,-->
<!--      elementIcons,-->
<!--      dialogImageUrl: '',-->
<!--      dialogVisible: false,-->
<!--      disabled: false-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    generateIconCode(symbol) {-->
<!--      return `<svg-icon icon-class="${symbol}" />`-->
<!--    },-->
<!--    generateElementIconCode(symbol) {-->
<!--      return `<i class="el-icon-${symbol}" />`-->
<!--    },-->
<!--    handleClipboard(text, event) {-->
<!--      clipboard(text, event)-->
<!--    },-->
<!--    handleRemove(file) {-->
<!--      console.log(file);-->
<!--    },-->
<!--    handlePictureCardPreview(file) {-->
<!--      this.dialogImageUrl = file.url;-->
<!--      this.dialogVisible = true;-->
<!--    },-->
<!--    handleDownload(file) {-->
<!--      console.log(file);-->
<!--    }-->
<!--    }-->
<!--}-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--  .icons-container {-->
<!--    margin: 10px 20px 0;-->
<!--    overflow: hidden;-->

<!--    .grid {-->
<!--      position: relative;-->
<!--      display: grid;-->
<!--      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));-->
<!--    }-->

<!--    .icon-item {-->
<!--      margin: 20px;-->
<!--      height: 85px;-->
<!--      text-align: center;-->
<!--      width: 100px;-->
<!--      float: left;-->
<!--      font-size: 30px;-->
<!--      color: #24292e;-->
<!--      cursor: pointer;-->
<!--    }-->

<!--    span {-->
<!--      display: block;-->
<!--      font-size: 16px;-->
<!--      margin-top: 10px;-->
<!--    }-->

<!--    .disabled {-->
<!--      pointer-events: none;-->
<!--    }-->
<!--  }-->
<!--</style>-->
