import { useQuery } from '@tanstack/react-query'
import { blogService } from '@/services/blogService'
import { QUERY_KEY } from '@/constants/queryKey'
import { BlogCase } from '@/types/blogTypes'

type UseRandomBlogListProps = {
  subcategoryId: number | 'all'
  take?: number
  excludeIds?: number[]
}

export const useRandomBlogList = ({ subcategoryId, take, excludeIds }: UseRandomBlogListProps) => {
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: [QUERY_KEY.RANDOM_BLOG_LIST, subcategoryId, take, excludeIds],
    queryFn: () => blogService.getRandomBlogList({ subcategoryId, take, excludeIds }),
    placeholderData: previousData => previousData, // 이전 데이터 유지로 깜빡임 방지
  })

  return {
    blogList: (data?.data || []) as BlogCase[],
    isLoading,
    isPlaceholderData,
  }
}
