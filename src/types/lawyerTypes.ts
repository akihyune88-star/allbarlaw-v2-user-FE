import { BlogCase } from './blogTypes'
import { KnowledgeItem } from './knowledgeType'
import { SortType } from './sortTypes'
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
  lawyerBlogUrl?: string
  lawyerYoutubeUrl?: string
  lawyerInstagramUrl?: string
  subcategoryId: number
}

export type AIRecommenderLawyerItem = Pick<
  Lawyer,
  'lawyerId' | 'lawfirmName' | 'lawyerName' | 'lawyerProfileImage' | 'tags' | 'lawyerDescription'
>

export type LawyerListRequest = {
  subcategoryId?: number | 'all'
  take?: number
  cursor?: number
  cursorId?: number
  orderBy?: SortType
  gender?: number | 'all'
  achievementId?: 'all'
  sort?: 'asc' | 'desc'
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

export type LawyerCareer = {
  lawyerCareerId?: number
  lawyerCareerCategoryName: string
  lawyerCareerContent: string
  lawyerCareerDisplayOrder: number
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
  isKeep: boolean
  lawyerProfileImages: {
    createdAt: string
    displayOrder: number
    imageId: number
    imageUrl: string
    isDefault: true
  }[]
  tags: Tag[]
  createdAt: string
  lawfirmAddress: string
  lawfirmContact: string
  subcategories: { id: number; name: string }[]
  statistics: LawyerStatistics
  achievements: LawyerAchievement[]
  careers: LawyerCareer[]
  activities: LawyerActivity[]
  blogCases: BlogCase[]
  videoCases: VideoCase[]
  consultationRequests: KnowledgeItem[]
}

export type RandomLawyerListRequest = {
  subcategoryId: number | 'all'
  take?: number
  excludeIds?: number[]
}

export type RandomLawyerListResponse = {
  data: Lawyer[]
  hasNextPage: boolean
}

export type LawyerKeepResponse = {
  isKeep: boolean
}

export type LawyerActiveRequest = {
  page?: number
  take?: number
  days?: number
}

export type LawyerActiveResponse = {
  data: {
    lawyerId: number
    lawyerName: string
    lawyerProfileImage: string
    lawyerLawfirmName: string
    lawyerDescription: string
    recentMessageCount: number
    activeChatRoomCount: number
    tags: Tag[]
  }[]

  total: number
  page: number
  totalPages: number
  hasNextPage: boolean
}

export type LawyerSignUpRequest = {
  lawyerAccount: string
  lawyerPassword: string
  lawyerPasswordRepeat: string
  lawyerName: string
  lawyerContact: string
  lawyerLawfirmName: string
  lawyerBarExamNumber: string
  lawyerEmail: string
}

export type LawyerSignUpResponse = {
  lawyerId: number
  lawyerAccount: string
  message: string
}

export type LawyerBasicInfoEditRequest = {
  lawyerDescription: string
  lawyerName: string
  lawyerBirthYear: number
  lawyerBirthMonth: number
  lawyerBirthDay: number
  lawyerGender: number
  lawyerPhone: string
  lawyerTags: string[]
  lawyerLawfirmName: string
  lawyerLawfirmAddress: string
  lawyerLawfirmAddressDetail: string
  lawyerLawfirmContact: string
  lawyerSubcategories: {
    subcategoryId: number
    subcategoryName: string
  }[]
  lawyerProfileImages: {
    imageUrl: string
    displayOrder: number
  }[]
}

export type LawyerBasicInfoEditResponse = {
  lawyerId: number
  lawyerDescription: string
  lawyerName: string
  lawyerBirthYear: number
  lawyerBirthMonth: number
  lawyerBirthDay: number
  lawyerGender: number
  lawyerPhone: string
  lawyerTags: {
    tagId: number
    tagName: string
  }[]
  lawyerLawfirmName: string
  lawyerLawfirmAddress: string
  lawyerLawfirmAddressDetail: string
  lawyerLawfirmContact: string
  lawyerSubcategories: {
    subcategoryId: number
    subcategoryName: string
  }[]

  lawyerProfileImages: {
    id: number
    imageUrl: string
    displayOrder: number
    isDefault: boolean
  }[]
}

export type LawyerCareerResponse = {
  lawyerCareers: LawyerCareer[]
}

export type LawyerCareerUpdateRequest = {
  lawyerCareerCategoryName: string
  lawyerCareerContent: string
  lawyerCareerDisplayOrder: number
}[]

export type LawyerAdminActivity = {
  lawyerActivityId: number
  lawyerActivityCategoryName: string
  lawyerActivityContent: string
  lawyerActivityDisplayOrder: number
}

export type LawyerActivityUpdateRequest = {
  lawyerActivityCategoryName: string
  lawyerActivityContent: string
  lawyerActivityDisplayOrder: number
}[]

export type LawyerActivityResponse = {
  lawyerActivities: LawyerAdminActivity[]
}
