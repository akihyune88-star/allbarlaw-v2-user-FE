export type SocialLink = {
  type: 'naver' | 'youtube' | 'instagram'
  link: string
}

export type Lawyer = {
  id: number
  name: string
  lawfirm: string
  profileImage: string
  tags: string[]
  description: string
}

export type AIRecommenderLawyerItem = Pick<Lawyer, 'id' | 'name' | 'description' | 'profileImage'>
