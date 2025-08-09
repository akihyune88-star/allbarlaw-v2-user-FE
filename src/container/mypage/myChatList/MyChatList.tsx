import { useState } from 'react'
import { useInfiniteMyConsultationList } from '@/hooks/queries/useMypage'
import styles from './myChatList.module.scss'
import ChatListFilter from '../chatListFilter/ChatListFilter'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import Divider from '@/components/divider/Divider'
import { ChatRoomStatus } from '@/types/baroTalkTypes'
import { COLOR } from '@/styles/color'

const MyChatList = ({ sort }: { sort: 'asc' | 'desc' }) => {
  const [year, setYear] = useState(2025)
  const [month, setMonth] = useState(8)

  const { consultationList } = useInfiniteMyConsultationList({
    year,
    month,
    sort,
  })

  const handleYearChange = (year: number) => setYear(year)
  const handleMonthChange = (month: number) => setMonth(month)

  const getStatus = (status: ChatRoomStatus) => {
    switch (status) {
      case 'PENDING':
        return '답변전 변경가능'
      default:
        return '답변완료/변경 불가능'
    }
  }

  return (
    <section className={styles['myChatList']}>
      <aside className={styles['myChatList-aside']}>
        <ChatListFilter year={year} month={month} onYearChange={handleYearChange} onMonthChange={handleMonthChange} />
      </aside>
      <div className={styles['myChatList-main']}>
        <ul className={styles['myChatList-list']}>
          {consultationList.map((consultation, index) => {
            const isEdit = consultation.chatRoomStatus === 'PENDING'
            return (
              <li key={consultation.knowledgeId}>
                <article className={styles['myChatListList-item']}>
                  <LegalKnowledgeItem
                    knowledgeId={consultation.knowledgeId}
                    title={consultation.knowledgeTitle}
                    description={consultation.summaryContent}
                    time={new Date(consultation.lastMessageAt)}
                    lawyerList={consultation.lawyers}
                    knowledgeKeep={consultation.isKeep}
                    isLastAnswer={true}
                  />
                  <footer className={styles['myChatListList-item-footer']}>
                    <span
                      className={styles['myChatListList-item-status']}
                      style={{ color: isEdit ? COLOR.green_01 : COLOR.error }}
                    >
                      {getStatus(consultation.chatRoomStatus)}
                    </span>
                    <nav className={styles['myChatListList-item-button']} aria-label='상담 액션'>
                      <button type='button' aria-label='상담 내용 수정'>
                        수정
                      </button>
                      <button type='button' aria-label='상담 비공개 설정'>
                        비공개
                      </button>
                      <button type='button' aria-label='채팅방 삭제'>
                        삭제
                      </button>
                    </nav>
                  </footer>
                </article>
                {index !== consultationList.length - 1 && <Divider padding={24} />}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default MyChatList
