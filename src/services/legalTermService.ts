import instance from '@/lib/axios'
import { PopularLegalTermListResponse } from '@/types/legalTermTypes'

export const legalTermService = {
  getPopularLegalTermList: async () => {
    const response = await instance.get<PopularLegalTermListResponse>('/legal-terms/popular')
    return response.data
  },
}
