import { useQuery } from '@tanstack/react-query'
import { recommendationService } from '@/services/recommendationService'
import { QUERY_KEY } from '@/constants/queryKey'
import { RecommendationContentRequest, RecommendationLegalTermRequest } from '@/types/recommendationTypes'

export const useRecommendationTag = (take: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.RECOMMENDATION_TAG, take],
    queryFn: () => recommendationService.getRecommendationTag(take),
    select: data => data.data,
    placeholderData: previousData => previousData,
  })
}

export const useRecommendationLawyer = (take: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.RECOMMENDATION_LAWYER, take],
    queryFn: () => recommendationService.getRecommendationLawyer(take),
    select: data => data.data,
    placeholderData: previousData => previousData,
  })
}

export const useRecommendationLegalTerm = (request: RecommendationLegalTermRequest) => {
  return useQuery({
    queryKey: [
      QUERY_KEY.RECOMMENDATION_LEGAL_TERM,
      request.blogCaseIds,
      request.videoCaseIds,
      request.knowledgeIds,
      request.lawfirmIds,
    ],
    queryFn: () => recommendationService.getRecommendationLegalTerm(request),
    select: data => data.legalTerms,
    placeholderData: previousData => previousData,
  })
}

export const useRecommendationVideo = (request: RecommendationContentRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.RECOMMENDATION_VIDEO, request.subcategoryId, request.take, request.excludeIds],
    queryFn: () => recommendationService.getRecommendationVideo(request),
    select: data => data.data,
    placeholderData: previousData => previousData,
  })
}

export const useRecommendationBlog = (request: RecommendationContentRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.RECOMMENDATION_BLOG, request.subcategoryId, request.take, request.excludeIds],
    queryFn: () => recommendationService.getRecommendationBlog(request),
    select: data => data.data,
    placeholderData: previousData => previousData,
  })
}
