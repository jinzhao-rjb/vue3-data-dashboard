<template>
  <div class="data-management-container">
    <el-page-header
      @back="goBack"
      content="数据管理"
    >
      <template #extra>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增数据
        </el-button>
      </template>
    </el-page-header>

    <div class="card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetSearch">
            <el-icon><RefreshRight /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="category" label="分类" />
        <el-table-column prop="value" label="数值" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag
              :type="scope.row.status === 'active' ? 'success' : 'danger'"
            >
              {{ scope.row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column prop="updatedAt" label="更新时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
            >
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 数据表单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      center
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-position="top"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入名称"
          />
        </el-form-item>
        
        <el-form-item label="分类" prop="category">
          <el-select
            v-model="formData.category"
            placeholder="请选择分类"
          >
            <el-option label="分类A" value="categoryA" />
            <el-option label="分类B" value="categoryB" />
            <el-option label="分类C" value="categoryC" />
            <el-option label="分类D" value="categoryD" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="数值" prop="value">
          <el-input-number
            v-model="formData.value"
            :min="0"
            :max="10000"
            :step="1"
            placeholder="请输入数值"
          />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="请输入描述"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search, RefreshRight, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// 状态
const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增数据')
const formRef = ref()
const selectedRows = ref<any[]>([])

// 搜索表单
const searchForm = reactive({
  name: '',
  status: '',
  dateRange: null as [string, string] | null
})

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 100
})

// 表格数据
const tableData = ref<any[]>([])

// 表单数据
const formData = reactive({
  id: 0,
  name: '',
  category: '',
  value: 0,
  status: 'active',
  description: '',
  createdAt: new Date().toISOString().split('T')[0],
  updatedAt: new Date().toISOString().split('T')[0]
})

// 表单规则
const formRules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 50, message: '名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  value: [
    { required: true, message: '请输入数值', trigger: 'blur' }
  ]
}

// 模拟数据
const mockData = () => {
  const data: any[] = []
  for (let i = 1; i <= 100; i++) {
    data.push({
      id: i,
      name: `数据项 ${i}`,
      category: `category${String.fromCharCode(65 + (i % 4))}`,
      value: Math.floor(Math.random() * 10000),
      status: i % 5 === 0 ? 'inactive' : 'active',
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      updatedAt: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })
  }
  return data
}

// 加载数据
const loadData = () => {
  loading.value = true
  
  // 模拟API请求
  setTimeout(() => {
    const data = mockData()
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize
    const endIndex = startIndex + pagination.pageSize
    
    tableData.value = data.slice(startIndex, endIndex)
    pagination.total = data.length
    
    loading.value = false
  }, 500)
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  loadData()
}

// 重置搜索
const resetSearch = () => {
  Object.assign(searchForm, {
    name: '',
    status: '',
    dateRange: null
  })
  pagination.currentPage = 1
  loadData()
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadData()
}

// 当前页变化
const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  loadData()
}

// 选择行变化
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
}

// 新增数据
const handleAdd = () => {
  dialogTitle.value = '新增数据'
  Object.assign(formData, {
    id: 0,
    name: '',
    category: '',
    value: 0,
    status: 'active',
    description: ''
  })
  dialogVisible.value = true
}

// 编辑数据
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑数据'
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

// 删除数据
const handleDelete = (_row: any) => {
  ElMessageBox.confirm('确定要删除这条数据吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除请求
    setTimeout(() => {
      ElMessage.success('删除成功')
      loadData()
    }, 500)
  }).catch(() => {
    // 取消删除
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 直接添加到表格数据中
    if (formData.id === 0) {
      // 新增数据
      const allData = mockData()
      const newId = Math.max(...allData.map(item => item.id)) + 1
      const newItem = {
        ...formData,
        id: newId,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }
      
      // 添加到当前页数据
      tableData.value.unshift(newItem)
      pagination.total++
      
      // 如果当前页数据超过pageSize，移除最后一条
      if (tableData.value.length > pagination.pageSize) {
        tableData.value.pop()
      }
    } else {
      // 更新数据
      const index = tableData.value.findIndex(item => item.id === formData.id)
      if (index !== -1) {
        tableData.value[index] = {
          ...tableData.value[index],
          ...formData,
          updatedAt: new Date().toISOString().split('T')[0]
        }
      }
    }
    
    ElMessage.success(dialogTitle.value.includes('新增') ? '新增成功' : '编辑成功')
    dialogVisible.value = false
  } catch (error: any) {
    ElMessage.error(error.message || '提交失败')
  } finally {
    submitting.value = false
  }
}

// 页面加载时初始化数据
onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.data-management-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.search-form {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;
  
  .el-form-item {
    margin-bottom: 15px;
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
