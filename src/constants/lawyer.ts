type SocialType = 'naver' | 'youtube' | 'instagram'

type SocialLinkList = {
  type: SocialType
  link: string
}

export const SOCIAL_LINK_LIST: SocialLinkList[] = [
  {
    type: 'naver',
    link: 'https://www.kakao.com',
  },
  {
    type: 'youtube',
    link: 'https://www.naver.com',
  },
  {
    type: 'instagram',
    link: 'https://www.instagram.com',
  },
]
