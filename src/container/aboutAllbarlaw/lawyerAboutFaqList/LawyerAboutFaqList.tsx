import styles from './lawyerAboutFaqList.module.scss'
import { LAWYER_FAQ } from '@/constants/lawyerFaq'
import PaginatedFaqList from '@/components/faqList/PaginatedFaqList'

const LawyerAboutFaqList = () => {
  return (
    <div className={styles['lawyer-about-faq-list']}>
      <h2 className={styles['section-title']}>변호사 자주묻는 질문</h2>
      <PaginatedFaqList faqData={LAWYER_FAQ} itemsPerPage={5} />
    </div>
  )
}

export default LawyerAboutFaqList
