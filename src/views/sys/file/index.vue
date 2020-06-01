<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="search.name" placeholder="桶内文件名/文件原名" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" plain>
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-plus" plain>
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
      @sort-change="sortChange">
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="100"
                       :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          {{ row.id }}
        </template>
      </el-table-column>

      <el-table-column label="桶内名称" min-width="150px" align="center">
        <template slot-scope="{row}">
          {{ row.fileName }}
        </template>
      </el-table-column>

      <el-table-column label="文件原名" width="150px" align="center">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>

      <el-table-column label="文件大小" min-width="80px" align="center">
        <template slot-scope="{row}">
          {{ row.fileSize }}
        </template>
      </el-table-column>

      <el-table-column label="文件类型" width="150px" align="center">
        <template slot-scope="{row}">
          {{ row.fileType }}
        </template>
      </el-table-column>

      <el-table-column label="桶名称" min-width="80px" align="center">
        <template slot-scope="{row}">
          {{ row.bucketName }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            size="mini"
            type="text"
            @click="detail(row.id)"
            icon="el-icon-search"
            plain>
            详情
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="download(row.fileName,row.name)"
            icon="el-icon-download" plain>
            下载
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="deleteFile(row)"
            icon="el-icon-delete" plain>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="listQuery.total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>

    <el-dialog title="文件详情" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="dataForm" :model="temp" label-width="100px" size="mini">
            <el-form-item
              label="文件原名：">{{ temp.name }}
            </el-form-item>
        <el-form-item
          label="桶内文件名：">{{ temp.fileName }}
        </el-form-item>
        <el-form-item
          label="文件大小：">{{ temp.fileSize }} kb
        </el-form-item>
        <el-form-item
          label="文件类型：">{{ temp.fileType }}
        </el-form-item>
        <el-form-item
          label="桶名称：">{{ temp.bucketName }}
        </el-form-item>
        <el-form-item
          label="上传用户：">{{ temp.createName }}
        </el-form-item>
        <el-form-item
          label="上传时间：">{{ temp.createTime }}
        </el-form-item>
        <el-form-item
          label="所属租户：">{{ temp.tenantName }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import checkPermission from '@/utils/permission'
import tableParam from "@/common/tableParam";
import {fetchList,delFile,detail} from "@/api/file";
import waves from "@/directive/waves";
import request from '@/utils/request'

export default {
  name: "SysFile",
  mixins: [tableParam],
  components: {Pagination},
  directives: {
    waves
  },
  data() {
    return {
      search: {
        name: undefined
      },
      temp: {},
      dialogFormVisible: false
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
      }, this.search))
      this.list = data.data.records
      this.listQuery.total = data.data.total
      this.listQuery.pageSize = data.data.size
      this.listLoading = false
    },
    deleteFile(row) {
      this.$confirm('确认删除名称为"' + row.name + '"的文件?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delFile(row.id)
      }).then(() => {
        this.getList()
        this.$notify.success('删除成功')
      })
    },
    detail(id) {
      detail(id).then(response =>{
        this.temp = response.data.data
      })
      this.dialogFormVisible=true
    },
    download(fileName,name) {
      request({
        url: '/admin/file/'+ fileName,
        method: 'get',
        responseType: 'blob'
      }).then((response) => { // 处理返回的文件流
        const blob = new Blob([response.data])
        if ('download' in document.createElement('a')) { //支持a标签download的浏览器
          const link = document.createElement('a')//创建a标签
          link.download = name === null || name === '' ? fileName : name+fileName.substring(fileName.lastIndexOf('.'))//a标签添加属性
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          document.body.appendChild(link)
          link.click()//执行下载
          URL.revokeObjectURL(link.href) //释放url
          document.body.removeChild(link)//释放标签
        } else { //其他浏览器
          navigator.msSaveBlob(blob, fileName)
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
  }
}
</script>
