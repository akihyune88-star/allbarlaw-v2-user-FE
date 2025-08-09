import instance from '@/lib/axios'
import { SearchRequest, SearchResponse } from '@/types/searchTypes'

export const searchService = {
  getSearchBlog: async (request: SearchRequest) => {
    const { searchQuery, searchTab, searchPage, searchSize, searchSortBy, searchLawyerId } = request

    const params = new URLSearchParams()
    if (searchQuery !== undefined) params.append('searchQuery', searchQuery)
    if (searchTab !== undefined) params.append('searchTab', searchTab)
    if (searchPage !== undefined) params.append('searchPage', searchPage.toString())
    if (searchSize !== undefined) params.append('searchSize', searchSize.toString())
    if (searchSortBy !== undefined) params.append('searchSortBy', searchSortBy)
    if (searchLawyerId !== undefined) params.append('searchLawyerId', searchLawyerId.toString())

    const response = await instance.get<SearchResponse>(`/search/`, { params })
    return response.data
  },
}
