import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ChartData {
  name: string
  value: number
}

export interface DashboardStats {
  totalUsers: number
  totalRevenue: number
  activeProjects: number
  completionRate: number
}

export const useDashboardStore = defineStore('dashboard', () => {
  // 状态
  const loading = ref(false)
  const stats = ref<DashboardStats>({
    totalUsers: 0,
    totalRevenue: 0,
    activeProjects: 0,
    completionRate: 0
  })
  
  const lineChartData = ref<ChartData[]>([])
  const barChartData = ref<ChartData[]>([])
  const pieChartData = ref<ChartData[]>([])
  const mapChartData = ref<ChartData[]>([])

  // 计算属性
  const formattedRevenue = computed(() => {
    return `¥${stats.value.totalRevenue.toLocaleString()}`
  })

  // 动作
  const fetchDashboardData = async () => {
    loading.value = true
    
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 模拟数据
      stats.value = {
        totalUsers: 12345,
        totalRevenue: 9876543,
        activeProjects: 234,
        completionRate: 87.5
      }
      
      lineChartData.value = [
        { name: '1月', value: 1200 },
        { name: '2月', value: 1900 },
        { name: '3月', value: 1500 },
        { name: '4月', value: 2500 },
        { name: '5月', value: 2200 },
        { name: '6月', value: 3000 }
      ]
      
      barChartData.value = [
        { name: '产品A', value: 3500 },
        { name: '产品B', value: 2800 },
        { name: '产品C', value: 4200 },
        { name: '产品D', value: 3100 },
        { name: '产品E', value: 2900 }
      ]
      
      pieChartData.value = [
        { name: '直接访问', value: 400 },
        { name: '邮件营销', value: 300 },
        { name: '联盟广告', value: 300 },
        { name: '视频广告', value: 200 },
        { name: '搜索引擎', value: 800 }
      ]
      
      mapChartData.value = [
        { name: '北京', value: 1200 },
        { name: '上海', value: 1500 },
        { name: '广州', value: 1000 },
        { name: '深圳', value: 1300 },
        { name: '杭州', value: 900 }
      ]
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      loading.value = false
    }
  }

  const refreshData = () => {
    return fetchDashboardData()
  }

  return {
    loading,
    stats,
    lineChartData,
    barChartData,
    pieChartData,
    mapChartData,
    formattedRevenue,
    fetchDashboardData,
    refreshData
  }
})
