import instance from '@/lib/axios'
import { SearchRequest, SearchResponse } from '@/types/searchTypes'

export const searchService = {
  getSearchBlog: async (request: SearchRequest) => {
    const { searchQuery, searchTab, searchPage, searchSize, searchSortBy, searchLawyerId } = request

    console.log('🌐 searchService 요청:', {
      searchQuery,
      searchTab,
      searchPage,
      searchSize,
      searchSortBy,
      searchLawyerId
    })

    const params = new URLSearchParams()
    if (searchQuery !== undefined && searchQuery !== '') params.append('searchQuery', searchQuery)
    if (searchTab !== undefined) params.append('searchTab', searchTab)
    if (searchPage !== undefined) params.append('searchPage', searchPage.toString())
    if (searchSize !== undefined) params.append('searchSize', searchSize.toString())
    if (searchSortBy !== undefined) params.append('searchSortBy', searchSortBy)
    if (searchLawyerId !== undefined) params.append('searchLawyerId', searchLawyerId.toString())

    console.log('🔗 최종 URL 파라미터:', params.toString())

    const response = await instance.get<SearchResponse>(`/search/`, { params })
    return response.data
  },
}
