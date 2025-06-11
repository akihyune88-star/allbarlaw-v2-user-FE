import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { KnowledgeListRequest } from '@/types/knowledgeType'
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
