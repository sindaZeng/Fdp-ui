<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="search.name" placeholder="参数名称" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" plain>
        搜索
      </el-button>
      <el-button v-if="checkPermission(['sys_add_param'])" class="filter-item" style="margin-left: 10px;"
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
      <el-table-column label="id" prop="id" sortable="custom" align="center" width="100"
                       :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          {{ row.id }}
        </template>
      </el-table-column>

      <el-table-column label="参数名" min-width="150px" align="center">
        <template slot-scope="{row}">
          {{ row.paramName }}
        </template>
      </el-table-column>

      <el-table-column label="参数键" width="150px" align="center">
        <template slot-scope="{row}">
          {{ row.paramKey }}
        </template>
      </el-table-column>

      <el-table-column label="参数值" min-width="80px" align="center">
        <template slot-scope="{row}">
          {{ row.paramValue }}
        </template>
      </el-table-column>

      <el-table-column label="参数类型" width="150px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.paramType | statusFilter">
            {{ row.paramType === 0 ?'系统参数':'业务参数'}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="备注" min-width="80px" align="center">
        <template slot-scope="{row}">
          {{ row.remark }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            v-if="checkPermission(['sys_editor_param'])"
            type="text"
            size="mini"
            @click="handleUpdate(row)"
            icon="el-icon-edit" plain>
            编辑
          </el-button>
          <el-button
            v-if="checkPermission(['sys_delete_param'])"
            size="mini"
            type="text"
            @click="deleteParam(row)"
            icon="el-icon-delete" plain>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="listQuery.total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px"
               style="width: 400px; margin-left:50px;">

        <el-form-item v-if="dialogStatus === 'update'">
          <div slot="label" style="margin-left:10px;">id:</div>
          <el-input v-model="temp.id" :disabled="true"/>
        </el-form-item>

        <el-form-item label="参数名:" prop="paramName">
          <el-input v-model="temp.paramName" clearable/>
        </el-form-item>

        <el-form-item label="参数键:" prop="paramKey">
          <el-input v-model="temp.paramKey" clearable/>
        </el-form-item>

        <el-form-item label="参数值:" prop="paramValue">
          <el-input v-model="temp.paramValue" clearable/>
        </el-form-item>

        <el-form-item label="参数类型:" prop="paramType">
          <el-select
            style="width: 310px"
            v-model="temp.paramType"
            placeholder="请选择参数类型">
            <el-option
              v-for="(v, k) in options"
              :key="k"
              :label="v"
              :value="parseInt(k)">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="remark">
          <div slot="label" style="margin-left:10px;">参数描述:</div>
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"
                    placeholder="请输入..."/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" plain>
          取消
        </el-button>
        <el-button type="primary"
                   @click="dialogStatus==='create'? createParam(): updateParam()"
                   plain>
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tableParam from "@/common/tableParam"
import Pagination from '@/components/Pagination'
import checkPermission from '@/utils/permission'
import {fetchList,createParam,updateParam,delParam} from "@/api/param";
import {get} from "@/api/enums";
import waves from '@/directive/waves/index.js' // 水波纹指令

export default {
  name: "SysParam",
  mixins: [tableParam],
  components: {Pagination},
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        1: ''
      }
      return statusMap[status]
    }
  },
  data(){
    return{
      search:{
        name: undefined
      },
      rules: {
        paramName: [{required: true, message: '参数名不能为空!', trigger: 'blur'}],
        paramKey: [{required: true, message: '参数键不能为空!', trigger: 'blur'}],
        paramValue: [{required: true, message: '参数值不能为空!', trigger: 'blur'}],
        paramType: [{required: true, message: '参数类型不能为空!', trigger: 'blur'}]
      },
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '编辑',
        create: '新增',
      },
      temp: {
        id: undefined,
        paramName: '',
        paramKey: '',
        paramValue: '',
        paramType: undefined,
        remark: '',
        sort: ''
      },
      options: []
    }
  },
  created() {
    this.getList()
    this.getEnum()
  },
  methods:{
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
    getEnum() {
      get('ParamTypeEnum').then(response => {
        this.options = response.data.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createParam() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createParam(this.temp).then(() => {
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
    updateParam() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateParam(this.temp).then(() => {
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
    },
    handleUpdate(row) {
      this.temp = row
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    deleteParam(row) {
      this.$confirm('确认删除名称为"' + row.name + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delParam(row.id)
      }).then(() => {
        this.getList()
        this.$notify.success('删除成功')
      })
    }
  }
}
</script>

<style scoped>

</style>
