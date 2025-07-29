// Lawyer 타입 import
import { Lawyer } from './lawyerTypes'

// 세션 저장용 타입 (selectedLawyerIds 제외)
export type BaroTalkSessionData = {
  consultationRequestTitle: string
  consultationRequestDescription: string
  consultationRequestSubcategoryId: number
}

export type CreateBaroTalkRequest = {
  consultationRequestTitle: string
  consultationRequestDescription: string
  consultationRequestSubcategoryId: number
  selectedLawyerIds: number[]
}

export type BaroTalkLawyerListRequest = {
  consultationRequestId: number
  subcategoryId: number
  take?: number
  page?: number
  excludeLawyerIds?: number[]
}

export type BaroTalkLawyerListResponse = {
  lawyers: Lawyer[]
}

export type BaroTalkChatListRequest = {
  chatRoomPage?: number
  chatRoomOrderBy?: 'createdAt' | 'updatedAt' | 'lastMessageAt'
  chatRoomSort?: 'asc' | 'desc'
}

// 채팅방 관련 타입들
export type ChatRoomLawyer = {
  lawyerId: number
  lawyerName: string
  lawyerProfileImage: string
}

export type ChatRoomLastMessage = {
  chatMessageId: number
  chatMessageContent: string
  chatMessageSenderType: 'USER' | 'LAWYER'
  chatMessageCreatedAt: string
}

export type ChatRoom = {
  chatRoomId: number
  chatRoomUserId: number
  chatRoomLawyerId: number
  chatRoomConsultationRequestId: number
  chatRoomStatus: ChatRoomStatus
  chatRoomIsActive: boolean
  chatRoomCreatedAt: string
  chatRoomUpdatedAt: string
  chatRoomLastMessageAt: string
  chatRoomLawyer: ChatRoomLawyer
  chatRoomLastMessage: ChatRoomLastMessage
}

export type BaroTalkChatListResponse = {
  chatRooms: ChatRoom[]
  total: number
  page: number
  totalPages: number
}

// 소켓 관련 타입들
export type ChatMessage = {
  chatMessageId: number
  chatMessageContent: string
  chatMessageSenderType: 'USER' | 'LAWYER'
  chatMessageSenderId: number
  chatMessageCreatedAt: string
}

export type JoinRoomRequest = {
  chatRoomId: number
  loadRecentMessages?: boolean
  messageLimit?: number
}

export type ChatRoomStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'CONSULTING'

export type JoinRoomSuccessData = {
  chatRoomId: number
  connectedUsers: number
  lastReadMessageId: number
  chatRoom: {
    chatRoomId: number
    chatRoomUserId: number
    chatRoomLawyerId: number
    chatRoomStatus: ChatRoomStatus
    chatRoomIsActive: boolean
    chatRoomCreatedAt: string
    chatRoomUpdatedAt: string
    chatRoomLawyer: {
      lawyerId: number
      lawyerName: string
      lawfirmName: string
      lawyerProfileImage: string
    }
  }
  recentMessages: ChatMessage[]
}

export type UserJoinedData = {
  userId: number
  connectedUsers: number
}

export type SendMessageRequest = {
  chatRoomId: number
  content: string
}

export type UpdateChatRoomStatusRequest = {
  chatRoomId: number
  status: ChatRoomStatus
}
