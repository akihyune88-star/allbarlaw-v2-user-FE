import { ROUTER } from '@/routes/routerConstant'

export const SEARCH_TAB_LIST = [
  {
    name: '전체',
    itemWidth: 84,
    path: '/',
  },
  {
    name: '법률정보의 글',
    itemWidth: 98,
    path: ROUTER.BLOG,
  },
  {
    name: '변호사의 영상',
    itemWidth: 98,
    path: ROUTER.VIDEO,
  },
  // {
  //   name: '법률 지식인',
  //   itemWidth: 84,
  //   path: ROUTER.LEGAL_KNOWLEDGE,
  // },
  {
    name: '변호사',
    itemWidth: 84,
    path: ROUTER.LAWYER,
  },
]
