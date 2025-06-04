import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { blogService } from '@/services/blogService'

type BlogCountRequest = {
  subCategoryId?: number
  recentDays: number | 'all'
}

export const useBlogCount = (request: BlogCountRequest) => {
  const { subCategoryId, recentDays } = request

  return useQuery({
    queryKey: [QUERY_KEY.BLOG_COUNT, subCategoryId, recentDays],
    queryFn: () => blogService.getBlogCount(subCategoryId!, recentDays),
    enabled: subCategoryId !== undefined,

    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })
}
