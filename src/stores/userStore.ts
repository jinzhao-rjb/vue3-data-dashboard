import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserInfo {
  id: number
  username: string
  email: string
  avatar: string
  role: string
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref<UserInfo | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoggedIn = computed(() => !!token.value)

  // 动作
  const login = async (username: string, _password: string) => {
    // 模拟登录请求
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser: UserInfo = {
          id: 1,
          username,
          email: `${username}@example.com`,
          avatar: 'https://via.placeholder.com/100',
          role: 'admin'
        }
        userInfo.value = mockUser
        token.value = 'mock-jwt-token-' + Date.now()
        localStorage.setItem('token', token.value)
        localStorage.setItem('isLoggedIn', 'true')
        resolve()
      }, 500)
    })
  }

  const logout = () => {
    userInfo.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('isLoggedIn')
  }

  const updateUserInfo = (info: Partial<UserInfo>) => {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...info }
    }
  }

  return {
    userInfo,
    token,
    isLoggedIn,
    login,
    logout,
    updateUserInfo
  }
})
