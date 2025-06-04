import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { BlogListRequest } from '@/types/blogTypes'
import { blogService } from '@/services/blogService'

export const useGetBlogList = (request: BlogListRequest) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEY.BLOG_LIST, request.subcategoryId, request.cursorId],
    queryFn: () => blogService.getBlogList(request),
    enabled: request.subcategoryId !== undefined,

    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })

  return {
    blogList: data?.data ?? [],
    isLoading,
    isError,
    hasNextPage: data?.hasNextPage ?? false,
    nextCursor: data?.nextCursor,
    nextCursorId: data?.nextCursorId,
  }
}
