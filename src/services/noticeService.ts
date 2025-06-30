import instance from '@/lib/axios'
import { NoticeListRequest, NoticeListResponse, NoticeTypeResponse } from '@/types/noticeTypes'

export const noticeService = {
  // 모든 카테고리 가져오기
  getNoticeTypes: async () => {
    try {
      const response = await instance.get<NoticeTypeResponse>('/notice/types')
      return response.data
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    }
  },

  getNoticeList: async (request: NoticeListRequest) => {
    const { take, cursor, cursorId } = request

    const params = new URLSearchParams()
    if (take !== undefined) params.append('take', take.toString())
    if (cursor !== undefined) params.append('cursor', cursor.toString())
    if (cursorId !== undefined) params.append('cursorId', cursorId.toString())

    // 쿼리스트링 생성
    const queryString = params.toString()
    const url = `/notice/${queryString ? `?${queryString}` : ''}`

    try {
      const response = await instance.get<NoticeListResponse>(url)
      return response.data
    } catch (error) {
      console.error('Failed to fetch notice list:', error)
      throw error
    }
  },
}
