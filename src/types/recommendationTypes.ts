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
