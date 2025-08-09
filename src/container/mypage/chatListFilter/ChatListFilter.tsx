import SelectBox from '@/components/selectBox'
import styles from './chatListFilter.module.scss'
import { getMonthsArray, getYearsFrom2025 } from '@/utils/date'

type ChatListFilterProps = {
  year: number
  month: number
  onYearChange: (_year: number) => void
  onMonthChange: (_month: number) => void
}

const ChatListFilter = ({ year, month, onYearChange, onMonthChange }: ChatListFilterProps) => {
  const years = getYearsFrom2025()
  const months = getMonthsArray()

  return (
    <main className={styles['chatListFilter']}>
      <header className={styles['chatListFilter-header']}>
        <h2 className={styles['chatListFilter-header-title']}>기간 선택</h2>
      </header>
      <section className={styles['chatListFilter-section']}>
        <SelectBox options={years} value={year} onChange={onYearChange} />
        <SelectBox options={months} value={month} onChange={onMonthChange} />
      </section>
    </main>
  )
}

export default ChatListFilter
