import { SortType } from './sortTypes'

export type LegalTermItem = {
  chineseName: string
  englishName: string
  koreanName: string
  legalTermId: number
  searchCount?: number
  viewCount?: number
  searchedAt?: string
  createdAt?: string
  content?: string
  source?: string
}

export type PopularLegalTermListResponse = {
  data: LegalTermItem[]
}

export type RecentSearchesResponse = {
  data: LegalTermItem[]
}

export type RecentRegisteredLegalTermListResponse = {
  data: LegalTermItem[]
}

export type SearchLegalTermRequest = {
  legalTermPage: number
  orderBy: SortType
  sort: 'asc' | 'desc'
  search: string
}

export type SearchLegalTermResponse = {
  data: LegalTermItem
}
