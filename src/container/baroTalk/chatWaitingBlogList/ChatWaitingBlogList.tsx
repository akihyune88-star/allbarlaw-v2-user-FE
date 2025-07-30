import BlogItem from '@/components/blogItem/BlogItem'
import styles from './chatWaitingBlogList.module.scss'
import { useGetBlogList } from '@/hooks/queries/useGetBlogList'
import Divider from '@/components/divider/Divider'
import { ChatRoomStatus, UpdateChatRoomStatusResponse } from '@/types/baroTalkTypes'
import { useUpdateChatRoomStatus } from '@/hooks/queries/useBaroTalk'
import { useChatStore } from '@/store/chatStore'

type ChatWaitingBlogListProps = {
  chatStatus: ChatRoomStatus
  chatRoomId: number | null
}

const ChatWaitingBlogList = ({ chatStatus, chatRoomId }: ChatWaitingBlogListProps) => {
  const { blogList } = useGetBlogList({
    subcategoryId: 'all',
    take: 4,
  })

  const { setChatStatus } = useChatStore()

  const { mutate: updateChatRoomStatus } = useUpdateChatRoomStatus({
    onSuccess: (data: UpdateChatRoomStatusResponse) => {
      console.log('updateChatRoomStatus 성공:', data)
      // 전역 상태도 업데이트
      setChatStatus(data.chatRoomStatus)
    },
  })

  const handleStartChat = () => {
    if (!chatRoomId) return
    updateChatRoomStatus({
      chatRoomId: chatRoomId,
      status: 'ACTIVE',
    })
  }

  return (
    <main className={styles.chatWaitingBlogList}>
      <header className={styles.chatWaitingBlogList__header}>
        {chatStatus === 'PENDING' && (
          <p className={styles.chatWaitingBlogList__description}>해당 질문에대한 답변을 기다리는 중입니다.</p>
        )}
        {chatStatus === 'CONSULTING' && (
          <div className={styles.chatWaitingBlogList__header__startChat}>
            <span>채팅을 시작 하시겠습니까? </span>
            <div className={styles.chatWaitingBlogList__header__startChat__button}>
              <button onClick={handleStartChat}>채팅 시작하기</button>
              <button>대화방 나가기</button>
            </div>
          </div>
        )}
      </header>
      <div className={styles.chatWaitingBlogList__content}>
        <h3 className={styles.chatWaitingBlogList__content__title}>
          답변을 기다리는 동안 유사 법률정보의 글을 확인하세요.
        </h3>
        <div className={styles.chatWaitingBlogList__content__list}>
          {blogList.map((blog, index) => (
            <>
              <BlogItem key={index} item={blog} />
              {index !== blogList.length - 1 && <Divider padding={0} />}
            </>
          ))}
        </div>
      </div>
    </main>
  )
}

export default ChatWaitingBlogList
