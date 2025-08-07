import { BlogCase } from './blogTypes'
import { KnowledgeItem } from './knowledgeType'
import { OrderByType, SortType } from './sortTypes'
import { VideoCase } from './videoTypes'

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
  orderBy?: SortType
  gender?: number | 'all'
  achievementId?: 'all'
}

export type LawyerListResponse = {
  data: Lawyer[]
  nextCursor: number
  nextCursorId: number
  hasNextPage: boolean
}

export type LawyerAchievement = {
  id: number
  name: string
  description: string
}

type LawyerStatistics = {
  blogPostCount: number
  videoCount: number
  knowledgeAnswerCount: number
  last30DaysSiteVisitCount: number
  totalSiteVisitCount: number
}

type LawyerCareer = {
  id: number
  categoryName: string
  content: string
  displayOrder: number
}

type LawyerActivity = {
  id: number
  categoryName: string
  content: string
  displayOrder: number
}

export type LawyerDetailResponse = {
  lawyerId: number
  lawyerName: string
  lawyerDescription: string
  lawfirmName: string
  lawyerProfileImage: string
  tags: string[]
  createdAt: string
  lawfirmAddress: string
  lawfirmContact: string
  categories: [
    {
      id: 1
      name: '민사'
    }
  ]
  statistics: LawyerStatistics
  achievements: LawyerAchievement[]
  careers: LawyerCareer[]
  activities: LawyerActivity[]
  blogPosts: BlogCase[]
  videos: VideoCase[]
  knowledgeAnswers: KnowledgeItem[]
}
