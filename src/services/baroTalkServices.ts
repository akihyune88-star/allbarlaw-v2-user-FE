import instance from '@/lib/axios'
import { CreateBaroTalkRequest, BaroTalkLawyerListRequest, BaroTalkLawyerListResponse } from '@/types/baroTalkTypes'

export const baroTalkServices = {
  createBaroTalk: async (userId: number, request: CreateBaroTalkRequest) => {
    const response = await instance.post(`/chat/${userId}/consultation-request`, request)
    return response.data
  },

  getBaroTalkLawyerList: async (request: BaroTalkLawyerListRequest) => {
    const params = new URLSearchParams()
    if (request.take) params.append('take', request.take.toString())
    if (request.excludeLawyerIds) {
      request.excludeLawyerIds.forEach(id => params.append('excludeLawyerIds', id.toString()))
    }

    const response = await instance.get<BaroTalkLawyerListResponse>(
      `/lawyer/recommend/${request.consultationRequestId}/${request.subcategoryId}?${params.toString()}`
    )
    return response.data
  },
}
