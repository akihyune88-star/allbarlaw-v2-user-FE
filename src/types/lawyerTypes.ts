import { OrderByType, SortType } from './sortTypes'

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
  blogPosts: [
    {
      id: 1
      title: '블로그 제목'
      publishedAt: '2024-01-01T00:00:00.000Z'
      likesCount: 10
      viewCount: 100
    }
  ]
  videos: [
    {
      id: 1
      title: '영상 제목'
      thumbnail: 'https://example.com/thumb.jpg'
      publishedAt: '2024-01-01T00:00:00.000Z'
      likesCount: 5
      viewCount: 50
    }
  ]
  knowledgeAnswers: [
    {
      id: 1
      title: '교통사고 피해보상 문의'
      description: '교통사고로 인한 피해보상 관련 질문입니다'
      createdAt: '2024-01-01T00:00:00.000Z'
      likesCount: 3
      viewCount: 25
      status: 'ACTIVE'
    }
  ]
}
