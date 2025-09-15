import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { BlogAiSummaryRequest } from '@/types/aiSummaryTypes'
import { aiSummaryService } from '@/services/aiSummaryService'
import { QUERY_KEY } from '@/constants/queryKey'

export const useBlogAiSummary = (
  request: BlogAiSummaryRequest,
  options?: Omit<UseQueryOptions<any, Error, any>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [QUERY_KEY.BLOG_AI_SUMMARY, request.url, request.category],
    queryFn: async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 30초 타임아웃

      try {
        const response = await aiSummaryService.getBlogAiSummary(request)
        clearTimeout(timeoutId)
        return response
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
    },
    retry: 1, // 한 번만 재시도
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    ...options,
  })
}

export const useVideoAiSummary = (
  request: { url: string },
  options?: Omit<UseQueryOptions<any, Error, any>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [QUERY_KEY.VIDEO_AI_SUMMARY, request.url],
    queryFn: async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 30초 타임아웃

      try {
        const response = await aiSummaryService.getVideoAiSummary(request)
        clearTimeout(timeoutId)
        return response
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
    },
    retry: 1, // 한 번만 재시도
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    ...options,
  })
}
