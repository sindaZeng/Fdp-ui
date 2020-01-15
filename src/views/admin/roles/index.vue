<template>
  <div class="app-container">
    <div class="filter-container">
      <!--      <el-autocomplete-->
      <!--        class="filter-item"-->
      <!--        v-model="selectRoleName"-->
      <!--        :fetch-suggestions="querySearch"-->
      <!--        placeholder="请输入角色名称"-->
      <!--        @blur="handleSelect"-->
      <!--      ></el-autocomplete>-->
      <el-button v-if="checkPermission(['sys_admin_add'])" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
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
      <el-table-column label="角色序号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.roleId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色标识" min-width="150px">
        <template slot-scope="{row}">
          {{ row.roleCode }}
        </template>
      </el-table-column>

      <el-table-column label="角色名称" min-width="150px">
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
          <span>{{ row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="checkPermission(['sys_admin_editor'])" type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="success">
            权限
          </el-button>
          <el-button v-if="row.delFlag===1 && checkPermission(['sys_admin_delete'])" size="mini" type="danger" @click="deleteRole(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="listQuery.total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">

        <el-form-item v-if="dialogStatus === 'update'">
          <div slot="label" style="margin-left:10px;">角色序号:</div>
          <el-input v-model="temp.roleId" :disabled="true" />
        </el-form-item>
        <el-form-item label="角色标识:" prop="roleCode">
          <el-input v-model="temp.roleCode" :disabled="dialogStatus === 'update'" clearable />
        </el-form-item>
        <el-form-item label="角色名称:" prop="roleName">
          <el-input v-model="temp.roleName" clearable />
        </el-form-item>

        <el-form-item>
          <div slot="label" style="margin-left:10px;">角色描述:</div>
          <el-input v-model="temp.roleDesc" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createRole():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, delRole, createRole } from '@/api/role'
import Pagination from '@/components/Pagination'
import checkPermission from '@/utils/permission'
import { deepClone } from '../../../utils'

export default {
  name: 'SysRole',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      serchlist: null,
      selectRoleName: '',
      listLoading: true,
      listQuery: {
        sort: '+id',
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      rules: {
        roleName: [{ required: true, message: '角色名称不能为空!', trigger: 'blur' }],
        roleCode: [{ required: true, message: '角色标识不能为空!', trigger: 'blur' }]
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
        create: '新增'
      },
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
      const { data } = await fetchList(Object.assign({
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
      this.serchlist = deepClone(this.list)
      this.listLoading = false
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleFilter() {
      this.list = this.list.reverse()
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // querySearch(queryString, cb) {
    //   var restaurants = this.serchlist;
    //   var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
    //   cb(results);
    // },
    // createFilter(queryString) {
    //   return (restaurant) => {
    //     return (restaurant.roleName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    //   };
    // },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    },
    // handleSelect(item) {
    //   // TODO 按条件搜索
    //   debugger
    //   if (item){
    //     this.list= deepClone(this.serchlist)
    //   }else {
    //     this.list = null
    //     this.list.push(item)
    //   }
    // },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    deleteRole(row) {
      this.$confirm('是否确认删除名称为"' + row.roleName + '"' + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
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
              title: 'Success',
              message: 'Created Successfully',
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

<style scoped>

</style>
