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
