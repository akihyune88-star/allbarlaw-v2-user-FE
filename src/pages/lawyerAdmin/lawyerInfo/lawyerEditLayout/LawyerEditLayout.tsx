import Tabs from '@/components/tabs/Tabs'
import { ROUTER } from '@/routes/routerConstant'
import { Outlet, useNavigate, useLocation, unstable_useBlocker as useBlocker } from 'react-router-dom'
import styles from './lawyerEditLayout.module.scss'
import { FormChangeProvider, useFormChange } from '@/contexts/FormChangeContext'
import { ConfirmModal } from '@/components/modal/ConfirmModal'
import { useState, useEffect, useCallback } from 'react'

const SEARCH_TAB_LIST = [
  { name: '변호사 기본정보', itemWidth: 114, path: ROUTER.LAWYER_ADMIN_LAWYER_EDIT_BASIC_INFO },
  { name: '이력사항', itemWidth: 84, path: ROUTER.LAWYER_ADMIN_LAWYER_EDIT_CAREER },
  { name: '활동사항', itemWidth: 84, path: ROUTER.LAWYER_ADMIN_LAWYER_EDIT_ACTIVITY },
]

const LawyerEditLayoutContent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { hasUnsavedChanges, setHasUnsavedChanges } = useFormChange()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingLocation, setPendingLocation] = useState<any>(null)
  const [selectedTabPath, setSelectedTabPath] = useState<string>('')

  // 초기 탭 설정
  useEffect(() => {
    const pathname = location.pathname
    const matchingItem = SEARCH_TAB_LIST.find(item =>
      pathname === item.path || pathname.startsWith(item.path + '/')
    )

    if (matchingItem) {
      setSelectedTabPath(matchingItem.path)
    }
  }, [location.pathname])

  // React Router v6의 useBlocker 사용
  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }) => {
        // 변경사항이 있고, 다른 탭으로 이동하려고 할 때만 차단
        if (hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname) {
          const isTabNavigation = SEARCH_TAB_LIST.some(tab =>
            nextLocation.pathname === tab.path || nextLocation.pathname.startsWith(tab.path + '/')
          )

          if (isTabNavigation) {
            return true
          }
        }
        return false
      },
      [hasUnsavedChanges]
    )
  )

  // blocker 상태 변경 감지
  useEffect(() => {
    if (blocker.state === 'blocked') {
      setPendingLocation(blocker.location)
      setShowConfirmModal(true)
    }
  }, [blocker])

  const handleTabChange = (path: string) => {
    // 현재 경로와 같으면 아무것도 하지 않음
    if (path === selectedTabPath) {
      return
    }

    // navigate를 호출하면 blocker가 동작함
    navigate(path)
  }

  const handleConfirmNavigation = () => {
    setShowConfirmModal(false)
    setHasUnsavedChanges(false)

    if (blocker.state === 'blocked') {
      blocker.proceed()
    }
  }

  const handleCancelNavigation = () => {
    setShowConfirmModal(false)
    setPendingLocation(null)

    if (blocker.state === 'blocked') {
      blocker.reset()
    }
  }

  return (
    <>
      <div className={styles['lawyer-edit-layout']}>
        <header className={styles['lawyer-edit-layout__header']}>
          <Tabs
            items={SEARCH_TAB_LIST}
            selectedPath={selectedTabPath}
            onChange={handleTabChange}
            className={styles['lawyer-edit-layout__header__tabs']}
          />
        </header>
        <Outlet />
      </div>
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={handleCancelNavigation}
        onConfirm={handleConfirmNavigation}
        message='변경사항이 저장되지 않았습니다.
정말로 페이지를 이동하시겠습니까?'
        confirmText='이동'
        cancelText='취소'
      />
    </>
  )
}

const LawyerEditLayout = () => {
  return (
    <FormChangeProvider>
      <LawyerEditLayoutContent />
    </FormChangeProvider>
  )
}

export default LawyerEditLayout