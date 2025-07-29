import ChatHeader from '@/container/baroTalk/chatHeader/ChatHeader'
import ChatBody from '@/container/baroTalk/chatBody/ChatBody'
import styles from './chatRoomContainer.module.scss'

const ChatRoomContainer = () => {
  return (
    <section className={`contents-section ${styles['chat-content']}`}>
      <ChatHeader
        lawyerId={1}
        isActive={true}
        lawyerName={'홍길동'}
        count={{ total: 1256, month: 251 }}
        lawfirmName={'example로펌'}
        lawyerProfileImage='https://picsum.photos/200/300'
        lawyerDescription={`로스쿨 수석!강력사건 전문 해결, 전문 변호사
          오랜 경험과 깊은 지식, 경험과 실력은 활동내역이 증명합니다.`}
      />
      <ChatBody isChatStart={true} />
    </section>
  )
}

export default ChatRoomContainer
