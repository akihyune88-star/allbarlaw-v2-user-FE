import { BlogAiSummaryRequest, BlogAiSummaryResponse } from '@/types/aiSummaryTypes'
import axios from 'axios'

export const aiSummaryService = {
  getBlogAiSummary: async (request: BlogAiSummaryRequest) => {
    const { url, category } = request

    const params = new URLSearchParams()
    if (url) params.append('url', url)
    if (category) params.append('category', category)

    const urlPath = `${import.meta.env.VITE_AI_SUMMARY_SERVER_API}/latest/summary/blog?${params.toString()}`

    const response = await axios.get<BlogAiSummaryResponse>(urlPath)
    return response.data
  },
}
