import { KnowledgeItem } from './knowledgeType'

export type MyConsultationListRequest = {
  take?: number
  cursor?: number
  cursorId?: number
  sort?: 'asc' | 'desc'
  year: number
  month: number
}

export type MyConsultationListResponse = {
  nextCursor: number
  nextCursorId: number
  data: KnowledgeItem[]
  hasNextPage: boolean
}

export type ChangeConsultationContentRequest = {
  consultationRequestId: number
  knowledgeTitle: string
  summaryContent: string
}

export type MypageCountResponse = {
  blogCaseCount: number
  videoCaseCount: number
  lawyerCount: number
  knowledgeCount: number
  legalTermCount: number
  consultationRequestCount: number
}
