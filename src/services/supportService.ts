import instance from '@/lib/axios'
import {
  FaqType,
  NoticeDetailResponse,
  NoticeListRequest,
  NoticeListResponse,
  NoticeTypeResponse,
  SupportListResponse,
} from '@/types/supportTypes'

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
    const { take, cursor, cursorId, typeId } = request

    const params = new URLSearchParams()
    if (take !== undefined) params.append('take', take.toString())
    if (cursor !== undefined) params.append('cursor', cursor.toString())
    if (cursorId !== undefined) params.append('cursorId', cursorId.toString())

    // 쿼리스트링 생성
    const queryString = params.toString()
    const url = `/notice/${typeId}${queryString ? `?${queryString}` : ''}`

    try {
      const response = await instance.get<NoticeListResponse>(url)
      return response.data
    } catch (error) {
      console.error('Failed to fetch notice list:', error)
      throw error
    }
  },

  getNoticeDetail: async (noticeId: number) => {
    try {
      const response = await instance.get<NoticeDetailResponse>(`/notice/detail/${noticeId}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch notice detail:', error)
      throw error
    }
  },
}

export const faqService = {
  readeFaqTypes: async () => await instance.get<FaqType>('/faq/types'),
  readFaqList: async (faqTypeId: number) => await instance.get<SupportListResponse>(`/faq/list/${faqTypeId}`),

  getFaqList: async (request: { take: number; cursor?: number; cursorId?: number; faqTypeId?: number }) => {
    const { take, cursor, cursorId, faqTypeId } = request

    const params = new URLSearchParams()
    if (take !== undefined) params.append('take', take.toString())
    if (cursor !== undefined) params.append('cursor', cursor.toString())
    if (cursorId !== undefined) params.append('cursorId', cursorId.toString())

    // 쿼리스트링 생성
    const queryString = params.toString()
    const url = `/faq/${faqTypeId}${queryString ? `?${queryString}` : ''}`

    try {
      const response = await instance.get<SupportListResponse>(url)
      return response.data
    } catch (error) {
      console.error('Failed to fetch faq list:', error)
      throw error
    }
  },
}
