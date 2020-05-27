<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-if="checkPermission(['sys_add_menu'])" class="filter-item" style="margin-left: 10px;" type="primary"
                 icon="el-icon-plus" @click="handleCreate" plain>
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
        label="名称" width="150">
      </el-table-column>

      <el-table-column
        label="图标" align="center">
        <template slot-scope="{row}">
          <svg-icon v-if="row.icon !=null && row.icon != '' " :icon-class="row.icon"/>
        </template>
      </el-table-column>
      <el-table-column
        label="类型" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.type | statusFilter">
            {{ row.type==0 ?'菜单':'按钮' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="path"
        label="路由路径" align="center">
      </el-table-column>
      <el-table-column
        prop="permission"
        label="授权标识" align="center">
      </el-table-column>
      <el-table-column
        prop="sort"
        sortable
        width="100"
        label="排序" align="center">
      </el-table-column>
      <el-table-column
        label="操作" align="center">
        <template slot-scope="{row}">
          <el-button
            v-if="checkPermission(['sys_editor_menu'])"
            size="mini"
            type="text"
            @click="handleCheck(row)"
            icon="el-icon-search">
            查看
          </el-button>
          <el-button
            size="mini"
            type="text"
            v-if="checkPermission(['sys_editor_menu'])"
            @click="handleUpdate(row)"
            icon="el-icon-edit">
            编辑
          </el-button>
          <el-button
            v-if="checkPermission(['sys_delete_menu'])"
            size="mini"
            type="text"
            :icon="row.delFlag ===1 ? 'el-icon-delete': 'el-icon-success'"
            @click="deleteMenus(row)">
            {{ row.delFlag==0 ?'启用':'禁用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :before-close="cancel">

      <el-form ref="dataForm" :rules="menuRules" :model="temp" label-width="150px" :inline="true">
        <el-form-item label="菜单标识:">
          <el-input v-model="temp.id" disabled clearable/>
        </el-form-item>

        <el-form-item label="名称:" prop="name">
          <el-input v-model="temp.name" :disabled="dialogStatus === 'check'" clearable/>
        </el-form-item>
        <el-form-item label="授权标识:" prop="permission">
          <el-input v-model="temp.permission" :disabled="dialogStatus === 'check' || temp.type === 0"
                    clearable/>
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <el-input v-model.number="temp.sort" :disabled="dialogStatus === 'check'" clearable/>
        </el-form-item>
        <el-form-item label="路由路径:" prop="path">
          <el-input v-model="temp.path" :disabled="dialogStatus === 'check' || temp.type === 1" clearable/>
        </el-form-item>
        <el-form-item
          label="类型:" prop="type">

          <el-radio-group v-model="temp.type" @change="agreeChange">
            <el-radio :disabled="dialogStatus === 'check' || hasChildren"
                      :label="0" size="small"
                      border>菜单
            </el-radio>
            <el-radio :disabled="dialogStatus === 'check' || hasChildren"
                      :label="1" size="small"
                      border>按钮
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上级菜单:" :hidden="dialogFormIsButton" prop="category">
          <el-cascader
            :disabled="dialogStatus === 'check'"
            v-model="form.category"
            :options="copyOptions"
            :props="{ checkStrictly: true }"
            clearable
          ></el-cascader>
        </el-form-item>

        <el-form-item label="图标:" prop="icon">
          <el-button
            v-if="(temp.icon == null || temp.icon === '') && (dialogStatus === 'update'|| dialogStatus === 'create' ) && flag"
            :style="{ display: buttonStust }" type="primary" @click="innerVisible = true">选择图片
          </el-button>
          <iconsView :createDialog="innerVisible" @cancelDialog="cancelDialog"/>
          <svg-icon v-if="temp.icon !=null && temp.icon != '' " :icon-class="temp.icon" class-name="disabled"/>
          <el-tooltip class="item" effect="dark" content="重新选择图片" placement="top-start">
            <span :style="{ display:deleteButtonStust}" class="delete" @click="deletePicture()">×</span>
          </el-tooltip>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="dialogStatus === 'update'|| dialogStatus === 'create'">
        <el-button @click="cancel()">
          取消
        </el-button>
        <el-button type="primary"
                   @click="dialogStatus==='create'?createMenus():updateMenus()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import {getMenuTree, addMenu, deleteMenu, updateMenu} from '@/api/menu'
import iconsView from '@/views/icons/index.vue'
import {deepClone} from '@/utils/encryption'

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
    },
    deleteFilter(status) {
      const statusMap = {
        1: 'danger',
        0: 'success'
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
      this.options = deepClone(this.menuData)
      this.listLoading = false
      this.options.push({value: 0, label: '顶级菜单'})
    },
    // filterButton(options, source) {
    //   const menusOptionss = {
    //     value: '',
    //     parentId: '',
    //     children: null,
    //     label: ''
    //   }
    //   if (options.type === 0) {
    //     menusOptionss.value = options.id
    //     menusOptionss.parentId = options.parentId
    //     menusOptionss.label = options.label
    //     if (source != null && source.children != null) {
    //       source.children.push(menusOptionss)
    //     } else {
    //       if (options.children.length != 0) {
    //         menusOptionss.children = []
    //       }
    //       source = menusOptionss
    //     }
    //     if (options.children.length > 0) {
    //       for (let i = 0; i < options.children.length; i++) {
    //         let dataKey = options.children[i];
    //         this.filterButton(dataKey, source)
    //         if (i === options.children.length - 1 && dataKey.type === 0) {
    //           this.options.push(source)
    //         }
    //       }
    //     } else {
    //       this.options.push(source)
    //     }
    //   } else if (source != null && options.type === 1) {
    //     options.children = null
    //   }
    // },
    handleCreate() {
      this.copyOptions = deepClone(this.options)
      this.buttonStust = 'inline'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCheck(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.copyOptions = deepClone(this.options)
      this.dialogStatus = 'check'
      this.createMenusId(row)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.temp = Object.assign({}, row)
      if (row.icon != null && row.icon != '') {
        this.deleteButtonStust = 'inline'
      }
      this.copyOptions = deepClone(this.options)
      this.hasChildren = false
      // 禁止选中自己的子级
      this.banChildren(row.id, row.parentId, this.copyOptions, false)
      // 如果有子级，不让选择菜单类型
      this.checkHasChildren(row.id, this.options)
      this.createMenusId(row)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    checkHasChildren(sourceId, data) {
      for (let dataKey in data) {
        const menu = data[dataKey]
        if (menu.id === sourceId && menu.children != null) {
          this.hasChildren = true
        }
        if (menu.children != null) {
          this.checkHasChildren(sourceId, menu.children)
        }
      }
    },
    agreeChange(val) {
      if (val === 0) {
        this.temp.permission = ''
        this.flag=true
      } else {
        this.temp.path = ''
        this.temp.icon = ''
        this.flag=false
      }
    },
    banChildren(id, parentId, data, falg) {
      for (let dataKey in data) {
        const menu = data[dataKey]
        if (menu.id === id || menu.parentId === parentId) {
          this.$set(menu, 'disabled', true)
          if (menu.children != null) {
            this.banChildren(id, parentId, menu.children, true)
          }
        }
        if (menu.type === 1) {
          this.$set(menu, 'disabled', true)
        }
        if (parentId === 0) {
          this.banChildren(id, parentId, menu.children, true)
        }
        if (falg) {
          this.$set(menu, 'disabled', true)
        }
        if (menu.children != null) {
          this.banChildren(id, parentId, menu.children, false)
        }
      }
    },
    createMenusId(row) {
      this.form.category = []
      if (row.parentId != 0) {
        // 查一下 有没有父亲的父亲
        this.getGrandFather(row.parentId, null, this.options)
      } else {
        this.form.category.push(row.parentId)
      }
    },
    getGrandFather(id, parentId, list) {
      // 传进来的是 别的菜单的 父亲
      for (let optionsKey in list) {
        const menu = list[optionsKey]
        if (parentId != null && parentId == menu.id) {
          this.form.category.push(menu.id)
        }
        // 如果 没用爷爷菜单
        if (menu.id === id) {
          if (menu.parentId === 0) {
            // 级联选择器 默认选中顺序 爷爷,父亲
            // 当这就是顶级菜单了 直接添加
            this.form.category.push(id)
            if (parentId != null) {
              this.form.category.push(parentId)
            }
          } else {
            // 不是顶级菜单 还有菜单
            this.getGrandFather(menu.parentId, id, this.options)
          }
        }
        if (menu.children != null) {
          this.getGrandFather(id, menu.id, menu.children)
        }

      }
    },
    cancel() {
      this.resetTemp()
      this.hasChildren = false,
        this.deleteButtonStust = 'none'
      this.dialogFormIsButton = false
      this.dialogFormVisible = false
    },
    deletePicture() {
      this.temp.icon = null
      this.deleteButtonStust = 'none'
      this.buttonStust = 'inline'
    },
    cancelDialog(e, iconName) {
      this.buttonStust = 'inline'
      if (iconName != null && iconName != '') {
        this.temp.icon = iconName
        this.buttonStust = 'none'
        this.deleteButtonStust = 'inline'
      }
      this.innerVisible = e
    },
    createMenus() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const parentId = this.form.category[this.form.category.length - 1]
          this.temp.parentId = parentId
          addMenu(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getMenuTree()
            this.resetTemp()
            this.$notify({
              title: 'Success',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateMenus() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const parentId = this.form.category[this.form.category.length - 1]
          this.temp.parentId = parentId
          this.$set(this.temp, 'menuId', this.temp.id)
          updateMenu(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getMenuTree()
            this.resetTemp()
            this.$notify({
              title: 'Success',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    deleteMenus(row) {
      let str = '禁用'
      if (row.delFlag == 0) {
        str = '启用'
      }
      this.$confirm('是否确认' + str + '"' + row.name + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return deleteMenu(row.id)
      }).then(() => {
        this.getMenuTree()
        this.$notify.success(str + '成功')
      })
    },
  },
  data() {
    const isNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('输入不可以为空'));
      }
      setTimeout(() => {
        if (!Number(value)) {
          callback(new Error('请输入正整数'));
        } else {
          const re = /^[0-9]*[1-9][0-9]*$/;
          const rsCheck = re.test(value);
          if (!rsCheck) {
            callback(new Error('请输入正整数'));
          } else {
            callback();
          }
        }
      }, 0);
    }
    return {
      form: {
        // 级联选择器 默认选中顺序 爷爷,父亲
        category: []
      },
      options: [],
      copyOptions: [],
      menuData: [],
      flag: true,
      temp: {
        id: undefined,
        label: '',
        name: '',
        permission: '',
        path: '',
        sort: '',
        type: '',
        parentId: 0,
        icon: ''
      },
      menuRules: {
        sort: [{required: true, trigger: 'blur', validator: isNum}],
        name: [{required: true, message: '菜单名称不能为空!', trigger: 'blur'}],
        type: [{required: true, message: '菜单类型不能为空!', trigger: 'blur'}]
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
      hasChildren: false,
      dialogFormVisible: false,
      dialogFormIsButton: false,
      innerVisible: false,
      // iconName: '',
      buttonStust: '',
      deleteButtonStust: 'none'
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
