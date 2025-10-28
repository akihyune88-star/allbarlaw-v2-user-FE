import { mobileBottomTapList } from '@/constants/mobileBottomTap'
import styles from './bottom-navigation.module.scss'
import SvgIcon from '../SvgIcon'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useGetBaroTalkChatList } from '@/hooks/queries/useBaroTalk'
import { ROUTER } from '@/routes/routerConstant'

const BottomNavigation = () => {
  const navigate = useNavigate()
  const { getDisplayLoginStatus } = useAuth()
  const [activeMenuPath, setActiveMenuPath] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [isCheckingBaroTalk, setIsCheckingBaroTalk] = useState(false)
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<number | null>(null)

  // 채팅방 목록 데이터 (refetch 전용 - 자동 실행 안 함)
  const { refetch: refetchChatList } = useGetBaroTalkChatList(
    {
      chatRoomOrderBy: 'lastMessageAt',
      chatRoomSort: 'desc',
    },
    { enabled: false }
  )

  // 바로톡(상담) 클릭 핸들러
  const handleBaroTalkClick = async () => {
    const isLoggedIn = getDisplayLoginStatus(true)

    if (!isLoggedIn) {
      // 로그인하지 않은 경우 바로 상담 요청 페이지로
      navigate(ROUTER.REQUEST_BARO_TALK)
      return
    }

    setIsCheckingBaroTalk(true)

    try {
      // 채팅방 목록 조회
      const result = await refetchChatList()
      const allChatRooms = result.data?.pages.flatMap(page => page.chatRooms) || []

      if (allChatRooms.length > 0) {
        // 채팅방이 1개 이상 있으면 채팅 페이지로
        navigate(ROUTER.CHAT)
      } else {
        // 채팅방이 없으면 상담 요청 페이지로
        navigate(ROUTER.REQUEST_BARO_TALK)
      }
    } catch (error) {
      console.error('채팅방 목록 조회 실패:', error)
      // 에러 발생 시 기본적으로 상담 요청 페이지로
      navigate(ROUTER.REQUEST_BARO_TALK)
    } finally {
      setIsCheckingBaroTalk(false)
    }
  }

  const handleItemClick = (path: string, itemName: string) => {
    // 상담 메뉴인 경우 특별 처리
    if (itemName === '바로톡') {
      setActiveMenuPath(path)
      handleBaroTalkClick()
      return
    }

    setActiveMenuPath(path)
    navigate(path)
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // 스크롤 방향 감지
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // 아래로 스크롤 중이고 50px 이상 스크롤된 경우 숨김
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY.current) {
        // 위로 스크롤 중일 때 표시
        setIsVisible(true)
      }

      lastScrollY.current = currentScrollY

      // 스크롤 정지 감지 (300ms 후 다시 표시)
      if (scrollTimeout.current) {
        window.clearTimeout(scrollTimeout.current)
      }

      scrollTimeout.current = window.setTimeout(() => {
        setIsVisible(true)
      }, 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout.current) {
        window.clearTimeout(scrollTimeout.current)
      }
    }
  }, [])

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : styles.hidden}`}>
      {mobileBottomTapList.map(item => {
        const isActive = activeMenuPath === item.path

        return (
          <div
            key={item.path}
            className={`${styles.item} ${isActive ? styles.active : ''} ${
              item.name === '바로톡' && isCheckingBaroTalk ? styles.disabled : ''
            }`}
            onClick={() => !isCheckingBaroTalk && handleItemClick(item.path, item.name)}
          >
            <SvgIcon name={isActive ? item.activeIcon : item.icon} size={24} />
            <span className={styles['menu-name']}>{item.name}</span>
          </div>
        )
      })}
    </div>
  )
}

export default BottomNavigation
