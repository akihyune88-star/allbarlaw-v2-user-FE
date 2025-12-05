import styles from './lawyerFaqList.module.scss'
import { LAWYER_FAQ } from '@/constants/lawyerFaq'
import PaginatedFaqList from '@/components/faqList/PaginatedFaqList'

const LawyerFaqList = () => {
  return (
    <section className={styles['lawyer-about-faq-list']}>
      <div className={styles['title-wrapper']}>
        <h2 className={styles['section-title']}>자주묻는 질문</h2>
      </div>
      <div className={styles['faq-list-section']}>
        <div className={styles['faq-list-container']}>
          <PaginatedFaqList faqData={LAWYER_FAQ} itemsPerPage={5} className={styles['faq-list']} />
        </div>
      </div>
    </section>
  )
}
export default LawyerFaqList
