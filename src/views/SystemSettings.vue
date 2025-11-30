<template>
  <div class="system-settings-container">
    <el-page-header
      @back="goBack"
      content="系统设置"
    />

    <el-tabs v-model="activeTab" class="settings-tabs">
      <!-- 用户信息 -->
      <el-tab-pane label="用户信息" name="userInfo">
        <div class="card">
          <h3 class="section-title">基本信息</h3>
          <el-form
            ref="userFormRef"
            :model="userForm"
            :rules="userFormRules"
            label-position="left"
            label-width="120px"
            class="user-form"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="用户名" prop="username">
                  <el-input
                    v-model="userForm.username"
                    placeholder="请输入用户名"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱" prop="email">
                  <el-input
                    v-model="userForm.email"
                    placeholder="请输入邮箱"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="手机号" prop="phone">
                  <el-input
                    v-model="userForm.phone"
                    placeholder="请输入手机号"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="角色">
                  <el-select
                    v-model="userForm.role"
                    placeholder="请选择角色"
                    disabled
                  >
                    <el-option label="管理员" value="admin" />
                    <el-option label="普通用户" value="user" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="简介" prop="bio">
                  <el-input
                    v-model="userForm.bio"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入个人简介"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item>
              <el-button type="primary" @click="updateUserInfo" :loading="updatingUser">
                保存修改
              </el-button>
              <el-button @click="resetUserForm">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="card">
          <h3 class="section-title">头像设置</h3>
          <div class="avatar-section">
            <div class="avatar-preview">
              <el-avatar :size="120" :src="userForm.avatar">
                {{ userForm.username.charAt(0).toUpperCase() }}
              </el-avatar>
            </div>
            <div class="avatar-upload">
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <el-button type="primary">
                  <el-icon><Upload /></el-icon>
                  上传头像
                </el-button>
              </el-upload>
              <div class="upload-tips">
                支持 JPG、PNG 格式，文件大小不超过 2MB
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="section-title">密码修改</h3>
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordFormRules"
            label-position="left"
            label-width="120px"
            class="password-form"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="原密码" prop="oldPassword">
                  <el-input
                    v-model="passwordForm.oldPassword"
                    type="password"
                    placeholder="请输入原密码"
                    show-password
                  />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="新密码" prop="newPassword">
                  <el-input
                    v-model="passwordForm.newPassword"
                    type="password"
                    placeholder="请输入新密码"
                    show-password
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    placeholder="请确认新密码"
                    show-password
                  />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item>
              <el-button type="primary" @click="updatePassword" :loading="updatingPassword">
                修改密码
              </el-button>
              <el-button @click="resetPasswordForm">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <!-- 系统配置 -->
      <el-tab-pane label="系统配置" name="systemConfig">
        <div class="card">
          <h3 class="section-title">主题设置</h3>
          <div class="theme-section">
            <el-radio-group v-model="systemConfig.theme">
              <el-radio label="light">浅色主题</el-radio>
              <el-radio label="dark">深色主题</el-radio>
              <el-radio label="auto">跟随系统</el-radio>
            </el-radio-group>
          </div>
        </div>

        <div class="card">
          <h3 class="section-title">语言设置</h3>
          <div class="language-section">
            <el-select v-model="systemConfig.language" placeholder="请选择语言">
              <el-option label="中文" value="zh-CN" />
              <el-option label="English" value="en-US" />
            </el-select>
          </div>
        </div>

        <div class="card">
          <h3 class="section-title">通知设置</h3>
          <div class="notification-section">
            <el-checkbox-group v-model="systemConfig.notifications">
              <el-checkbox label="邮件通知">邮件通知</el-checkbox>
              <el-checkbox label="短信通知">短信通知</el-checkbox>
              <el-checkbox label="系统通知">系统通知</el-checkbox>
              <el-checkbox label="推送通知">推送通知</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>

        <div class="card">
          <h3 class="section-title">保存配置</h3>
          <el-button type="primary" @click="saveSystemConfig" :loading="savingConfig">
            保存配置
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 状态
const activeTab = ref('userInfo')
const updatingUser = ref(false)
const updatingPassword = ref(false)
const savingConfig = ref(false)
const userFormRef = ref()
const passwordFormRef = ref()

// 用户表单
const userForm = reactive({
  username: 'admin',
  email: 'admin@example.com',
  phone: '13800138000',
  role: 'admin',
  bio: '系统管理员',
  avatar: 'https://via.placeholder.com/100'
})

// 用户表单规则
const userFormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ],
  bio: [
    { max: 200, message: '简介长度不能超过 200 个字符', trigger: 'blur' }
  ]
}

// 密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码表单规则
const passwordFormRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: any) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 系统配置
const systemConfig = reactive({
  theme: 'light',
  language: 'zh-CN',
  notifications: ['email', 'system']
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 更新用户信息
const updateUserInfo = async () => {
  if (!userFormRef.value) return
  
  try {
    await userFormRef.value.validate()
    updatingUser.value = true
    
    // 模拟更新请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    ElMessage.success('用户信息更新成功')
  } catch (error: any) {
    ElMessage.error(error.message || '更新失败')
  } finally {
    updatingUser.value = false
  }
}

// 重置用户表单
const resetUserForm = () => {
  Object.assign(userForm, {
    username: 'admin',
    email: 'admin@example.com',
    phone: '13800138000',
    role: 'admin',
    bio: '系统管理员',
    avatar: 'https://via.placeholder.com/100'
  })
}

// 更新密码
const updatePassword = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    updatingPassword.value = true
    
    // 模拟更新请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    ElMessage.success('密码修改成功')
    resetPasswordForm()
  } catch (error: any) {
    ElMessage.error(error.message || '修改失败')
  } finally {
    updatingPassword.value = false
  }
}

// 重置密码表单
const resetPasswordForm = () => {
  Object.assign(passwordForm, {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
}

// 保存系统配置
const saveSystemConfig = async () => {
  savingConfig.value = true
  
  try {
    // 模拟保存请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    ElMessage.success('系统配置保存成功')
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  } finally {
    savingConfig.value = false
  }
}

// 头像上传成功
const handleAvatarSuccess = (_response: any, file: File) => {
  userForm.avatar = URL.createObjectURL(file)
  ElMessage.success('头像上传成功')
}

// 头像上传前校验
const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2
  
  if (!isJPG) {
    ElMessage.error('只能上传 JPG/PNG 格式的图片')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
  }
  
  return isJPG && isLt2M
}

// 页面加载时初始化数据
onMounted(() => {
  // 模拟从服务器获取数据
  setTimeout(() => {
    // 初始化数据
  }, 500)
})
</script>

<style scoped lang="scss">
.system-settings-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.settings-tabs {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
}

.user-form {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 40px;
  
  .avatar-preview {
    .el-avatar {
      border: 2px solid #e4e7ed;
    }
  }
  
  .avatar-upload {
    .upload-tips {
      margin-top: 10px;
      font-size: 12px;
      color: #909399;
    }
  }
}

.password-form {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.theme-section,
.language-section,
.notification-section {
  padding: 20px 0;
}
</style>
