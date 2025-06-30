import instance from '@/lib/axios'
import { NoticeTypeResponse } from '@/types/noticeTypes'

export const noticeService = {
  // 모든 카테고리 가져오기
  getNoticeTypes: async (): Promise<NoticeTypeResponse> => {
    try {
      const response = await instance.get('/notice/types')
      return response.data
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    }
  },
}
