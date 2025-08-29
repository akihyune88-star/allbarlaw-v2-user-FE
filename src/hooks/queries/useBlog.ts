import { useMutation } from '@tanstack/react-query'
import { blogService } from '@/services/blogService'
import { LawyerAdminBlogCreateRequest } from '@/types/blogTypes'
import { QUERY_KEY } from '@/constants/queryKey'
import { useQueryClient } from '@tanstack/react-query'

export const useLawyerAdminBlogCreate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: LawyerAdminBlogCreateRequest) => blogService.createLawyerAdminBlog(request),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BLOG_LIST, data.lawyerId] })
    },
  })
}
