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
    onSuccess: (data: KnowledgeKeepResponse, knowledgeId: number) => {
      // 무한 스크롤 쿼리 캐시 업데이트
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEY.KNOWLEDGE_LIST, 'infinite'] },
        (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data?.map((knowledge: any) =>
                knowledge.knowledgeId === knowledgeId ? { ...knowledge, isKeep: data.isKeep } : knowledge
              ) || [],
            })),
          }
        }
      )
      
      // 일반 리스트 쿼리 캐시 업데이트
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEY.KNOWLEDGE_LIST] },
        (oldData: any) => {
          if (!oldData || !oldData.data) return oldData
          return {
            ...oldData,
            data: oldData.data.map((knowledge: any) =>
              knowledge.knowledgeId === knowledgeId ? { ...knowledge, isKeep: data.isKeep } : knowledge
            ),
          }
        }
      )
      
      onSuccess(data)
    },
    onError: () => {
      console.error('Failed to change knowledge keep')
      onError?.()
    },
  })
}
