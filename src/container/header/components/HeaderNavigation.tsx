import styles from '@/container/header/header.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { MENU_LIST } from '@/constants/topMenu'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import { useAuth } from '@/contexts/AuthContext'
import { useGetBaroTalkChatList } from '@/hooks/queries/useBaroTalk'
import { useState } from 'react'

const HeaderNavigation = () => {
  const navigate = useNavigate()
  const { logout, getDisplayLoginStatus } = useAuth()
  const [isCheckingBaroTalk, setIsCheckingBaroTalk] = useState(false)

  // 채팅방 목록 데이터 (prefetch용)
  const { refetch: refetchChatList } = useGetBaroTalkChatList({
    chatRoomOrderBy: 'lastMessageAt',
    chatRoomSort: 'desc',
  })

  const handleLogout = () => {
    logout()
    navigate(ROUTER.MAIN)
  }

  // 바로톡 클릭 핸들러
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

  // 메인 레이아웃에서는 변호사 로그인을 숨김
  const isLoggedIn = getDisplayLoginStatus(true)

  // 로그인 상태에 따라 메뉴 필터링
  const filteredMenuList = MENU_LIST.filter(item => {
    // 로그인 상태일 때는 로그인 버튼을 숨기고 마이페이지를 보여줌
    if (isLoggedIn) {
      return item.name !== '로그인/회원가입'
    }
    // 로그아웃 상태일 때는 마이페이지를 숨기고 로그인 버튼을 보여줌
    return item.name !== '마이페이지'
  })

  return (
    <div className={styles['navigation-container']}>
      <div className={styles['category']}>
        <SvgIcon name='menu' />
        <span>카테고리</span>
      </div>
      <div className={styles['header-menu-list']}>
        {filteredMenuList.map(item => (
          <button
            key={item.name}
            className={styles['menu-item']}
            onClick={item.name === '바로톡' ? handleBaroTalkClick : () => navigate(item.path)}
            disabled={item.name === '바로톡' && isCheckingBaroTalk}
          >
            {item.name === '바로톡' && (
              <div className={styles['speech-bubble']}>
                <span>변호사랑 바로상담하기</span>
              </div>
            )}
            <span>{item.name}</span>
          </button>
        ))}
        {isLoggedIn && (
          <button className={styles['menu-item']} onClick={handleLogout}>
            <span>로그아웃</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default HeaderNavigation
