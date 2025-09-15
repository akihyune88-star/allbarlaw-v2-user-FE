import { QUERY_KEY } from '@/constants/queryKey'
import { videoService } from '@/services/videoService'
import { LawyerVideoCreateRequest, VideoCountRequest, YoutubeChannelInfoResponse } from '@/types/videoTypes'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

export const useGetVideoCount = (request: VideoCountRequest) => {
  const { subcategoryId, recentDays } = request

  return useQuery({
    queryKey: [QUERY_KEY.VIDEO_COUNT, subcategoryId, recentDays],
    queryFn: () => videoService.getVideoCount(subcategoryId!, recentDays),
    enabled: subcategoryId !== undefined,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })
}

export const useGetYoutubeChannelInfo = ({
  onSuccess,
  onError,
}: {
  onSuccess: (_data: YoutubeChannelInfoResponse) => void
  onError: (_error: any) => void
}) => {
  return useMutation({
    mutationFn: (request: { channelUrl: string }) => videoService.getYoutubeChannelInfo(request),
    onSuccess: data => {
      onSuccess(data)
    },
    onError: error => {
      onError(error)
    },
  })
}
