export type BlogCountRequest = {
  subcategoryId: number | 'all'
  recentDays: number
}

export type BlogListRequest = {
  subcategoryId?: number | 'all'
  take?: number
  cursor?: number
  cursorId?: number
  orderBy?: 'createdAt' | 'viewCount' | 'likesCount'
}

export interface BlogCase {
  id: number
  title: string
  summaryContent: string
  thumbnail: string
  lawyerName: string
  lawfirmName: string
  lawyerId: number
  lawyerProfileImage: string
  isKeep: boolean
}

export type BlogListResponse = {
  data: BlogCase[]
  nextCursor: number
  nextCursorId: number
  hasNextPage: boolean
}
