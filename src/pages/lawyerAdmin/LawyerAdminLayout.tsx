import SideBar from '@/components/sideBar/SideBar'
import LawyerAdminHeader from '@/container/lawyerAdmin/lawyerAdminHeader/LawyerAdminHeader'
import { CategoryList } from '@/types/categoryTypes'
import styles from '@/styles/app.module.scss'
import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'
import { useChatSocket } from '@/hooks/useChatSocket'
import { useSetChatStatus, useIsConnected } from '@/stores/socketStore'
import { useAuth } from '@/contexts/AuthContext'

// 채팅 페이지에서만 소켓을 연결하는 컴포넌트
const ChatSocketProvider = () => {
  const setChatStatus = useSetChatStatus()
  const isConnected = useIsConnected()

  // chatRoomId를 null로 설정해서 소켓 연결만 담당 (특정 방에 join하지 않음)
  useChatSocket({
    chatRoomId: null,
    setChatStatus,
  })

  // 초기 마운트 시 한 번만 로그
  useEffect(() => {
    console.log('💬 [CHAT SOCKET] 소켓 프로바이더 초기화 완료 (방 입장 없음)')
  }, [])

  // 소켓 연결 상태 변경 감지
  useEffect(() => {
    if (isConnected) {
      console.log('✅ [CHAT SOCKET] 소켓 연결됨')
    } else {
      console.log('❌ [CHAT SOCKET] 소켓 연결 끊김')
    }
  }, [isConnected])

  return null
}

const LawyerAdminLayout = () => {
  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  // URL 경로에 따라 선택된 카테고리 자동 업데이트
  useEffect(() => {
    const path = location.pathname

    // subcategoryId와 해당하는 categoryId 매핑
    const pathMapping: Record<string, { subcategoryId: number; categoryId: number }> = {
      '/lawyer-admin/lawyer-detail': { subcategoryId: 1, categoryId: 1 },
      '/lawyer-admin/lawyer-edit': { subcategoryId: 2, categoryId: 1 },
      '/lawyer-admin/content/blog': { subcategoryId: 3, categoryId: 2 },
      '/lawyer-admin/content/video': { subcategoryId: 4, categoryId: 2 },
      '/lawyer-admin/content/legal-knowledge': { subcategoryId: 5, categoryId: 2 },
      '/lawyer-admin/chat': { subcategoryId: 6, categoryId: 3 },
      '/lawyer-admin/account-edit': { subcategoryId: 7, categoryId: 4 },
    }

    // 경로에 맞는 카테고리 찾기
    const matchedPath = Object.keys(pathMapping).find(key => path.includes(key))

    if (matchedPath) {
      const { subcategoryId, categoryId } = pathMapping[matchedPath]
      setSelectedSubcategory(subcategoryId)
      setSelectedMainCategory(categoryId)
    }
  }, [location.pathname])

  // 채팅 관련 페이지인지 확인
  const isChatPage = location.pathname.includes('/lawyer-admin/chat')

  const handleMainCategoryClick = (id: number) => {
    setSelectedMainCategory(selectedMainCategory === id ? null : id)
  }
  const handleLogout = () => {
    logout()
    setTimeout(() => navigate('/'), 0)
  }

  const handleSubcategoryClick = (id: number) => {
    setSelectedSubcategory(id)
    switch (id) {
      case 1:
        navigate(ROUTER.LAWYER_ADMIN_LAWYER_DETAIL)
        break
      case 2:
        navigate(ROUTER.LAWYER_ADMIN_LAWYER_EDIT)
        break
      case 3:
        navigate(ROUTER.LAWYER_ADMIN_CONTENT_BLOG)
        break
      case 4:
        navigate(ROUTER.LAWYER_ADMIN_CONTENT_VIDEO)
        break
      case 5:
        navigate(ROUTER.LAWYER_ADMIN_CONTENT_LEGAL_KNOWLEDGE)
        break
      case 6:
        navigate(ROUTER.LAWYER_ADMIN_CHAT_LIST)
        break
      case 7:
        navigate(ROUTER.LAWYER_ADMIN_ACCOUNT_EDIT)
        break
      case 8:
        handleLogout()
        break
    }
  }

  return (
    <div className={styles.container}>
      {/* 채팅 페이지에서만 소켓 연결 */}
      {isChatPage && <ChatSocketProvider />}

      <LawyerAdminHeader />
      <div className={styles['inner-container']} style={{ display: 'flex' }}>
        <SideBar
          categories={categories}
          selectedMainCategory={selectedMainCategory}
          selectedSubcategory={selectedSubcategory}
          onMainCategoryClick={handleMainCategoryClick}
          onSubcategoryClick={handleSubcategoryClick}
          alwaysExpanded={true}
        />
        <div style={{ width: 1120, display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default LawyerAdminLayout

const categories: CategoryList = [
  {
    categoryId: 1,
    categoryName: '변호사 정보관리',
    imageUrl: '',
    clickedImageUrl: '',
    isUncategorized: false,
    subcategories: [
      {
        subcategoryId: 1,
        subcategoryName: '변호사 정보 상세',
        isUncategorized: false,
        categoryId: 1,
      },
      {
        subcategoryId: 2,
        subcategoryName: '변호사 정보 수정',
        isUncategorized: false,
        categoryId: 1,
      },
    ],
  },
  {
    categoryId: 2,
    categoryName: '분류별 컨텐츠 관리',
    imageUrl: '',
    clickedImageUrl: '',
    isUncategorized: false,
    subcategories: [
      {
        subcategoryId: 3,
        subcategoryName: '블로그 글',
        isUncategorized: false,
        categoryId: 2,
      },
      {
        subcategoryId: 4,
        subcategoryName: '법률영상',
        isUncategorized: false,
        categoryId: 2,
      },
      {
        subcategoryId: 5,
        subcategoryName: '법률 지식인',
        isUncategorized: false,
        categoryId: 2,
      },
    ],
  },
  {
    categoryId: 3,
    categoryName: '채팅상담',
    imageUrl: '',
    clickedImageUrl: '',
    isUncategorized: false,
    subcategories: [
      {
        subcategoryId: 6,
        subcategoryName: '채팅리스트',
        isUncategorized: false,
        categoryId: 3,
      },
    ],
  },
  {
    categoryId: 4,
    categoryName: '변호사 회원정보',
    imageUrl: '',
    clickedImageUrl: '',
    isUncategorized: false,
    subcategories: [
      {
        subcategoryId: 7,
        subcategoryName: '회원정보/비밀번호 변경',
        isUncategorized: false,
        categoryId: 4,
      },
      {
        subcategoryId: 8,
        subcategoryName: '로그아웃',
        isUncategorized: false,
        categoryId: 4,
      },
    ],
  },
]
