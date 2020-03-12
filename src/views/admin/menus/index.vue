<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="名称" style="width: 200px;" class="filter-item"
                @keyup.enter.native="searchMenu"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="searchMenu">
        搜索
      </el-button>
      <el-button v-if="checkPermission(['sys_add_menu'])" class="filter-item" style="margin-left: 10px;" type="primary"
                 icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="menuData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="name"
      :stripe="true"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

      <el-table-column
        prop="name"
        label="名称">
      </el-table-column>

      <el-table-column
        label="图标">
        <template slot-scope="{row}">
          <svg-icon :icon-class="row.icon"/>
        </template>
      </el-table-column>
      <el-table-column
        label="类型">
        <template slot-scope="{row}">
          <el-tag :type="row.type | statusFilter">
            {{ row.type==0 ?'菜单':'按钮' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="path"
        label="路由路径">
      </el-table-column>
      <el-table-column
        prop="permission"
        label="授权标识">
      </el-table-column>
      <el-table-column
        prop="sort"
        sortable
        width="100"
        label="排序">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="{row}">
          <el-button v-if="checkPermission(['sys_editor_menu'])" type="primary" size="mini" @click="handleCheck(row)"
                     plain>
            查看
          </el-button>
          <el-button size="mini" type="success" @click="updateMenus(row)" plain>
            编辑
          </el-button>
          <el-button v-if="checkPermission(['sys_delete_menu'])" size="mini" type="danger"
                     @click="deleteRole(row)" plain>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :before-close="cancel">

      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="150px" :inline="true">
        <el-form-item v-if="dialogStatus === 'update'" hidden>
          <div slot="label" style="margin-left:10px;">ID:</div>
          <el-input v-model="temp.id"/>
        </el-form-item>

        <el-form-item label="名称:" prop="roleCode">
          <el-input v-model="temp.name" :disabled="dialogStatus === 'update'" clearable/>
        </el-form-item>
        <el-form-item label="授权标识:" prop="roleName">
          <el-input v-model="temp.permission" clearable/>
        </el-form-item>
        <el-form-item label="排序:" prop="roleName">
          <el-input v-model="temp.sort" clearable/>
        </el-form-item>
        <el-form-item label="路由路径:" prop="roleName">
          <el-input v-model="temp.path" clearable/>
        </el-form-item>
        <el-form-item
          label="类型:">
          <el-radio v-model="temp.type" :label="0" size="small" border>菜单</el-radio>
          <el-radio v-model="temp.type" :label="1" size="small" border>按钮</el-radio>
        </el-form-item>
        <el-form-item label="上级菜单:" prop="roleName" :hidden="dialogFormIsButton">
          <el-cascader
            v-model="form.category"
            :options="options"
            :props="{ checkStrictly: true }"
            clearable
          ></el-cascader>
        </el-form-item>

        <el-form-item label="图标:" prop="roleName">
          <el-button :style="{ display: buttonStust }" type="primary" @click="innerVisible = true">选择图片</el-button>
          <iconsView :createDialog="innerVisible" @cancelDialog="cancelDialog"/>
          <svg-icon :icon-class="iconName" class-name="disabled"/>
          <el-tooltip class="item" effect="dark" content="重新选择图片" placement="top-start">
          <span :style="{ display:deleteButtonStust}" class="delete" @click="deletePicture()">×
            </span></el-tooltip>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">
          取消
        </el-button>
        <el-button type="primary"
                   @click="dialogStatus==='create'?createRole():dialogStatus==='update'?updateData():updateRoleMenus()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import {getMenuTree} from '@/api/menu'
import iconsView from '@/views/icons/index.vue'

export default {
  components: {
    iconsView
  },
  name: 'SysMenus',
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: ''
      }
      return statusMap[status]
    }
  },
  methods: {
    checkPermission,
    async getMenuTree() {
      this.listLoading = true
      const {data} = await getMenuTree()
      if (data.code != 0) {
        this.$notify.error('菜单数据加载异常,请联系管理员')
      }
      this.menuData = data.data;
      data.data.map(v => {
        this.filterButton(v)
      })
      this.listLoading = false
    },
    filterButton(options, source) {
      const menusOptionss = {
        value: '',
        parentId: '',
        children: null,
        label: ''
      }
      if (options.type === 0) {
        menusOptionss.value = options.id
        menusOptionss.parentId = options.parentId
        menusOptionss.label = options.label
        if (source != null && source.children != null) {
          source.children.push(menusOptionss)
        } else {
          if (options.children.length != 0) {
            menusOptionss.children = []
          }

          source = menusOptionss
        }
        if (options.children.length > 0) {
          for (let i = 0; i < options.children.length; i++) {
            let dataKey = options.children[i];
            this.filterButton(dataKey, source)
            if (i === options.children.length - 1 && dataKey.type === 0) {
              this.options.push(source)
            }
          }
        } else {
          this.options.push(source)
        }
      } else if (source != null && options.type === 1) {
        options.children = null
      }
    },
    getParentId(dataPatent) {
      let arr = []
      arr.push(dataPatent)
      return arr
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCheck(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'check'
      this.form.category = []
      if (row.type == 0) {
        this.form.category.push(row.parentId)
        if (row.parentId != 0) {
          this.form.category.push(row.id)
        }
      } else {
        this.dialogFormIsButton = true
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    cancel() {
      this.dialogFormIsButton = false
      this.dialogFormVisible = false
    },
    deletePicture() {
      this.deleteButtonStust = 'none'
      this.buttonStust = 'inline'
      this.iconName = ''
    },
    cancelDialog(e, iconName) {
      this.buttonStust = 'inline'
      if (iconName != null) {
        this.iconName = iconName
        this.buttonStust = 'none'
        this.deleteButtonStust = 'inline'
      }
      this.innerVisible = e
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        title: '',
        status: 'published',
        type: ''
      }
    }
  },
  data() {
    return {
      form: {
        category: []
      },
      options: [{
        value: 0,
        label: '顶级菜单'
      }],
      temp: {
        id: undefined,
        label: '',
        name: '',
        permission: '',
        path: '',
        sort: '',
        type: '0',
        parentId: 0
      },
      radio1: '0',
      textMap: {
        update: '编辑',
        create: '新增',
        updateRoleMenu: '权限'
      },
      listLoading: true,
      listQuery: {
        title: undefined
      },
      dialogStatus: '',
      dialogFormVisible: false,
      dialogFormIsButton: false,
      innerVisible: false,
      iconName: '',
      buttonStust: '',
      deleteButtonStust: 'none',
      menuData: []
    }
  },
  created() {
    this.getMenuTree()
  }
}
</script>

<style scoped>
  .svg-icon {
    width: 30px;
    height: 30px;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

</style>
