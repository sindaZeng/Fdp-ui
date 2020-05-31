<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-if="checkPermission(['sys_add_role'])" class="filter-item" style="margin-left: 10px;" type="primary"
                 icon="el-icon-plus" @click="handleCreate" plain>
        新增
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80"
                       :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.roleId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色标识" min-width="150px" align="center">
        <template slot-scope="{row}">
          {{ row.roleCode }}
        </template>
      </el-table-column>

      <el-table-column label="角色名称" min-width="150px" align="center">
        <template slot-scope="{row}">
          {{ row.roleName }}
        </template>
      </el-table-column>

      <el-table-column label="角色描述" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.roleDesc }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="修改时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.updateTime !=null && row.updateTime != ''">{{row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            v-if="checkPermission(['sys_editor_role'])"
            type="text"
            size="mini"
            @click="handleUpdate(row)"
            icon="el-icon-edit" plain>
            编辑
          </el-button>
          <el-button
            v-if="checkPermission(['sys_permission_role'])"
            size="mini"
            type="text"
            @click="updateMenus(row)"
            icon="el-icon-unlock" plain>
            权限
          </el-button>
          <el-button
            v-if="row.delFlag===1 && checkPermission(['sys_delete_role'])"
            size="mini"
            type="text"
            @click="deleteRole(row)"
            icon="el-icon-delete" plain>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="listQuery.total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-tree
        v-if="dialogStatus === 'updateRoleMenu'"
        :data="roleMenuData"
        show-checkbox
        node-key="id"
        highlight-current
        @check-change="handleRoleMenuSelectionData"
        default-expand-all
        :default-checked-keys="defaultRoleMenuCheckedIds"
        :props="defaultProps">
      </el-tree>

      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px"
               style="width: 400px; margin-left:50px;">

        <el-form-item v-if="dialogStatus === 'update'">
          <div slot="label" style="margin-left:10px;">角色序号:</div>
          <el-input v-model="temp.roleId" :disabled="true"/>
        </el-form-item>
        <el-form-item label="角色标识:" prop="roleCode" v-if="dialogStatus === 'update' || dialogStatus === 'create'">
          <el-input v-model="temp.roleCode" :disabled="dialogStatus === 'update'" clearable/>
        </el-form-item>
        <el-form-item label="角色名称:" prop="roleName" v-if="dialogStatus === 'update' || dialogStatus === 'create'">
          <el-input v-model="temp.roleName" clearable/>
        </el-form-item>

        <el-form-item label="角色描述:" v-if="dialogStatus === 'update' || dialogStatus === 'create'">
          <el-input v-model="temp.roleDesc" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"
                    placeholder="Please input"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" plain>
          取消
        </el-button>
        <el-button type="primary"
                   @click="dialogStatus==='create'?createRole():dialogStatus==='update'?updateRole():updateRoleMenus()"
                   plain>
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {fetchList, delRole, createRole, updataRoleMenus, updateRole} from '@/api/role'
import {getMenuTree, getRoleTree} from '@/api/menu'
import Pagination from '@/components/Pagination'
import checkPermission from '@/utils/permission'
import tableParam from '@/common/tableParam'

export default {
  name: 'SysRole',
  components: {Pagination},
  mixins: [tableParam],
  data() {
    return {
      list: null,
      roleId: undefined,
      selectRoleName: '',
      rules: {
        roleName: [{required: true, message: '角色名称不能为空!', trigger: 'blur'}],
        roleCode: [{required: true, message: '角色标识不能为空!', trigger: 'blur'}]
      },
      temp: {
        roleId: undefined,
        roleCode: '',
        roleName: '',
        roleDesc: '',
        status: 'published'
      },
      textMap: {
        update: '编辑',
        create: '新增',
        updateRoleMenu: '权限',
      },
      defaultProps: {},
      defaultRoleMenuCheckedIds: [], // 角色菜单默认选中ids
      defaultRoleMenuExpandedIds: [], // 角色菜单展开的ids
      roleMenuData: [], // 角色菜单权限数据
      roleMenuSelectionData: {}, // 保存角色菜单选中的数据
      pvData: [],
      dialogStatus: '',
      dialogFormVisible: false,
      statusOptions: [0, 1],
      dialogPvVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkPermission,
    async getList() {
      this.listLoading = true
      const {data} = await fetchList(Object.assign({
        current: this.listQuery.currentPage,
        size: this.listQuery.pageSize
      }))
      const items = data.data.records
      this.listQuery.total = data.data.total
      this.listQuery.pageSize = data.data.size
      this.list = items.map(v => {
        this.$set(v, 'edit', false)
        this.$set(v, 'value', v.roleName)
        return v
      })
      this.listLoading = false
    },
    handleRoleMenuSelectionData(data, checked, indeterminate) {
      if (checked) {
        this.roleMenuSelectionData[data.id] = data;
      } else {
        delete this.roleMenuSelectionData[data.id]
      }
    },
    handleUpdate(row) {
      this.temp.roleCode = row.roleCode
      this.temp.roleDesc = row.roleDesc
      this.temp.roleId = row.roleId
      this.temp.roleName = row.roleName
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateMenus(row) {
      this.temp = Object.assign({}, row)
      getMenuTree(Object.assign({
        disabled: false
      })).then(menus => {
        const allMenuTreeRsp = menus.data
        if (allMenuTreeRsp.code != 0) {
          this.$notify.error('菜单数据加载异常,请联系管理员')
          return
        }
        //全部菜单
        this.roleMenuData = allMenuTreeRsp.data;
        // 获取当前菜单选中数据
        return getRoleTree(this.temp.roleId);
      }).then(roleMenu => {
        const roleMenuTreeRsp = roleMenu.data
        if (roleMenuTreeRsp.code != 0) {
          this.$notify.error('菜单数据加载异常,请联系管理员')
          return
        }
        this.defaultRoleMenuCheckedIds = this.resolveAllEunuchNodeId(this.roleMenuData, roleMenuTreeRsp.data, [])
        this.roleId = row.roleId
      })
      this.dialogStatus = 'updateRoleMenu'
      this.dialogFormVisible = true
    },
    /**
     * 解析出所有选中节点id，如果子节点被选中，父节点不添加
     * @param json 所有菜单
     * @param idArr 原始选中节点数组
     * @param temp 临时存放节点id的数组
     * @return 被选中的id，任何有子节点被选中，父节点不参与
     */
    resolveAllEunuchNodeId(json, idArr, temp) {
      for (let i = 0; i < json.length; i++) {
        const item = json[i]
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          this.resolveAllEunuchNodeId(item.children, idArr, temp)
        } else {
          temp.push(idArr.filter(id => id === item.id))
        }
      }
      return temp
    },
    updateRoleMenus(roleId) {
      let treeIdMap = this.getIdMapByTrees(this.roleMenuData);
      let ids = Object.keys(this.roleMenuSelectionData);
      let allIds = Object.keys(this.roleMenuSelectionData);
      // 以下  根据选中的菜单，补充根节点完整的树型结构
      for (let i = 0; i < ids.length; i++) {
        // 当前选中节点
        this.getCheckAllNode(allIds, treeIdMap[ids[i]].parentId, treeIdMap)
      }
      updataRoleMenus(this.roleId, [...new Set(allIds)].join(',')).then(data => {
        const roleMenuTreeRsp = data.data
        this.dialogFormVisible = false;
        //重新刷新路由
        this.getList()
        this.$notify.success('修改成功')
      })
    },
    getCheckAllNode(ids, id, treeIdMap) {
      if (id != 0) {
        ids.push(id + '')  // 添加父节点
        this.getCheckAllNode(ids, treeIdMap[id].parentId, treeIdMap)
      }
    },
    // 展开树的结构,获取 [{id: Tree}] list 单层数据
    getIdMapByTrees(trees, map = {}) {
      if (trees && trees.length) {
        for (let i = 0; i < trees.length; i++) {
          map[trees[i].id] = trees[i];
          this.getIdMapByTrees(trees[i].children, map);
        }
      }
      return map;
    },
    getIdListByExpandTrees(trees, list = []) {
      if (trees && trees.length) {
        for (let i = 0; i < trees.length; i++) {
          list.push(trees[i].id);
          this.getIdListByExpandTrees(trees[i].children, list);
        }
      }
      return list;
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    deleteRole(row) {
      this.$confirm('是否确认删除名称为"' + row.roleName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delRole(row.roleId)
      }).then(() => {
        this.getList()
        this.$notify.success('删除成功')
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    createRole() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createRole(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '新增成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateRole() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateRole(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
