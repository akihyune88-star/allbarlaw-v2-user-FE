import { SortType } from './sortTypes'

export type BlogCountRequest = {
  subcategoryId: number | 'all'
  recentDays: number
}

export type BlogListRequest = {
  subcategoryId?: number | 'all'
  take?: number
  cursor?: number
  cursorId?: number
  orderBy?: SortType
  sort?: 'asc' | 'desc'
  lawyerId?: number
  search?: string
}

export type RandomBlogListRequest = {
  subcategoryId?: number | 'all'
  take?: number
  excludeIds?: number[]
}

export type BlogDetailRequest = {
  blogCaseId: number
  subcategoryId?: number | 'all'
}
export interface BlogCase {
  subcategoryId: number
  blogCaseId: number
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

export type RandomBlogListResponse = {
  data: BlogCase[]
  hasNextPage: boolean
}

export type BlogDetailResponse = BlogCase & {
  source: string
  tags: string[]
}

export type BlogKeepResponse = {
  isKeep: boolean
}
