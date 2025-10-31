import { ChatRoomStatus, LawyerChatRoom } from '@/types/baroTalkTypes'
import styles from './lawyerChatList.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { useGetLawyerChatList } from '@/hooks/queries/useBaroTalk'
import { useAuth } from '@/contexts/AuthContext'
import React, { useEffect, useState, useRef, useMemo } from 'react'
import { toggleClipChatRoom, isClippedChatRoom, sortChatRoomsByClip } from '@/utils/localStorage'
import HeaderPortal from '@/components/headerPortal/HeaderPortal'
import ChatModal from '@/components/chatModal/ChatModal'
import Tabs from '@/components/tabs/Tabs'

interface LawyerChatListProps {
  onChatRoomSelect?: (_chatRoomId: number) => void
}

interface ChatModalState {
  chatRoomId: number
  clientName: string
  clientId: number
  userLeft: boolean
  zIndex: number
  position: { x: number; y: number }
}

const LawyerChatList = ({ onChatRoomSelect }: LawyerChatListProps) => {
  const { getLawyerIdFromToken } = useAuth()
  const lawyerId = getLawyerIdFromToken()
  const [clipStates, setClipStates] = useState<Record<number, boolean>>({})
  const observerRef = useRef<HTMLDivElement>(null)
  const disabledStatus = ['COMPLETED', 'CANCELLED', 'REJECTED']

  // 멀티 모달 상태 관리
  const [openModals, setOpenModals] = useState<ChatModalState[]>([])
  const [nextZIndex, setNextZIndex] = useState(1000)

  // 폴링 간격 상태 (분 단위, 밀리초로 변환)
  const [pollingInterval, setPollingInterval] = useState<number>(5)

  // 탭 상태 (전체/진행중/종료)
  const [selectedTab, setSelectedTab] = useState<string>('all')

  // 초기 마운트 시 한 번만 로그
  useEffect(() => {
    console.log('📋 [LAWYER LIST] 컴포넌트 초기화 완료:', { lawyerId })
  }, [lawyerId])

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useGetLawyerChatList(
    lawyerId || 0,
    {
      take: 20,
      sort: 'desc',
      page: 1,
    },
    pollingInterval * 60 * 1000 // 분을 밀리초로 변환하여 refetchInterval로 전달
  )

  // IntersectionObserver를 사용한 무한스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const target = entries[0]
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log('🟢 LawyerChatList - IntersectionObserver: 다음 페이지 로드 시작')
          fetchNextPage()
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // 모든 페이지의 채팅방 데이터를 하나의 배열로 합치기
  const allChatRooms = data?.pages.flatMap((page: any) => page.chatRooms) || []

  // 탭에 따라 필터링
  const filteredChatRooms = useMemo(() => {
    let filtered = allChatRooms

    if (selectedTab === 'active') {
      // 진행중: PENDING, ACTIVE, CONSULTING, PARTIAL_LEFT
      filtered = allChatRooms.filter((room: LawyerChatRoom) =>
        ['PENDING', 'ACTIVE', 'CONSULTING', 'PARTIAL_LEFT'].includes(room.chatRoomStatus)
      )
    } else if (selectedTab === 'completed') {
      // 종료: COMPLETED, CANCELLED, REJECTED
      filtered = allChatRooms.filter((room: LawyerChatRoom) =>
        ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(room.chatRoomStatus)
      )
    }
    // 'all'이면 모든 채팅방 표시

    return filtered
  }, [allChatRooms, selectedTab])

  const chatRooms = sortChatRoomsByClip(filteredChatRooms)

  const getStatusBadge = (status: ChatRoomStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}>
            <span className={`${styles.statusBadge} ${styles.newQuestion}`}>신규 질문</span>
            <span className={`${styles.statusBadge} ${styles.pending}`}>답변하기</span>
          </div>
        )
      case 'ACTIVE':
        return <span className={`${styles.statusBadge} ${styles.waiting}`}>채팅중</span>
      case 'CONSULTING':
        return <span className={`${styles.statusBadge} ${styles.consulting}`}>답변완료 채팅시작 대기중</span>
      case 'COMPLETED':
        return <span className={`${styles.statusBadge} ${styles.completed}`}>완료</span>
      default:
        return <span className={`${styles.statusBadge} ${styles.completed}`}>종료</span>
    }
  }

  const getResponseStatus = (responseTime: string | null, status: ChatRoomStatus) => {
    if (status === 'PENDING' || !responseTime) {
      return <span className={styles.pendingResponse}>답변 대기중</span>
    }

    if (status === 'CONSULTING') {
      return <span className={styles.pendingResponse}>채팅시작 대기중</span>
    }

    return new Date(responseTime).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  useEffect(() => {
    if (chatRooms.length > 0) {
      const initialClipStates: Record<number, boolean> = {}
      chatRooms.forEach(room => {
        initialClipStates[room.chatRoomId] = isClippedChatRoom(room.chatRoomId)
      })
      setClipStates(initialClipStates)
    }
  }, [chatRooms.length])

  const handleClipRoom = (chatRoomId: number, event: React.MouseEvent) => {
    event.stopPropagation() // 행 클릭 이벤트 버블링 방지
    const isClipped = toggleClipChatRoom(chatRoomId)
    setClipStates(prev => ({
      ...prev,
      [chatRoomId]: isClipped,
    }))
  }

  const handleChatRoomClick = (chatRoom: LawyerChatRoom) => {
    if (disabledStatus.includes(chatRoom.chatRoomStatus)) {
      console.log('⚠️ [LAWYER LIST] 비활성 채팅방 클릭 차단:', {
        chatRoomId: chatRoom.chatRoomId,
        status: chatRoom.chatRoomStatus,
      })
      return
    }

    // 이미 열려있는 모달인지 확인
    const existingModal = openModals.find(modal => modal.chatRoomId === chatRoom.chatRoomId)
    if (existingModal) {
      // 이미 열려있으면 해당 모달을 맨 앞으로 가져오기
      handleModalFocus(chatRoom.chatRoomId)
      return
    }

    console.log('🔘 [LAWYER LIST] 채팅방 클릭:', {
      chatRoomId: chatRoom.chatRoomId,
      clientName: chatRoom.clientName,
      status: chatRoom.chatRoomStatus,
    })

    // 모달 위치 계산 (계단식 배치)
    const offset = openModals.length * 30
    const position = {
      x: 100 + offset,
      y: 50 + offset,
    }

    // 새 모달 추가
    const newModal: ChatModalState = {
      chatRoomId: chatRoom.chatRoomId,
      clientName: chatRoom.clientName,
      clientId: chatRoom.clientId,
      userLeft: chatRoom.userLeft || false,
      zIndex: nextZIndex,
      position,
    }

    setOpenModals(prev => [...prev, newModal])
    setNextZIndex(prev => prev + 1)

    if (onChatRoomSelect) {
      onChatRoomSelect(chatRoom.chatRoomId)
    }
  }

  // 모달 닫기
  const handleCloseModal = (chatRoomId: number) => {
    setOpenModals(prev => prev.filter(modal => modal.chatRoomId !== chatRoomId))
    console.log('🔴 [MODAL] 모달 닫힘:', chatRoomId)
  }

  // 모달 포커스 (맨 앞으로 가져오기)
  const handleModalFocus = (chatRoomId: number) => {
    setOpenModals(prev => {
      const modal = prev.find(m => m.chatRoomId === chatRoomId)
      if (!modal) return prev

      const otherModals = prev.filter(m => m.chatRoomId !== chatRoomId)
      const updatedModal = { ...modal, zIndex: nextZIndex }

      setNextZIndex(nextZIndex + 1)
      return [...otherModals, updatedModal]
    })
  }

  // 모달 위치 변경
  const handlePositionChange = (chatRoomId: number, newPosition: { x: number; y: number }) => {
    setOpenModals(prev =>
      prev.map(modal => (modal.chatRoomId === chatRoomId ? { ...modal, position: newPosition } : modal))
    )
  }

  if (isLoading) {
    return <div className={styles.loading}>로딩 중...</div>
  }

  if (error) {
    return <div className={styles.error}>데이터를 불러오는 중 오류가 발생했습니다.</div>
  }

  return (
    <>
      {/* 헤더 포탈을 통해 페이지별 컴포넌트 주입 */}
      <HeaderPortal>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>채팅 상담 목록</h2>
          <span style={{ fontSize: '0.875rem', color: '#666' }}>총 {chatRooms.length}개의 상담</span>
        </div>
      </HeaderPortal>

      <div className={styles.container}>
        {/* 탭과 폴링 간격 선택 */}
        <div
          style={{
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* 탭 */}
          <Tabs
            selectedPath={selectedTab}
            onChange={path => setSelectedTab(path)}
            items={[
              { path: 'all', name: '전체' },
              { path: 'active', name: '진행중' },
              { path: 'completed', name: '종료' },
            ]}
          />

          {/* 폴링 간격 선택 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <label
              htmlFor='polling-interval'
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#333',
              }}
            >
              자동 새로고침
            </label>
            <select
              id='polling-interval'
              value={pollingInterval}
              onChange={e => setPollingInterval(Number(e.target.value))}
              style={{
                padding: '0.625rem 2.5rem 0.625rem 1rem',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                backgroundColor: 'white',
                color: '#333',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                appearance: 'none',
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' " +
                  "width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' " +
                  "d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = '#20BF62'
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(32, 191, 98, 0.15)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = '#e0e0e0'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              <option value={1}>1분</option>
              <option value={5}>5분</option>
              <option value={10}>10분</option>
              <option value={30}>30분</option>
            </select>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.clipColumn}></th>
              <th>No.</th>
              <th>의뢰인명</th>
              <th>채팅수</th>
              <th>변호사명</th>
              <th>채팅수</th>
              <th>질문 일시</th>
              <th>답변 일시</th>
              <th>의뢰인 채팅여부</th>
            </tr>
          </thead>
          <tbody>
            {chatRooms.map((room: LawyerChatRoom) => {
              const isDisabled = disabledStatus.includes(room.chatRoomStatus)
              return (
                <tr
                  key={room.chatRoomId}
                  onClick={() => !isDisabled && handleChatRoomClick(room)}
                  className={`${styles.clickableRow} ${isDisabled ? styles.disabled : ''}`}
                >
                  <td className={styles.clipColumn}>
                    <button
                      className={`${styles.clipButton} ${clipStates[room.chatRoomId] ? styles.clipped : ''} ${
                        isDisabled ? styles.disabled : ''
                      }`}
                      onClick={e => !isDisabled && handleClipRoom(room.chatRoomId, e)}
                      disabled={isDisabled}
                    >
                      <SvgIcon name='clip' size={16} />
                    </button>
                  </td>
                  <td>{room.chatRoomId}</td>
                  <td>{room.clientName}</td>
                  <td className={styles.chatCount}>{room.clientMessageCount}</td>
                  <td>{room.lawyerName}</td>
                  <td className={styles.chatCount}>{room.lawyerMessageCount}</td>
                  <td>{formatDateTime(room.chatRoomCreatedAt)}</td>
                  <td>{getResponseStatus(room.lawyerFirstResponseAt, room.chatRoomStatus)}</td>
                  <td>{getStatusBadge(room.chatRoomStatus)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* IntersectionObserver 타겟 요소 */}
        <div ref={observerRef} style={{ height: '20px', width: '100%' }}>
          {isFetchingNextPage && <div className={styles.loadingMore}>더 많은 데이터를 불러오는 중...</div>}
        </div>
      </div>

      {/* 멀티 채팅 모달 */}
      {openModals.map(modal => (
        <ChatModal
          key={modal.chatRoomId}
          chatRoomId={modal.chatRoomId}
          clientName={modal.clientName}
          clientId={modal.clientId}
          userLeft={modal.userLeft}
          onClose={() => handleCloseModal(modal.chatRoomId)}
          zIndex={modal.zIndex}
          position={modal.position}
          onFocus={() => handleModalFocus(modal.chatRoomId)}
          onPositionChange={newPosition => handlePositionChange(modal.chatRoomId, newPosition)}
        />
      ))}
    </>
  )
}

export default LawyerChatList
