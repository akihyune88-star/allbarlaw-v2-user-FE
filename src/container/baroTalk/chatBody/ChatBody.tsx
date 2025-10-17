import ChatBubble from '@/components/chatBubble/ChatBubble'
import { COLOR } from '@/styles/color'
import styles from './chatBody.module.scss'
import ChatWaitingBlogList from '../chatWaitingBlogList/ChatWaitingBlogList'
import InputBox from '@/components/inputBox/InputBox'
import SvgIcon from '@/components/SvgIcon'
import React, { ChangeEvent, useState, useCallback, useRef, useEffect } from 'react'
import { ChatMessage } from '@/types/baroTalkTypes'
import { formatTimeAgo } from '@/utils/date'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useSocketStore, useChatStatus, useSocket, useIsConnected, useRoomInfo } from '@/stores/socketStore'
import { useAuth } from '@/contexts/AuthContext'

type ChatBodyProps = {
  chatRoomId: number | null
  type?: 'USER' | 'LAWYER'
  userLeft: boolean
  isLawyer?: boolean
}

const ChatBody = ({ chatRoomId, type = 'USER', userLeft, isLawyer }: ChatBodyProps) => {
  // Zustand 전역 상태 구독
  const messageCache = useSocketStore(state => state.messageCache)
  const messages = chatRoomId ? messageCache[chatRoomId] || [] : []
  const chatStatus = useChatStatus()
  const socket = useSocket()
  const isConnected = useIsConnected()
  const roomInfo = useRoomInfo()
  const addMessageToRoom = useSocketStore(state => state.addMessageToRoom)
  const { getUserIdFromToken } = useAuth()
  const userId = getUserIdFromToken()

  const [message, setMessage] = useState('')
  const isMobile = useMediaQuery('(max-width: 768px)')
  const chatBodyRef = useRef<HTMLDivElement>(null)

  console.log('messages', messageCache)
  // 스크롤을 맨 아래로 이동하는 함수
  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }

  // 메시지가 변경될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !isConnected || !socket || !chatRoomId) {
      return
    }

    const tempId = `temp_${Date.now()}_${Math.random()}`

    // 임시 메시지를 먼저 UI에 표시
    const tempMessage: ChatMessage = {
      chatMessageId: Date.now(),
      chatMessageContent: message.trim(),
      chatMessageSenderType: isLawyer ? 'LAWYER' : 'USER',
      chatMessageSenderId: userId || 0,
      chatMessageReceiverId: isLawyer
        ? (roomInfo as any)?.chatRoomUserId || 0
        : (roomInfo as any)?.chatRoomLawyerId || 0,
      chatMessageReceiverType: isLawyer ? 'USER' : 'LAWYER',
      chatMessageIsRead: false,
      chatMessageCreatedAt: new Date().toISOString(),
      tempId,
      status: 'sending',
    }

    if (chatRoomId) {
      addMessageToRoom(chatRoomId, tempMessage)
    }

    // 서버로 메시지 전송
    socket.emit('sendMessage', {
      chatRoomId,
      content: message.trim(),
      receiverId: isLawyer ? (roomInfo as any)?.chatRoomUserId || 0 : (roomInfo as any)?.chatRoomLawyerId || 0,
      receiverType: isLawyer ? 'USER' : 'LAWYER',
      tempId,
    })

    setMessage('')
  }, [message, isConnected, socket, chatRoomId, isLawyer, userId, roomInfo, addMessageToRoom])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    console.log('키 눌림:', e.key, 'Shift:', e.shiftKey, 'Composing:', e.nativeEvent.isComposing)

    // 한글 입력 중(조합 중)일 때는 엔터키 이벤트 무시
    if (e.nativeEvent.isComposing) {
      return
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      console.log('엔터키 감지, 메시지 전송 시도')
      e.preventDefault()
      handleSendMessage()
    }
  }

  // 채팅 입력창 렌더링 함수들
  const renderCompletedChat = () => (
    <div className={styles['chat-disabled']}>
      <p>채팅이 종료되었습니다.</p>
    </div>
  )

  const renderPartialLeftChat = () => (
    <div className={styles['chat-partial-left']}>
      <p>상대방이 채팅을 종료했습니다. 채팅을 종료하라면 상담 끝내기 버튼을 눌러주세요.</p>
      <InputBox
        icon={<SvgIcon name='send' />}
        value={message}
        onChange={handleChangeMessage}
        onKeyDown={handleKeyPress}
        onIconClick={handleSendMessage}
        disabled={!isConnected || userLeft || chatStatus === 'PARTIAL_LEFT'}
        className={styles['chat-input']}
        style={type === 'LAWYER' ? { height: '3rem', minHeight: '3rem' } : undefined}
      />
    </div>
  )

  const renderActiveChat = () => (
    <InputBox
      icon={<SvgIcon name='send' />}
      value={message}
      onChange={handleChangeMessage}
      onKeyDown={handleKeyPress}
      onIconClick={handleSendMessage}
      disabled={!isConnected || userLeft}
      className={styles['chat-input']}
      style={type === 'LAWYER' ? { height: '3rem', minHeight: '3rem' } : undefined}
    />
  )

  const renderWaitingChat = () => (
    <ChatWaitingBlogList
      chatStatus={chatStatus}
      chatRoomId={chatRoomId}
      messagesLength={messages.length}
      isLawyer={isLawyer}
    />
  )

  // 채팅 입력창 렌더링 로직
  const renderChatInput = () => {
    if (chatStatus === 'COMPLETED') {
      return renderCompletedChat()
    }

    if (chatStatus === 'PARTIAL_LEFT' || userLeft) {
      return renderPartialLeftChat()
    }

    if (chatStatus === 'ACTIVE' || type === 'LAWYER') {
      return renderActiveChat()
    }

    return renderWaitingChat()
  }

  return (
    <>
      {isMobile && (
        <div className={styles['mobile-info-header']}>
          <span>바로톡</span>
          <p>변호사와 1:1 상담을 진행할 수 있습니다.</p>
        </div>
      )}
      <div className={styles['chat-body-wrapper']}>
        <div className={styles.chatBody} ref={chatBodyRef}>
          {messages.length === 0 ? (
            <div className={styles['empty-messages']}>
              <p>아직 메시지가 없습니다.</p>
              <p>첫 번째 메시지를 보내보세요!</p>
            </div>
          ) : (
            messages.map(msg => {
              // 🆕 시스템 메시지 체크 (senderId가 0이고 특정 내용을 포함하는 경우)
              const isSystemMessage =
                msg.chatMessageSenderId === 0 &&
                (msg.chatMessageContent.includes('상담을 종료했습니다') ||
                  msg.chatMessageContent.includes('나갔습니다') ||
                  msg.chatMessageContent.includes('종료되었습니다'))

              if (isSystemMessage) {
                // 시스템 메시지는 중앙에 회색으로 표시
                return (
                  <div key={msg.chatMessageId} className={styles['system-message']}>
                    <span className={styles['system-message-text']}>{msg.chatMessageContent}</span>
                    <span className={styles['system-message-time']}>{formatTimeAgo(msg.chatMessageCreatedAt)}</span>
                  </div>
                )
              }

              // 일반 메시지는 기존 방식으로 렌더링
              const isMyMessage = msg.chatMessageSenderType === type

              // 읽음 상태 판단: 내가 보낸 메시지에서 상대방이 읽었는지 확인
              const isReadByOther = isMyMessage ? msg.chatMessageIsRead || false : false

              return (
                <ChatBubble
                  key={msg.chatMessageId}
                  message={msg.chatMessageContent}
                  direction={isMyMessage ? 'right' : 'left'}
                  color={isMyMessage ? COLOR.green_01 : COLOR.white}
                  colorText={isMyMessage ? COLOR.white : COLOR.black}
                  profileImage={msg.chatMessageSenderType === 'LAWYER' ? 'https://picsum.photos/200/300' : undefined}
                  // 읽음 상태 관련 props
                  isRead={isReadByOther} // 상대방이 읽었는지 여부
                  showReadStatus={isMyMessage} // 내가 보낸 메시지만 읽음 상태 표시
                  status={msg.status || 'sent'}
                >
                  <div>
                    <span>{formatTimeAgo(msg.chatMessageCreatedAt)}</span>
                  </div>
                </ChatBubble>
              )
            })
          )}
        </div>
        {/* 채팅 입력창 또는 상태 메시지 */}
        {renderChatInput()}
      </div>
    </>
  )
}

export default ChatBody
