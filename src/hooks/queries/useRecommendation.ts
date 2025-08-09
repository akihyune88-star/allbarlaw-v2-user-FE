import { useQuery } from '@tanstack/react-query'
import { recommendationService } from '@/services/recommendationService'
import { QUERY_KEY } from '@/constants/queryKey'

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
