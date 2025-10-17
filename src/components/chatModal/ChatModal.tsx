import React, { useEffect, useState, useRef } from 'react'
import ChatRoomContainer from '@/container/baroTalk/chatRoomContainer/ChatRoomContainer'
import styles from './chatModal.module.scss'

interface ChatModalProps {
  chatRoomId: number
  clientName: string
  clientId: number
  userLeft?: boolean
  onClose: () => void
  zIndex: number
  position: { x: number; y: number }
  onFocus: () => void
  onPositionChange: (position: { x: number; y: number }) => void
}

const ChatModal = ({
  chatRoomId,
  clientName,
  clientId,
  userLeft = false,
  onClose,
  zIndex,
  position,
  onFocus,
  onPositionChange,
}: ChatModalProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const modalRef = useRef<HTMLDivElement>(null)

  // 모달 클릭 시 포커스 (맨 앞으로 가져오기)
  const handleModalClick = () => {
    onFocus()
  }

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // ChatRoomContainer 내부 클릭은 드래그 시작하지 않음
    if ((e.target as HTMLElement).closest('.chat-content')) {
      return
    }

    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
    onFocus()
  }

  // 드래그 중
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y

      // 화면 밖으로 나가지 않도록 제한
      const maxX = window.innerWidth - (modalRef.current?.offsetWidth || 650)
      const maxY = window.innerHeight - (modalRef.current?.offsetHeight || 500)

      const boundedX = Math.max(0, Math.min(newX, maxX))
      const boundedY = Math.max(0, Math.min(newY, maxY))

      onPositionChange({ x: boundedX, y: boundedY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset, onPositionChange])

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div
      ref={modalRef}
      className={`${styles.modalOverlay} ${isDragging ? styles.dragging : ''}`}
      style={{
        zIndex,
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onClick={handleModalClick}
      onMouseDown={handleMouseDown}
    >
      <div className={styles.modalContent}>
        {/* 닫기 버튼 */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label='닫기'
          onMouseDown={e => e.stopPropagation()}
        >
          ×
        </button>

        {/* 채팅 컨테이너 (ChatHeader와 ChatBody 포함) */}
        <ChatRoomContainer chatRoomId={chatRoomId} userLeft={userLeft} clientName={clientName} clientId={clientId} />
      </div>
    </div>
  )
}

export default ChatModal
