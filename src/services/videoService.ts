import instance from '@/lib/axios'
import {
  VideoDetailRequest,
  VideoDetailResponse,
  VideoListRequest,
  VideoListResponse,
  RandomVideoListRequest,
} from '@/types/videoTypes'

export const videoService = {
  // 모든 카테고리 가져오기
  getVideoCount: async (subcategoryId: number | 'all', recentDays: number | 'all'): Promise<number> => {
    try {
      const response = await instance.get<number>(`/video-case/${subcategoryId}/${recentDays}/count`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    }
  },

  getVideoList: async (request: VideoListRequest) => {
    const { subcategoryId, take, cursor, cursorId, orderBy } = request

    // 쿼리 파라미터 객체 생성 (값이 있을 때만 포함)
    const params = new URLSearchParams()
    if (take !== undefined) params.append('take', take.toString())
    if (cursor !== undefined) params.append('cursor', cursor.toString())
    if (cursorId !== undefined) params.append('cursorId', cursorId.toString())
    if (orderBy !== undefined) params.append('orderBy', orderBy)

    // 쿼리스트링 생성
    const queryString = params.toString()
    const url = `/video-case/${subcategoryId}${queryString ? `?${queryString}` : ''}`

    const response = await instance.get<VideoListResponse>(url)

    return response.data
  },

  getVideoDetail: async (request: VideoDetailRequest) => {
    const { videoCaseId } = request
    const response = await instance.get<VideoDetailResponse>(`/video-case/detail/${videoCaseId}`)
    return response.data
  },

  getRandomVideoList: async (request: RandomVideoListRequest) => {
    const { subcategoryId, take, excludeIds } = request

    const params = new URLSearchParams()
    if (take !== undefined) params.append('take', take.toString())
    if (excludeIds !== undefined) params.append('excludeIds', `[${excludeIds}]`)

    const queryString = params.toString()
    const url = `/video-case/${subcategoryId}/random${queryString ? `?${queryString}` : ''}`

    const response = await instance.get<VideoListResponse>(url)
    return response.data
  },
}
