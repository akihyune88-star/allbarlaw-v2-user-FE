import ChatBubble from '@/components/chatBubble/ChatBubble'
import { COLOR } from '@/styles/color'
import styles from './chatBody.module.scss'
import ChatWaitingBlogList from '../chatWaitingBlogList/ChatWaitingBlogList'
import InputBox from '@/components/inputBox/InputBox'
import SvgIcon from '@/components/SvgIcon'
import React, { ChangeEvent, useState } from 'react'
import { ChatMessage, ChatRoomStatus } from '@/types/baroTalkTypes'
import { formatTimeAgo } from '@/utils/date'
import { useChatStore } from '@/store/chatStore'

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
  const { chatStatus: globalChatStatus } = useChatStore()

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

  // 전역 상태의 chatStatus를 우선 사용
  const currentChatStatus = globalChatStatus || chatStatus

  return (
    <>
      <div className={styles.chatBody}>
        {messages.length === 0 ? (
          <div className={styles['empty-messages']}>
            <p>아직 메시지가 없습니다.</p>
            <p>첫 번째 메시지를 보내보세요!</p>
          </div>
        ) : (
          messages.map(msg => (
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
          ))
        )}
      </div>
      {currentChatStatus === 'ACTIVE' || type === 'LAWYER' ? (
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
        <ChatWaitingBlogList chatStatus={currentChatStatus} chatRoomId={chatRoomId} />
      )}
    </>
  )
}

export default ChatBody
