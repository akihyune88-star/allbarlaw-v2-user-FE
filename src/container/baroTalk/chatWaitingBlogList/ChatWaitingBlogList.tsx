import BlogItem from '@/components/blogItem/BlogItem'
import styles from './chatWaitingBlogList.module.scss'
import { useGetBlogList } from '@/hooks/queries/useGetBlogList'
import Divider from '@/components/divider/Divider'
import { ChatRoomStatus, UpdateChatRoomStatusResponse } from '@/types/baroTalkTypes'
import { useUpdateChatRoomStatus, useLeaveChatRoom } from '@/hooks/queries/useBaroTalk'
import { useSetChatStatus, useSetChatRoomId } from '@/stores/socketStore'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useChatSocket } from '@/hooks/useChatSocket'
import React from 'react'

type ChatWaitingBlogListProps = {
  chatStatus: ChatRoomStatus
  chatRoomId: number | null
  messagesLength: number
}

const ChatWaitingBlogList = ({ chatStatus, chatRoomId, messagesLength }: ChatWaitingBlogListProps) => {
  console.log('chatStatus', chatStatus)

  const { blogList } = useGetBlogList({
    subcategoryId: 'all',
    take: 4,
  })

  // 🟢 Zustand 스토어 사용
  const setChatStatus = useSetChatStatus()
  const setChatRoomId = useSetChatRoomId()
  const navigate = useNavigate()
  const { userKeyId } = useAuth()

  // WebSocket 연결 (채팅방 나가기용)
  const { leaveRoom, isLawyer } = useChatSocket({
    chatRoomId,
    setChatStatus,
  })

  const { mutate: updateChatRoomStatus } = useUpdateChatRoomStatus({
    onSuccess: (data: UpdateChatRoomStatusResponse) => {
      setChatStatus(data.chatRoomStatus)
    },
  })

  const { mutate: leaveChatRoom } = useLeaveChatRoom({
    onSuccess: data => {
      // REST API 성공 후 WebSocket으로도 나가기 처리
      leaveRoom()
      setChatRoomId(null)
      
      // 변호사인 경우 변호사 채팅 목록으로 이동
      if (isLawyer) {
        navigate('/lawyer-admin/chat-list')
      } else {
        // 일반 사용자는 메인 채팅 페이지로 이동 (또는 다른 적절한 페이지)
        navigate('/chat')
      }
    },
    onError: error => {
      console.error('채팅방 나가기 실패:', error)
      alert('채팅방 나가기에 실패했습니다.')
    },
  })

  const handleStartChat = () => {
    if (!chatRoomId) return
    updateChatRoomStatus({
      chatRoomId: chatRoomId,
      status: 'ACTIVE',
    })
  }

  const handleLeaveChat = () => {
    if (!chatRoomId || !userKeyId) return

    const confirmed = window.confirm(
      '정말로 채팅방을 나가시겠습니까?\n\n' +
        '• 채팅방에서 나가게 됩니다\n' +
        '• 나간 후에도 상대방은 메시지를 보낼 수 있습니다\n' +
        '• 이 작업은 되돌릴 수 없습니다'
    )

    if (!confirmed) {
      return
    }

    const userType: 'USER' | 'LAWYER' = isLawyer ? 'LAWYER' : 'USER'
    const leaveRequest = {
      roomId: chatRoomId,
      userType,
      reason: '사용자 요청',
      userId: userKeyId,
    }

    leaveChatRoom(leaveRequest)
  }

  // 블로그 아이템 클릭 핸들러
  const handleBlogClick = (subcategoryId: number, blogCaseId: number) => {
    navigate(`/${subcategoryId}/blog/${blogCaseId}`)
  }

  return (
    <main className={styles.chatWaitingBlogList}>
      <header className={styles.chatWaitingBlogList__header}>
        {chatStatus === 'PENDING' && (
          <p className={styles.chatWaitingBlogList__description}>해당 질문에 대한 답변을 기다리는 중입니다.</p>
        )}
        {(chatStatus === 'CONSULTING' || messagesLength > 1) && (
          <div className={styles.chatWaitingBlogList__header__startChat}>
            <span>채팅을 시작 하시겠습니까? </span>
            <div className={styles.chatWaitingBlogList__header__startChat__button}>
              <button onClick={handleStartChat}>채팅 시작하기</button>
              <button onClick={handleLeaveChat}>대화방 나가기</button>
            </div>
          </div>
        )}
      </header>
      <div className={styles.chatWaitingBlogList__content}>
        <h3 className={styles.chatWaitingBlogList__content__title}>
          답변을 기다리는 동안 유사 법률정보의 글을 확인하세요.
        </h3>
        <div className={styles.chatWaitingBlogList__content__list}>
          {blogList.map((blog, index) => (
            <React.Fragment key={blog.blogCaseId || index}>
              <BlogItem
                item={blog}
                onClick={() => handleBlogClick(blog.subcategoryId, blog.blogCaseId)}
                // subcategory 정보가 item 객체에 포함되어 있다면 자동으로 전달됨
              />
              {index !== blogList.length - 1 && <Divider padding={0} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </main>
  )
}

export default ChatWaitingBlogList
