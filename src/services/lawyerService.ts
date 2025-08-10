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

    const params = new URLSearchParams()
    if (subcategoryId !== undefined) params.append('subcategoryId', subcategoryId.toString())
    if (take !== undefined) params.append('take', take.toString())
    if (cursor !== undefined) params.append('cursor', cursor.toString())
    if (cursorId !== undefined) params.append('cursorId', cursorId.toString())
    if (orderBy !== undefined) params.append('orderBy', orderBy)
    if (gender !== undefined) params.append('gender', gender.toString())
    if (achievementId !== undefined) params.append('achievementId', achievementId)

    const queryString = params.toString()
    const url = `/lawyer/${subcategoryId}${queryString ? `?${queryString}` : ''}`
    const response = await instance.get<LawyerListResponse>(url)
    return response.data
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
