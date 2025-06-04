import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { blogService } from '@/services/blogService'

// 카테고리 데이터를 가져오는 커스텀 훅

type BlogCountRequest = {
  subCategoryId: number | 'all'
  recentDays: number
}

export const useBlogCount = (request: BlogCountRequest) => {
  const { subCategoryId, recentDays } = request

  return useQuery({
    queryKey: [QUERY_KEY.BLOG_COUNT, subCategoryId, recentDays],
    queryFn: () => blogService.getBlogCount(subCategoryId, recentDays),
    // 추가 옵션들
    staleTime: 1000 * 60 * 10, // 10분간 fresh 상태 유지
    gcTime: 1000 * 60 * 30, // 30분간 캐시 보관
  })
}
