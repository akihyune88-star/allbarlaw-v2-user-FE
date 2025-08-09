import instance from '@/lib/axios'
import {
  RecommendationLawyerResponse,
  RecommendationLegalTermRequest,
  RecommendationLegalTermResponse,
  RecommendationTagResponse,
  RecommendationVideoRequest,
  RecommendationVideoResponse,
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
    if (blogCaseIds !== undefined) params.append('blogCaseIds', `[${blogCaseIds}]`)
    if (videoCaseIds !== undefined) params.append('videoCaseIds', `[${videoCaseIds}]`)
    if (knowledgeIds !== undefined) params.append('knowledgeIds', `[${knowledgeIds}]`)
    if (lawfirmIds !== undefined) params.append('lawfirmIds', `[${lawfirmIds}]`)

    // 쿼리스트링 생성
    const queryString = params.toString()
    const url = `/legal-terms/extract${queryString ? `?${queryString}` : ''}`

    const response = await instance.get<RecommendationLegalTermResponse>(url)
    return response.data
  },
  getRecommendationVideo: async (request: RecommendationVideoRequest): Promise<RecommendationVideoResponse> => {
    const { subcategoryId, take, excludeIds } = request

    const params = new URLSearchParams()
    if (subcategoryId !== undefined) params.append('subcategoryId', subcategoryId.toString())
    if (take !== undefined) params.append('take', take.toString())
    if (excludeIds !== undefined) params.append('excludeIds', `[${excludeIds}]`)

    const queryString = params.toString()
    const url = `/api/recommendations/video-cases/${subcategoryId}${queryString ? `?${queryString}` : ''}`

    const response = await instance.get<RecommendationVideoResponse>(url)
    return response.data
  },
}
