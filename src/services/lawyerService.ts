import instance from '@/lib/axios'
import {
  LawyerDetailResponse,
  LawyerListRequest,
  LawyerListResponse,
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
    if (excludeIds !== undefined && excludeIds.length > 0) params.append('excludeIds', excludeIds.join(','))

    const queryString = params.toString()
    const url = `/lawyer/${subcategoryId}/random${queryString ? `?${queryString}` : ''}`
    const response = await instance.get<RandomLawyerListResponse>(url)
    return response.data
  },
}
