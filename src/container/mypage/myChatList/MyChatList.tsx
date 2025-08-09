import { useState } from 'react'
import { useInfiniteMyConsultationList } from '@/hooks/queries/useMypage'
import styles from './myChatList.module.scss'
import ChatListFilter from '../chatListFilter/ChatListFilter'

const MyChatList = () => {
  const [year, setYear] = useState(2025)
  const [month, setMonth] = useState(8)

  const { consultationList } = useInfiniteMyConsultationList({
    year,
    month,
  })

  const handleYearChange = (year: number) => setYear(year)
  const handleMonthChange = (month: number) => setMonth(month)

  return (
    <div className={styles['myChatList']}>
      <aside className={styles['myChatList-aside']}>
        <ChatListFilter year={year} month={month} onYearChange={handleYearChange} onMonthChange={handleMonthChange} />
      </aside>
      <main className={styles['myChatList-main']}>여기가 채팅지롱</main>
    </div>
  )
}

export default MyChatList
