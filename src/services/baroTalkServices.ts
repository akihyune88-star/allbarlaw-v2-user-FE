import instance from '@/lib/axios'
import {
  CreateBaroTalkRequest,
  BaroTalkLawyerListRequest,
  BaroTalkLawyerListResponse,
  BaroTalkChatListRequest,
  BaroTalkChatListResponse,
  ChatRoomStatus,
  UpdateChatRoomStatusRequest,
} from '@/types/baroTalkTypes'

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

  getBaroTalkChatList: async (userId: number, request: BaroTalkChatListRequest) => {
    const params = new URLSearchParams()
    if (request.chatRoomPage) params.append('chatRoomPage', request.chatRoomPage.toString())
    if (request.chatRoomOrderBy) params.append('chatRoomOrderBy', request.chatRoomOrderBy)
    if (request.chatRoomSort) params.append('chatRoomSort', request.chatRoomSort)

    const response = await instance.get<BaroTalkChatListResponse>(`/chat/${userId}/rooms?${params.toString()}`)
    return response.data
  },
  updateChatRoomStatus: async (userId: number, request: UpdateChatRoomStatusRequest) => {
    const response = await instance.post(`/chat/${request.chatRoomId}/status`, { status: request.status, userId })
    return response.data
  },
}
