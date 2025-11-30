import { request } from './axiosInstance'
import type { ChartData, DashboardStats } from '../stores/dashboardStore'

// 仪表盘相关API
export const dashboardApi = {
  // 获取仪表盘统计数据
  getStats: () => {
    return request.get<DashboardStats>('/dashboard/stats')
  },

  // 获取折线图数据
  getLineChartData: () => {
    return request.get<ChartData[]>('/dashboard/line-chart')
  },

  // 获取柱状图数据
  getBarChartData: () => {
    return request.get<ChartData[]>('/dashboard/bar-chart')
  },

  // 获取饼图数据
  getPieChartData: () => {
    return request.get<ChartData[]>('/dashboard/pie-chart')
  },

  // 获取地图数据
  getMapChartData: () => {
    return request.get<ChartData[]>('/dashboard/map-chart')
  },

  // 刷新数据
  refreshData: () => {
    return request.post('/dashboard/refresh')
  }
}

// 用户相关API
export const userApi = {
  // 登录
  login: (username: string, password: string) => {
    return request.post('/auth/login', { username, password })
  },

  // 注册
  register: (username: string, password: string, email: string) => {
    return request.post('/auth/register', { username, password, email })
  },

  // 获取用户信息
  getUserInfo: () => {
    return request.get('/user/info')
  },

  // 更新用户信息
  updateUserInfo: (data: any) => {
    return request.put('/user/info', data)
  },

  // 登出
  logout: () => {
    return request.post('/auth/logout')
  }
}

// 数据管理相关API
export const dataManagementApi = {
  // 获取数据列表
  getDataList: (params: any) => {
    return request.get('/data/list', params)
  },

  // 获取数据详情
  getDataDetail: (id: number) => {
    return request.get(`/data/${id}`)
  },

  // 创建数据
  createData: (data: any) => {
    return request.post('/data', data)
  },

  // 更新数据
  updateData: (id: number, data: any) => {
    return request.put(`/data/${id}`, data)
  },

  // 删除数据
  deleteData: (id: number) => {
    return request.delete(`/data/${id}`)
  },

  // 批量删除数据
  batchDeleteData: (ids: number[]) => {
    return request.post('/data/batch-delete', { ids })
  }
}
