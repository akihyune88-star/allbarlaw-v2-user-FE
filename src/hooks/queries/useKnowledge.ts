import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { knowledgeService } from '@/services/knowledgeService'

type KnowledgeCountRequest = {
  subcategoryId?: number | 'all'
  recentDays: number | 'all'
}

export const useKnowledgeCount = (request: KnowledgeCountRequest) => {
  const { subcategoryId, recentDays } = request

  return useQuery({
    queryKey: [QUERY_KEY.KNOWLEDGE_COUNT, subcategoryId, recentDays],
    queryFn: () => knowledgeService.getKnowledgeCount(Number(subcategoryId), recentDays),
    enabled: subcategoryId !== undefined && subcategoryId !== 'all',

    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })
}
