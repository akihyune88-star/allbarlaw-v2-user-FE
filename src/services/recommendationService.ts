import instance from '@/lib/axios'
import { RecommendationLawyerResponse, RecommendationTagResponse } from '@/types/recommendationTypes'

export const recommendationService = {
  getRecommendationTag: async (take: number): Promise<RecommendationTagResponse> => {
    const response = await instance.get<RecommendationTagResponse>(`/api/recommendations/tags?take=${take}`)
    return response.data
  },
  getRecommendationLawyer: async (take: number): Promise<RecommendationLawyerResponse> => {
    const response = await instance.get<RecommendationLawyerResponse>(`/api/recommendations/lawyers?take=${take}`)
    return response.data
  },
}
