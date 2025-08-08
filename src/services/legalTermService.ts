import instance from '@/lib/axios'
import {
  PopularLegalTermListResponse,
  RecentRegisteredLegalTermListResponse,
  RecentSearchesResponse,
  LegalTermListRequest,
  LegalTermListResponse,
  LegalTermDetailResponse,
  LegalTermReportRequest,
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

  getLegalTermList: async (request: LegalTermListRequest) => {
    const params = new URLSearchParams({
      legalTermPage: request.legalTermPage.toString(),
      orderBy: request.orderBy,
      sort: request.sort,
      content: request.content || '',
    })

    if (request.search) {
      params.append('search', request.search)
    }

    const response = await instance.get<LegalTermListResponse>(`/legal-terms?${params.toString()}`)
    return response.data
  },

  getSearchLegalTermItem: async (searchTerm: string) => {
    const response = await instance.get<LegalTermListResponse>(`/legal-terms/search?q=${searchTerm}`)
    return response.data
  },

  deleteRecentSearch: async (searchQuery: string) => {
    const response = await instance.delete(`/legal-terms/recent-searches`, { data: { searchQuery } })
    return response.data
  },

  getLegalTermDetail: async (legalTermId: number) => {
    const response = await instance.get<LegalTermDetailResponse>(`/legal-terms/detail/${legalTermId}`)
    return response.data
  },

  reportLegalTerm: async (legalTermId: number, request: LegalTermReportRequest) => {
    const response = await instance.post(`/legal-terms/${legalTermId}/report`, request)
    return response.data
  },
}
