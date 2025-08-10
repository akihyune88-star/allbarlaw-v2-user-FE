import { ChatRoomStatus } from './baroTalkTypes'
import { Tag } from './lawyerTypes'
import { SortType } from './sortTypes'

export type KnowledgeListRequest = {
  subcategoryId?: number | 'all'
  take?: number
  cursor?: number
  cursorId?: number
  orderBy?: SortType
  sort?: 'asc' | 'desc'
}

export type KnowledgeDetailRequest = {
  knowledgeId: number
  subcategoryId?: number | 'all'
}

export type KnowledgeItem = {
  knowledgeId: number
  knowledgeTitle: string
  summaryContent: string
  lastMessageAt: string
  isKeep: boolean
  chatRoomStatus: ChatRoomStatus

  lawyers: {
    lawyerId: number
    lawyerName: string
    lawyerProfileImage: string
  }[]
}

export type KnowledgeListResponse = {
  data: KnowledgeItem[]
  nextCursor: number
  nextCursorId: number
  hasNextPage: boolean
}

export type KnowledgeDetailResponse = {
  knowledgeId: number
  knowledgeTitle: string
  knowledgeDescription: string
  lastMessageAt: string
  isKeep: boolean
  tags: Tag[]
  lawyers: {
    lawyerId: number
    lawyerName: string
    lawfirmName: string
    lawyerDescription: string
    lawyerProfileImage: string
    content: string
  }[]
}

export type KnowledgeKeepResponse = {
  isKeep: boolean
}
