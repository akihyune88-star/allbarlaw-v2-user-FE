export type BlogAiSummaryRequest = {
  url: string
  category: string
}

export type BlogAiSummaryResponse = {
  text: string
  tags: string[]
  thumbnail: string
  title: string
}
