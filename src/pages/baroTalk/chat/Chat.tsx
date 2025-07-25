import ChatHeader from '@/container/baroTalk/chatHeader/ChatHeader'
import styles from './chat.module.scss'
import ChatList from '@/container/baroTalk/chatList/ChatList'
import ChatBubble from '@/components/chatBubble/ChatBubble'
import { COLOR } from '@/styles/color'

const Chat = () => {
  return (
    <main className={`w-full sub-main-container ${styles.chat}`}>
      <section className={`contents-section ${styles['chat-content']}`}>
        <ChatHeader
          id={1}
          isActive={true}
          name={'홍길동'}
          count={{ total: 1256, month: 251 }}
          lawfirm={'example로펌'}
          profileImage='https://picsum.photos/200/300'
          description={`로스쿨 수석!강력사건 전문 해결, 전문 변호사
            오랜 경험과 깊은 지식, 경험과 실력은 활동내역이 증명합니다.`}
        />
        <ChatBubble message={rightMessage} direction='right'>
          <div className={styles.meta}>
            <span>2025-07-25</span>
          </div>
        </ChatBubble>
        <ChatBubble message={leftMessage} direction='left' color={COLOR.white} colorText={COLOR.black}>
          <div className={styles.meta}>
            <span>2025-07-25</span>
          </div>
        </ChatBubble>
      </section>
      <aside className={`aside ${styles['mobile-aside']}`}>
        <ChatList />
      </aside>
    </main>
  )
}

export default Chat

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
