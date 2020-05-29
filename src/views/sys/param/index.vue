<template>
  <div class="app-container">
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

  </div>
</template>

<script>
export default {
    name: "SysParam"
}
</script>

<style scoped>

</style>
