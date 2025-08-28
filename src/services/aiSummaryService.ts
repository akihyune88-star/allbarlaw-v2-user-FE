import instance from '@/lib/axios'
import { BlogAiSummaryRequest, BlogAiSummaryResponse } from '@/types/aiSummaryTypes'
import axios from 'axios'

export const aiSummaryService = {
  getBlogAiSummary: async (request: BlogAiSummaryRequest) => {
    const { url, category } = request

    const params = new URLSearchParams()
    if (url) params.append('url', url)
    if (category) params.append('category', category)

    const urlPath = `http://3.36.247.161:8000/latest/summary/blog?${params.toString()}`

    const response = await axios.get<BlogAiSummaryResponse>(urlPath)
    return response.data
  },
}
