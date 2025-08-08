import { useQuery, useInfiniteQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { KnowledgeKeepResponse, KnowledgeListRequest } from '@/types/knowledgeType'
import { knowledgeService } from '@/services/knowledgeService'

export const useGetKnowledgeList = (request: KnowledgeListRequest) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEY.KNOWLEDGE_LIST, request.subcategoryId, request.cursorId, request.orderBy],
    queryFn: () => knowledgeService.getKnowledgeList(request),
    enabled: request.subcategoryId !== undefined,

    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })

  return {
    data: data?.data ?? [],
    isLoading,
    isError,
  }
}

// 무한 스크롤용 훅
export const useInfiniteKnowledgeList = (request: Omit<KnowledgeListRequest, 'cursor' | 'cursorId'>) => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [QUERY_KEY.KNOWLEDGE_LIST, 'infinite', request.subcategoryId, request.orderBy],
    queryFn: ({ pageParam }) =>
      knowledgeService.getKnowledgeList({
        ...request,
        cursor: pageParam?.cursor,
        cursorId: pageParam?.cursorId,
      }),
    enabled: request.subcategoryId !== undefined,
    initialPageParam: undefined as { cursor?: number; cursorId?: number } | undefined,
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

export const useKnowledgeKeep = ({
  onSuccess,
  onError,
}: {
  onSuccess: (_data: KnowledgeKeepResponse) => void
  onError: () => void
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (knowledgeId: number) => knowledgeService.changeKnowledgeKeep(knowledgeId),
    onSuccess: (data: KnowledgeKeepResponse) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.KNOWLEDGE_LIST] })
      onSuccess(data)
    },
  })
}
