import { useMutation } from '@tanstack/react-query'
import { lawfirmService } from '@/services/lawfirmService'
import { QUERY_KEY } from '@/constants/queryKey'

// 조회수 추적 뮤테이션 훅
export const usePostTrackView = () => {
  return useMutation({
    mutationKey: [QUERY_KEY.TRACK_VIEW],
    mutationFn: (id: number) => lawfirmService.postTrackView(id),
    onSuccess: (_, variables) => {
      console.log(`조회수 추적 성공: ID ${variables}`)
    },
    onError: (error, variables) => {
      console.error(`조회수 추적 실패: ID ${variables}`, error)
    },
  })
}
