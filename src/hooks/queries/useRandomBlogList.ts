import { useQuery } from '@tanstack/react-query'
import { blogService } from '@/services/blogService'
import { QUERY_KEY } from '@/constants/queryKey'
import { BlogCase } from '@/types/blogTypes'

type UseRandomBlogListProps = {
  subcategoryId: number | 'all'
  take?: number
  excludeIds?: number[]
  enabled?: boolean
}

export const useRandomBlogList = ({ subcategoryId, take, excludeIds, enabled = true }: UseRandomBlogListProps) => {
  // excludeIds가 너무 많이 쌓이지 않도록 최근 50개만 사용
  const limitedExcludeIds = excludeIds ? excludeIds.slice(-20) : []

  const { data, isLoading, isPlaceholderData, refetch } = useQuery({
    queryKey: [QUERY_KEY.RANDOM_BLOG_LIST, subcategoryId, take, limitedExcludeIds],
    queryFn: () => blogService.getRandomBlogList({ subcategoryId, take, excludeIds: limitedExcludeIds }),
    placeholderData: previousData => previousData, // 이전 데이터 유지로 깜빡임 방지
    enabled: subcategoryId !== undefined && excludeIds !== undefined && enabled,
  })

  return {
    blogList: (data?.data || []) as BlogCase[],
    isLoading,
    isPlaceholderData,
    hasNextPage: data?.hasNextPage ?? true,
    refetch,
  }
}
