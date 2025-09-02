import { QUERY_KEY } from '@/constants/queryKey'
import { videoService } from '@/services/videoService'
import { LawyerVideoCreateRequest } from '@/types/videoTypes'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useVideoCreate = ({ onSuccess, onError }: { onSuccess: () => void; onError: (error: any) => void }) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: LawyerVideoCreateRequest) => videoService.createLawyerAdminVideo(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.VIDEO_LIST] })
      onSuccess()
    },
    onError: error => {
      onError(error)
    },
  })
}
