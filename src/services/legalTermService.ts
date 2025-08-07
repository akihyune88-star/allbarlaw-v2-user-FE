import instance from '@/lib/axios'
import {
  PopularLegalTermListResponse,
  RecentRegisteredLegalTermListResponse,
  RecentSearchesResponse,
  SearchLegalTermResponse,
  LegalTermListRequest,
  LegalTermListResponse,
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

  getSearchLegalTermItem: async (searchTerm: string) => {
    const response = await instance.get<SearchLegalTermResponse>(`/legal-terms/search?searchTerm=${searchTerm}`)
    return response.data
  },

  getLegalTermList: async (request: LegalTermListRequest) => {
    const params = new URLSearchParams({
      legalTermPage: request.legalTermPage.toString(),
      orderBy: request.orderBy,
      sort: request.sort,
    })
    
    if (request.search) {
      params.append('search', request.search)
    }

    const response = await instance.get<LegalTermListResponse>(`/legal-term?${params.toString()}`)
    return response.data
  },
}
