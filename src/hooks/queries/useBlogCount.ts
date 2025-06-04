import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { blogService } from '@/services/blogService'

type BlogCountRequest = {
  subcategoryId?: number
  recentDays: number | 'all'
}

export const useBlogCount = (request: BlogCountRequest) => {
  const { subcategoryId, recentDays } = request

  return useQuery({
    queryKey: [QUERY_KEY.BLOG_COUNT, subcategoryId, recentDays],
    queryFn: () => blogService.getBlogCount(subcategoryId!, recentDays),
    enabled: subcategoryId !== undefined,

    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })
}
