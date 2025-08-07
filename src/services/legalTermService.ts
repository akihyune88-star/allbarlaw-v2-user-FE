import instance from '@/lib/axios'
import {
  PopularLegalTermListResponse,
  RecentRegisteredLegalTermListResponse,
  RecentSearchesResponse,
} from '@/types/legalTermTypes'

export const legalTermService = {
  getPopularLegalTermList: async () => {
    const response = await instance.get<PopularLegalTermListResponse>('/legal-terms/popular')
    return response.data
  },

  getRecentSearches: async () => {
    const response = await instance.get<RecentSearchesResponse>('/legal-terms/recent-searches')
    return response.data
  },

  getRecentRegisteredLegalTermList: async () => {
    const response = await instance.get<RecentRegisteredLegalTermListResponse>('/legal-terms/recent')
    return response.data
  },
}
