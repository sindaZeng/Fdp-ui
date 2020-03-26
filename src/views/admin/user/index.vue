<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="listQuery" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item prop="text">
            <el-input
              v-model="listQuery.text"
              placeholder="用户名/手机号/邮箱"
              clearable
              class="filter-item"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item prop="roleName">
            <el-input
              v-model="listQuery.roleName"
              placeholder="角色名称"
              clearable
              class="filter-item"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item prop="ban">
            <el-select
              v-model="listQuery.ban"
              placeholder="禁用/启用"
              clearable
              style="width: 120px"
              class="filter-item">
              <el-option
                v-for="item in banOrOpen"
                :key="item.key"
                :label="item.label"
                :value="item.key"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              class="filter-item"
              v-model="listQuery.date"
              type="month"
              placeholder="日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetListQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              v-if="checkPermission(['sys_add_user'])"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              icon="el-icon-upload2"
              size="mini"
              @click="dialogUploadVisible = true"
            >导入
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              @click="handleDownload"
              size="mini"
            >导出
            </el-button>
          </el-col>
        </el-row>

        <el-table v-loading="listLoading" :data="userList">
          <el-table-column label="用户编号" align="center" prop="userId" width="80" fixed/>
          <el-table-column label="用户名称" align="center" prop="username" width="80" :show-overflow-tooltip="true"/>
          <el-table-column label="用户头像" align="center" width="80">
            <template slot-scope="{row}">
              <el-image
                style="width: 60px; height: 60px"
                :src="row.avatar"
                :preview-src-list="[row.avatar]">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="用户性别" align="center" width="80">
            <template slot-scope="{row}">
              <span>{{ row.sex === 0 ? '女' : '男' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户邮箱" align="center" width="110" prop="email" :show-overflow-tooltip="true"/>
          <el-table-column label="用户手机" align="center" prop="phone" width="120"/>
          <el-table-column label="三方授权" align="center" width="150"/>
          <el-table-column label="创建时间" align="center" prop="createTime" width="200">
            <template slot-scope="{row}">
              <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="锁定状态"
            align="center"
            width="90"
            v-if="checkPermission(['sys_ban_user'])">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.lockFlag"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value=1
                :inactive-value=0
                @change="handleStatusChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            fixed="right">
            <template slot-scope="scope">
              <el-button
                v-if="checkPermission(['sys_editor_user'])"
                size="mini"
                type="text"
                @click="handleCheck(scope.row)"
                icon="el-icon-search">详情
              </el-button>
              <el-button
                type="text"
                size="mini"
                icon="el-icon-edit"
                v-if="checkPermission(['sys_editor_user'])"
                @click="updateUser(scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="text"
                @click="deleteUser(scope.row)"
                v-if="checkPermission(['sys_delete_user'])"
                :icon="scope.row.delFlag === 1 ? 'el-icon-delete': 'el-icon-success'">
                {{ scope.row.delFlag == 0 ?'启用':'禁用' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="listQuery.total>0"
          :total="listQuery.total"
          :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize"
          @pagination="userPage"
        />

        <!-- 用户详情 -->
        <el-dialog title="用户详情" :visible.sync="dialogFormVisible" width="700px">
          <el-form ref="dataForm" :model="temp" label-width="100px" size="mini">
            <el-row>
              <el-col :span="24">
                <el-form-item label="用户头像：">
                  <el-image
                    style="width: 60px; height: 60px"
                    :src="temp.avatar">
                  </el-image>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="用户名称：">{{ temp.username }}
                </el-form-item>
                <el-form-item label="用户性别：">
                  <div v-if="temp.sex === 1">男</div>
                  <div v-else-if="temp.sex === 0">女</div>
                  <div v-else>其他</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户邮箱：">{{ temp.email }}</el-form-item>
                <el-form-item label="用户手机：">{{ temp.phone }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="用户角色：">
                  <div v-for="item in temp.roleName">{{ item }}</div>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="用户部门：">
                  <div v-for="item in temp.deptName">{{ item }}</div>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="三方授权："></el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="创建时间：">{{ temp.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</el-form-item>
                <el-form-item label="更新时间：">{{ temp.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="锁定状态：">
                  <div v-if="temp.lockFlag === 1">
                    <el-tag type="success">正常</el-tag>
                  </div>
                  <div v-else-if="temp.lockFlag === 0">
                    <el-tag type="danger">已锁定</el-tag>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="注销状态：">
                  <div v-if="temp.delFlag === 1">
                    <el-tag type="success">正常</el-tag>
                  </div>
                  <div v-else-if="temp.delFlag === 0">
                    <el-tag type="danger">已注销</el-tag>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">关 闭</el-button>
          </div>
        </el-dialog>

        <!-- 用户导入对话框 -->
        <el-dialog title="导入用户" :visible.sync="dialogUploadVisible" width="400px">
          <el-upload
            ref="upload"
            drag
            accept=".xlsx, .xls"
            :auto-upload="false"
            :limit="1"
            :on-progress="uploadProgress"
            :on-exceed="warningUpload"
            :on-success="handleFileSuccess"
            :on-error="handleFileError"
            :disabled="isUploading"
            :headers="headers"
            :action="url+'?updateSupport=' + updateSupport"
            :multiple=false>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            <div class="el-upload__tip" slot="tip">
              <el-checkbox v-model="updateSupport"/>
              是否更新已经存在的用户
              <el-link type="info" style="font-size:13px" @click="downloadTemplate(false)">下载模板</el-link>
            </div>
          </el-upload>

          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitFileForm">确 定</el-button>
            <el-button @click="dialogUploadVisible = false">取 消</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import pagination from '@/components/Pagination'
import {userPage, lockUser, deleteUser, getUserById} from '@/api/user'
import {getDeptTree} from '@/api/dept'
import {parseTime} from '@/utils'
import checkPermission from '@/utils/permission'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import {getToken} from '@/utils/auth'

export default {
  name: 'UserList',
  components: {pagination, UploadExcelComponent},
  data() {
    return {
      // 部门名称
      deptName: undefined,
      banOrOpen: [{label: '全部', key: 2}, {label: '禁用', key: 0}, {label: '启用', key: 1}],
      userList: [],
      listLoading: true,
      deptOptions: undefined,
      dialogFormVisible: false,
      dialogUploadVisible: false,
      isUploading: false,
      updateSupport: false,
      headers: {Authorization: "Bearer " + getToken()},
      url: process.env.VUE_APP_BASE_API + "admin/user/import",
      deptIds: [],
      listQuery: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        roleName: undefined,
        text: undefined,
        date: undefined,
        ban: undefined
      },
      temp: {
        userId: undefined,
        username: '',
        password: '',
        avatar: '',
        phone: '',
        email: '',
        sex: undefined,
        createTime: undefined,
        updateTime: undefined,
        lockFlag: 1,
        delFlag: 1,
        roleName: [],
        deptName: []
      },
      defaultProps: {
        children: "children",
        label: "name"
      }
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.userPage()
    this.getDeptTree()
  },
  methods: {
    checkPermission,
    async userPage() {
      this.listLoading = true
      const deptIdsStr = this.deptIds.join(',')
      this.$set(this.listQuery, 'deptIds', deptIdsStr)
      userPage(Object.assign({
        current: this.listQuery.currentPage,
        size: this.listQuery.pageSize
      }, this.listQuery)).then(response => {
        this.userList = response.data.data.records
        this.listQuery.total = response.data.data.total
        this.listQuery.pageSize = response.data.data.size
        this.listLoading = false
      })
    },
    async getDeptTree() {
      getDeptTree().then(response => {
        this.deptOptions = response.data.data
      })
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.deptIds = []
      // 包括自己节点 以及子节点
      this.deptIds.push(data.id)
      this.getDeptNodeId(this.deptIds, data.children)
      this.userPage()
    },
    getDeptNodeId(nodeId, node) {
      for (let dataKey in node) {
        const dept = node[dataKey]
        nodeId.push(dept.id)
        if (dept.children !== null) {
          this.getDeptNodeId(nodeId, dept.children)
        }
      }
    },
    handleCheck(row) {
      this.dialogFormVisible = true
      // getUserById(row.userId).then(response => {
        this.temp = row
      // })
      // this.temp = Object.assign({}, row) // copy obj
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 搜索
    handleQuery() {
      this.listQuery.currentPage = 1;
      this.userPage();
    },
    // 导出
    handleDownload() {
      this.downloadTemplate(true)
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.dialogUploadVisible = false;
      this.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.data, "导入结果", {dangerouslyUseHTMLString: true});
      this.userPage();
    },
    handleFileError(err, file, fileList) {
      var errStr = err.toString();
      var msgIndex = errStr.indexOf("{");
      var msgLastIndex = errStr.indexOf("}");
      const errObj = JSON.parse(errStr.substr(msgIndex, msgLastIndex))
      const errMsgStrObj = errObj.msg
      this.dialogUploadVisible = false;
      this.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(errMsgStrObj, "导入结果", {dangerouslyUseHTMLString: true});
      this.userPage();
    },
    downloadTemplate(flag) {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户编号', '用户名称', '用户头像', '用户性别', '用户角色', '用户部门', '用户邮箱', '用户手机', '创建时间', '更新时间', '锁定状态', '注销状态']
        const filterVal = ['userId', 'username', 'avatar', 'sex', 'roleName', 'deptName', 'email', 'phone', 'createTime', 'updateTime', 'lockFlag', 'delFlag']
        let data = []
        let text = '用户列表'
        if (flag) {
          data = this.formatJson(filterVal, this.userList)
        } else {
          data = []
          text = '用户列表模板'
        }
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: text
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime' || j === 'updateTime') {
          return parseTime(v[j])
        } else if (j === 'sex') {
          return v[j] === 1 ? '男' : '女'
        } else if (j === 'lockFlag') {
          return v[j] === 1 ? '正常' : '已锁定'
        } else if (j === 'delFlag') {
          return v[j] === 1 ? '正常' : '已注销'
        } else {
          return v[j]
        }
      }))
    },
    warningUpload() {
      this.$message({
        message: '警告，已经选中一个文件!',
        type: 'warning'
      });
    },
    uploadProgress(event, file, fileList) {
      this.isUploading = true;
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    deleteUser(row) {
      let text = row.delFlag === 1 ? "禁用" : "启用";
      this.$confirm('是否确认' + text + '"' + row.username + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return deleteUser(row.userId)
      }).then(() => {
        this.userPage()
        this.$notify.success(text + '成功')
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 用户锁定
    handleStatusChange(row) {
      let text = row.lockFlag === 1 ? "解锁" : "锁定";
      this.$confirm('确认要' + text + '"' + row.username + '"用户吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return lockUser(row.userId);
      }).then(() => {
        this.$notify.success(text + '成功')
      }).catch(function () {
        row.lockFlag = row.lockFlag === 0 ? 1 : 0;
      });
    },
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        roleName: undefined,
        text: undefined,
        date: undefined,
        ban: undefined
      }
    },
    /** 重置按钮操作 */
    resetListQuery() {
      this.reset();
      this.userPage()
    },
  }
}

</script>
<style scoped>
</style>
