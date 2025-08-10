import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { BlogListRequest } from '@/types/blogTypes'
import { mypageService } from '@/services/mypageServices'
import { VideoListRequest } from '@/types/videoTypes'
import { KnowledgeListRequest } from '@/types/knowledgeType'
import { LawyerListRequest } from '@/types/lawyerTypes'
import { LegalTermListRequest } from '@/types/legalTermTypes'
import { ChangeConsultationContentRequest, MyConsultationListRequest } from '@/types/mypageTypes'
import { ChatRoomStatus } from '@/types/baroTalkTypes'

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

export const useInfiniteMyLegalDictionaryList = (request?: Omit<LegalTermListRequest, 'cursor' | 'cursorId'>) => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [QUERY_KEY.MY_LEGAL_DICTIONARY_LIST, 'infinite', 'my', request?.sort, request?.take],
    queryFn: ({ pageParam }) =>
      mypageService.getMyLegalDictionaryList({
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

  const legalDictionaryList = data?.pages.flatMap(page => page.data) ?? []

  return {
    legalDictionaryList,
    isLoading,
    isError,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    isFetchingNextPage,
  }
}

export const useInfiniteMyConsultationList = (request: Omit<MyConsultationListRequest, 'cursor' | 'cursorId'>) => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [
      QUERY_KEY.MY_CONSULTATION_LIST,
      'infinite',
      'my',
      request.year,
      request.month,
      request.sort,
      request.take,
    ],
    queryFn: ({ pageParam }) =>
      mypageService.getMyConsultationList({
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

  const consultationList = data?.pages.flatMap(page => page.data) ?? []

  return {
    consultationList,
    isLoading,
    isError,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    isFetchingNextPage,
  }
}

export const useChangeConsultationStatus = ({ onSuccess, onError }: { onSuccess: () => void; onError: () => void }) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      consultationRequestId,
      consultationRequestStatus,
    }: {
      consultationRequestId: number
      consultationRequestStatus: ChatRoomStatus
    }) => mypageService.changeConsultationStatus(consultationRequestId, consultationRequestStatus),
    onSuccess: () => {
      onSuccess()
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.MY_CONSULTATION_LIST] })
    },
    onError: () => {
      onError()
    },
  })
}

export const useChangeConsultationContent = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void
  onError: () => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: ChangeConsultationContentRequest) => mypageService.changeConsultationContent(request),
    onSuccess: () => {
      onSuccess()
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.MY_CONSULTATION_LIST] })
    },
    onError: () => {
      onError()
    },
  })
}
