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
