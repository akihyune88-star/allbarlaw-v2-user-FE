import instance from '@/lib/axios'
import {
  Lawyer,
  LawyerActiveRequest,
  LawyerActiveResponse,
  LawyerDetailResponse,
  LawyerKeepResponse,
  LawyerListRequest,
  LawyerListResponse,
  LawyerSignUpRequest,
  LawyerSignUpResponse,
  RandomLawyerListRequest,
  RandomLawyerListResponse,
} from '@/types/lawyerTypes'

export const lawyerService = {
  getLawyerList: async (request: LawyerListRequest) => {
    const { subcategoryId, take, cursor, cursorId, orderBy, gender, achievementId } = request

    console.log('🟣 getLawyerList API 호출:', request)

    const params = new URLSearchParams()
    if (subcategoryId !== undefined) params.append('subcategoryId', subcategoryId.toString())
    if (take !== undefined) params.append('take', take.toString())
    if (cursor !== undefined) params.append('cursor', cursor.toString())
    if (cursorId !== undefined) params.append('cursorId', cursorId.toString())
    if (orderBy !== undefined) params.append('orderBy', orderBy)
    if (gender !== undefined) params.append('gender', gender.toString())
    if (achievementId !== undefined) params.append('achievementId', achievementId)

    const queryString = params.toString()
    const url = `/lawyer/list/${subcategoryId}${queryString ? `?${queryString}` : ''}`

    console.log('🌐 API URL:', url)

    try {
      const response = await instance.get<any>(url)
      console.log('✅ API 원본 응답:', response.data)

      // 서버가 잘못된 형식으로 응답하는 경우를 처리
      // Case 1: 정상적인 응답 (data 배열을 포함)
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data as LawyerListResponse
      }

      // Case 2: 단일 객체를 반환하는 경우 (서버 버그)
      if (response.data?.lawyerId) {
        console.warn('⚠️ 서버가 단일 객체를 반환했습니다. 배열로 변환합니다.')
        return {
          data: [response.data],
          nextCursor: 0,
          nextCursorId: 0,
          hasNextPage: false,
        } as LawyerListResponse
      }

      // Case 3: 배열을 직접 반환하는 경우
      if (Array.isArray(response.data)) {
        console.warn('⚠️ 서버가 배열을 직접 반환했습니다. 구조를 변환합니다.')
        return {
          data: response.data,
          nextCursor: 0,
          nextCursorId: 0,
          hasNextPage: false,
        } as LawyerListResponse
      }

      // Case 4: 예상치 못한 형식
      console.error('❌ 예상치 못한 API 응답 형식:', response.data)
      return {
        data: [],
        nextCursor: 0,
        nextCursorId: 0,
        hasNextPage: false,
      } as LawyerListResponse
    } catch (error) {
      console.error('❌ API 에러:', error)
      // 에러 발생 시에도 빈 배열 반환하여 UI가 깨지지 않도록 함
      return {
        data: [],
        nextCursor: 0,
        nextCursorId: 0,
        hasNextPage: false,
      } as LawyerListResponse
    }
  },

  getLawyerDetail: async (lawyerId: number) => {
    const response = await instance.get<LawyerDetailResponse>(`/lawyer/detail/${lawyerId}`)
    return response.data
  },

  getRandomLawyerList: async (request: RandomLawyerListRequest) => {
    const { subcategoryId, take, excludeIds } = request

    const params = new URLSearchParams()
    if (take !== undefined) params.append('take', take.toString())
    if (excludeIds !== undefined && excludeIds.length > 0) params.append('excludeIds', `[${excludeIds}]`)

    const queryString = params.toString()
    const url = `/lawyer/${subcategoryId}/random${queryString ? `?${queryString}` : ''}`
    const response = await instance.get<RandomLawyerListResponse>(url)
    return response.data
  },

  changeLawyerKeep: async (lawyerId: number) => {
    const response = await instance.put<LawyerKeepResponse>(`/lawyer/${lawyerId}/keep`)
    return response.data
  },

  getLawyerActive: async (request: LawyerActiveRequest) => {
    const { page, take, days } = request

    const params = new URLSearchParams()
    if (page !== undefined) params.append('page', page.toString())
    if (take !== undefined) params.append('take', take.toString())
    if (days !== undefined) params.append('days', days.toString())

    const queryString = params.toString()
    const url = `/lawyer/active${queryString ? `?${queryString}` : ''}`

    const response = await instance.get<LawyerActiveResponse>(url)
    return response.data
  },

  getLawyer: async (lawyerId: number) => {
    const response = await instance.get<Lawyer>(`/lawyer/${lawyerId}`)
    return response.data
  },

  signUpLawyer: async (request: LawyerSignUpRequest) => {
    const response = await instance.post<LawyerSignUpResponse>(`/lawyer/signup`, request)
    return response.data
  },
}
