import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { KnowledgeDetailRequest } from '@/types/knowledgeType'
import { knowledgeService } from '@/services/knowledgeService'

export const useGetKnowledgeDetail = (request: KnowledgeDetailRequest) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEY.KNOWLEDGE_DETAIL, request.knowledgeId],
    queryFn: () => knowledgeService.getKnowledgeDetail(request),
    enabled: request.knowledgeId !== undefined,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })

  return {
    data,
    isError,
    isLoading,
  }
}
