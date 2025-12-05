import styles from './userAboutFaqList.module.scss'
import { USER_FAQ } from '@/constants/userFaq'
import PaginatedFaqList from '@/components/faqList/PaginatedFaqList'

const UserAboutFaqList = () => {
  return (
    <div className={styles['user-about-faq-list']}>
      <h2 className={styles['section-title']}>자주묻는 질문</h2>
      <PaginatedFaqList faqData={USER_FAQ} itemsPerPage={5} />
    </div>
  )
}

export default UserAboutFaqList
