import ChatBubble from '@/components/chatBubble/ChatBubble'
import { COLOR } from '@/styles/color'
import styles from './chatBody.module.scss'

type ChatBodyProps = {
  isChatStart: boolean
}

const ChatWaitingBlogList = () => {
  return (
    <div>
      <div></div>
    </div>
  )
}

const ChatBody = ({ isChatStart }: ChatBodyProps) => {
  return (
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
      {isChatStart && <ChatWaitingBlogList />}
    </div>
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
