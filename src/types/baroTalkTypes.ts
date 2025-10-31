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
  subcategoryId: number
  take?: number
  excludeLawyerIds?: number[]
  tags?: string[]
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
  partnerOnlineStatus?: 'online' | 'offline' | 'away'
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
  chatMessageReceiverId?: number
  chatMessageReceiverType?: 'USER' | 'LAWYER'
  chatMessageIsRead?: boolean
  chatMessageCreatedAt: string
  // 로컬 상태 (전송 상태 추적용)
  tempId?: string
  status?: 'sending' | 'sent' | 'failed'
}

export type JoinRoomRequest = {
  chatRoomId: number
  loadRecentMessages?: boolean
  messageLimit?: number
}

export type ChatRoomStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CONSULTING'
  | 'PARTIAL_LEFT'
  | 'REJECTED'
  | 'HIDE'
  | 'DELETED'

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
    // 🆕 개별 나가기 상태 정보 (서버 API 업데이트 필요)
    userLeft?: boolean
    lawyerLeft?: boolean
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

export type UpdateChatRoomStatusResponse = {
  chatRoomId: number
  chatRoomUserId: number
  chatRoomLawyerId: number
  chatRoomStatus: ChatRoomStatus
  chatRoomIsActive: boolean
  chatRoomCreatedAt: string
  chatRoomUpdatedAt: string
  chatRoomLastMessageAt: string | null
  chatRoomLawyer: {
    lawyerId: number
    lawyerName: string
    lawyerProfileImage: string | null
  }
}

// 변호사용 채팅방 목록 관련 타입들
export type LawyerChatRoom = {
  chatRoomId: number
  chatRoomStatus: ChatRoomStatus
  chatRoomCreatedAt: string
  clientId: number
  clientName: string
  clientMessageCount: number
  lawyerMessageCount: number
  lawyerFirstResponseAt: string | null
  consultationRequestTitle: string
  lawyerName: string
  userLeft: boolean
  lawyerLeft: boolean
}

export type LawyerChatListResponse = {
  chatRooms: LawyerChatRoom[]
  total: number
  page: number
  totalPages: number
  hasNextPage: boolean
}

export type LeaveChatRoomRequest = {
  userId: number
  userType: 'USER' | 'LAWYER'
  reason: string
  roomId: number
}

export type LeaveChatRoomResponse = {
  chatRoomId: number
  chatRoomStatus: ChatRoomStatus
  chatRoomIsActive: boolean
  userLeft: boolean
  lawyerLeft: boolean
  currentUserLeft: boolean
  timestamp: string
}

// 읽음 처리 관련 타입들
export type MarkAsReadRequest = {
  chatRoomId: number
  messageIds?: number[]
}

export type MarkAsReadSuccessData = {
  chatRoomId: number
  processedMessageIds: number[]
  timestamp: string
}

export type MessagesMarkedAsReadData = {
  userId: number
  chatRoomId: number
  messageIds: number[]
  timestamp: string
}

// 메시지 전송 성공/실패 타입들
export type SendMessageSuccessData = {
  tempId?: string
  messageId: number
  timestamp: string
}

export type SendMessageErrorData = {
  tempId?: string
  message: string
  code?: string
}

// 새로운 userLeft 이벤트 타입
export type UserLeftData = {
  chatRoomId: number
  connectedUsers: number
  userLeft: boolean
  lawyerLeft: boolean
  chatRoomIsActive: boolean
  leftUserType?: 'USER' | 'LAWYER'
  leftUserName?: string
}

export type PatchMessageRequest = {
  messageId: number
  messageContent: string
  userId: number
}

export type PatchMessageResponse = {
  chatMessageId: number
  chatMessageContent: string
  chatMessageIsRead: boolean
  chatMessageUpdatedAt: string
  success: boolean
}
