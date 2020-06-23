<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary"
                 icon="el-icon-plus" plain>
        新增
      </el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="序号"
        sortable
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        label="类型"
        sortable
        width="180">
        <template slot-scope="{row}">
          <el-tag type="success">
            {{ row.type}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="数据库名称">
      </el-table-column>
      <el-table-column
        prop="host"
        align="center"
        label="主机">
      </el-table-column>
      <el-table-column
        prop="port"
        align="center"
        label="端口">
      </el-table-column>
      <el-table-column
        prop="username"
        align="center"
        label="账号">
      </el-table-column>
      <el-table-column
        prop="password"
        align="center"
        label="密码">
      </el-table-column>

      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            type="text"
            icon="el-icon-search"
            @click="tableInfo(row.id)"
            plain>
            表信息
          </el-button>
          <el-button
            type="text"
            icon="el-icon-delete" plain>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <TableInfo v-if="tableInfoVisible" ref="tableInfo"></TableInfo>
    <pagination :total="listQuery.total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/index";
import tableParam from "@/common/tableParam";
import {fetchList} from "@/api/dev";
import TableInfo from './tableinfo'

export default {
  name: "Datasource",
  components: {Pagination,TableInfo},
  mixins: [tableParam],
  data() {
    return {
      list: [],
      tableInfoVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
    tableInfo(id){
      this.tableInfoVisible = true
      this.$nextTick(() => {
        this.$refs.tableInfo.init(id)
      })
    }
  }
}
</script>

<style scoped>

</style>
