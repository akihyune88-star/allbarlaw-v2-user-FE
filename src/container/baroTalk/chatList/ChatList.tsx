import styles from './chatList.module.scss'

const ChatList = () => {
  return (
    <main className={styles['chat-list']}>
      <header className={styles['chat-list-header']}>
        <h3>바로톡 목록</h3>
        <div className={styles['chat-list-header-button']}>
          <span className={styles['chat-list-header-button-text']}>변호사와 1:1 상담을 진행할 수 있습니다.</span>
          <button>추가 상담하기</button>
        </div>
      </header>
      <section>채팅리스트</section>
    </main>
  )
}

export default ChatList
