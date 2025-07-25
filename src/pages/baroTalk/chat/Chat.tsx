import ChatHeader from '@/container/baroTalk/chatHeader/ChatHeader'
import styles from './chat.module.scss'
import ChatList from '@/container/baroTalk/chatList/ChatList'
import ChatBody from '@/container/baroTalk/chatBody/ChatBody'

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
        <ChatBody />
      </section>
      <aside className={`aside ${styles['mobile-aside']}`}>
        <ChatList />
      </aside>
    </main>
  )
}

export default Chat
