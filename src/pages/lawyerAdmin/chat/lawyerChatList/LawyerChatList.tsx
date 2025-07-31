import { ChatRoomStatus, LawyerChatRoom } from '@/types/baroTalkTypes'
import styles from './lawyerChatList.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { useGetLawyerChatList } from '@/hooks/queries/useBaroTalk'
import { useAuth } from '@/contexts/AuthContext'
import React, { useEffect, useState, useRef } from 'react'
import { toggleClipChatRoom, isClippedChatRoom, sortChatRoomsByClip } from '@/utils/localStorage'
import { useSetChatRoomId } from '@/stores/socketStore'
import { useNavigate } from 'react-router-dom'
import { ROUTER } from '@/routes/routerConstant'

interface LawyerChatListProps {
  onChatRoomSelect?: (_chatRoomId: number) => void
}

const LawyerChatList = ({ onChatRoomSelect }: LawyerChatListProps) => {
  const { getUserIdFromToken } = useAuth()
  const lawyerId = getUserIdFromToken() // 임시로 userId를 lawyerId로 사용
  const [clipStates, setClipStates] = useState<Record<number, boolean>>({})
  const setChatRoomId = useSetChatRoomId()
  const navigate = useNavigate()
  const observerRef = useRef<HTMLDivElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useGetLawyerChatList(
    lawyerId || 0,
    {
      take: 20,
      sort: 'desc',
      page: 1,
    }
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
  const chatRooms = sortChatRoomsByClip(allChatRooms)

  const getStatusBadge = (status: ChatRoomStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className={`${styles.statusBadge} ${styles.pending}`}>답변 대기중</span>
      case 'ACTIVE':
        return <span className={`${styles.statusBadge} ${styles.waiting}`}>채팅중</span>
      case 'CONSULTING':
        return <span className={`${styles.statusBadge} ${styles.answered}`}>답변완료 채팅시작 대기중</span>
      case 'COMPLETED':
        return <span className={`${styles.statusBadge} ${styles.completed}`}>완료</span>
      case 'CANCELLED':
        return <span className={`${styles.statusBadge} ${styles.cancelled}`}>취소</span>
      default:
        return <span className={`${styles.statusBadge} ${styles.completed}`}>종료</span>
    }
  }

  const getResponseStatus = (responseTime: string | null, status: ChatRoomStatus) => {
    if (!responseTime) {
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

  const handleChatRoomClick = (chatRoomId: number) => {
    console.log('🗋 LawyerChatList: 채팅방 클릭:', chatRoomId)

    // 1. 전역 상태에 채팅방 ID 설정
    setChatRoomId(chatRoomId)

    // 2. LawyerChat 페이지로 네비게이션
    navigate(ROUTER.LAWYER_ADMIN_CHAT)

    // 3. 만약 onChatRoomSelect prop이 있다면 호출 (선택사항)
    if (onChatRoomSelect) {
      onChatRoomSelect(chatRoomId)
    }
  }

  if (isLoading) {
    return <div className={styles.loading}>로딩 중...</div>
  }

  if (error) {
    return <div className={styles.error}>데이터를 불러오는 중 오류가 발생했습니다.</div>
  }

  return (
    <div className={styles.container}>
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
          {chatRooms.map((room: LawyerChatRoom) => (
            <tr
              key={room.chatRoomId}
              onClick={() => handleChatRoomClick(room.chatRoomId)}
              className={styles.clickableRow}
            >
              <td className={styles.clipColumn}>
                <button
                  className={`${styles.clipButton} ${clipStates[room.chatRoomId] ? styles.clipped : ''}`}
                  onClick={e => handleClipRoom(room.chatRoomId, e)}
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
          ))}
        </tbody>
      </table>

      {/* IntersectionObserver 타겟 요소 */}
      <div ref={observerRef} style={{ height: '20px', width: '100%' }}>
        {isFetchingNextPage && <div className={styles.loadingMore}>더 많은 데이터를 불러오는 중...</div>}
      </div>
    </div>
  )
}

export default LawyerChatList
