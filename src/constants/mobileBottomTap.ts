import { ROUTER } from '@/routes/routerConstant'
import { KeyOfIcon } from '@/types/svg'

export type MobileBottomTap = {
  path: string
  name: string
  icon: KeyOfIcon
  activeIcon: KeyOfIcon
}

export const mobileBottomTapList: MobileBottomTap[] = [
  {
    path: ROUTER.MAIN,
    name: '홈',
    icon: 'home',
    activeIcon: 'activeHome',
  },
  {
    path: ROUTER.REQUEST_BARO_TALK,
    name: '상담',
    icon: 'talk',
    activeIcon: 'activeTalk',
  },
  {
    path: ROUTER.MYPAGE,
    name: '찜리스트',
    icon: 'bookMarkStrong',
    activeIcon: 'activeBookMark',
  },
  {
    path: ROUTER.MOBILE_MENU_LIST,
    name: '전체메뉴',
    icon: 'totalMenu',
    activeIcon: 'activeTotalMenu',
  },
] as const
