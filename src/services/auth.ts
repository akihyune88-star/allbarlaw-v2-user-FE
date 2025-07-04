import instance from '@/lib/axios'

// 현재는 목업 데이터를 사용하지만, 실제 API로 교체 가능
export const authService = {
  sendVerificationCode: async (phone: string) => {
    try {
      const response = await instance.post('/user/send-verification', { phone })
      return response.data
    } catch (error) {
      console.error('Failed to send verification code:', error)
      throw error
    }
  },
}
