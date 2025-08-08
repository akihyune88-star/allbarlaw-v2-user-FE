import { useInfiniteQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { BlogListRequest } from '@/types/blogTypes'
import { mypageService } from '@/services/mypageServices'
import { VideoListRequest } from '@/types/videoTypes'
import { KnowledgeListRequest } from '@/types/knowledgeType'
import { LawyerListRequest } from '@/types/lawyerTypes'

// 무한 스크롤용 훅
export const useInfiniteMyBlogList = (request?: Omit<BlogListRequest, 'cursor' | 'cursorId'>) => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [QUERY_KEY.MY_BLOG_LIST, 'infinite', 'my', request?.subcategoryId, request?.sort, request?.take],
    queryFn: ({ pageParam }) =>
      mypageService.getMyBlogList({
        ...request,
        cursor: pageParam?.cursor,
        cursorId: pageParam?.cursorId,
      }),
    enabled: true, // 마이페이지에서는 항상 실행
    initialPageParam: undefined as undefined | { cursor: number; cursorId: number },
    getNextPageParam: lastPage => {
      if (!lastPage.hasNextPage) return undefined
      return {
        cursor: lastPage.nextCursor,
        cursorId: lastPage.nextCursorId,
      }
    },
  })

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

export const useInfiniteMyVideoList = (request?: Omit<VideoListRequest, 'cursor' | 'cursorId'>) => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [QUERY_KEY.MY_VIDEO_LIST, 'infinite', 'my', request?.subcategoryId, request?.sort, request?.take],
    queryFn: ({ pageParam }) =>
      mypageService.getMyVideoList({
        ...request,
        cursor: pageParam?.cursor,
        cursorId: pageParam?.cursorId,
      }),
    enabled: true,
    initialPageParam: undefined as undefined | { cursor: number; cursorId: number },
    getNextPageParam: lastPage => {
      if (!lastPage.hasNextPage) return undefined
      return {
        cursor: lastPage.nextCursor,
        cursorId: lastPage.nextCursorId,
      }
    },
  })

  const videoList = data?.pages.flatMap(page => page.data) ?? []

  return {
    videoList,
    isLoading,
    isError,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    isFetchingNextPage,
  }
}

export const useInfiniteMyLegalKnowledgeList = (request?: Omit<KnowledgeListRequest, 'cursor' | 'cursorId'>) => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [
      QUERY_KEY.MY_LEGAL_KNOWLEDGE_LIST,
      'infinite',
      'my',
      request?.subcategoryId,
      request?.sort,
      request?.take,
    ],
    queryFn: ({ pageParam }) =>
      mypageService.getMyLegalKnowledgeList({
        ...request,
        cursor: pageParam?.cursor,
        cursorId: pageParam?.cursorId,
      }),
    enabled: true,
    initialPageParam: undefined as undefined | { cursor: number; cursorId: number },
    getNextPageParam: lastPage => {
      if (!lastPage.hasNextPage) return undefined
      return {
        cursor: lastPage.nextCursor,
        cursorId: lastPage.nextCursorId,
      }
    },
  })

  const knowledgeList = data?.pages.flatMap(page => page.data) ?? []

  return {
    knowledgeList,
    isLoading,
    isError,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    isFetchingNextPage,
  }
}

export const useInfiniteMyLawyerList = (request?: Omit<LawyerListRequest, 'cursor' | 'cursorId'>) => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [QUERY_KEY.MY_LAWYER_LIST, 'infinite', 'my', request?.subcategoryId, request?.sort, request?.take],
    queryFn: ({ pageParam }) =>
      mypageService.getMyLawyerList({
        ...request,
        cursor: pageParam?.cursor,
        cursorId: pageParam?.cursorId,
      }),
    enabled: true,
    initialPageParam: undefined as undefined | { cursor: number; cursorId: number },
    getNextPageParam: lastPage => {
      if (!lastPage.hasNextPage) return undefined
      return {
        cursor: lastPage.nextCursor,
        cursorId: lastPage.nextCursorId,
      }
    },
  })

  const lawyerList = data?.pages.flatMap(page => page.data) ?? []

  return {
    lawyerList,
    isLoading,
    isError,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    isFetchingNextPage,
  }
}
