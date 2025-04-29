import { ROUTER } from '@/routes/routerConstant'

export const SUB_MENU_LIST = [
  {
    name: '전체',
    itemWidth: 84,
    path: '/',
  },
  {
    name: '변호사의 글',
    itemWidth: 84,
    path: ROUTER.BLOG,
  },
  {
    name: '변호사의 영상',
    itemWidth: 98,
    path: ROUTER.VIDEO,
  },
  {
    name: '법률 지식인',
    itemWidth: 84,
    path: ROUTER.LEGAL_KNOWLEDGE,
  },
  {
    name: '변호사',
    itemWidth: 84,
    path: '/lawyer',
  },
  {
    name: '로펌',
    itemWidth: 54,
    path: '/law-firm',
  },
]
