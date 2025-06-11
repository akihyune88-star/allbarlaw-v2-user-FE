import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { BlogDetailRequest } from '@/types/blogTypes'
import { blogService } from '@/services/blogService'

export const useGetBlogDetail = (request: BlogDetailRequest) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEY.BLOG_DETAIL, request.blogCaseId],
    queryFn: () => blogService.getBlogDetail(request),
    enabled: request.blogCaseId !== undefined,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })

  return {
    data,
    isError,
    isLoading,
  }
}
