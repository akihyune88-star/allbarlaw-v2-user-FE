// 토큰 디코드 유틸리티 함수들
export const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}

export const getUserIdFromToken = (token: string): number | null => {
  const decoded = decodeToken(token)
  return decoded?.userId || null
}

export const getLawyerIdFromToken = (token: string): number | null => {
  const decoded = decodeToken(token)
  return decoded?.lawyerId || null
}
