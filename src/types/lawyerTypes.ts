import { OrderByType } from './sortTypes'

export type SocialLink = {
  type: 'naver' | 'youtube' | 'instagram'
  link: string
}

export type Tag = {
  id: number
  name: string
}

export type Lawyer = {
  lawyerId: number
  lawfirmName: string
  lawyerName: string
  lawyerProfileImage: string
  tags?: Tag[]
  lawyerDescription?: string
}

export type AIRecommenderLawyerItem = Pick<
  Lawyer,
  'lawyerId' | 'lawfirmName' | 'lawyerName' | 'lawyerProfileImage' | 'tags' | 'lawyerDescription'
>

export type LawyerListRequest = {
  subcategoryId: number | 'all'
  take?: number
  cursor?: number
  cursorId?: number
  orderBy?: OrderByType
  gender?: number | 'all'
  achievementId: 'all'
}

export type LawyerListResponse = {
  data: Lawyer[]
  nextCursor: number
  nextCursorId: number
  hasNextPage: boolean
}
