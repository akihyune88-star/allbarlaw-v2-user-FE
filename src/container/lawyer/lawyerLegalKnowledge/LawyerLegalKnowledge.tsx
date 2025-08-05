import Divider from '@/components/divider/Divider'
import SvgIcon from '@/components/SvgIcon'
import styles from './lawyerLegalKnowledge.module.scss'

const LawyerLegalKnowledge = () => {
  return (
    <section className={styles['lawyer-legal-knowledge']} aria-label="변호사의 법률 지식">
      <header className={styles['lawyer-legal-knowledge__header']}>
        <h3 className={styles['lawyer-legal-knowledge__title']}>변호사의 법률 지식</h3>
        <button type='button' className={styles['lawyer-legal-knowledge__button']} aria-label='변호사의 법률 지식 더보기'>
          더보기
          <SvgIcon name='arrowSmall' className={styles['lawyer-legal-knowledge__button-icon']} size={14} />
        </button>
      </header>
      <Divider padding={14} />
    </section>
  )
}

export default LawyerLegalKnowledge
