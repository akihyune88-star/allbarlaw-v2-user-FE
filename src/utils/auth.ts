import { LOCAL } from '@/constants/local'

export const getToken = () => {
  // localStorage와 sessionStorage 모두 확인
  return localStorage.getItem(LOCAL.TOKEN) || sessionStorage.getItem(LOCAL.TOKEN)
}

export const isAuthenticated = () => {
  return !!getToken()
}
