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
import {
  useSocketStore,
  useChatStatus,
  useSocket,
  useIsConnected,
  useRoomInfo,
  useSetTempIdMapping,
  useUpdateMessageInRoom,
} from '@/stores/socketStore'
import { useAuth } from '@/contexts/AuthContext'
import { usePatchMessage } from '@/hooks/queries/useBaroTalk'

type ChatBodyProps = {
  chatRoomId: number | null
  type?: 'USER' | 'LAWYER'
  userLeft: boolean
  isLawyer?: boolean
  fixedInputBar?: boolean // 입력창을 하단에 고정할지 여부
}

const ChatBody = ({ chatRoomId, type = 'USER', userLeft, isLawyer, fixedInputBar = false }: ChatBodyProps) => {
  // Zustand 전역 상태 구독
  const messageCache = useSocketStore(state => state.messageCache)
  const messages = chatRoomId ? messageCache[chatRoomId] || [] : []
  const chatStatusFromHook = useChatStatus()
  const roomInfo = useRoomInfo()
  // roomInfo가 있으면 거기서 상태를 가져오고, 없으면 hook의 상태 사용
  const chatStatus = roomInfo?.chatRoomStatus || chatStatusFromHook
  const socket = useSocket()
  const isConnected = useIsConnected()
  const addMessageToRoom = useSocketStore(state => state.addMessageToRoom)
  const setTempIdMapping = useSetTempIdMapping()
  const updateMessageInRoom = useUpdateMessageInRoom()
  const { getUserIdFromToken } = useAuth()
  const userId = getUserIdFromToken()

  const [message, setMessage] = useState('')
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null)
  const [editingContent, setEditingContent] = useState('')
  const isMobile = useMediaQuery('(max-width: 768px)')
  const chatBodyRef = useRef<HTMLDivElement>(null)

  // 메시지 수정 mutation
  const { mutate: patchMessage } = usePatchMessage({
    onSuccess: data => {
      console.log('✅ 메시지 수정 성공:', data)
      // 로컬 메시지 캐시 업데이트 (chatRoomId별로 관리)
      if (chatRoomId) {
        updateMessageInRoom(chatRoomId, data.chatMessageId, {
          chatMessageContent: data.chatMessageContent,
          chatMessageUpdatedAt: data.chatMessageUpdatedAt,
        })
      }
      // 수정 모드 종료
      setEditingMessageId(null)
      setEditingContent('')
    },
    onError: error => {
      console.error('❌ 메시지 수정 실패:', error)
      alert(error)
    },
  })

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

  // fixedInputBar 모드일 때 초기 로드 시에도 스크롤을 맨 아래로
  useEffect(() => {
    if (fixedInputBar && messages.length > 0) {
      setTimeout(() => scrollToBottom(), 100)
    }
  }, [fixedInputBar, messages.length])

  const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !isConnected || !socket || !chatRoomId) {
      return
    }

    const tempId = `temp_${Date.now()}_${Math.random()}`

    // tempId와 chatRoomId 매핑 저장
    setTempIdMapping(tempId, chatRoomId)

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
  }, [message, isConnected, socket, chatRoomId, isLawyer, userId, roomInfo, addMessageToRoom, setTempIdMapping])

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

  // 메시지 수정 시작
  const handleStartEdit = (messageId: number, content: string) => {
    setEditingMessageId(messageId)
    setEditingContent(content)
  }

  // 메시지 수정 취소
  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditingContent('')
  }

  // 메시지 수정 완료
  const handleConfirmEdit = () => {
    const lawyerId = (roomInfo as any)?.chatRoomLawyerId
    if (!editingMessageId || !lawyerId) return

    // REST API로 메시지 수정 요청 (변호사 ID로 전송)
    patchMessage({
      messageId: editingMessageId,
      messageContent: editingContent.trim(),
      userId: lawyerId,
    })
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
      style={
        fixedInputBar
          ? { position: 'absolute', bottom: 0, left: 0, right: 0, height: '3rem', minHeight: '3rem', backgroundColor: 'white', zIndex: 10 }
          : type === 'LAWYER'
          ? { height: '3rem', minHeight: '3rem' }
          : undefined
      }
    />
  )

  const renderWaitingChat = () => (
    <div className={styles['waiting-chat-wrapper']}>
      <ChatWaitingBlogList
        chatStatus={chatStatus}
        chatRoomId={chatRoomId}
        messagesLength={messages.length}
        isLawyer={isLawyer}
      />
    </div>
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

  // fixedInputBar 모드일 때 완전히 다른 레이아웃
  if (fixedInputBar) {
    return (
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div
          ref={chatBodyRef}
          style={{ flex: 1, overflowY: 'auto', padding: '1rem', paddingBottom: '5rem' }}
        >
          {messages.length === 0 ? (
            <div className={styles['empty-messages']}>
              <p>아직 메시지가 없습니다.</p>
              <p>첫 번째 메시지를 보내보세요!</p>
            </div>
          ) : (
            messages.map(msg => {
              const isSystemMessage =
                msg.chatMessageSenderId === 0 &&
                (msg.chatMessageContent.includes('상담을 종료했습니다') ||
                  msg.chatMessageContent.includes('나갔습니다') ||
                  msg.chatMessageContent.includes('종료되었습니다'))

              if (isSystemMessage) {
                return (
                  <div key={msg.chatMessageId} className={styles['system-message']}>
                    <span className={styles['system-message-text']}>{msg.chatMessageContent}</span>
                    <span className={styles['system-message-time']}>{formatTimeAgo(msg.chatMessageCreatedAt)}</span>
                  </div>
                )
              }

              const isMyMessage = msg.chatMessageSenderType === type
              const isReadByOther = isMyMessage ? msg.chatMessageIsRead || false : false
              const isEditing = editingMessageId === msg.chatMessageId

              // 수정하기 버튼 표시 조건: 변호사가 보낸 메시지 + CONSULTING 상태 + 유저가 아직 읽지 않음
              const showEditButton =
                isLawyer &&
                isMyMessage &&
                chatStatus === 'CONSULTING' &&
                !msg.chatMessageIsRead

              // 수정 중인 메시지는 입력창으로 표시
              if (isEditing) {
                return (
                  <div key={msg.chatMessageId} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', marginBottom: '1rem', justifyContent: 'flex-end' }}>
                    <textarea
                      value={editingContent}
                      onChange={e => setEditingContent(e.target.value)}
                      style={{
                        flex: 1,
                        maxWidth: '400px',
                        minHeight: '80px',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        border: '2px solid #20BF62',
                        fontSize: '0.875rem',
                        resize: 'vertical',
                      }}
                      autoFocus
                    />
                    <button
                      onClick={handleConfirmEdit}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#20BF62',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      확인
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#E0E0E0',
                        color: '#666',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                      }}
                    >
                      취소
                    </button>
                  </div>
                )
              }

              return (
                <div key={msg.chatMessageId} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '1rem', flexDirection: isMyMessage ? 'row-reverse' : 'row' }}>
                  <ChatBubble
                    message={msg.chatMessageContent}
                    direction={isMyMessage ? 'right' : 'left'}
                    color={isMyMessage ? COLOR.green_01 : COLOR.white}
                    colorText={isMyMessage ? COLOR.white : COLOR.black}
                    profileImage={msg.chatMessageSenderType === 'LAWYER' ? 'https://picsum.photos/200/300' : undefined}
                    isRead={isReadByOther}
                    showReadStatus={isMyMessage}
                    status={msg.status || 'sent'}
                  >
                    <div>
                      <span>{formatTimeAgo(msg.chatMessageCreatedAt)}</span>
                    </div>
                  </ChatBubble>
                  {showEditButton && (
                    <button
                      onClick={() => handleStartEdit(msg.chatMessageId, msg.chatMessageContent)}
                      style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: 'white',
                        color: '#20BF62',
                        border: '1px solid #20BF62',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        alignSelf: 'flex-end',
                        marginBottom: '2rem',
                      }}
                    >
                      수정하기
                    </button>
                  )}
                </div>
              )
            })
          )}
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', zIndex: 10, padding: '0.5rem 1rem' }}>
          <InputBox
            icon={<SvgIcon name='send' />}
            value={message}
            onChange={handleChangeMessage}
            onKeyDown={handleKeyPress}
            onIconClick={handleSendMessage}
            disabled={!isConnected || userLeft}
            className={styles['chat-input']}
            style={{ height: '3rem', minHeight: '3rem', margin: 0 }}
          />
        </div>
      </div>
    )
  }

  // 기존 렌더링 (fixedInputBar가 false일 때)
  return (
    <>
      {isMobile && (
        <div className={styles['mobile-info-header']}>
          <span>바로톡</span>
          <p>변호사와 1:1 상담을 진행할 수 있습니다.</p>
        </div>
      )}
      <div
        className={`${styles['chat-body-wrapper']} ${
          chatStatus !== 'ACTIVE' && chatStatus !== 'COMPLETED' && chatStatus !== 'PARTIAL_LEFT' ? styles.waiting : ''
        }`}
      >
        <div
          className={`${styles.chatBody} ${
            chatStatus !== 'ACTIVE' && chatStatus !== 'COMPLETED' && chatStatus !== 'PARTIAL_LEFT' ? styles.waiting : ''
          }`}
          ref={chatBodyRef}
        >
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
