import { useMutation } from '@tanstack/react-query'
import { blogService } from '@/services/blogService'
import { LawyerAdminBlogCreateRequest } from '@/types/blogTypes'
import { QUERY_KEY } from '@/constants/queryKey'
import { useQueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

export const useLawyerAdminBlogCreate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: LawyerAdminBlogCreateRequest) => blogService.createLawyerAdminBlog(request),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BLOG_LIST, data.lawyerId] })
    },
  })
}

type BlogCountRequest = {
  subcategoryId?: number | 'all'
  recentDays: number | 'all'
}

export const useBlogCount = (request: BlogCountRequest) => {
  const { subcategoryId, recentDays } = request

  return useQuery({
    queryKey: [QUERY_KEY.BLOG_COUNT, subcategoryId, recentDays],
    queryFn: () => blogService.getBlogCount(subcategoryId!, recentDays),
    enabled: subcategoryId !== undefined,

    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })
}
