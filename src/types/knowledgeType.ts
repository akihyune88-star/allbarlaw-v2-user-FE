import { SortType } from './sortTypes'

export type KnowledgeListRequest = {
  subcategoryId?: number | 'all'
  take?: number
  cursor?: number
  cursorId?: number
  orderBy?: SortType
}

type KnowledgeItem = {
  knowledgeId: number
  knowledgeTitle: string
  summaryContent: string
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
