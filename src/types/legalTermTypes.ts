export type LegalTermItem = {
  legalTermId: number
  legalTermName: string
  legalTermDescription: string
  legalTermImage: string
  legalTermUrl: string
}

export type PopularLegalTermListResponse = {
  data: {
    chineseName: string
    englishName: string
    koreanName: string
    legalTermId: number
    searchCount: 0
    viewCount: 2100
  }[]
}
