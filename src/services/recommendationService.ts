import instance from '@/lib/axios'
import {
  RecommendationLawyerResponse,
  RecommendationLegalTermRequest,
  RecommendationLegalTermResponse,
  RecommendationTagResponse,
} from '@/types/recommendationTypes'

export const recommendationService = {
  getRecommendationTag: async (take: number): Promise<RecommendationTagResponse> => {
    const response = await instance.get<RecommendationTagResponse>(`/api/recommendations/tags?take=${take}`)
    return response.data
  },
  getRecommendationLawyer: async (take: number): Promise<RecommendationLawyerResponse> => {
    const response = await instance.get<RecommendationLawyerResponse>(`/api/recommendations/lawyers?take=${take}`)
    return response.data
  },
  getRecommendationLegalTerm: async (
    request: RecommendationLegalTermRequest
  ): Promise<RecommendationLegalTermResponse> => {
    const { blogCaseIds, videoCaseIds, knowledgeIds, lawfirmIds } = request

    const params = new URLSearchParams()
    if (blogCaseIds !== undefined) params.append('blogCaseIds', blogCaseIds.toString())
    if (videoCaseIds !== undefined) params.append('videoCaseIds', videoCaseIds.toString())
    if (knowledgeIds !== undefined) params.append('knowledgeIds', knowledgeIds.toString())
    if (lawfirmIds !== undefined) params.append('lawfirmIds', lawfirmIds.toString())

    // 쿼리스트링 생성
    const queryString = params.toString()
    const url = `/legal-terms/extract${queryString ? `?${queryString}` : ''}`

    const response = await instance.post<RecommendationLegalTermResponse>(url)
    return response.data
  },
}
