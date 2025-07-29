import { useMutation } from '@tanstack/react-query'
import { baroTalkServices } from '@/services/baroTalkServices'
import { useAuth } from '@/contexts/AuthContext'
import { CreateBaroTalkRequest } from '@/types/baroTalkTypes'

export const useCreateBaroTalk = () => {
  const { getUserIdFromToken } = useAuth()
  const userId = getUserIdFromToken()
  console.log('userId', userId)

  return useMutation({
    mutationFn: (request: CreateBaroTalkRequest) => baroTalkServices.createBaroTalk(userId!, request),
  })
}
