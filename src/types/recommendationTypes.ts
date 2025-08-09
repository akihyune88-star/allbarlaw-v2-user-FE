export type RecommendationTag = {
  tagId: number
  tagName: string
  viewCount: number
}

export type RecommendationTagResponse = {
  data: RecommendationTag[]
  isPersonalized: boolean
}

export type RecommendationLawyer = {
  lawyerId: number
  lawyerName: string
  lawyerProfileImage: string
  lawfirmName: string
}

export type RecommendationLawyerResponse = {
  data: RecommendationLawyer[]
  isPersonalized: boolean
}

export type RecommendationLegalTerm = {
  legalTermId: number
  koreanName: string
  chineseName: string
  englishName: string
}

export type RecommendationLegalTermResponse = {
  legalTerms: RecommendationLegalTerm[]
}

export type RecommendationLegalTermRequest = {
  blogCaseIds?: number[]
  videoCaseIds?: number[]
  knowledgeIds?: number[]
  lawfirmIds?: number[]
}

export type RecommendationVideoRequest = {
  subcategoryId: number | 'all'
  take?: number
  excludeIds?: number[]
}

export type RecommendationVideoResponse = {
  data: {
    videoCaseId: number
    title: string
    thumbnail: string
    channelName: string
    channelThumbnail: string
    summaryContent: string
    lawyerName: string
    lawfirmName: string
    subcategoryId: number
    isKeep: boolean
  }[]

  isPersonalized: true
}
