import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { BlogKeepResponse, BlogListRequest } from '@/types/blogTypes'
import { blogService } from '@/services/blogService'

export const useGetBlogList = (request: BlogListRequest) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEY.BLOG_LIST, request.subcategoryId, request.cursorId, request.take],
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

// 무한 스크롤용 훅
export const useInfiniteBlogList = (request: Omit<BlogListRequest, 'cursor' | 'cursorId'>) => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [QUERY_KEY.BLOG_LIST, 'infinite', request.subcategoryId, request.orderBy, request.take, request.search],
    queryFn: ({ pageParam }) =>
      blogService.getBlogList({
        ...request,
        cursor: pageParam?.cursor,
        cursorId: pageParam?.cursorId,
      }),
    enabled: request.subcategoryId !== undefined,
    initialPageParam: undefined as undefined | { cursor: number; cursorId: number },
    getNextPageParam: lastPage => {
      if (!lastPage.hasNextPage) return undefined
      return {
        cursor: lastPage.nextCursor,
        cursorId: lastPage.nextCursorId,
      }
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })

  // 모든 페이지의 데이터를 하나의 배열로 합치기
  const blogList = data?.pages.flatMap(page => page.data) ?? []

  return {
    blogList,
    isLoading,
    isError,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    isFetchingNextPage,
  }
}

export const useBlogKeep = ({
  onSuccess,
  onError,
}: {
  onSuccess: (_data: BlogKeepResponse) => void
  onError: () => void
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (blogCaseId: number) => blogService.changeBlogKeep(blogCaseId),
    onSuccess: (data: BlogKeepResponse, blogCaseId: number) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.MY_BLOG_LIST] })

      queryClient.setQueriesData({ queryKey: [QUERY_KEY.BLOG_LIST, 'infinite'] }, (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data:
              page.data?.map((blog: any) =>
                blog.blogCaseId === blogCaseId ? { ...blog, isKeep: data.isKeep } : blog
              ) || [],
          })),
        }
      })

      // 일반 리스트 쿼리 캐시 업데이트
      queryClient.setQueriesData({ queryKey: [QUERY_KEY.BLOG_LIST] }, (oldData: any) => {
        if (!oldData || !oldData.data) return oldData
        return {
          ...oldData,
          data: oldData.data.map((blog: any) =>
            blog.blogCaseId === blogCaseId ? { ...blog, isKeep: data.isKeep } : blog
          ),
        }
      })

      onSuccess(data)
    },
    onError: error => {
      console.error('Failed to change blog keep:', error)
      onError?.()
    },
  })
}
