import instance from '@/lib/axios'
import {
  BlogDetailRequest,
  BlogDetailResponse,
  BlogListRequest,
  BlogListResponse,
  RandomBlogListRequest,
} from '@/types/blogTypes'

// 현재는 목업 데이터를 사용하지만, 실제 API로 교체 가능
export const blogService = {
  // 모든 카테고리 가져오기
  getBlogCount: async (subcategoryId: number | 'all', recentDays: number | 'all'): Promise<number> => {
    try {
      // 실제 API 호출
      const response = await instance.get<number>(`/blog-case/${subcategoryId}/${recentDays}/count`)

      return response.data
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    }
  },

  getBlogList: async (request: BlogListRequest) => {
    const { subcategoryId, take, cursor, cursorId, orderBy, lawyerId, search } = request

    // 쿼리 파라미터 객체 생성 (값이 있을 때만 포함)
    const params = new URLSearchParams()
    if (take !== undefined) params.append('take', take.toString())
    if (cursor !== undefined) params.append('cursor', cursor.toString())
    if (cursorId !== undefined) params.append('cursorId', cursorId.toString())
    if (orderBy !== undefined) params.append('orderBy', orderBy)
    if (lawyerId !== undefined) params.append('lawyerId', lawyerId.toString())
    if (search !== undefined) params.append('search', search)

    // 쿼리스트링 생성
    const queryString = params.toString()
    const url = `/blog-case/${subcategoryId}${queryString ? `?${queryString}` : ''}`

    const response = await instance.get<BlogListResponse>(url)

    return response.data
  },

  getRandomBlogList: async (request: RandomBlogListRequest) => {
    const { take, excludeIds, subcategoryId } = request

    const params = new URLSearchParams()
    if (take !== undefined) params.append('take', take.toString())

    if (excludeIds !== undefined) params.append('excludeIds', `[${excludeIds}]`)

    const queryString = params.toString()
    const url = `/blog-case/${subcategoryId}/random${queryString ? `?${queryString}` : ''}`

    const response = await instance.get<BlogListResponse>(url)

    return response.data
  },

  getBlogDetail: async (request: BlogDetailRequest) => {
    try {
      const response = await instance.get<BlogDetailResponse>(`/blog-case/detail/${request.blogCaseId}`)

      return response.data
    } catch (error) {
      console.error('Failed to fetch blog detail:', error)
      throw error
    }
  },

  changeBlogKeep: async (blogCaseId: number) => {
    const response = await instance.put(`/blog-case/${blogCaseId}/keep`)
    return response.data
  },
}
