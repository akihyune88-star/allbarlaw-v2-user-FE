import ChatBubble from '@/components/chatBubble/ChatBubble'
import { COLOR } from '@/styles/color'
import styles from './chatBody.module.scss'
import ChatWaitingBlogList from '../chatWaitingBlogList/ChatWaitingBlogList'
import InputBox from '@/components/inputBox/InputBox'
import SvgIcon from '@/components/SvgIcon'
import React, { ChangeEvent, useState } from 'react'
import { ChatMessage, ChatRoomStatus } from '@/types/baroTalkTypes'
import { formatTimeAgo } from '@/utils/date'

type ChatBodyProps = {
  chatStatus: ChatRoomStatus
  type?: 'USER' | 'LAWYER'
  messages: ChatMessage[]
  onSendMessage: (_content: string) => void
  isConnected: boolean
  chatRoomId: number | null
  userLeft: boolean
}

const ChatBody = ({
  chatStatus,
  messages,
  onSendMessage,
  isConnected,
  type = 'USER',
  chatRoomId,
  userLeft,
}: ChatBodyProps) => {
  const [message, setMessage] = useState('')

  console.log('🗋 ChatBody: userLeft', userLeft)

  const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleSendMessage = () => {
    if (message.trim() && isConnected) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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

  const renderWaitingChat = () => <ChatWaitingBlogList chatStatus={chatStatus} chatRoomId={chatRoomId} />

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
      <div className={styles.chatBody}>
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
    </>
  )
}

export default ChatBody
