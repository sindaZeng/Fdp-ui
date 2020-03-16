<template>
  <el-dialog
    width="80%"
    hight="80%"
    title="图片列表"
    :visible.sync="createDialog"
    :before-close="cancelDialog"
    append-to-body
      top="15px">
    <div class="icons-container">
      <el-tabs type="border-card">
        <el-tab-pane label="本地">
          <div class="grid" style="max-height: 300px;overflow: auto">
            <div v-for="item of svgIcons" :key="item"
                 :class="checkIcon == item ? 'active':''" @click="activeIcon(item)">
              <div class="icon-item">
                <svg-icon :icon-class="item" class-name="disabled"/>
                <span>{{ item }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="七牛云">
          <div class="grid" style="max-height: 300px;overflow: auto">
            <div v-for="item of elementIcons" :key="item"
                 :class="checkIcon == item ? 'active':''" @click="activeIcon(item)" >
                <div class="icon-item">
                  <i :class="'el-icon-' + item"/>
                  <span>{{ item }}</span>
                </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <span slot="footer" class="dialog-footer">
             <el-button @click="cancelDialog">取 消</el-button>
             <el-button type="primary" @click="selectIcon">确 定</el-button>
             </span>
  </el-dialog>
</template>

<script>
import clipboard from '@/utils/clipboard'
import svgIcons from './svg-icons'
import elementIcons from './element-icons'

export default {
  name: 'Icons',
  props: {
    createDialog: {
      type: Boolean
    }
  },
  data() {
    return {
      checkIcon: '',
      svgIcons,
      innerVisible: false,
      elementIcons
    }
  },
  watch:{

  },
  methods: {
    cancelDialog () {
      this.$emit('cancelDialog',false,null)
    },
    selectIcon () {
      this.$emit('cancelDialog',false,this.checkIcon)
    },
    activeIcon(index) {
      this.checkIcon = index;
    },
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },
    generateElementIconCode(symbol) {
      return `<i class="el-icon-${symbol}" />`
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    }
  }
}
</script>

<style lang="scss" scoped>
  .icons-container {
    margin: 10px 20px 0;
    overflow: hidden;

    .grid {
      position: relative;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }

    .icon-item {
      margin: 5px;
      height: 85px;
      text-align: center;
      width: 100px;
      float: left;
      font-size: 30px;
      color: #24292e;
      cursor: pointer;
    }

    span {
      display: block;
      font-size: 16px;
      margin-top: 10px;
    }

    .active {
      color: #18d217;
      border: 2px dashed #43d22e;
      font-weight: bolder;
    }

    .disabled {
      pointer-events: none;
    }
  }
</style>
