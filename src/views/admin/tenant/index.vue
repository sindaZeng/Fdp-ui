<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-if="checkPermission(['sys_add_tenant'])" class="filter-item" style="margin-left: 10px;"
                 type="primary"
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
      <el-table-column label="租户id" prop="id" sortable="custom" align="center" width="100"
                       :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="租户名称" min-width="150px" align="center">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>

      <el-table-column label="logo" width="150px" align="center">
        <template slot-scope="{row}">
          <el-image
            style="width: 60px; height: 60px"
            :src="row.logo"
            :preview-src-list="[row.avatar]">
          </el-image>
        </template>
      </el-table-column>

      <el-table-column label="使用状态" min-width="80px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.state | statusFilter">
            {{ row.state === 0 ?'禁用': row.state === 1 ? '正常': row.state === 2 ? '待审核': '拒绝'}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="有效期" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.expirationTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            v-if="checkPermission(['sys_editor_tenant'])"
            type="text"
            size="mini"
            @click="handleUpdate(row)"
            icon="el-icon-edit" plain>
            编辑
          </el-button>
          <el-button
            v-if="checkPermission(['sys_delete_tenant'])"
            size="mini"
            type="text"
            @click="deleteTenant(row)"
            icon="el-icon-delete" plain>
            {{ row.delFlag == 0 ?'启用':'禁用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="listQuery.total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px"
               style="width: 400px; margin-left:50px;">

        <el-form-item label="租户logo:">
          <el-upload
            class="avatar-uploader"
            :auto-upload="true"
            :action="avatarUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="handleFileError"
            :headers="headers">
            <img v-if="temp.logo" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item v-if="dialogStatus === 'update'">
          <div slot="label" style="margin-left:10px;">租户id:</div>
          <el-input v-model="temp.tenantId" :disabled="true"/>
        </el-form-item>
        <el-form-item label="租户名称:" prop="name">
          <el-input v-model="temp.name" clearable/>
        </el-form-item>
        <el-form-item label="租户状态:" prop="state">
          <el-select
            style="width: 310px"
            v-model="temp.state"
            placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="到期时间:" prop="state">
          <el-date-picker
            style="width: 310px"
            v-model="temp.expirationTime"
            type="datetime"
            placeholder="选择日期时间"
            clearable>
          </el-date-picker>
        </el-form-item>

        <el-form-item label="租户描述:">
          <el-input v-model="temp.remake" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"
                    placeholder="请输入..."/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" plain>
          取消
        </el-button>
        <el-button type="primary"
                   @click="dialogStatus==='create'? createTenant(): updateTenant()"
                   plain>
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {fetchList, createTenant, updateTenant, deleteTenant} from '@/api/tenant'
import Pagination from '@/components/Pagination'
import checkPermission from '@/utils/permission'
import { headers,url,avatarUrl } from '@/common/common-constants'


export default {
  name: 'SysTenant',
  components: {Pagination},
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger',
        2: '',
        3: 'warning'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: undefined,
      listLoading: true,
      headers,
      url,
      avatarUrl,
      listQuery: {
        sort: '+id',
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      textMap: {
        update: '编辑',
        create: '新增',
      },
      temp: {
        tenantId: undefined,
        name: '',
        state: '',
        expirationTime: '',
        logo: '',
        remake: ''
      },
      dialogStatus: '',
      dialogFormVisible: false,
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
      this.list = data.data.records
      this.listQuery.total = data.data.total
      this.listQuery.pageSize = data.data.size
      this.listLoading = false
    },
    sortChange(data) {
      const {prop, order} = data
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
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = row
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    deleteTenant(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return deleteTenant(row.id)
      }).then(() => {
        this.getList()
        this.$notify.success('删除成功')
      })
    },
    createTenant() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createTenant(this.temp).then(() => {
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
    },
    updateTenant() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateTenant(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: 'Success',
              message: '更新成功',
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
