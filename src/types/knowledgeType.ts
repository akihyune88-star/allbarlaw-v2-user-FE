export type KnowledgeListRequest = {
  subcategoryId?: number | 'all'
  take?: number
  cursor?: number
  cursorId?: number
  orderBy?: 'createdAt' | 'viewCount' | 'likesCount'
}

export type KnowledgeItem = {
  knowledgeId: number
  knowledgeTitle: string
  summaryContent: string
  lawyers: {
    lawyerId: number
    lawyerName: string
    lawyerProfileImage: string
  }[]
}
