import styles from './lawyerCard.module.scss'
import { Lawyer } from '@/types/lawyerTypes'

type LawyerCardProps = {
  lawyer: Lawyer
  onClick?: () => void
}

const LawyerCard = ({ lawyer, onClick }: LawyerCardProps) => {
  return (
    <div className={styles['lawyer-card']} onClick={onClick}>
      <div className={styles['lawyer-image']}>
        {lawyer.lawyerProfileImage ? (
          <img src={lawyer.lawyerProfileImage} alt={lawyer.lawyerName} />
        ) : (
          <div className={styles['no-image']}>
            {lawyer.lawyerName?.charAt(0) || '변'}
          </div>
        )}
      </div>
      <div className={styles['lawyer-info']}>
        <h3 className={styles['lawyer-name']}>{lawyer.lawyerName}</h3>
        {lawyer.lawyerCompany && (
          <p className={styles['lawyer-company']}>{lawyer.lawyerCompany}</p>
        )}
        {lawyer.lawyerDescription && (
          <p className={styles['lawyer-description']}>{lawyer.lawyerDescription}</p>
        )}
        <div className={styles['lawyer-stats']}>
          {lawyer.lawyerCaseCount > 0 && (
            <span className={styles['case-count']}>사례 {lawyer.lawyerCaseCount}건</span>
          )}
          {lawyer.lawyerRate && (
            <span className={styles['lawyer-rate']}>평점 {lawyer.lawyerRate}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default LawyerCard