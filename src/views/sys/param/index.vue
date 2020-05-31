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

      <el-table-column label="参数名称" min-width="150px" align="center">
        <template slot-scope="{row}">
          {{ row.configName }}
        </template>
      </el-table-column>

      <el-table-column label="参数键名" width="150px" align="center">
        <template slot-scope="{row}">
          {{ row.configKey }}
        </template>
      </el-table-column>

      <el-table-column label="参数键值" min-width="80px" align="center">
        <template slot-scope="{row}">
          {{ row.configValue }}
        </template>
      </el-table-column>

      <el-table-column label="参数类型" width="150px" align="center">
        <template slot-scope="{row}">
          <el-tag type="success">
            {{ row.configType === 0 ?'系统参数':'业务参数'}}
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
            @click="deleteTenant(row)"
            icon="el-icon-delete" plain>
            {{ row.delFlag == 0 ?'启用':'禁用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="listQuery.total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>

  </div>
</template>

<script>
import tableParam from "@/common/tableParam"
import Pagination from '@/components/Pagination'
import checkPermission from '@/utils/permission'
import {fetchList} from "@/api/param";

export default {
  name: "SysParam",
  mixins: [tableParam],
  components: {Pagination},
  data(){
    return{
      search:{
        name: undefined
      }
    }
  },
  created() {
    this.getList()
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
  }
}
</script>

<style scoped>

</style>
