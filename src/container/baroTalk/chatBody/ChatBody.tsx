import ChatBubble from '@/components/chatBubble/ChatBubble'
import { COLOR } from '@/styles/color'
import styles from './chatBody.module.scss'
import ChatWaitingBlogList from '../chatWaitingBlogList/ChatWaitingBlogList'
import Input from '@/components/input/Input'
import InputBox from '@/components/inputBox/InputBox'
import SvgIcon from '@/components/SvgIcon'
import { ChangeEvent, useState } from 'react'

type ChatBodyProps = {
  isChatStart: boolean
}

const ChatBody = ({ isChatStart }: ChatBodyProps) => {
  const [message, setMessage] = useState('')

  const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  return (
    <>
      <div className={styles.chatBody}>
        <ChatBubble message={rightMessage} direction='right'>
          <div>
            <span>2025-07-25</span>
          </div>
        </ChatBubble>
        <ChatBubble
          message={leftMessage}
          direction='left'
          color={COLOR.white}
          colorText={COLOR.black}
          profileImage={'https://picsum.photos/200/300'}
        >
          <div>
            <span>2025-07-25</span>
          </div>
        </ChatBubble>
      </div>
      {isChatStart ? (
        <InputBox icon={<SvgIcon name='send' />} value={message} onChange={handleChangeMessage} />
      ) : (
        <ChatWaitingBlogList isWaiting={false} />
      )}
    </>
  )
}

export default ChatBody

const rightMessage = `로스쿨 수석!강력사건 전문 해결, 전문 변호사
오랜 경험과 깊은 지식, 경험과 실력은 활동내역이 증명합니다. 로스쿨 수석!
강력사건 전문 해결, 전문 변호사 오랜 경험과 깊은 지식, 
경험과 실력은 활동내역이 증명합니다.`

const leftMessage = `로스쿨 수석!강력사건 전문 해결, 전문 변호사
오랜 경험과 깊은 지식, 경험과 실력은 활동내역이 증명합니다.
로스쿨 수석!강력사건 전문 해결, 전문 변호사
오랜 경험과 깊은 지식, 경험과 실력은 활동내역이 증명합니다.
로스쿨 수석!강력사건 전문 해결, 전문 변호사
오랜 경험과 깊은 지식, 경험과 실력은 활동내역이 증명합니다.`
