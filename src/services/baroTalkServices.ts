import instance from '@/lib/axios'
import {
  CreateBaroTalkRequest,
  BaroTalkLawyerListRequest,
  BaroTalkLawyerListResponse,
  BaroTalkChatListRequest,
  BaroTalkChatListResponse,
  UpdateChatRoomStatusRequest,
  UpdateChatRoomStatusResponse,
  LawyerChatListResponse,
  LeaveChatRoomRequest,
  PatchMessageRequest,
  PatchMessageResponse,
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
    if (request.tags) {
      params.append('tags', JSON.stringify(request.tags))
    }

    const response = await instance.get<BaroTalkLawyerListResponse>(
      `/lawyer/recommend/${request.subcategoryId}?${params.toString()}`
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
    const response = await instance.post<UpdateChatRoomStatusResponse>(`/chat/${request.chatRoomId}/status`, {
      status: request.status,
      userId,
    })
    return response.data
  },

  getLawyerChatList: async (
    lawyerId: number,
    request?: { page?: number; take?: number; status?: string; sort?: string }
  ) => {
    const params = new URLSearchParams()
    if (request?.page) params.append('page', request.page.toString())
    if (request?.status) params.append('status', request.status)
    if (request?.sort) params.append('sort', request.sort)

    const response = await instance.get<LawyerChatListResponse>(`/lawyer/${lawyerId}/chat-rooms?${params.toString()}`)
    return response.data
  },

  leaveChatRoom: async (request: LeaveChatRoomRequest) => {
    const response = await instance.post(`/chat/${request.roomId}/leave`, {
      userId: request.userId,
      userType: request.userType,
      reason: request.reason,
    })
    return response.data
  },
  patchMessage: async (request: PatchMessageRequest) => {
    const response = await instance.patch<PatchMessageResponse>(`/chat/message/${request.messageId}`, {
      messageContent: request.messageContent,
      userId: request.userId,
    })
    return response.data
  },
}
