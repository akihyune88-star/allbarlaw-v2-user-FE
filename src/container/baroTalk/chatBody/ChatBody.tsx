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
  onSendMessage: (content: string) => void
  isConnected: boolean
  chatRoomId: number | null
}

const ChatBody = ({ chatStatus, messages, onSendMessage, isConnected, type = 'USER', chatRoomId }: ChatBodyProps) => {
  const [message, setMessage] = useState('')

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
              (msg.chatMessageContent.includes('상담을 종료했습니다') || msg.chatMessageContent.includes('나갔습니다'))

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
            return (
              <ChatBubble
                key={msg.chatMessageId}
                message={msg.chatMessageContent}
                direction={msg.chatMessageSenderType === 'USER' ? 'right' : 'left'}
                color={msg.chatMessageSenderType === 'USER' ? COLOR.green_01 : COLOR.white}
                colorText={msg.chatMessageSenderType === 'USER' ? COLOR.white : COLOR.black}
                profileImage={msg.chatMessageSenderType === 'LAWYER' ? 'https://picsum.photos/200/300' : undefined}
              >
                <div>
                  <span>{formatTimeAgo(msg.chatMessageCreatedAt)}</span>
                </div>
              </ChatBubble>
            )
          })
        )}
      </div>
      {chatStatus === 'ACTIVE' || type === 'LAWYER' ? (
        <InputBox
          icon={<SvgIcon name='send' />}
          value={message}
          onChange={handleChangeMessage}
          onKeyDown={handleKeyPress}
          onIconClick={handleSendMessage}
          // disabled={!isConnected}
          className={styles['chat-input']}
          style={type === 'LAWYER' ? { height: '3rem', minHeight: '3rem' } : undefined}
        />
      ) : (
        <ChatWaitingBlogList chatStatus={chatStatus} chatRoomId={chatRoomId} />
      )}
    </>
  )
}

export default ChatBody
