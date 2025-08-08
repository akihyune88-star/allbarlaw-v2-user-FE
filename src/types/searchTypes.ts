import { BlogCase } from './blogTypes'
import { KnowledgeItem } from './knowledgeType'
import { Lawyer } from './lawyerTypes'
import { SortType } from './sortTypes'
import { VideoCase } from './videoTypes'

export type SearchTab = 'all' | 'blog' | 'video' | 'consultation' | 'lawyer'

export type SearchRequest = {
  searchQuery?: string
  searchTab?: SearchTab
  searchPage?: number
  searchSize?: number
  searchSortBy?: SortType
  searchLawyerId?: number
}

export type SearchResponse = {
  searchQuery: string
  searchTab: SearchTab
  searchTotalCounts: {
    searchTotalBlogCount: number
    searchTotalVideoCount: number
    searchTotalConsultationCount: number
    searchTotalLawyerCount: number
  }
  searchResults: {
    searchBlogResults: BlogCase[]

    searchVideoResults: VideoCase[]
    searchConsultationResults: KnowledgeItem[]
    searchLawyerResults: Lawyer[]
  }
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  totalItems: number
}
