<template>
  <el-dialog title="列表" :visible.sync="dialogFormVisible" width="55%">
    <div class="app-container">
      <div class="filter-container">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary"
                   icon="el-icon-download" @click="handleInnerDialog" plain>
          批量生成
        </el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="tableName"
          label="表名称"
          width="200">
        </el-table-column>
        <el-table-column
          prop="engine"
          label="存储引擎"
          width="100">
        </el-table-column>
        <el-table-column
          prop="tableComment"
          label="表备注"
          width="300"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="创建时间"
          width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="listQuery.total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                  @pagination="init(Id)"/>
    </div>

    <el-dialog
      width="30%"
      title="添加信息"
      :visible.sync="innerVisible"
      append-to-body>
      <el-form :model="formData" ref="dataForm" :rules="rules" label-width="80px">
        <el-form-item label="模块名称" prop="moduleName">
          <el-input v-model="formData.moduleName"></el-input>
        </el-form-item>
        <el-form-item label="作者名称" prop="author">
          <el-input v-model="formData.author"></el-input>
        </el-form-item>
        <el-form-item label="被选中表">
          <div v-for="item in formData.tableName">
            <li>{{item}}</li>
          </div>

        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="downloadCode">立即生成</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </el-dialog>
</template>

<script>
import {getTableInfoById, generator} from "@/api/dev";
import tableParam from "@/common/tableParam";
import Pagination from "@/components/Pagination/index";

export default {
  name: "TableInfo",
  mixins: [tableParam],
  components: {Pagination},
  data() {
    return {
      Id: '',
      list: [],
      formData: {
        tableName: [],
        moduleName: '',
        author: ''
      },
      listQuery: {
        sort: '+id',
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      rules: {
        moduleName: [{required: true, trigger: 'blur', message: '请输入模块名称!'}],
        author: [{required: true, trigger: 'blur', message: '请输入作者名称!'}]
      },
      innerVisible: false,
      dialogFormVisible: false
    }
  },
  methods: {
    init(id) {
      this.Id = id
      this.list = []
      this.dialogFormVisible = true
      this.$nextTick(() => {
        getTableInfoById(Object.assign({
          current: this.listQuery.currentPage,
          size: this.listQuery.pageSize
        }), id).then(response => {
          this.list = response.data.data.records
          this.listQuery.total = response.data.data.total
          this.listQuery.pageSize = response.data.data.size
        })
      })
    },
    handleInnerDialog() {
      if (this.formData.tableName.length < 1 || this.formData.tableName.length > 10) {
        this.$message.error('选中数量不合法，最少1个或最多10个')
        return false
      }
      this.innerVisible = true
    },
    downloadCode() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          generator(this.Id, this.formData).then(() => {
            this.innerVisible=false
            this.dialogFormVisible = false
            this.$message.success('生成成功!')
          }).catch(() => {
            this.innerVisible=false
            this.dialogFormVisible = false
            this.$message.error('生成失败!')
          })
        }
      })
    },
    handleSelectionChange(val) {
      this.formData = {
        tableName: [],
        moduleName: '',
        author: ''
      },
        val.forEach(table => {
          this.formData.tableName.push(table.tableName);
        })
    }
  }
}
</script>

<style scoped>

</style>
