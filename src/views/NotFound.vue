<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-message">页面不存在</h2>
      <p class="error-description">
        抱歉，您访问的页面不存在或已被删除。
      </p>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">
          返回首页
        </el-button>
        <el-button @click="goBack">
          返回上一页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回首页
const goHome = () => {
  router.push('/')
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.not-found-content {
  text-align: center;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 60px 40px;
  max-width: 500px;
  width: 100%;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  color: #409eff;
  margin: 0 0 20px 0;
  line-height: 1;
}

.error-message {
  font-size: 2rem;
  color: #303133;
  margin: 0 0 16px 0;
}

.error-description {
  font-size: 1rem;
  color: #909399;
  margin: 0 0 32px 0;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  
  .el-button {
    padding: 10px 30px;
    font-size: 1rem;
  }
}
</style>
