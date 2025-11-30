<template>
  <div class="dashboard-container">
    <el-page-header
      @back="goBack"
      content="数据仪表盘"
    >
      <template #extra>
        <el-button type="primary" @click="refreshData" :loading="loading">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
      </template>
    </el-page-header>

    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">总用户数</p>
              <h3 class="stat-value">{{ dashboardStore.stats.totalUsers }}</h3>
              <span class="stat-change positive">+12.5%</span>
            </div>
            <div class="stat-icon users">
              <el-icon><User /></el-icon>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">总收入</p>
              <h3 class="stat-value">{{ dashboardStore.formattedRevenue }}</h3>
              <span class="stat-change positive">+8.2%</span>
            </div>
            <div class="stat-icon revenue">
              <el-icon><Money /></el-icon>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">活跃项目</p>
              <h3 class="stat-value">{{ dashboardStore.stats.activeProjects }}</h3>
              <span class="stat-change negative">-3.1%</span>
            </div>
            <div class="stat-icon projects">
              <el-icon><Document /></el-icon>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">完成率</p>
              <h3 class="stat-value">{{ dashboardStore.stats.completionRate }}%</h3>
              <span class="stat-change positive">+5.7%</span>
            </div>
            <div class="stat-icon completion">
              <el-icon><Check /></el-icon>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :xs="24" :md="12">
        <div class="card">
          <h3 class="card-title">月度趋势</h3>
          <chart-component type="line" :data="dashboardStore.lineChartData" height="300px" />
        </div>
      </el-col>

      <el-col :xs="24" :md="12">
        <div class="card">
          <h3 class="card-title">产品销售</h3>
          <chart-component type="bar" :data="dashboardStore.barChartData" height="300px" />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :xs="24" :md="12">
        <div class="card">
          <h3 class="card-title">流量来源</h3>
          <chart-component type="pie" :data="dashboardStore.pieChartData" height="400px" />
        </div>
      </el-col>

      <el-col :xs="24" :md="12">
        <div class="card">
          <h3 class="card-title">地区分布</h3>
          <chart-component type="map" :data="dashboardStore.mapChartData" height="400px" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Refresh, User, Money, Document, Check } from '@element-plus/icons-vue'
import ChartComponent from '../components/base/ChartComponent.vue'
import { useDashboardStore } from '../stores/dashboardStore'

const router = useRouter()
const dashboardStore = useDashboardStore()
const loading = ref(false)

// 返回上一页
const goBack = () => {
  router.back()
}

// 刷新数据
const refreshData = async () => {
  loading.value = true
  await dashboardStore.refreshData()
  loading.value = false
}

// 页面加载时获取数据
onMounted(() => {
  dashboardStore.fetchDashboardData()
})
</script>

<style scoped lang="scss">
.dashboard-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
  }
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin: 0 0 8px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 4px 0;
}

.stat-change {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  
  &.positive {
    color: #67c23a;
    background-color: #f0f9eb;
  }
  
  &.negative {
    color: #f56c6c;
    background-color: #fef0f0;
  }
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #fff;
  
  &.users {
    background-color: #409eff;
  }
  
  &.revenue {
    background-color: #67c23a;
  }
  
  &.projects {
    background-color: #e6a23c;
  }
  
  &.completion {
    background-color: #f56c6c;
  }
}

.charts-row {
  margin-bottom: 20px;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  
  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 20px 0;
  }
}
</style>
