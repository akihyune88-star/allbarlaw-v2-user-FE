import instance from '@/lib/axios'
import { CreateBaroTalkRequest } from '@/types/baroTalkTypes'

export const baroTalkServices = {
  createBaroTalk: async (userId: number, request: CreateBaroTalkRequest) => {
    const response = await instance.post(`/chat/${userId}/consultation-request`, request)
    return response.data
  },
}
