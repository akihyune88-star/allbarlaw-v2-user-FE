import ChatRoomContainer from '@/container/baroTalk/chatRoomContainer/ChatRoomContainer'
import styles from './chat.module.scss'
import ChatList from '@/container/baroTalk/chatList/ChatList'

const Chat = () => {
  return (
    <main className={`w-full sub-main-container ${styles.chat}`}>
      <ChatRoomContainer />
      <aside className={`aside ${styles['mobile-aside']}`}>
        <ChatList />
      </aside>
    </main>
  )
}

export default Chat
